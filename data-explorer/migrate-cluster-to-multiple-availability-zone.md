---
title: Migrate your cluster to support multiple availability zones
description: This guide teaches you how to migrate your cluster to support multiple availability zones.
ms.reviewer: iriskaminer
ms.date: 11/07/2023
ms.topic: how-to
---
# Migrate your cluster to support multiple availability zones

Many Azure regions provide availability zones, which are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones. They're connected by a high-performance network with a round-trip latency of less than 2 ms. However, availability zones are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. For more information, see [Azure Availability Zones](/azure/availability-zones/az-overview).

Azure Data Explorer clusters can be configured to use availability zones in supported regions. By using availability zones, a cluster can withstand the failure of a single datacenter in a region and ensure [business continuity](business-continuity-overview.md).

You can configure availability zones when creating a cluster [in the Azure portal](create-cluster-and-database.md#create-a-cluster) or [programmatically](create-cluster-database.md).

> [!IMPORTANT]
>
> - Once a cluster is configured with availability zones, you can't change the cluster not use availability zones.
> - Not all regions support multiple zones. Clusters in those regions can't be configured to use availability zones.

In this article, you learn about:

> [!div class="checklist"]
>
> - How to [migrate your cluster configuration to support availability zones](#migrate-your-cluster-configuration-to-support-availability-zones)
> - The [architecture of clusters with availability zones](#architecture-of-clusters-with-availability-zones)
> - The [migration process and considerations](#migration-process)

## Prerequisites

Changing a cluster's availability zones is supported in the following scenarios:

- A cluster that was deployed without any availability zones
- A cluster that was deployed with a partial list of less than three availability zones

## Migrate your cluster configuration to support availability zones

> [!NOTE]
> Before you proceed, make sure you familiarize the [migration process and considerations](#migration-process).

To add availability zones to an existing cluster, you must update the cluster `zones` attribute with a list of the target availability zones. You can change the programatically using one of the following methods:

- ARM Template
- REST API
- C# SDK
- Python SDK
- Go SDK
- Azure CLI
- PowerShell

1. STEP 1
1. STEP 2

// TODO?
// WHERE GET LIST OF AZs?
// MONITOR PROGRESS / CHECK STATUS

## Architecture of clusters with availability zones

When availability zones are configured, a cluster's resources are deployed as follows:

- **Compute layer**: Azure Data Explorer is a distributed computing platform that has two or more nodes. If availability zones are configured, compute nodes are distributed across the defined availability zone for maximum intra-region resiliency. A zone failure doesn't result in complete outage but instead, performance might degrade until the recovery of the zone. We recommended configuring the maximum available zones in a region.

    > [!NOTE]
    >
    > - In some cases, due to compute capacity limitations, only partial availability zones will be available for the compute layer.
    > - A cluster's compute layer uses Virtual Machine Scale Sets (VMSS) zone redundant setup, leveraging the scale set best effort approach to evenly spread instances across selected zones. For more advanced VMSS setups, see [Create a Virtual Machine Scale Set that uses Availability Zones](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones).

- **Persistent storage layer**: Clusters use Azure Storage as its durable persistence layer. If availability zones are configured, [Zone-redundant storage (ZRS)](/azure/storage/common/storage-redundancy#zone-redundant-storage) is enabled, placing storage replicas across all three availability zones for maximum intra-region resiliency.

    > [!NOTE]
    >
    > - ZRS entails an additional cost.
    > - When availability zones aren't configured, storage resources are deployed with the default setting of [Locally Redundant Storage (LRS)](/azure/storage/common/storage-redundancy#locally-redundant-storage), placing all 3 replicas is a single zone.

## Migration process

When an existing cluster that was deployed without any availability zones is configured to support availability zones, the following steps take place as part of the migration process:

- Compute is distributed in the defined availability zones

    The process of redistributing compute resources involves the creation of a new VMSS. During the preparation of this new VMSS, the existing cluster's VMSS continues to function, ensuring uninterrupted service. This preparation phase can take a considerable amount of time, often in the range of tens of minutes. The transition to the new VMSS only occurs once it's fully prepared and operational. This parallel processing approach ensures a relatively seamless experience, with only minimal service disruption during the switchover process, typically lasting between one to the minutes. However, it's important to note that query performance might be affected during the SKU migration. The degree of impact can vary depending on specific usage patterns.

- Historical persistent storage data is migrated to ZRS

    The migration process is dependent on the regional support for the transition from LRS to ZRS storage, as well as the capacity of the available zones to support the migration. The transfer of historical data can be a time-consuming process, potentially taking several hours or even extending over multiple days.

- All new data is written to ZRS

    After the request for migration to availability zones is initiated, all new data is replicated and stored in the ZRS configuration.

    > [!NOTE]
    >
    > - Following the migration request, there might be a delay of up to several minutes before all new data begins to be written in the Zone Redundant Storage (ZRS) configuration.
    > - If a cluster has streaming ingestion, then the recycling of new data to be written as ZRS data, can take up to 30 days.

### Considerations

The request for migration to availability zones might not be successful due to capacity constraints. For a successful migration, there must be sufficient compute and storage capacity to support the migration. If there are capacity limitations, you'll receive an error message indicating the issue.

## See also

- [Business continuity and disaster recovery overview](business-continuity-overview.md)