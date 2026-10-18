---
title:  Monitor materialized views
description:  This article describes how to monitor materialized views.
ms.reviewer: yifats
ms.topic: how-to
ms.date: 02/04/2025
---
# Monitor materialized views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Monitor the health of materialized views in the following ways:
::: moniker range="azure-data-explorer"
* Monitor [materialized views metrics](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) in the [Azure portal](https://portal.azure.com/) by using [Azure Monitor](/azure/data-explorer/monitor-data-explorer-reference#metrics). Use the materialized view age metric, `MaterializedViewAgeSeconds`, as the primary metric to monitor the freshness of the view.

::: moniker-end
:::moniker range="microsoft-fabric"
* Monitor [materialized view metrics](/fabric/real-time-intelligence/monitor-metrics#metric-specific-dimension-column) in your Microsoft Fabric workspace. Use the materialized view age metric, `MaterializedViewAgeSeconds`, as the primary metric to monitor the freshness of the view. For more information, see [Enable monitoring in your workspace](/fabric/get-started/enable-workspace-monitoring).

::: moniker-end
* Monitor the `IsHealthy` property by using [`.show materialized-view`](materialized-view-show-command.md#show-materialized-views).

* Inspect extent, hot-cache, size, and effective policy details by using [`.show materialized-view details`](materialized-view-show-details-command.md).

* Check for failures by using [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures).

> [!NOTE]
>
> Materialization never skips any data, even if there are constant failures. The view always returns the most up-to-date snapshot of the query, based on all records in the source table. Constant failures significantly degrade query performance, but don't cause incorrect results in view queries.

## Troubleshooting unhealthy materialized views

If the `MaterializedViewAgeSeconds` metric constantly increases and the `MaterializedViewHealth` metric shows that the view is unhealthy, use the following symptoms to identify the root cause.

:::moniker range="azure-data-explorer"

### Not enough materialization concurrency

Use [`.show capacity`](../show-capacity-command.md) to compare the number of materialized views that can run concurrently with the number currently running:

```kusto
.show capacity
| where Resource == "MaterializedView"
| project Resource, Total, Consumed
```

| Resource | Total | Consumed |
|---|---|---|
| MaterializedView | 1 | 0 |

`Total` is the current concurrency limit, and `Consumed` is the number of materialized views currently running. If the limit is delaying materialization, increase the materialization concurrency only after evaluating the effect on other workloads. For more information, see [Increase available resources](materialized-views-optimization.md#increase-available-resources).
::: moniker-end

### Materialization failures

Use [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures) to inspect failures.

* For a permanent error, the system automatically disables the materialized view. Use [`.show materialized-view`](materialized-view-show-command.md) to check whether `IsEnabled` is `false`, and use [`.show journal`](../journal.md#show-journal) to find the disabled event. A source table schema change that makes the table incompatible with the materialized view is an example of a permanent error. For more information, see [.create materialized-view](materialized-view-create.md#supported-properties).
* For a transient error, the system automatically retries the operation. Repeated memory-limit or query-timeout failures delay materialization and increase the materialized view age. For ways to reduce transient failures, see [Optimize materialized views](materialized-views-optimization.md).

### Materialization exceeds the memory limit

Use [`.show commands-and-queries`](../commands-and-queries.md) to inspect `MemoryPeak`. Replace `DatabaseName` and `ViewName` with your values:

```kusto
.show commands-and-queries
| where Database == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
| project StartedOn, LastUpdatedOn, Duration, State, FailureReason,
          TotalCpu, MemoryPeak
```

A failure that reaches the memory limit can appear as a [runaway query](../../concepts/runaway-queries.md). Raise the materialization memory limit or reduce the memory required by each cycle. For more information, see [Increase the materialization memory limit](materialized-views-optimization.md#increase-the-materialization-memory-limit).

### Materialization is hitting cold cache

Use the cache statistics from [`.show commands-and-queries`](../commands-and-queries.md) to determine whether materialization is retrieving data from the cold cache. The following query summarizes cache activity over the past day for `ViewName`:

```kusto
.show commands-and-queries
| where ClientActivityId startswith "DN.MaterializedViews;ViewName"
| where StartedOn > ago(1d)
| extend HotCacheHits = tolong(CacheStatistics.Shards.Hot.HitBytes),
         HotCacheMisses = tolong(CacheStatistics.Shards.Hot.MissBytes),
         HotCacheRetrieved = tolong(CacheStatistics.Shards.Hot.RetrieveBytes),
         ColdCacheHits = tolong(CacheStatistics.Shards.Cold.HitBytes),
         ColdCacheMisses = tolong(CacheStatistics.Shards.Cold.MissBytes),
         ColdCacheRetrieved = tolong(CacheStatistics.Shards.Cold.RetrieveBytes)
| summarize HotCacheHits = format_bytes(sum(HotCacheHits)),
            HotCacheMisses = format_bytes(sum(HotCacheMisses)),
            HotCacheRetrieved = format_bytes(sum(HotCacheRetrieved)),
            ColdCacheHits = format_bytes(sum(ColdCacheHits)),
            ColdCacheMisses = format_bytes(sum(ColdCacheMisses)),
            ColdCacheRetrieved = format_bytes(sum(ColdCacheRetrieved))
```

| HotCacheHits | HotCacheMisses | HotCacheRetrieved | ColdCacheHits | ColdCacheMisses | ColdCacheRetrieved |
|---|---|---|---|---|---|
| 26 GB | 0 Bytes | 0 Bytes | 1 GB | 0 Bytes | 866 MB |

Cold-cache hits or retrieved bytes indicate that materialization is reading data outside the hot cache, which can significantly slow the process. Extend the caching policies to cover the data that materialization scans. For more information, see [Adjust caching policies](materialized-views-optimization.md#adjust-caching-policies).

### Materialization scans old records

Inspect `ScannedExtentsStatistics` with [`.show queries`](../show-queries-command.md). A high number of scanned extents and an old `MinDataScannedTime` indicate that the cycle is scanning all or most of the materialized part to find intersections with the delta. Reduce the scan by using an appropriate datetime group-by key, lookback period, or caching policy. For more information, see [Optimize materialized views](materialized-views-optimization.md).

### Not enough ingestion capacity

:::moniker range="azure-data-explorer"
Check whether the [`MaterializedViewResult` metric](#materializedviewresult-metric) or [IngestionUtilization metric](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) has an `InsufficientCapacity` value.
::: moniker-end
:::moniker range="microsoft-fabric"
Check whether the [`MaterializedViewResult` metric](#materializedviewresult-metric) has an `InsufficientCapacity` value.
::: moniker-end

Recurring `InsufficientCapacity` values indicate that available ingestion capacity is limiting materialization. Increase the resources available for materialization. For more information, see [Increase available resources](materialized-views-optimization.md#increase-available-resources).

### Materialized view remains unhealthy

If the preceding diagnostics don't identify a specific cause, the service might not have sufficient capacity or resources to materialize all data on time. Increase available resources or split a memory-intensive view only after applying less disruptive optimizations. For more information, see [Optimize materialized views](materialized-views-optimization.md).

## MaterializedViewResult metric

The `MaterializedViewResult` metric provides the result of each materialization cycle. Use it to identify problems with materialized view health. The metric includes the `Database`, `MaterializedViewName`, and `Result` dimensions.

| Value | Meaning | Action |
|---|---|---|
| `Success` | The materialization cycle completed successfully. | None. |
| `SourceTableNotFound` | The source table was dropped, so the materialized view is automatically disabled. | Restore the source table and [enable the materialized view](materialized-view-enable-disable.md). |
| `SourceTableSchemaChange` | The source table schema is incompatible with the materialized view definition, so the view is automatically disabled. | Make the source schema and materialized view query compatible, and then [enable the materialized view](materialized-view-enable-disable.md). |
| `InsufficientCapacity` | Available ingestion capacity is limiting materialization. The failure can be transient, but recurring values indicate a capacity issue. For Azure Data Explorer, see [Ingestion capacity](../capacity-policy.md#ingestion-capacity). | [Increase available resources](materialized-views-optimization.md#increase-available-resources). |
| `InsufficientResources` | Materialization exceeded the memory limit allowed for a single operation. | [Increase the materialization memory limit](materialized-views-optimization.md#increase-the-materialization-memory-limit) or reduce the memory required by each cycle. |

## Materialized views in follower databases

You can define materialized views in [follower databases](materialized-views-limitations.md#follower-databases). However, you should monitor these materialized views from the leader database, where you define the materialized view. Specifically:

::: moniker range="azure-data-explorer"
* [Metrics](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) related to materialized view execution (`MaterializedViewResult`, `MaterializedViewExtentsRebuild`) are only present in the leader database. Metrics related to monitoring (`MaterializedViewAgeSeconds`, `MaterializedViewHealth`, `MaterializedViewRecordsInDelta`) also appear in the follower databases.
::: moniker-end
* The [.show materialized-view failures command](materialized-view-show-failures-command.md) only works in the leader database.


## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [Materialized views optimization](materialized-views-optimization.md)
