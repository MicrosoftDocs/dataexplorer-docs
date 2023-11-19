---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
ms.reviewer: ankhanol
ms.topic: conceptual
ms.date: 08/05/2020
---

# Business continuity and disaster recovery overview

Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. This article discusses availability (intra-region) and disaster recovery. It details native capabilities and architectural considerations for a resilient Azure Data Explorer deployment. It details recovery from human errors, high availability, followed by multiple disaster recovery configurations. These configurations depend on resiliency requirements such as Recovery Point Objective (RPO) and Recovery Time Objective (RTO), needed effort, and cost.

## Mitigate disruptive events

* [Human error](#human-error)
* [High availability of Azure Data Explorer](#high-availability-of-azure-data-explorer)
* [Outage of an Azure availability zone](#outage-of-an-azure-availability-zone)
* [Outage of an Azure datacenter](#outage-of-an-azure-datacenter)
* [Outage of an Azure region](#outage-of-an-azure-region)

### Human error 

Human errors are inevitable. Users can accidentally drop a cluster, database, or a table.  

#### Accidental cluster or database deletion

Accidental cluster or database deletion is an irrecoverable action. As the Azure Data Explorer resource owner, you can prevent data loss by enabling the delete [lock](/azure/azure-resource-manager/management/lock-resources) capability, available at the Azure resource level.

#### Accidental table deletion

Users with table admin permissions or higher are allowed to [drop tables](kusto/management/drop-table-command.md). If one of those users accidentally drops a table, you can recover it using the [`.undo drop table`](kusto/management/undo-drop-table-command.md) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](kusto/management/retentionpolicy.md).

#### Accidental external table deletion

[External tables](kusto/query/schema-entities/externaltables.md) are Kusto query schema entities that reference data stored outside the database. 
Deletion of an external table only deletes the table metadata. You can recover it by re-executing the table creation command. Use the [soft delete](/azure/storage/blobs/storage-blob-soft-delete) capability to protect against accidental deletion or overwrite of a file/blob for a user-configured amount of time.

### High availability of Azure Data Explorer

High availability refers to the fault-tolerance of Azure Data Explorer, its components, and underlying dependencies within an Azure region. This fault tolerance avoids single points of failure (SPOF) in the implementation. In Azure Data Explorer, high availability includes the persistence layer, compute layer, and a leader-follower configuration.

#### Persistence layer

Azure Data Explorer leverages Azure Storage as its durable persistence layer. Azure Storage automatically provides fault tolerance, with the default setting offering Locally Redundant Storage (LRS) within a data center. Three replicas are persisted. If a replica is lost while in use, another is deployed without disruption. Further resiliency is possible with Zone Redundant Storage (ZRS) that places replicas intelligently across Azure regional availability zones for maximum fault tolerance at an additional cost. ZRS enabled storage is automatically configured when the Azure Data Explorer cluster is deployed into [Availability Zones](create-cluster-and-database.md#create-a-cluster).

#### Compute layer

Azure Data Explorer is a distributed computing platform and can have two to many nodes depending on scale and node role type. At provision time, select availability zones to distribute the node deployment, across zones for maximum intra-region resiliency. An availability zone failure won't result in a complete outage but instead, performance degradation until recovery of the zone. 

#### Leader-follower cluster configuration

Azure Data Explorer provides an optional [follower capability](follower.md) for a leader cluster to be followed by other follower clusters for read-only access to the leader's data and metadata. Changes in the leader, such as `create`, `append`, and `drop` are automatically synchronized to the follower. While the leaders could span Azure regions, the follower clusters should be hosted in the same region(s) as the leader. If the leader cluster is down or databases or tables are accidentally dropped, the follower clusters will lose access until access is recovered in the leader. 

### Outage of an Azure availability zone

Azure availability zones are unique physical locations within the same Azure region. They can protect an Azure Data Explorer cluster's compute and data from partial region failure. Zone failure is an availability scenario as it is intra-region. 

Pin an Azure Data Explorer cluster to the same zone as other connected Azure resources. For more information on enabling availability zones, see [create a cluster](create-cluster-and-database.md#create-a-cluster).

> [!NOTE] 
> Availability zone selection is only supported at the time of cluster creation and can't be modified later.

### Outage of an Azure datacenter

Azure availability zones come with a cost and some customers choose to deploy without zonal redundancy. With such an Azure Data Explorer deployment, an Azure datacenter outage will result in cluster outage. Handling an Azure datacenter outage is therefore identical to that of an Azure region outage.

### Outage of an Azure region

Azure Data Explorer doesn't provide automatic protection against the outage of an entire Azure region. To minimize business impact if there is such an outage, multiple Azure Data Explorer clusters across [Azure paired regions](/azure/best-practices-availability-paired-regions). Based on your recovery time objective (RTO), recovery point objective (RPO), as well as effort and cost considerations, there are [multiple disaster recovery configurations](#disaster-recovery-configurations). Cost and performance optimizations are possible with Azure Advisor recommendations and [autoscale](manage-cluster-horizontal-scaling.md) configuration.

## Disaster recovery configurations

 This section details multiple disaster recovery configurations depending on resiliency requirements (RPO and RTO), needed effort, and cost.

Recovery time objective (RTO) refers to the time to recover from a disruption. For example, RTO of 2 hours means the application has to be up and running within two hours of a disruption. Recovery point objective (RPO) refers to the interval of time that might pass during a disruption before the quantity of data lost during that period is greater than the allowable threshold. For example, if the RPO is 24 hours, and an application has data beginning from 15 years ago, they're still within the parameters of the agreed-upon RPO.

Ingestion, processing, and curation processes need diligent design upfront when planning for disaster recovery. Ingestion refers to data integrated into Azure Data Explorer from various sources; processing refers to transformations and similar activities; curation refers to materialized views, exports to the data lake, and so on.

The following are popular disaster recovery configurations, and each is described in detail below.
* [Active-Active-Active (always-on) configuration](#active-active-active-configuration)
* [Active-Active configuration](#active-active-configuration)
* [Active-Hot standby configuration](#active-hot-standby-configuration)
* [On-demand data recovery cluster configuration](#on-demand-data-recovery-configuration)

### Active-active-active configuration

This configuration is also called "always-on". For critical application deployments with no tolerance for outages, you should use multiple Azure Data Explorer clusters across Azure paired regions. Set up ingestion, processing, and curation in parallel to all of the clusters. The cluster SKU must be the same across regions. Azure will ensure that updates are rolled out and staggered across Azure paired regions. An Azure region outage won't cause an application outage. You may experience some latency or performance degradation.

:::image type="content" source="media/business-continuity-overview/active-active-active-n.png" alt-text="Active-active-active-n configuration.":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | 0 hours | 0 hours | Lower | Highest |

### Active-Active configuration

This configuration is identical to the [active-active-active configuration](#active-active-active-configuration), but only involves two Azure paired regions. Configure dual ingestion, processing, and curation. Users are routed to the nearest region. The cluster SKU must be the same across regions.

:::image type="content" source="media/business-continuity-overview/active-active.png" alt-text="Active-active configuration.":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active** | 0 hours | 0 hours | Lower | High |

### Active-Hot standby configuration

The Active-Hot configuration is similar to the [Active-Active configuration](#active-active-configuration) in dual ingest, processing, and curation. While the standby cluster is online for ingestion, process, and curation, it isn't available to query. The standby cluster doesn't need to be in the same SKU as the primary cluster. It can be of a smaller SKU and scale, which may result in it being less performant. In a disaster scenario, users are redirected to the standby cluster, which can optionally be scaled up to increase performance.

:::image type="content" source="media/business-continuity-overview/active-hot-standby.png" alt-text="Active-hot standby configuration.":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Hot Standby** | 0 hours | Low | Medium | Medium |

### On-demand data recovery configuration

This solution offers the least resiliency (highest RPO and RTO), is the lowest in cost and highest in effort. In this configuration, there's no data recovery cluster. Configure continuous export of curated data (unless raw and intermediate data is also required) to a storage account that is configured GRS (Geo Redundant Storage). A data recovery cluster is spun up if there is a disaster recovery scenario. At that time, DDLs, configuration, policies, and processes are applied. Data is ingested from storage with the ingestion property [kustoCreationTime](ingest-data-event-grid-overview.md) to over-ride the ingestion time that defaults to system time. 

:::image type="content" source="media/business-continuity-overview/on-demand-data-recovery-cluster.png" alt-text="On-demand data recovery cluster configuration.":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **On-demand data recovery cluster** | Highest | Highest | Highest | Lowest |

### Summary of disaster recovery configuration options

| **Configuration** | **Resiliency** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | Highest | 0 hours | 0 hours | Lower | Highest |
| **Active-Active** | High | 0 hours | 0 hours | Lower | High |
| **Active-Hot Standby** | Medium | 0 hours | Low | Medium | Medium |
| **On-demand data recovery cluster** | Lowest | Highest | Highest | Highest | Lowest |

## Best practices

Regardless of which disaster recovery configuration is chosen, follow these best practices:

* All database objects, policies, and configurations should be persisted in source control so they can be released to the cluster from your release automation tool. For more information, see [Azure DevOps support for Azure Data Explorer](devops.md). 
* Design, develop, and implement validation routines to ensure all clusters are in-sync from a data perspective. Azure Data Explorer supports [cross cluster joins](kusto/query/cross-cluster-or-database-queries.md?pivots=azuredataexplorer). A simple count or rows across tables can help validate.
* Release procedures should involve governance checks and balances that ensure mirroring of the clusters.
* Be fully cognizant of what it takes to build a cluster from scratch.
* Create a checklist of deployment units. Your list will be unique to your needs, but should include: deployment scripts, ingestion connections, BI tools, and other important configurations. 

## Next step

> [!div class="nextstepaction"]
> [Create business continuity and disaster recovery solutions](business-continuity-create-solution.md)
