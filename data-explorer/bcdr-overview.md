---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
author: orspod
ms.author: orspodek
ms.reviewer: ankhanol
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/05/2020
---

# Business Continuity and Disaster Recovery

Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. This article discusses availability (intra-region) and disaster recovery. It details native capabilities available out of the box, and architectural considerations, for a resilient Azure Data Explorer deployment. It details recovering from human errors, high availability out of the box, followed by multiple disaster recovery configurations depending on resiliency requirements (Recovery point objective (RPO) and Recovery time objective (RTO)), needed effort and cost.

## Mitigate disruptive events

* [Human error](#human-error)
* [High availability of Azure Data Explorer](#high-availability-of-azure-data-explorer)
* [Outage of an Azure availability zone](#outage-of-an-azure-availability-zone)
* [Outage of an Azure datacenter](#outage-of-an-azure-datacenter)
* [Outage of an Azure region](#outage-of-an-azure-region)

### Human error 

Human errors are inevitable. Users can accidentally drop a cluster, database, or a table.  

#### Accidental cluster or database deletion

Accidental cluster or database deletion is an irrecoverable action. As the Azure Data Explorer resource owner, you can prevent data loss by enabling the delete [lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) capability, available at the Azure resource level.

#### Accidental table deletion

Users with table admin permissions or higher are allowed to [drop tables](kusto/management/drop-table-command.md). If one of those users accidentally drops a table, you can recover it using the [`.undo drop table`](kusto/management/undo-drop-table-command.md) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](kusto/management/retentionpolicy.md).

#### Accidental external table deletion

[External tables](kusto/query/schema-entities/externaltables.md) are Kusto query schema entities that reference data stored outside the database. 
Deletion of an external table only deletes the table metadata. You can recover it by re-executing the table creation command. Use the [soft delete](/azure/storage/blobs/storage-blob-soft-delete) capability to protect against accidental deletion or overwrite of a file/blob for a user-configured amount of time.

### High availability of Azure Data Explorer

High availability refers to the fault-tolerance of Azure Data Explorer, its components, and underlying dependencies within an Azure region. This fault tolerance includes avoiding single points of failure (SPOF), out of the box, in the implementation. In Azure Data Explorer, high availability includes the persistence layer, compute layer, and a leader-follower configuration.

#### Persistence layer

Azure Data Explorer leverages Azure Storage as its durable persistence layer. Azure Storage automatically provides fault tolerance, with the default setting offering Locally Redundant Storage (LRS) within a data center. Three replicas are persisted. If a replica is lost while in use, another is deployed without disruption. Further resiliency is possible with Zone Redundant Storage that places replicas intelligently across Azure regional availability zones for maximum fault tolerance at an additional cost.

#### Compute layer

Azure Data Explorer is a distributed computing platform and can have two to many nodes depending on scale and node role type. At provision time, select availability zones to distribute the node deployment, across zones for maximum intra-region resiliency. An availability zone failure won't result in a complete outage but instead, performance degradation until recovery of the zone. 

#### Leader-Follower cluster configuration

Azure Data Explorer provides an optional [follower capability](follower.md) for a leader cluster to be followed by other follower clusters for read-only access to the leader's data and metadata. Changes in the leader, such as `create`, `append`, and `drop` are automatically synchronized to the follower. While the leaders could span Azure regions, the follower clusters should be hosted in the same region(s) as the leader. If the leader cluster is down or databases/tables are accidentally dropped, the follower clusters will lose access until access is recovered in the leader. 

### Outage of an Azure availability zone

Azure availability zones are unique physical locations within the same Azure region. They can protect an Azure Data Explorer cluster's compute and data from partial region failure. Zone failure is an availability scenario as it is intra-region. 

Pin an Azure Data Explorer cluster to the same zone as other connected Azure resources. For more information on enabling availability zones, see [create a cluster](create-cluster-database-portal.md#create-a-cluster).

> [!NOTE] 
> Availability zone selection is only supported at the time of cluster creation and can't be modified later.

### Outage of an Azure datacenter

Azure availability zones come with a cost and some customers choose to deploy without zonal redundancy. With such an Azure Data Explorer deployment, an Azure datacenter outage will result in cluster outage. Handling an Azure datacenter outage is therefore identical to that of an Azure region outage.

### Outage of an Azure region

[Paired regions](/azure/best-practices-availability-paired-regions)

Azure Data Explorer doesn't provide automatic protection against the outage of an entire Azure region. To minimize business impact if there is such an outage, based on your recovery time objective (RTO), recovery point objective (RPO), as well as effort and cost considerations, there are [multiple disaster recovery configurations](#disaster-recovery-configurations). Cost and performance optimizations are possible with Azure Advisor recommendations and [autoscale](manage-cluster-horizontal-scaling.md) configuration.

## Disaster recovery configurations

 This section details multiple disaster recovery configurations depending on resiliency requirements (RPO and RTO), needed effort and cost.

Recovery time objective (RTO) refers to the time to recover from a disruption. For example, RTO of 2 hours means the application has to be up and running within two hours of a disruption. Recovery point objective (RPO) refers to the interval of time that might pass during a disruption before the quantity of data lost during that period is greater than the allowable threshold. For example, if the RPO is 24 hours, and an application has data beginning from 15 years ago, they're still within the parameters of the agreed-upon RPO.

Ingestion, processing, and curation processes need diligent design upfront when planning for disaster recovery. Ingestion refers to data integrated into Azure Data Explorer from various sources; processing refers to transformations and similar activities; curation refers to materialized views, exports to the data lake, and so on.

The following are popular disaster recovery configurations, and each is described in detail below.
* Always-on configuration
* Active-Active configuration
* Active-Hot standby configuration
* On-demand DR cluster configuration

### Always-on configuration

For critical application deployments with no tolerance for outages, you should use multiple Azure Data Explorer clusters across Azure paired regions. Set up ingestion, processing, and curation in parallel to all of the clusters. The cluster SKU must be the same across regions. Azure will ensure that updates are rolled out and staggered across Azure paired regions. An Azure region outage won't cause an application outage. You may experience some latency or performance degradation.

:::image type="content" source="media/bcdr-overview/active-active-active-n.png" alt-text="Active-active-active-n configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | 0 hours | 0 hours | Lower | Highest |

### Active-Active configuration

This configuration is identical to the [Always-on configuration](#always-on-configuration), but only involves two paired Azure regions. Configure dual ingestion, processing, and curation. Users are routed to the nearest region. The cluster SKU must be the same across regions.

:::image type="content" source="media/bcdr-overview/active-active.png" alt-text="Active-active configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active** | None | None | Lower | High |

### Active-Hot standby configuration

The Active-Hot configuration is similar to the [Active-Active configuration](#active-active-configuration) in dual ingest, processing, and curation. However, the standby cluster is offline to end users, and doesn't need to be in the same SKU as the primary. The hot standby cluster can also be of a smaller SKU and scale, and as such is less performant. In a disaster scenarios, the standby cluster is brought online, and scaled up.

:::image type="content" source="media/bcdr-overview/active-hot-standby.png" alt-text="Active-hot standby configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Hot Standby** | Low | Low | Medium | Medium |

### On-demand DR configuration

This solution offers the least resiliency (highest RPO and RTO), is the lowest in cost and highest in effort. In this configuration, there's no DR (data recovery) cluster. Configure continuous export of curated data (unless raw and intermediate data is also required) to a storage account that is configured GRS (Geo Redundant Storage). A DR cluster is spun up if there is a DR scenario. At that time, DDLs, configuration, policies, and processes are applied. Data is ingested from storage with the ingestion property [kustoCreationTime](kusto/management/data-ingestion/eventgrid.md) to over-ride the ingestion time that defaults to system time. 

:::image type="content" source="media/bcdr-overview/on-demand-dr-cluster.png" alt-text="On-demand DR cluster configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **On-demand DR cluster** | Highest | Highest | Highest | Lowest |

### Summary of Disaster Recovery Configuration Options

| **Configuration** | **Resiliency** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | Highest | 0 hours | 0 hours | Lower | Highest |
| **Active-Active** | High | None | None | Lower | High |
| **Active-Hot Standby** | Medium | Low | Low | Medium | Medium |
| **On-demand DR cluster** | Lowest | Highest | Highest | Highest | Lowest |

## Best Practices

Regardless of which disaster recovery configuration is chosen, follow these best practices:

* All database objects, policies, and configurations should be persisted in source control so they can be released to the cluster from your release automation tool. For more information, see [Azure DevOps support for Azure Data Explorer](devops.md). 
* Design, develop, and implement validation routines to ensure all clusters are in-sync from a data perspective. Azure Data Explorer supports [cross cluster joins](kusto/query/cross-cluster-or-database-queries.md?pivots=azuredataexplorer). A simple count or rows across tables can help validate.
* Use [continuous export](kusto/management/data-export/continuous-data-export.md) capability and export data within Azure Data Explorer tables to an Azure Data Lake store. Ensure selection of GRS for the highest resilience.
* Release procedures should involve governance checks and balances that ensure mirroring of the clusters.
* Be fully cognizant of what it takes to build a cluster from scratch.
* Create a checklist of deployment units. Your list will be unique to your needs, but should include: deployment scripts, ingestion connections, BI tools, and other important configurations. 

## Next steps

Learn more with the [business continuity disaster recovery solution](bcdr-create-solution.md).
