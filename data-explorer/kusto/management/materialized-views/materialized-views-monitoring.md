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

* Check for failures by using [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures).

> [!NOTE]
>
> Materialization never skips any data, even if there are constant failures. The view always returns the most up-to-date snapshot of the query, based on all records in the source table. Constant failures significantly degrade query performance, but don't cause incorrect results in view queries.

## Troubleshooting unhealthy materialized views

If the `MaterializedViewAge` metric constantly increases, and the `MaterializedViewHealth` metric shows that the view is unhealthy, follow these recommendations to identify the root cause:

:::moniker range="azure-data-explorer"

* Check the number of materialized views on the cluster, and the current capacity for materialized views:

    ```kusto
    .show capacity 
    | where Resource == "MaterializedView"
    | project Resource, Total, Consumed
    ```

    **Output**

    |Resource|Total|Consumed|
    |---|---|---|
    |MaterializedView|1|0|

    * The number of materialized views that can run concurrently depends on the capacity shown in the `Total` column. The `Consumed` column shows the number of materialized views currently running. If concurrency is limiting materialization, see [Increase available resources](materialized-views-optimization.md#increase-available-resources).
::: moniker-end

* Check if there are failures during the materialization process by using [.show materialized-view failures](materialized-view-show-failures-command.md#show-materialized-view-failures).
    * If the error is permanent, the system automatically disables the materialized view. To check if it's disabled, use the [.show materialized-view](materialized-view-show-command.md) command and see if the value in the `IsEnabled` column is `false`. Then check the [Journal](../journal.md) for the disabled event by using the [.show journal](../journal.md#show-journal) command.
    An example of a permanent failure is a source table schema change that makes it incompatible with the materialized view. For more information, see [.create materialized-view command](materialized-view-create.md#supported-properties).
    * If the failure is transient, the system automatically retries the operation. However, the failure can delay the materialization and increase the age of the materialized view. This type of failure occurs, for example, when hitting memory limits or with a query time-out. See the following recommendations for more ways to troubleshoot transient failures.

* Analyze the materialization process by using the [.show commands-and-queries](../commands-and-queries.md) command. Replace *Databasename* and *ViewName* to filter for a specific view:

    ```kusto
    .show commands-and-queries 
    | where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
    ```
  
   * Check the memory consumption in the `MemoryPeak` column to identify operations that failed because they reached memory limits, such as [runaway queries](../../concepts/runaway-queries.md). For remediation, see [Increase the materialization memory limit](materialized-views-optimization.md#increase-the-materialization-memory-limit).

   * Check if the materialization process is hitting cold cache. The following example shows cache statistics over the past day for the materialized view, `ViewName`:

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
                ColdCacheHits =format_bytes(sum(ColdCacheHits)), 
                ColdCacheMisses = format_bytes(sum(ColdCacheMisses)),
                ColdCacheRetrieved = format_bytes(sum(ColdCacheRetrieved))
    ```

    **Output**

    |HotCacheHits|HotCacheMisses|HotCacheRetrieved|ColdCacheHits|ColdCacheMisses|ColdCacheRetrieved|
    |---|---|---|---|---|---|
    |26 GB|0 Bytes|0 Bytes|1 GB|0 Bytes|866 MB|

      * If the view isn't fully in the hot cache, materialization can experience disk misses, significantly slowing down the process.

      * If cache misses are slowing materialization, see [Adjust caching policies](materialized-views-optimization.md#adjust-caching-policies).
   * Check if the materialization is scanning old records by checking `ScannedExtentsStatistics` with the [.show queries](../show-queries-command.md) command. If the number of scanned extents is high and `MinDataScannedTime` is old, the cycle scans all or most of the *materialized* part to find intersections with the *delta*. For ways to reduce the amount of data scanned, see [Optimize materialized views](materialized-views-optimization.md).
:::moniker range="azure-data-explorer"

* Check whether there's enough ingestion capacity by verifying if either the [`MaterializedViewResult` metric](#materializedviewresult-metric) or [IngestionUtilization metric](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) show `InsufficientCapacity` values. These values indicate that available ingestion capacity is limiting materialization. For remediation, see [Increase available resources](materialized-views-optimization.md#increase-available-resources).
::: moniker-end
:::moniker range="microsoft-fabric"

* Check whether there's enough ingestion capacity by verifying if the [`MaterializedViewResult` metric](#materializedviewresult-metric) shows `InsufficientCapacity` values. These values indicate that available ingestion capacity is limiting materialization. For remediation, see [Increase available resources](materialized-views-optimization.md#increase-available-resources).
::: moniker-end

* If the materialized view is still unhealthy, the service might not have sufficient capacity or resources to materialize all data on time. See [Optimize materialized views](materialized-views-optimization.md) for remediation options.

## MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle. Use it to identify problems in the materialized view health status. The metric includes the `Database`, `MaterializedViewName`, and a `Result` dimension.

The `Result` dimension can have one of the following values:

* **Success**: The materialization completed successfully.

* **SourceTableNotFound**: The source table of the materialized view was dropped, so the materialized view is automatically disabled.

* **SourceTableSchemaChange**: The schema of the source table changed in a way that isn't compatible with the materialized view definition. Since the materialized view query no longer matches the materialized view schema, the materialized view is automatically disabled.
:::moniker range="azure-data-explorer"
* **InsufficientCapacity**: The instance doesn't have sufficient capacity to materialize the materialized view, due to a lack of [ingestion capacity](../capacity-policy.md#ingestion-capacity). Insufficient capacity failures can be transient, but recurring failures indicate that available ingestion capacity is limiting materialization.
::: moniker-end
:::moniker range="microsoft-fabric"
* **InsufficientCapacity**: The instance doesn't have sufficient capacity to materialize the materialized view, due to a lack of ingestion capacity. Insufficient capacity failures can be transient, but recurring failures indicate that available ingestion capacity is limiting materialization.
::: moniker-end

* **InsufficientResources:** The database doesn't have sufficient resources (memory) to materialize the materialized view. Insufficient resource errors can be transient, but recurring failures indicate that the database lacks sufficient memory for materialization. For remediation, see [Optimize materialized views](materialized-views-optimization.md).

## Materialized views in follower databases

You can define materialized views in [follower databases](materialized-views-limitations.md#follower-databases). However, you should monitor these materialized views from the leader database, where you define the materialized view. Specifically:

::: moniker range="azure-data-explorer"
* [Metrics](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) related to materialized view execution (`MaterializedViewResult`, `MaterializedViewExtentsRebuild`) are only present in the leader database. Metrics related to monitoring (`MaterializedViewAgeSeconds`, `MaterializedViewHealth`, `MaterializedViewRecordsInDelta`) also appear in the follower databases.
::: moniker-end
* The [.show materialized-view failures command](materialized-view-show-failures-command.md) only works in the leader database.

## Track resource consumption

**Materialized views resource consumption:** Use the [`.show commands-and-queries`](../commands-and-queries.md) command to track the resources the materialized views materialization process consumes. To filter the records for a specific view, use the following query and replace `DatabaseName` and `ViewName` with your values:

```kusto
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
| project StartedOn, LastUpdatedOn, Duration, State, FailureReason,
          TotalCpu, MemoryPeak, CacheStatistics, ScannedExtentsStatistics
```

## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [Materialized views optimization](materialized-views-optimization.md)
