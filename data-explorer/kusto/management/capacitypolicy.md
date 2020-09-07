---
title: Capacity policy - Azure Data Explorer
description: This article describes Capacity policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/12/2020
---
# Capacity policy 

A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## The capacity policy object

The capacity policy is made of:

* [IngestionCapacity](#ingestion-capacity)
* [ExtentsMergeCapacity](#extents-merge-capacity)
* [ExtentsPurgeRebuildCapacity](#extents-purge-rebuild-capacity)
* [ExportCapacity](#export-capacity)
* [ExtentsPartitionCapacity](#extents-partition-capacity)

## Ingestion capacity

|Property                           |Type    |Description                                                                                                                                                                               |
|-----------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|ClusterMaximumConcurrentOperations |long    |A maximal value for the number of concurrent ingestion operations in a cluster                                          |
|CoreUtilizationCoefficient         |double  |A coefficient for the percentage of cores to use when calculating the ingestion capacity. The calculation's result will always be normalized by `ClusterMaximumConcurrentOperations`                          |

The cluster's total ingestion capacity, as shown by [.show capacity](../management/diagnostics.md#show-capacity), is calculated by:

Minimum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * Maximum(1, `Core count per node` * `CoreUtilizationCoefficient`))

> [!Note]
> In clusters with three ore more nodes, the admin node doesn't participate in ingestion operations. The `Number of nodes in cluster` is reduced by one.

## Extents merge capacity

|Property                           |Type    |Description                                                                                                |
|-----------------------------------|--------|-----------------------------------------------------------------------------------------------------------|
|MinimumConcurrentOperationsPerNode |long    |A minimal value for the number of concurrent extents merge/rebuild operations on a single node. Default is 1 |
|MaximumConcurrentOperationsPerNode |long    |A maximal value for the number of concurrent extents merge/rebuild operations on a single node. Default is 3 |

The cluster's total extents merge capacity, as shown by [.show capacity](../management/diagnostics.md#show-capacity), is calculated by:

`Number of nodes in cluster` x `Concurrent operations per node`

The effective value for `Concurrent operations per node` gets automatically adjusted by the system in the range [`MinimumConcurrentOperationsPerNode`,`MaximumConcurrentOperationsPerNode`], as long as the success rate of the
merge operations is above 90%.

> [!Note]
> * In clusters with three or more nodes, the admin node doesn't participate in doing merge operations. The `Number of nodes in cluster` is reduced by one.

## Extents purge rebuild capacity

|Property                           |Type    |Description                                                                                                                           |
|-----------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------|
|MaximumConcurrentOperationsPerNode |long    |A maximal value for the number of concurrent rebuild extents for purge operations on a single node |

The cluster's total extents purge rebuild capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity)) is calculated by:

`Number of nodes in cluster` x `MaximumConcurrentOperationsPerNode`

> [!Note]
> In clusters with three or more nodes, the admin node doesn't participate in doing merge operations. The `Number of nodes in cluster` is reduced by one.

## Export capacity

|Property                           |Type    |Description                                                                                                                                                                            |
|-----------------------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|ClusterMaximumConcurrentOperations |long    |A maximal value for the number of concurrent export operations in a cluster.                                           |
|CoreUtilizationCoefficient         |double  |A coefficient for the percentage of cores to use when calculating the export capacity. The calculation's result will always be normalized by `ClusterMaximumConcurrentOperations`. |

The cluster's total export capacity, as shown by [.show capacity](../management/diagnostics.md#show-capacity), is calculated by:

Minimum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * Maximum(1, `Core count per node` * `CoreUtilizationCoefficient`))

> [!Note]
> In clusters with three or more nodes, the admin node doesn't participate in export operations. The `Number of nodes in cluster` is reduced by one.

## Extents partition capacity

|Property                           |Type    |Description                                                                                         |
|-----------------------------------|--------|----------------------------------------------------------------------------------------------------|
|ClusterMinimumConcurrentOperations |long    |A minimal value for the number of concurrent extents partition operations in a cluster. Default: 1  |
|ClusterMaximumConcurrentOperations |long    |A maximal value for the number of concurrent extents partition operations in a cluster. Default: 16 |

The cluster's total extents partition capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity)).

The effective value for `Concurrent operations` is automatically adjusted by the system in the range
[`ClusterMinimumConcurrentOperations`,`ClusterMaximumConcurrentOperations`], as long as the success rate of the
partitioning operations is above 90%.

## Defaults

The default capacity policy has the following JSON representation:

```json
{
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  },
  "ExtentsMergeCapacity": {
    "MinimumConcurrentOperationsPerNode": 1,
    "MaximumConcurrentOperationsPerNode": 3
  },
  "ExtentsPurgeRebuildCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExportCapacity": {
    "ClusterMaximumConcurrentOperations": 100,
    "CoreUtilizationCoefficient": 0.25
  },
  "ExtentsPartitionCapacity": {
    "ClusterMinimumConcurrentOperations": 1,
    "ClusterMaximumConcurrentOperations": 16
  }
}
```

## Control commands

> [!WARNING]
> Consult with the Azure Data Explorer team before altering a capacity policy.

* Use [.show cluster policy capacity](capacity-policy.md#show-cluster-policy-capacity) to show the current capacity policy of the cluster.

* Use [.alter cluster policy capacity](capacity-policy.md#alter-cluster-policy-capacity) to alter the capacity policy of the cluster.

## Throttling

Kusto limits the number of concurrent requests for the following user-initiated commands:

* Ingestions (includes all the commands that are listed [here](../../ingest-data-overview.md))
   * Limit is as defined in the [capacity policy](#capacity-policy).
* Purges
   * Global is currently fixed at one per cluster.
   * The purge rebuild capacity is used internally to determine the number of concurrent rebuild operations during purge commands. Purge commands won't be blocked/throttled because of this process, but will work faster or slower depending on the purge rebuild capacity.
* Exports
   * Limit is as defined in the [capacity policy](#capacity-policy).

When the cluster detects that an operation has exceeded the permitted concurrent operation, it will respond with a 429, "Throttled", HTTP code.
Retry the operation after some backoff.
