---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
author: orspod
ms.author: orspodek
ms.reviewer: herauch
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/09/2020
---

# Business continuity and disaster recovery

Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a disruption. Some disruptive events are not automatically handled by Azure Data Explorer, such as:

 1. High availability/fault tolerance <!-- choose preferred term -->
 1. Recovering from human errors
 1. Azure availability zone failure
 1. Azure datacenter failure
 1. Outage of an Azure region

<!-- align these names with header titles if changed in either location-->

This overview describes capabilities that Azure Data Explorer provides for business continuity and disaster recovery. 
Some basic capabilities are built in, but most rely on users to set up their clusters in an architecture that most suits their disaster recovery objectives. Learn about different solutions and architectures, and how they address events that would otherwise cause data loss or unavailability.

## Built in fault tolerance

### Persistence Layer/Storage layer
<!-- choose preferred term -->

Azure Storage automatically provides fault tolerance, with the default setting offering Locally Redundant Storage (LRS) within a data center. Three replicas are persisted. If a replica is lost while in use, another is deployed without disruption.

If you need further resiliency, Zone Redundant Storage places replicas across availability zones. This feature incurs added costs.

> [!Note] 
> Availability zone configuration selection is only supported at the time of provision.

### Compute layer/Availability zones
<!-- choose preferred term -->

Azure Data Explorer is a distributed computing platform and can have two to many nodes depending on scale, and node role type. At provision time, select availability zones to distribute the node deployment, across zones for maximum intra-region resiliency. An availability zone failure won't result in a complete outage. You'll, however, experience performance degradation until recovery of the zone. 

> [!Note] 
> Availability zone selection is only supported at the time of provision.

### Leader-Follower cluster configuration

Azure Data Explorer provides an optional [capability](follower.md) for a leader cluster to be followed by other follower clusters for read-only access to the leader's data and metadata. Changes in the leader, such as `create`, `append`, and `drop` are automatically synchronized to the follower. While the leaders could span Azure regions, the follower clusters should be hosted in the same region(s) as the leader. If the leader cluster is down or databases/tables are accidentally dropped, the follower clusters will lose access until recovered in the leader. 

## Recovering from human error- user accidentally dropped a cluster, database, or table

### Accidental cluster or database deletion

Accidental cluster or database deletion is an irrecoverable action. 
The Azure Data Explorer resource owner can prevent data loss by enabling the delete &quot;[lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources)&quot; capability, available at the Azure resource level.

### Accidental table deletion

Users with table admin permissions or higher are allowed to [drop tables](kusto/management/drop-table-command.md). If one of those users accidentally drops a table, you can recover it using [`.undo drop table`](kusto/management/undo-drop-table-command.md) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](kusto/management/retentionpolicy.md).

### Accidental external table deletion

[External tables](kusto/query/schema-entities/externaltables.md) are Kusto query schema entities that reference data stored outside the database. 
Deletion of an external table only deletes the table metadata. You can recover it by re-executing the table creation command. Use the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) capability to protect against accidental deletion or overwrite of a file/blob for a user-configured amount of time. 

## Azure availability zone failure

Availability zones are unique physical locations within the same Azure region.

Azure availability zones can protect an Azure Data Explorer cluster and data from partial region failure.

When you deploy new clusters to different availability zones, the underlying compute and storage components are deployed to different zones in the region. Each zone has independent power, cooling, and networking. During zonal downtime, the cluster will continue to work, but may experience performance degradation until the failure is resolved.

You can also use zonal services, which pin an Azure Data Explorer cluster to the same zone as other connected Azure resources.

> [!Note]
> Deployment to availability zones can be done only during cluster creation and cannot be modified later.

Continue reading for more details on [enabling availability zones](create-cluster-database-portal.md) on Azure Data Explorer.

## Outage of an Azure Datacenter

Dealing with a datacenter outage is similar to the Azure region failure recovery process.
Azure Availability Zones come with a cost and some customers, choose to deploy without zonal redundancy. With such an Azure Data Explorer deployment, a datacenter outage, will result in cluster outage. That's why this disaster recovery scenario is similar to an entire Azure region failure.

## Outage of an Azure Region

[Paired regions](https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions)

Azure Data Explorer does not support **automatic** protection against the outage of an **entire** Azure region. To create an architecture that can overcome such an outage, we provide some options and considerations for disaster recovery. For each option, we take into account recovery time objective (RTO), recovery point objective (RPO), effort, and cost. You can do cost and performance optimizations using Azure Advisor recommendations and [autoscale](manage-cluster-horizontal-scaling.md) configuration.

 You'll need to address ingestion, processing, and curation as they relate to setting up this architecture. Ingestion refers to data integrated into Azure Data Explorer from sources; processing refers to transformations and similar activities; curation refers to materialized views, exports to the data lake, and such.

Regardless of which disaster recovery configuration is chosen, use these best practices:

* All database objects, policies, and configurations should be persisted in source control so they can be released to the cluster from Azure DevOps or your favorite release automation tool. Read more information about [Azure DevOps support for Azure Data Explorer](devops.md). 
* Design, develop, and implement validation routines to ensure all clusters are in-sync from a data perspective. Azure Data Explorer supports [cross cluster joins](https://docs.microsoft.com/azure/data-explorer/kusto/query/cross-cluster-or-database-queries?pivots=azuredataexplorer). A simple count or rows across tables can help validate.
* Use [continuous export](kusto/management/data-export/continuous-data-export.md) capability, as a best practice, and export data within Azure Data Explorer tables to an Azure Data Lake Store, whatever DR configuration is chosen, and ensure selection of GRS or Geo Redundant Storage for the highest resilience.
* Release procedures should involve governance checks and balances that ensure mirroring of the clusters
* Be fully cognizant of what it takes to build a cluster from scratch.
* Create a checklist of deployment units to build a cluster from scratch. Your list will be unique to your needs, but should include: deployment scripts, ingestion connections, BI tools, and other important configurations. 

<!-- consider adding this checklist in some way but also edit it to be more understandable:
 **Deployment unit** 
1. ARM template to create Azure Data Explorer cluster with the required configuration
1. Command-lets to deploy control plane security - authorization
1. Database object deployment scripts – databases, tables, user-defined functions
1. External table deployment scripts with the DR storage configuration
1. [Policy](kusto/management/policies.md) deployment scripts 
1. Deployment scripts for processes – e.g. continuous exports, materialized views
1. Data ingestion connections 
1. Follower-leader deployments 
1. Scripts for security at the data plane level- authorization including row level
1. BI tool related
1. Over-rides to any default cluster configurations
1. Scripts for ingestion from storage, backfill factored in, DR region specific SAS URLs
-->

## Architecture examples and their performance

The following examples show possible architectures for disaster recovery. You'll need to balance your recovery objectives with cost and effort to find the most appropriate configuration for your needs. 

Recovery time objective (RTO) refers to the time to recover from a disruption. For example, RTO of 2 hours means the application has to be up and running within two hours of a disruption.

Recovery point objective (RPO) refers to the interval of time that might pass during a disruption before the quantity of data lost during that period is greater than the allowable threshold. For example, if the RPO is 24 hours, and an application has data beginning from 15 years ago, they're still within the parameters of the agreed-upon RPO.

### Always-on configuration with zero tolerance for application downtime

For critical application deployments with no tolerance for outages, you should use multiple Azure Data Explorer clusters across Azure paired regions. Set up ingestion, processing, and curation done in parallel to all the clusters. The cluster SKU typically is the same across regions in this configuration.

Azure will ensure that updates are rolled, staggered across Azure paired regions.
In the deployment below, an Azure region outage will not cause an application outage and may experience latency or performance degradation.

:::image type="content" source="media/bcdr/active-active-active-n.png" alt-text="Active-active-active-n configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | 0 hours | 0 hours | Lower | Highest |

### Active-Active configuration

This configuration is identical to the **Always-on** configuration described above, but only involves two paired Azure regions. Dual ingestion, processing and curation need to be configured. Users are routed to the nearest region. The cluster SKU typically is the same across regions in this configuration.

:::image type="content" source="media/bcdr/active-active.png" alt-text="Active-active configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active** | None | None | Lower | High |

### Active-hot standby configuration

This configuration is similar to the **active-active** configuration in dual ingest, processing, and curation. However, the standby cluster is offline to end users, and need not be the same SKU as the primary. The hot standby cluster can also be of a smaller SKU and scale, and as such is less performant. In a disaster scenario, the standby cluster is brought online, and scaled up.

:::image type="content" source="media/bcdr/active-hot-standby.png" alt-text="Active-hot standby configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Hot Standby** | Low | Low | Medium | Medium |

### On-demand DR cluster configuration

This solution offers the least resiliency (highest RPO and RTO), is the lowest in cost and highest in effort. In this configuration, there is no DR cluster. Continuous export of &quot;curated&quot; data (unless raw and intermediate data is also required) should be configured to a storage account that is configured GRS or geo redundant. A DR cluster is spun up in the event of a DR scenario and DDLs, configuration and policies, processes etc are applied, data is ingested from storage into. The data needs to be ingested with the ingestion property [kustoCreationTime](kusto/management/data-ingestion/eventgrid.md) to over-ride the ingestion time that defaults to system time. 

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


## Next steps

Get started with the [business continuity disaster recovery HowTo](bcdr-howto.md).

Read more 