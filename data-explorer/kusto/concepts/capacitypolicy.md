---
title: Capacity policy - Azure Data Explorer | Microsoft Docs
description: This article describes Capacity policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 12/09/2019
---
# Capacity policy

A Kusto cluster defines a capacity policy, for controlling the compute resources which are being used to perform
data ingestion and other data grooming operations (such as merging extents).

## The capacity policy object

The capacity policy is comprised of `IngestionCapacity`, `ExtentsMergeCapacity`, `ExtentsPurgeRebuildCapacity`
and `ExportCapacity`.

### Ingestion capacity

|Property                           |Type    |Description                                                                                                                                                                               |
|-----------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|ClusterMaximumConcurrentOperations |long    |A maximal value for the number of concurrent ingestion operations in a cluster                                                                                                            |
|CoreUtilizationCoefficient         |double  |A coefficient for the percentage of cores to utilize when calculating the ingestion capacity (the calculation's result will always be normalized by `ClusterMaximumConcurrentOperations`) |                                                                                                                             |

The cluster's total ingestion capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity))
is calculated by:
- Minimum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * Maximum(1, `Core count per node` * `CoreUtilizationCoefficient`))
- *Note:* In clusters with 3 nodes or above, the admin node doesn't participate in performing ingestion operations, therefore `Number of nodes in cluster`
is reduced by 1.

### Extents Merge capacity

|Property                           |Type    |Description                                                                                    |
|-----------------------------------|--------|-----------------------------------------------------------------------------------------------|
|MaximumConcurrentOperationsPerNode |long    |A maximal value for the number of concurrent extents merge/rebuild operations on a single node |

The cluster's total extents merge capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity))
is calculated by:
- `Number of nodes in cluster` x `MaximumConcurrentOperationsPerNode`
- *Note:* In clusters with 3 nodes or above, the admin node doesn't participate in performing merge operations, therefore `Number of nodes in cluster`
is reduced by 1.

### Extents Purge Rebuild capacity

|Property                           |Type    |Description                                                                                                                           |
|-----------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------|
|MaximumConcurrentOperationsPerNode |long    |A maximal value for the number of concurrent extents purge rebuild operations (rebuild extents for purge operations) on a single node |

The cluster's total extents purge rebuild capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity))
is calculated by:
- `Number of nodes in cluster` x `MaximumConcurrentOperationsPerNode`
- *Note:* In clusters with 3 nodes or above, the admin node doesn't participate in performing merge operations, therefore `Number of nodes in cluster`
is reduced by 1.

### Export capacity

|Property                           |Type    |Description                                                                                                                                                                            |
|-----------------------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|ClusterMaximumConcurrentOperations |long    |A maximal value for the number of concurrent export operations in a cluster.                                                                                                           |
|CoreUtilizationCoefficient         |double  |A coefficient for the percentage of cores to utilize when calculating the export capacity (the calculation's result will always be normalized by `ClusterMaximumConcurrentOperations`) |

The cluster's total export capacity (as shown by [.show capacity](../management/diagnostics.md#show-capacity))
is calculated by:
- Minimum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * Maximum(1, `Core count per node` * `CoreUtilizationCoefficient`))
- *Note:* In clusters with 3 nodes or above, the admin node doesn't participate in performing export operations, 
therefore `Number of nodes in cluster` is reduced by 1.



### Defaults

The default capacity policy has the following JSON representation:

```kusto 
{
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  },
  "ExtentsMergeCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExtentsPurgeRebuildCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExportCapacity": {
    "ClusterMaximumConcurrentOperations": 100,
    "CoreUtilizationCoefficient": 0.25
  }
}
```

> [!WARNING]
> It is **rarely** recommended to alter a Capacity Policy without consulting with the Kusto team first.

## Control Commands
* Use [.show cluster policy capacity](../management/diagnostics.md#show-capacity)
  to show the current capacity policy of the cluster.


## Throttling

Kusto limits the amount of concurrent requests for the following commands.

1. Ingestions (includes all the commands that are listed [here](../management/data-ingestion/index.md))
      * Limit is as defined in the [capacity policy](#capacity-policy).
2. Merges
      * Limit is as defined in the [capacity policy](#capacity-policy).
3. Purges
      * Global is currently fixed at 1 per cluster.
      * The purge rebuild capacity is used internally to determine the number of concurrent rebuild operations during purge commands (purge commands will not be blocked/throttled due to this, but will work faster/slower depending on the purge rebuild capacity).
4. Exports
      * Limit is as defined in the [capacity policy](#capacity-policy).


When Kusto detects that some operation has exceeded the allowed concurrent operation, Kusto will respond with a 429 HTTP code.
The client should retry the operation after some backoff. 