---
title:  Monitor materialized views
description:  This article describes how to monitor materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/04/2025
---
# Monitor materialized views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Monitor the materialized view's health in the following ways:
::: moniker range="azure-data-explorer"
* Monitor [materialized views metrics](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) in the [Azure portal](https://portal.azure.com/) with [Azure Monitor](/azure/data-explorer/monitor-data-explorer-reference#metrics). Use the materialized view age metric, `MaterializedViewAgeSeconds`, as the primary metric to monitor the freshness of the view.

::: moniker-end
:::moniker range="microsoft-fabric"
* Monitor [materialized view metrics](/fabric/real-time-intelligence/monitor-metrics#metric-specific-dimension-column) in your Microsoft Fabric workspace. Use the materialized view age metric, `MaterializedViewAgeSeconds` as the primary metric to monitor the freshness of the view. For more information, see [Enable monitoring in your workspace](/fabric/get-started/enable-workspace-monitoring).

::: moniker-end
* Monitor the `IsHealthy` property using [`.show materialized-view`](materialized-view-show-command.md#show-materialized-views).

* Check for failures using [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures).

> [!NOTE]
>
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures significantly degrade query performance, but don't cause incorrect results in view queries.

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

    * The number of materialized views that can run concurrently depends on the capacity shown in the `Total` column, while the `Consumed` column shows the number of materialized views currently running. You can use the [Materialized views capacity policy](../capacity-policy.md#materialized-views-capacity-policy) to specify the minimum and maximum number of concurrent operations, overriding the system's default concurrency level. The system determines the current concurrency, shown in `Total`, based on the cluster's available resources. The following example overrides the system's decision and changes the minimum concurrent operations from one to three:

    ```kusto
    .alter-merge cluster policy capacity '{  "MaterializedViewsCapacity": { "ClusterMinimumConcurrentOperations": 3 } }'
    ```

    * If you explicitly change this policy, monitor the cluster's health and ensure that other workloads aren't affected by this change.
::: moniker-end

* Check if there are failures during the materialization process using [.show materialized-view failures](materialized-view-show-failures-command.md#show-materialized-view-failures).
    * If the error is permanent, the system automatically disables the materialized view. To check if it's disabled, use the [.show materialized-view](materialized-view-show-command.md) command and see if the value in the `IsEnabled` column is `false`. Then check the [Journal](../journal.md) for the disabled event with the [.show journal](../journal.md#show-journal) command.
    An example of a permanent failure is a source table schema change that makes it incompatible with the materialized view. For more information, see [.create materialized-view command](materialized-view-create.md#supported-properties).
    * If the failure is transient, the system automatically retries the operation. However, the failure can delay the materialization and increase the age of the materialized view. This type of failure occurs, for example, when hitting memory limits or with a query time-out. See the following recommendations for more ways to troubleshoot transient failures.

* Analyze the materialization process using the [.show commands-and-queries](../commands-and-queries.md) command. Replace *Databasename* and *ViewName* to filter for a specific view:

    ```kusto
    .show commands-and-queries 
    | where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
    ```
  
   * Check the memory consumption in the `MemoryPeak` column to identify any operations that failed due to hitting memory limits, such as, [runaway queries](../../concepts/runaway-queries.md). By default, the materialization process is limited to a 15-GB memory peak per node. If the queries or commands executed during the materialization process exceed this value, the materialization fails due to memory limits. To increase the memory peak per node, alter the [$materialized-views workload group](../workload-groups.md#materialized-views-workload-group). The following example alters the materialized views workload group to use a maximum of 64-GB memory peak per node during materialization:

    ```kusto
    .alter-merge workload_group ['$materialized-views'] ```
    {
      "RequestLimitsPolicy": {
        "MaxMemoryPerQueryPerNode": {
          "Value": 68719241216
        }
      }
    } 
    ```

    > [!NOTE]
    > `MaxMemoryPerQueryPerNode` can't exceed 50% of the total memory available on each node.

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

      * If the view isn’t fully in the hot cache, materialization can experience disk misses, significantly slowing down the process.

      * Increasing the caching policy for the materialized view helps avoid cache misses. For more information, see [hot and cold cache and caching policy](../cache-policy.md) and [.alter materialized-view policy caching command](../alter-materialized-view-cache-policy-command.md).  
   * Check if the materialization is scanning old records by checking the `ScannedExtentsStatistics` with the [.show queries](../show-queries-command.md) command. If the number of scanned extents is high and the `MinDataScannedTime` is old, the materialization cycle needs to scan all, or most, of the *materialized* part of the view. The scan is needed to find intersections with the *delta*. For more information about the *delta* and the *materialized* part, see [How materialized views work](materialized-view-overview.md#how-materialized-views-work). The following recommendations provide ways to reduce the amount of data scanned in materialized cycles by minimizing the intersection with the *delta*.

* If the materialization cycle scans a large amount of data, potentially including cold cache, consider making the following changes to the materialized view definition:
    * Include a `datetime` group-by key in the view definition. This can significantly reduce the amount of data scanned, **as long as there is no late arriving data in this column**. For more information, see [Performance tips](materialized-view-create.md#performance-tips). You need to create a new materialized view since updates to group-by keys aren't supported.
    * Use a `lookback` as part of the view definition. For more information, see [.create materialized view supported properties](materialized-view-create.md#supported-properties).
:::moniker range="azure-data-explorer"

* Check whether there's enough ingestion capacity by verifying if either the [`MaterializedViewResult` metric](#materializedviewresult-metric) or [IngestionUtilization metric](/azure/data-explorer/monitor-data-explorer-reference#supported-metrics-for-microsoftkustoclusters) show `InsufficientCapacity` values. You can increase ingestion capacity by scaling the available resources (preferred) or by altering the [ingestion capacity policy](../capacity-policy.md#ingestion-capacity).
::: moniker-end
:::moniker range="microsoft-fabric"

* Check whether there's enough ingestion capacity by verifying if the [`MaterializedViewResult` metric](#materializedviewresult-metric) shows `InsufficientCapacity` values. You can increase ingestion capacity by scaling the available resources.
::: moniker-end

* If the materialized view is still unhealthy, then the service doesn't have sufficient capacity or resources to materialize all the data on time. Consider the following options:
    :::moniker range="azure-data-explorer"
    * Scale out the cluster by increasing the minimum instance count. [Optimized autoscale](/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-recommended-option) doesn't take materialized views into consideration and doesn't scale out the cluster automatically if materialized views are unhealthy. You need to set the minimum instance count to provide the cluster with more resources to accommodate materialized views.
    ::: moniker-end
    :::moniker range="microsoft-fabric"
    * Scale out the Eventhouse to provide it with more resources to accommodate materialized views. For more information, see [Enable minimum consumption](/fabric/real-time-intelligence/manage-monitor-eventhouse#enable-minimum-consumption).
    ::: moniker-end
    * Divide the materialized view into several smaller views, each covering a subset of the data. For instance, you can split them based on a high cardinality key from the materialized view's group-by keys. All views are based on the same source table, and each view filters by `SourceTable | where hash(key, number_of_views) == i`, where `i` is part of the set `{0,1,…,number_of_views-1}`. Then, you can define a [stored function](../../query/schema-entities/stored-functions.md) that [unions](../../query/union-operator.md) all the smaller materialized views. Use this function in queries to access the combined data.

    While splitting the view might increase CPU usage, it reduces the memory peak in materialization cycles. Reducing the memory peak can help if the single view is failing due to memory limits.

## MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle and can be used to identify issues in the materialized view health status. The metric includes the `Database` and `MaterializedViewName` and a `Result` dimension.

The `Result` dimension can have one of the following values:

* **Success**: The materialization completed successfully.

* **SourceTableNotFound**: The source table of the materialized view was dropped, so the materialized view is disabled automatically.

* **SourceTableSchemaChange**: The schema of the source table changed in a way that isn’t compatible with the materialized view definition. Since the materialized view query no longer matches the materialized view schema, the materialized view is disabled automatically.
:::moniker range="azure-data-explorer"
* **InsufficientCapacity**: The instance doesn't have sufficient capacity to materialize the materialized view, due to a lack of [ingestion capacity](../capacity-policy.md#ingestion-capacity). While insufficient capacity failures can be transient, if they reoccur often, try scaling out the instance or increasing the relevant capacity in the policy.
::: moniker-end
:::moniker range="microsoft-fabric"
* **InsufficientCapacity**: The instance doesn't have sufficient capacity to materialize the materialized view, due to a lack of ingestion capacity. While insufficient capacity failures can be transient, if they reoccur often, try scaling out the instance or increasing capacity. For more information, see [Plan your capacity size](/fabric/enterprise/plan-capacity).
::: moniker-end

* **InsufficientResources:** The database doesn't have sufficient resources (CPU/memory) to materialize the materialized view. While insufficient resource errors might be transient, if they reoccur often, try scaling up or scaling out. For more ideas, see [Troubleshooting unhealthy materialized views](#troubleshooting-unhealthy-materialized-views).

## Materialized views in follower databases

Materialized views can be defined in [follower databases](materialized-views-limitations.md#follower-databases). However, the monitoring of these materialized views should be based on the leader database, where the materialized view is defined. Specifically:

::: moniker range="azure-data-explorer"
* [Metrics](/azure/data-explorer/using-metrics#materialized-view-metrics) related to materialized view execution (`MaterializedViewResult`, `MaterializedViewExtentsRebuild`) are only present in the leader database. Metrics related to monitoring (`MaterializedViewAgeSeconds`, `MaterializedViewHealth`, `MaterializedViewRecordsInDelta`) also appear in the follower databases.
::: moniker-end
* The [.show materialized-view failures command](materialized-view-show-failures-command.md) only works in the leader database.

## Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [`.show commands-and-queries`](../commands-and-queries.md) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

```kusto
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```

## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)