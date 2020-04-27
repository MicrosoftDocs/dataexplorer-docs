---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
author: orspod
ms.author: orspodek
ms.reviewer: herauch
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/27/2020
---

# Business continuity and disaster recovery

Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. Some disruptive events are not automatically handled by Azure Data Explorer, such as:

 1. High availability/fault tolerance <!-- reword -->
 1. User accidentally dropped a cluster, database, or table
 1. Azure zone failure
 1. Azure datacenter failure
 1. An entire Azure region is no longer available

This overview describes capabilities that Azure Data Explorer provides for business continuity and disaster recovery. Learn how to recover from events that could cause data loss, or cause your database and application to become unavailable.

## High-availability

This section covers intra-Azure-region resiliency, outside of planned maintenance that is already accounted for in the SLA of 99.9%. Azure Data Explorer is a Microsoft first party, serverless, platform as a service (PaaS) that has a disaggregated compute and storage model, typical of cloud native, distributed offerings. The persistence layer is Azure (Blob) Storage v2. The internal implementation is built natively highly available but abstracted due to the proprietary nature of the product.

### Persistence Layer

Azure Storage offers fault tolerance, out of the box – with the basic and default redundancy offering of LRS or Locally Redundant Storage (within a datacenter). 3 replicas of writes are persisted, and in the event of loss of a replica in use, another is served out seamlessly.

 Further resiliency is offered at a price/additional cost with ZRS or Zone Redundant Storage where replicas are intelligently placed across availability zones for maximum intra-region resiliency. This availability zone configuration selection is supported, strictly, only at provision-time.

### Compute layer

Azure Data Explorer is a distributed computing platform and can have two to many nodes depending on scale, and per node role type. At provision time, selecting availability zones distributes the node deployment, intelligently, across zones providing maximum resiliency, intra-region. An availability zone failure, will not result in a complete outage, but performance degradation, until recovery of the zone. Availability zone selection (or not) is an architectural consideration and strictly, a provision-time configuration that cannot be changed post-provisioning.

### Leader-Follower cluster configuration

Azure Data Explorer provides an optional but useful [capability](https://docs.microsoft.com/azure/data-explorer/follower) for a cluster (lets call it a leader) to be followed by zero to many clusters (lets call them followers) for read only access to the leader's data and metadata, including automated synchronization (create, append, drop) of changes in the leader to the follower. While the leaders could span Azure regions, it is strongly recommended to host follower clusters in the same region as the leader. In this setup, if the leader cluster is down or databases or tables accidentally dropped, the follower clusters will lose access until recovered in the leader. <!-- what does this protect against? -->

## Human errors

Human errors are inevitable. This section describes recoverability capabilities available out of the box, or considerations for safeguarding, in the context of human errors. The features and entities covered are – cluster, database, table data and external table data.

### Accidental cluster deletion

Accidental cluster deletion by the cluster owner/privileged user is an irrecoverable action. To safeguard against the same, the Azure Data Explorer resource owner/privileged user, should, as a best practice, leverage the delete &quot;[lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources)&quot; capability, available at the Azure resource level.

### Accidental database deletion

Accidental database deletion by the cluster owner/privileged user is an irrecoverable action. To safeguard against the same, the database administrator should as a best practice, leverage the delete &quot;[lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) &quot;capability, available at the Azure resource level.

### Accidental table deletion

Users with table admin permissions or higher are allowed to [drop tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/drop-table-command). If one of those users accidentally drops a table, you can recover it using the [.undo drop table](https://docs.microsoft.com/azure/data-explorer/kusto/management/undo-drop-table-command) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/retentionpolicy).

### Accidental deletion of external table data in Azure storage

External tables in Azure Data Explorer allow defining a schema on data in disparate formats/compression, sitting in a storage account – blob container or hierarchical namespace, and querying the same tables in Kusto Query Language (KQL). Deletion of an external table merely deletes the table metadata and is a recoverable by re-executing the table creation command. The external data needs consideration though. Azure storage offers [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) capability that protects against accidental deletion or overwrite of a file/blob for a user-configured amount of time. Delete &quot;[locks](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources)&quot; on a storage account, safeguards against accidental deletion by permissioned users, of storage containers or the storage account itself.

## Outage of an Azure Availability Zone

Availability zones are unique physical locations within the same Azure region.

Azure availability zones can protect an Azure Data Explorer cluster and data from partial region failure.

When you deploy new clusters to different availability zones, the underlying compute and storage components are deployed to different zones in the region. Each zone has independent power, cooling, and networking. During zonal downtime, the cluster will continue to work, but may experience performance degradation until the failure is resolved.

You can also use zonal services, which pin an Azure Data Explorer cluster to the same zone as other connected Azure resources.

> [!Note]
> Deployment to availability zones can be done only during cluster creation and cannot be modified later.

For more details on enabling availability zones on Azure Data Explorer, read - [https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal)

## Outage of an Azure Region

Azure Data Explorer does not support **automatic** protection against the outage of an **entire** Azure region. This disruption could happen during a natural disaster, like an earthquake. If you require a solution for this type of situation, you must create two or more independent clusters in two [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

Once you have created multiple clusters, do the following steps:

1. Replicate all management activities (such as creating new tables or managing user roles) on each cluster.
1. Ingest data to each cluster in parallel.

Azure Data Explorer won't perform parallel maintenance operations (such as upgrades) on clusters that are in Azure paired regions.

## Outage of an Azure Availability Zone


As described in section 4.0, Azure Availability zones provide higher intra-region resiliency through automated, intelligent placement of replicas of storage and intelligent deployment of compute nodes across availability zones. A single availability zone outage will not cause an Azure Data Explorer outage, merely, potential degradation of performance in a right-sized cluster until recovery of the zone.

## Outage of an Azure Datacenter


Azure Availability Zones come with a cost and some customers, choose to deploy without zonal redundancy. With such an ADX deployment, a datacenter outage, will result in cluster outage, and is therefore, a disaster recovery scenario, similar to an entire Azure region failure. This is addressed under the next section.


## Regional outage - HowTo

Azure Data Explorer currently does not support automatic protection against the outage of an entire Azure region. Outages could happen during a natural disaster, like an earthquake. If you require a solution for this situation, you must create  **two or more**  independent clusters.

This HowTo article presents an example how to create an architecture that takes business continuity into account under heavy disruptions.

### Create independent clusters

First, create more than one [cluster](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal) in more than one region.

Make sure that at least two of these clusters are created in [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). 

:::image type="content" source="media/bcdr/1.png" alt-text="Create independent clusters":::

The above image shows three clusters in three different regions, which can also be called replicas.

### Duplicate management activities

In order to have the same cluster configuration in every replica, you must replicate the management activities.

1. Create the same databases/[tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-table-command)/[mappings](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-ingestion-mapping-command)/[policies](https://docs.microsoft.com/azure/data-explorer/kusto/management/policies) on each replica.
1. Manage the [authentication/authorization](https://docs.microsoft.com/azure/data-explorer/kusto/management/security-roles) on each replica.

:::image type="content" source="media/bcdr/2.png" alt-text="Duplicate management activities":::

There are several ways to manage your databases. You could use the [portal to create a new database](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal#create-a-database) or even one of our [SDKs](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/kusto/Microsoft.Azure.Management.Kusto).

### Align data ingestion

In addition to management activities, you need to configure data ingestion consistently on every cluster.

Hardening ingestion methods leveraging using advanced business continuity options:
<!-- I have no idea what that means -->

|Ingestion method  |Disaster recovery feature  |
|---------|---------|
|[IotHub](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr)  |[Microsoft-initiated failover and manual failover](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr) |
|[EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) | Metadata disaster recovery using [primary and secondary disaster recovery namespaces](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr)     |
|[Ingest from storage using Event Grid subscription](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventgrid)  |  Implement a [geo-disaster recovery](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr) for the blob-created messages that are sent to EventHub and the [disaster recovery and account failover strategy](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance)       |

#### Example

The following example uses ingestion via EventHub. A [failover flow](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr#setup-and-failover-flow) has been set up, and Azure Data Explorer ingests <!-- data? --> from the Alias. 

Make sure to [ingest from the EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) using a unique consumer group per cluster replica. Otherwise, you'll end up distributing the traffic instead of replicating it.

:::image type="content" source="media/bcdr/3.png" alt-text="Ingestment via EventHub":::

> [!Note] 
> Ingestion via EventHub/IoTHub/storage is robust. If a cluster is not available for a period of time, it will later catch up and insert pending messages or blobs. This process relies on [checkpointing](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#checkpointing).

### How does the disaster recovery setup work?
<!-- I think this is meant to be an explanation of what you've now set up -->

If you've completed the previous steps, your data and management are now distributed to multiple regions. If you experience an outage in one region, Azure Data Explorer will be able to catch up in the other replicas.

As shown in the diagram below, your data sources produce events to the failover-configured EventHub, and each Azure Data Explorer replica consumes the events.

Data visualization components like PowerBI, Grafana, or SDK powered WebApps can query one of the replicas.

:::image type="content" source="media/bcdr/4.png" alt-text="Data sources to data visualization":::


## Outage of an Azure Region

Azure Data Explorer currently does not support geo-redundancy. In this section we provide some options and considerations for disaster recovery from the highest resiliency to the lowest. For each option, we also indicate RPO, RTO, effort and cost on a scale of low, medium and high. Business criticality, RPO, RTO, and budget typically drive the decision on DR configuration. Potential cost/and or performance optimizations are possible with Azure Advisor recommendations and [autoscale](https://docs.microsoft.com/azure/data-explorer/manage-cluster-horizontal-scaling) configuration.

Regardless of which DR configuration is chosen, the following due diligence is required-
1. All database objects, policies and configurations should be persisted in source control so they can be released to the cluster from Azure DevOps or your favorite release automation tool. You can find information about Azure DevOps support for Azure Data Explorer [here](https://docs.microsoft.com/azure/data-explorer/devops).
1. It is important to design, develop and implement validation routines to ensure all clusters are in-sync from a data perspective. Azure Data Explorer supports [cross cluster joins](https://docs.microsoft.com/azure/data-explorer/kusto/query/cross-cluster-or-database-queries?pivots=azuredataexplorer). A simple count or rows across tables can help validate.
1. Leverage [continuous export](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-export/continuous-data-export) capability, as a best practice, and export data within Azure Data Explorer tables to an Azure Data Lake Store, regardless of DR configuration chosen, and ensure selection of GRS or Geo Redundant Storage for the highest resilience.
1. Release procedures should involve governance checks and balances that ensure mirroring of the clusters
1. Be fully cognizant of what it takes to build a cluster from scratch.
1. Create a checklist of deployment units to build a cluster from scratch. The below is by no means a complete list but a basic template, to refine, for operational readiness, including rapid response.

 **Deployment unit** 
1. ARM template to create Azure Data Explorer cluster with the required configuration
1. Command-lets to deploy control plane security - authorization
1. Database object deployment scripts – databases, tables, user-defined functions
1. External table deployment scripts with the DR storage configuration
1. [Policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/policies) deployment scripts 
1.  Deployment scripts for processes – e.g. continuous exports, materialized views
1. Data ingestion connections 
1. Follower-leader deployments 
1. Scripts for security at the data plane level- authorization including row level
1. BI tool related
1. Over-rides to any default cluster configurations
1. Scripts for ingestion from storage, backfill factored in, DR region specific SAS URLs

## Cost optimization in disaster recovery

Now you're ready to optimize your replicas for the following:

- Architecture for an active/hot standby
- How to implement a highly available application service
- How to optimize cost in an active/active architecture


### Always-on configuration with zero tolerance for application downtime

For mission critical &quot;application&quot; deployments with no tolerance for outages, and that use Azure Data Explorer, we recommend having multiple Azure Data Explorer clusters (greater than two) across Azure paired regions, with ingestion, processing and curation done in parallel to all the clusters. The cluster SKU typically is the same across regions in this configuration.

 - Applications should leverage Azure Traffic Manager for routing or if custom configuration is required, design for discovery microservices as required, that perform availability checks, proximity checks, and route to the nearest available datacenter.
 - Azure will ensure that updates are rolled, staggered across Azure paired regions.

 In the deployment below, an Azure region outage will not cause an application outage; End users will experience latency due to lack of proximity and potentially, performance degradation due to additional load on clusters in regions that are alive.

:::image type="content" source="media/bcdr/active-active-active-n.png" alt-text="Active-active-active-n configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | 0 hours | 0 hours | Lower | Highest |

## Active-Active configuration


This is identical to the &quot;Always-on&quot; configuration described above, with the exception, that it involves only two Azure regions, and paired regions at that. Dual ingestion, processing and curation needs to be configured. Users are routed to the nearest region. The cluster SKU typically is the same across regions in this configuration.

:::image type="content" source="media/bcdr/active-active.png" alt-text="Active-active configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active** | None | None | Lower | High |

## Active-hot standby configuration

This is similar to the &quot;active-active&quot; configuration described above, in terms of dual ingest, processing and curation. The differentiators, however, are that the standby cluster is offline to end users, and can therefore be a sparse compute, with dense storage configuration, and the compute need not be the same SKU as the primary. The hot standby cluster can also be of a smaller SKU and scale, as a cost optimization, and is therefore less performant. In the event of a disaster scenario, the standby cluster that is offline, needs to be brought online (security policies applied/access to end users enabled), and scaled up (higher VM SKU, results in downtime) and scaled out (more nodes) to right-size.

:::image type="content" source="media/bcdr/active-hot-standby.png" alt-text="Active-hot standby configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Hot Standby** | Low | Low | Medium | Medium |

## On-demand DR cluster configuration

This solution offers the least resiliency (highest RPO and RTO), is the lowest in cost and highest in effort. In this configuration, there is no DR cluster. Continuous export of &quot;curated&quot; data (unless raw and intermediate data is also required) should be configured to a storage account that is configured GRS or geo redundant. A DR cluster is spun up in the event of a DR scenario and DDLs, configuration and policies, processes etc are applied, data is ingested from storage into. With regards to ingesting from Azure storage, further diligence is required to avoid hydrating the hot cache with cold data - the data needs to be ingested with the ingestion property – &quot;[kustoCreationTime](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventgrid)&quot; to over-ride the ingestion time that defaults to system time. Due diligence detailed at the beginning of section 9.0 is crucial for success for this configuration.

The diagram below provides a pictorial overview of the configuration.

:::image type="content" source="media/bcdr/on-demand-dr-cluster.png" alt-text="On demand DR cluster configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **On-demand DR cluster** | Highest | Highest | Highest | Lowest |

## Summary of configuration options

| **Configuration** | **Resiliency** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | Highest | 0 hours | 0 hours | Lower | Highest |
| **Active-Active** | High | None | None | Lower | High |
| **Active-Hot Standby** | Medium | Low | Low | Medium | Medium |
| **On-demand DR cluster** | Lowest | Highest | Highest | Highest | Lowest |

### Architecture for an active/hot standby

Replicating and updating the Azure Data Explorer setup will linearly increase the cost with the number of replicas. In order to optimize cost, you can implement an architectural variant to balance time, failover, and cost.

:::image type="content" source="media/bcdr/5.png" alt-text="Architecture for an active/hot standby":::

In this example, cost optimization has been implemented by introducing passive Azure Data Explorer replicas. These replicas are only turned on in case of a disaster in the primary region (for example, region A).

Only one cluster is ingesting data from the EventHub. The primary cluster in Region A is performing a [continuous export](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-export/continuous-data-export) of all data to a storage account. The secondary replicas have access to the data using [external tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/externaltables).

The replicas in Regions B and C do not need to be active 24/7, reducing the cost significantly. However, the performance of these replicas will not be as good as the primary cluster for most of the cases.
<!-- clusters vs replicas- consistency not 100% -->

You can start/stop the secondary replicas using one of the following methods:

- [Flow](https://radennis.github.io/Ravit-Blog/blogs/SaveMoneyUsingFlow.html)
- The &quot;Stop&quot; button

   :::image type="content" source="media/bcdr/6.png" alt-text="The stop button":::

- Azure CLI: 

  ```kusto
  az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>” ```

### How to implement a highly available application service

This section shows how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) that supports a connection to a single primary **and** multiple secondary Azure Data Explorer clusters. The following picture illustrates the setup (management activities and data ingestion have been removed for clarity).

:::image type="content" source="media/bcdr/7.png" alt-text="Create an Azure App Service":::

Having multiple connections between replicas in the same service gives you increased availability. This is useful not only in instances of regional outages.  

You can use this boilerplate code for an app service to github : [https://github.com/Azure/azure-kusto-bcdr-boilerplate](https://github.com/Azure/azure-kusto-bcdr-boilerplate). In order to implement a multi-cluster client, the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class has been created. Each query that is executed using this client will be sent [first to the primary cluster](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69). If there is a failure, the query will be sent to secondary replicas.

In order to measure the performance, and request distribution to primary/secondary cluster [custom application insights metrics](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics) can be used. 

We ran a test using multiple Azure Data Explorer replicas. After a simulated outage of primary and secondary clusters, you can see that the app service BCDR client is behaving as intended.

:::image type="content" source="media/bcdr/8.png" alt-text="Verify app service BCDR client":::

The Azure Data Explorer clusters have been distributed across West Europe (2xD14v2 primary), South East Asia and East US (2xD11v2). Slower response times can be explained by different SKUs and by doing cross planet queries.

:::image type="content" source="media/bcdr/9.png" alt-text="Cross planet query response time":::

One last extension to this architecture could be the dynamic or static routing of the requests using [Azure Traffic Manager routing methods](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods). Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute app service traffic. This traffic is optimized to services across global Azure regions, while providing high availability and responsiveness. 
Alternatively, you can use [Azure Front Door based routing](https://docs.microsoft.com/azure/frontdoor/front-door-routing-methods). 

Compare these two methods [here](https://docs.microsoft.com/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### How to optimize cost in an active/active architecture

Adding replicas to an active/active architecture increases the cost linearly. The cost includes nodes, storage, markup, and increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/).

Use the [optimized autoscale](https://docs.microsoft.com/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-preview) feature to configure the horizontal scaling for the secondary clusters. They should be dimensioned to be able to handle the load of the ingest. Once the primary cluster is not reachable, the secondary clusters will get more traffic and scale according to the configuration. 

In the previous example, this saved roughly 50% of the cost, compared with having the same horizontal and vertical scale on all replicas.

## Next steps
