---
title: Capacity policy
description: Learn how to use the capacity policy to control the compute resources of data management operations on a cluster.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/30/2023
---
# Capacity policy

A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## The capacity policy object

The capacity policy is made of the following components:

* [IngestionCapacity](#ingestion-capacity)
* [ExtentsMergeCapacity](#extents-merge-capacity)
* [ExtentsPurgeRebuildCapacity](#extents-purge-rebuild-capacity)
* [ExportCapacity](#export-capacity)
* [ExtentsPartitionCapacity](#extents-partition-capacity)
* [MaterializedViewsCapacity](#materialized-views-capacity-policy)
* [StoredQueryResultsCapacity](#stored-query-results-capacity)

To view the capacity of your cluster, use the [.show capacity](../management/diagnostics.md#show-capacity) command.

### Ingestion capacity

| Property | Type | Description |
|--|--|--|
| `ClusterMaximumConcurrentOperations` | `long` | The maximum number of concurrent ingestion operations allowed in a cluster. This value caps the total ingestion capacity, as shown in the following formula. |
| `CoreUtilizationCoefficient` | `real` | Determines the percentage of cores to use in the ingestion capacity calculation.|

**Formula**

The [.show capacity](../management/diagnostics.md#show-capacity) command returns the cluster's ingestion capacity based on the following formula:

`Minimum(ClusterMaximumConcurrentOperations` `,` *Number of nodes in cluster* `*` `Maximum(1,` *Core count per node* `*`  `CoreUtilizationCoefficient))`

> [!NOTE]
> In clusters with four or more nodes, the admin node doesn't participate in ingestion operations, so the *Number of nodes in cluster* is reduced by one.

### Extents merge capacity

| Property | Type | Description |
|--|--|--|
| `MinimumConcurrentOperationsPerNode` | `long` | The minimal number of concurrent extents merge/rebuild operations on a single node. Default is `1`. |
| `MaximumConcurrentOperationsPerNode` |`long` | The maximum number of concurrent extents merge/rebuild operations on a single node. Default is `5`. |

**Formula**

The [.show capacity](../management/diagnostics.md#show-capacity) command returns the cluster's extents merge capacity based on the following formula:

*Number of nodes in cluster* `*` *Concurrent operations per node*

The effective value for *Concurrent operations per node* is automatically adjusted by the system in the range [`MinimumConcurrentOperationsPerNode`,`MaximumConcurrentOperationsPerNode`], as long as the success rate of the merge operations is 90% or higher.

> [!NOTE]
> In clusters with four or more nodes, the admin node doesn't participate in merge operations, so *Number of nodes in cluster* is reduced by one.

### Extents purge rebuild capacity

| Property | Type | Description |
|--|--|--|
| `MaximumConcurrentOperationsPerNode` | `long` | The maximum number of concurrent rebuild extents for purge operations on a single node. |

**Formula**

The [.show capacity](../management/diagnostics.md#show-capacity) command returns the cluster's extents purge rebuild capacity based on the following formula:

*Number of nodes in cluster* x `MaximumConcurrentOperationsPerNode`

> [!NOTE]
> In clusters with four or more nodes, the admin node doesn't participate in merge operations, so *Number of nodes in cluster* is reduced by one.

### Export capacity

| Property | Type | Description |
|--|--|--|
| `ClusterMaximumConcurrentOperations` | `long` | The maximum number of concurrent export operations in a cluster. This value caps the total export capacity, as shown in the following formula. |
| `CoreUtilizationCoefficient` | `long` | Determines the percentage of cores to use in the export capacity calculation. |

**Formula**

The [.show capacity](../management/diagnostics.md#show-capacity) command returns the cluster's export capacity based on the following formula:

`Minimum(ClusterMaximumConcurrentOperations` `,` *Number of nodes in cluster* `*` `Maximum(1,` *Core count per node* `*`  `CoreUtilizationCoefficient))`

> [!NOTE]
> In clusters with four or more nodes, the admin node doesn't participate in export operations. The `Number of nodes in cluster` is reduced by one.

### Extents partition capacity

| Property | Type | Description |
|--|--|--|
| `ClusterMinimumConcurrentOperations` | `long` | The minimal number of concurrent extents partition operations in a cluster. Default is `1`. |
| `ClusterMaximumConcurrentOperations` | `long` | The maximum number of concurrent extents partition operations in a cluster. Default is `32`. |

The effective value for *Concurrent operations* is automatically adjusted by the system in the range
[`ClusterMinimumConcurrentOperations`,`ClusterMaximumConcurrentOperations`], as long as the success rate of the
partitioning operations is 90% or higher.

### Materialized views capacity policy

The policy can be used to change concurrency settings for [materialized views](materialized-views/materialized-view-overview.md). Changing the materialized views capacity policy can be useful when there's more than a single materialized view defined on a cluster.

| Property | Type | Description |
|--|--|--|
| `ClusterMinimumConcurrentOperations` | `long` | The minimal number of concurrent materialization operations in a cluster. Default is `1`. |
| `ClusterMaximumConcurrentOperations` | `long` | The maximum number of concurrent materialization operations in a cluster. Default is `10`. |

The effective value for *Concurrent operations* is automatically adjusted by the system in the range [`ClusterMinimumConcurrentOperations`,`ClusterMaximumConcurrentOperations`], based on the number of materialized views in the cluster and the cluster's CPU.

> [!WARNING]
> Only increase `ClusterMinimumConcurrentOperations` if the cluster has ample resources (low CPU usage and available memory). Raising these values under resource constraints can lead to exhaustion and significantly degrade cluster performance.

### Stored query results capacity

| Property | Type | Description |
|--|--|--|
| `MaximumConcurrentOperationsPerDbAdmin` | `long` | The maximum number of concurrent ingestion operations in a cluster admin node. |
| `CoreUtilizationCoefficient` | `real` | Determines the percentage of cores to use in the stored query results creation calculation. |

**Formula**

The [.show capacity](../management/diagnostics.md#show-capacity) command returns the cluster's stored query results creation capacity based on the following formula:

*Number of nodes in cluster* `*` `Maximum(1,` *Core count per node* `*` `CoreUtilizationCoefficient)`

> [!NOTE]
> In clusters with four or more nodes, the admin node doesn't participate in stored query results creation operations, so the *Number of nodes in cluster* is reduced by one.

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
    "ClusterMaximumConcurrentOperations": 32
  },
  "MaterializedViewsCapacity": {
    "ClusterMaximumConcurrentOperations": 1,
    "ExtentsRebuildCapacity": {
      "ClusterMaximumConcurrentOperations": 50,
      "MaximumConcurrentOperationsPerNode": 5
    }
  },
  "StoredQueryResultsCapacity": {
    "MaximumConcurrentOperationsPerDbAdmin": 250,
    "CoreUtilizationCoefficient": 0.75
  }
}
```

## Management commands

> [!WARNING]
> Consult with the support team before altering a capacity policy.

* Use [`.show cluster policy capacity`](./show-cluster-capacity-policy-command.md) to show the current capacity policy of the cluster.
* Use [`.alter-merge cluster policy capacity`](./alter-merge-capacity-policy-command.md) to alter the capacity policy of the cluster.

## Management commands throttling

Kusto limits the number of concurrent requests for the following user-initiated commands:

* **Ingestions**
  * This category includes commands that [ingest from storage](data-ingestion/ingest-from-storage.md), [ingest from a query](data-ingestion/ingest-from-query.md), and [ingest inline](data-ingestion/ingest-inline.md).
  * The limit is as defined by the [ingestion capacity](#ingestion-capacity).
* **Purges**
  * The global limit is currently fixed at one per cluster.
  * The [purge rebuild capacity](#extents-purge-rebuild-capacity) is used internally to determine the number of concurrent rebuild operations during purge commands. Purge commands won't be blocked or throttled because of this process, but will complete faster or slower depending on the purge rebuild capacity.
* **Exports**
  * The limit is as defined in the [export capacity](#export-capacity).

When the cluster detects that an operation has exceeded the limit on concurrent requests:

* The command's state, as presented by [System information commands](system-info.md), will be `Throttled`.
* The error message will include the *command type*, the *origin* of the throttling and the *capacity* that's been exceeded. For example:
  * For example: `The management command was aborted due to throttling. Retrying after some backoff might succeed. CommandType: 'TableSetOrAppend', Capacity: 18, Origin: 'CapacityPolicy/Ingestion'`.
* The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
* The exception type will be `ControlCommandThrottledException`.

> [!NOTE]
> Management commands may also be throttled as a result of exceeding the limit defined by a workload group's [Request rate limit policy](request-rate-limit-policy.md).

## Related content

* [`.show capacity`](../management/diagnostics.md#show-capacity)
