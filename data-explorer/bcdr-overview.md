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

 1. High availability/fault tolerance <!-- choose preferred term -->
 1. Recovering from human errors
 1. Azure zone failure
 1. Azure datacenter failure
 1. Outage of an Azure region

<!-- align these names with header titles if changed in either location-->

This overview describes capabilities that Azure Data Explorer provides for business continuity and disaster recovery. Learn how to recover from events that could cause data loss, or cause your database and application to become unavailable.

## Built in fault tolerance

### Persistence Layer/Storage layer
<!-- choose preferred term -->

Azure Storage automatically provides fault tolerance, with the default redundancy offering Locally Redundant Storage within a datacenter. Three replicas are persisted, and in the event of loss of a replica in use, another is deployed without disruption.

Further resiliency is offered at an additional cost with Zone Redundant Storage. In this setup, replicas are intelligently placed across availability zones for maximum intra-region resiliency. This availability zone configuration selection is only supported at provision-time.

### Compute layer/Availability zones
<!-- choose preferred term -->

Azure Data Explorer is a distributed computing platform and can have two to many nodes depending on scale, and per node role type. At provision time, selecting availability zones distributes the node deployment, intelligently, across zones providing maximum resiliency, intra-region. An availability zone failure, will not result in a complete outage, but performance degradation, until recovery of the zone. Availability zone selection (or not) is an architectural consideration and strictly, a provision-time configuration that cannot be changed post-provisioning.

### Leader-Follower cluster configuration

Azure Data Explorer provides an optional but useful [capability](https://docs.microsoft.com/azure/data-explorer/follower) for a cluster (lets call it a leader) to be followed by zero to many clusters (lets call them followers) for read only access to the leader's data and metadata, including automated synchronization (create, append, drop) of changes in the leader to the follower. While the leaders could span Azure regions, it is strongly recommended to host follower clusters in the same region as the leader. In this setup, if the leader cluster is down or databases or tables accidentally dropped, the follower clusters will lose access until recovered in the leader. <!-- what does this protect against? -->

## Recovering from human error- user accidentally dropped a cluster, database, or table

### Accidental cluster or database deletion

Accidental cluster or database deletion is an irrecoverable action. The Azure Data Explorer resource owner can prevent this by enabling the delete &quot;[lock](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources)&quot; capability, available at the Azure resource level.

### Accidental table deletion

Users with table admin permissions or higher are allowed to [drop tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/drop-table-command). If one of those users accidentally drops a table, you can recover it using the [.undo drop table](https://docs.microsoft.com/azure/data-explorer/kusto/management/undo-drop-table-command) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/retentionpolicy).

### Accidental external table deletion

Deletion of an external table merely deletes the table metadata. You can recover it by re-executing the table creation command. Azure storage offers [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) capability that protects against accidental deletion or overwrite of a file/blob for a user-configured amount of time. 

## Azure availability zone failure

Availability zones are unique physical locations within the same Azure region.

Azure availability zones can protect an Azure Data Explorer cluster and data from partial region failure.

When you deploy new clusters to different availability zones, the underlying compute and storage components are deployed to different zones in the region. Each zone has independent power, cooling, and networking. During zonal downtime, the cluster will continue to work, but may experience performance degradation until the failure is resolved.

You can also use zonal services, which pin an Azure Data Explorer cluster to the same zone as other connected Azure resources.

> [!Note]
> Deployment to availability zones can be done only during cluster creation and cannot be modified later.

For more details on enabling availability zones on Azure Data Explorer, read - [https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal)

## Outage of an Azure Datacenter


Azure Availability Zones come with a cost and some customers, choose to deploy without zonal redundancy. With such an ADX deployment, a datacenter outage, will result in cluster outage, and is therefore, a disaster recovery scenario, similar to an entire Azure region failure. This is addressed under the next section.

## Outage of an Azure Region

Azure Data Explorer does not support **automatic** protection against the outage of an **entire** Azure region. This disruption could happen during a natural disaster, like an earthquake. If you require a solution for this type of situation, you must create two or more independent clusters in two [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

Once you have created multiple clusters, do the following steps:

1. Replicate all management activities (such as creating new tables or managing user roles) on each cluster.
1. Ingest data to each cluster in parallel.

Azure Data Explorer won't perform parallel maintenance operations (such as upgrades) on clusters that are in Azure paired regions.

### Always-on configuration with zero tolerance for application downtime

For mission critical &quot;application&quot; deployments with no tolerance for outages, you should use multiple Azure Data Explorer clusters across Azure paired regions. Set up ingestion, processing and curation done in parallel to all the clusters. The cluster SKU typically is the same across regions in this configuration.

Azure will ensure that updates are rolled, staggered across Azure paired regions.
In the deployment below, an Azure region outage will not cause an application outage and may experience latency or performance degradation.

:::image type="content" source="media/bcdr/active-active-active-n.png" alt-text="Active-active-active-n configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active-Active-n** | 0 hours | 0 hours | Lower | Highest |

## Active-Active configuration

This is identical to the &quot;Always-on&quot; configuration described above, but only involves two paired Azure regions. Dual ingestion, processing and curation needs to be configured. Users are routed to the nearest region. The cluster SKU typically is the same across regions in this configuration.

:::image type="content" source="media/bcdr/active-active.png" alt-text="Active-active configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Active** | None | None | Lower | High |

## Active-hot standby configuration

This is similar to the &quot;active-active&quot; configuration described above, in terms of dual ingest, processing and curation. However, the standby cluster is offline to end users, and need not be the same SKU as the primary. The hot standby cluster can also be of a smaller SKU and scale, and is therefore less performant. In the event of a disaster scenario, the standby cluster is brought online, and scaled up.

:::image type="content" source="media/bcdr/active-hot-standby.png" alt-text="Active-hot standby configuration":::

| **Configuration** | **RPO** | **RTO** | **Effort** | **Cost** |
| --- | --- | --- | --- | --- |
| **Active-Hot Standby** | Low | Low | Medium | Medium |

## On-demand DR cluster configuration

This solution offers the least resiliency (highest RPO and RTO), is the lowest in cost and highest in effort. In this configuration, there is no DR cluster. Continuous export of &quot;curated&quot; data (unless raw and intermediate data is also required) should be configured to a storage account that is configured GRS or geo redundant. A DR cluster is spun up in the event of a DR scenario and DDLs, configuration and policies, processes etc are applied, data is ingested from storage into. The data needs to be ingested with the ingestion property – &quot;[kustoCreationTime](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventgrid)&quot; to over-ride the ingestion time that defaults to system time. 

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

