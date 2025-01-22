---
title:  Monitor materialized views
description:  This article describes how to monitor materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/11/2024
---
# Monitor materialized views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Monitor the materialized view's health in the following ways:
::: moniker range="azure-data-explorer"
* Monitor [materialized view metrics](/azure/data-explorer/using-metrics#materialized-view-metrics) in the Azure portal.
  * The materialized view age metric `MaterializedViewAgeSeconds` should be used to monitor the freshness of the view. This should be the primary metric to monitor.
::: moniker-end
* Monitor the `IsHealthy` property returned from [`.show materialized-view`](materialized-view-show-command.md#show-materialized-views).
* Check for failures using [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures).

> [!NOTE]
>
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

## Troubleshooting unhealthy materialized views

If the value of `MaterializedViewAge` metric constantly increases, and the `MaterializedViewHealth` metric shows that 
the view is unhealthy, you can follow the recommendations below to identify the root cause:

1. Check how many materialized views there are on the cluster, and what is the current capacity for materialized views:

    ```kusto
    .show capacity 
    | where Resource == "MaterializedView"
    | project Resource, Total, Consumed
    ```

    |Resource|Total|Consumed|
    |---|---|---|
    |MaterializedView|1|0|

    If there are several materialized views in the cluster, then the concurrency in which they run depends on the value of the
    `Total` capacity. The `Consumed` column shows how many are currently running. The 
    [materialized view capacity policy](../capacity-policy.md#materialized-views-capacity-policy), specifies the minimum and 
    maximum concurrent operations, and system chooses the current concurrency, noted in `Total`, based on the cluster's 
    available resources. You can override the system's decision and increase concurrency of materialization processes by 
    setting the minimum concurrent operations in the policy:

    ```kusto
    .alter-merge cluster policy capacity '{  "MaterializedViewsCapacity": { "ClusterMinimumConcurrentOperations": 3 } }'
    ```

    If you explicitly change this policy, you should monitor the cluster's health and verify other workloads are not impacted by this change.

1. Check if there are failures during materialization process using [`.show materialized-view failures command`](materialized-view-show-failures-command.md#show-materialized-view-failures).
    * If the error is permanent, the system will automatically disable the materialized view. You can identify this case by checking 
      the `IsEnabled` column in the [.show materialized-view](materialized-view-show-command.md), and by checking the [Journal](../journal.md)
      for the disable event. This can happen, for example, if there's a change in the schema of the source table that makes it incompatible 
      with the materialized view. See more details in the [.create materialized-view command](materialized-view-create.md#supported-properties).
    * If the failure is transient (for example, hitting memory limits, query timeout), the system will automatically retry the 
      operation, but such failures can delay the materialization and result in an increase in the materialized view age. See more 
      recommendations below about how to troubleshoot transient failures.

1. Analyze the materialization process using [.show commands-and-queries command](../commands-and-queries.md) 
   (replace `DatabaseName` and `ViewName` to filter on a specific view):
    <!-- csl -->
    ```kusto
    .show commands-and-queries 
    | where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
    ```
  
   * Check the memory consumption in the `MemoryPeak` column and whether there are operations that failed due to hitting memory limits 
     (for example, [runaway queries](../../concepts/runaway-queries.md)). The materialization process is limited to 15GB memory peak 
     per node by default. If the queries or commands executed during the materialization process exceed this value, materialization 
     fails due to memory limits. You can alter the [$materialized-views workload group](../workload-groups.md#materialized-views-workload-group) 
     to increase the memory peak per node in materialization process. For example, the following command will alter the materialized views 
     workload group to use a max of 64GB memory peak per node during materialization:
    
    <!-- csl -->
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
    > MaxMemoryPerQueryPerNode can't be set to more than 50% of the total memory of each node.

   * Check if the materialization process is hitting cold cache. The following command, for example, shows cache statistics of the 
     materialization process for view `ViewName` in the past day:

    <!-- csl -->
    ```kusto
    .show commands-and-queries 
    | where ClientActivityId startswith "DN.MaterializedViews;ViewName"
    | where StartedOn > ago(1d)
    | extend HotCacheHits = tolong(CacheStatistics.Shards.Hot.HitBytes), 
             HotCacheMisses = tolong(CacheStatistics.Shards.Hot.MissBytes), 
             HotCacheRetreived = tolong(CacheStatistics.Shards.Hot.RetrieveBytes), 
             ColdCacheHits = tolong(CacheStatistics.Shards.Cold.HitBytes), 
             ColdCacheMisses = tolong(CacheStatistics.Shards.Cold.MissBytes), 
             ColdCacheRetreived = tolong(CacheStatistics.Shards.Cold.RetrieveBytes)
    | summarize HotCacheHits = format_bytes(sum(HotCacheHits)), 
                HotCacheMisses = format_bytes(sum(HotCacheMisses)),
                HotCacheRetreived = format_bytes(sum(HotCacheRetreived)), 
                ColdCacheHits =format_bytes(sum(ColdCacheHits)), 
                ColdCacheMisses = format_bytes(sum(ColdCacheMisses)),
                ColdCacheRetreived = format_bytes(sum(ColdCacheRetreived))
    ```
 
    |HotCacheHits|HotCacheMisses|HotCacheRetreived|ColdCacheHits|ColdCacheMisses|ColdCacheRetreived|
    |---|---|---|---|---|---|
    |26 GB|0 Bytes|0 Bytes|1 GB|0 Bytes|866 MB|

    If the view is not fully in hot cache, materialization can hit disk misses, which significantly slows down materialization.
    Increasing the caching policy for the materialized view will help avoiding cache misses. You can read more about
    [hot and cold cache and caching policy](../cache-policy.md) and how to [.alter materialized-view policy caching command](../alter-materialized-view-cache-policy-command.md).

   * Check if the materialization is scanning old records by checking the `ScannedExtentsStatistics`. If the number of scanned extents is
     high, and the `MinDataScannedTime` is old, this indicates the materialization cycle requires scanning all, or most, of the materialized
     part of the view in order to find intersections with the "delta". See more about "delta" and "materialized part" in
     [How materialized views work](materialized-view-overview.md#how-materialized-views-work). Below are several recommendations for
     minimizing the intersection with the "delta", and therefore reducing the amount of data scanned in materialization cycles.

1. If the analysis above shows that each materialization cycle scans much data, potentially cold cache as well, consider the following 
   changes to the definition of view, if they are applicable to your scenario:
    * Include a `datetime` group by key in the view definition. A `datetime` group by key can significantly reduce the amount of
      data scanned from the view, **as long as there is no late arriving data in this column**. See more in
      [Performance tips](materialized-view-create.md#performance-tips). Note that this change requires creating a new materialized view,
      as updates to group by keys of an existing view aren't supported.
    * Use a `lookback` as part of the view definition. Read more about `lookback` in
      [create materialized view properties](../../includes/materialized-view-create-properties.md).

1. Check if the `MaterializedViewResult` metric shows `InsufficientCapacity` values. This indicates that the cluster doesn't have
   sufficient ingestion capacity, which should also be noted in the cluster's [IngestionUtilization metric](../../../monitor-data-explorer-reference.md#supported-metrics-for-microsoftkustoclusters). 
   You can increase ingestion capacity by scaling the cluster, or by altering the cluster's [ingestion capacity policy](../capacity-policy.md#ingestion-capacity)
   (less recommended).

1. If neither of the above suggestions work, and the view is still unhealthy, this indicates that the cluster doesn't have sufficient
   capacity and/or resources to materialize all data on time. You can consider the following options in this case:
    * Scale out the cluster by increasing the min instance count. [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale-recommended-option)
      does not take materialized views into consideration and does not scale out the cluster automatically if materialized views are unhealthy.
      Therefore, if you would like to give the cluster more resources to accommodate for materialized views, you need to set the minimum
      instance count accordingly.
    * Split the materialized view into several smaller views, each covering a subset of the data. You can split based on some high
      cardinality key from the materialized view's group by keys, for example. All views will be based on same source table, and each
      will filter by `SourceTable | where hash(key, number_of_views) == i` where `i ∈ {0,1,…,number_of_views-1}`. Then, you can define
      a [stored function](../../query/schema-entities/stored-functions.md) to union between all materialized views, and use that
      function in queries. This option might consume more CPU, but will reduce the memory peak in materialization cycles, and therefore
      if the single view is failing due to memory limits, this approach can help.

## MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle, and can be used to identify issues in the materialized view health status. The metric includes the `Database` and `MaterializedViewName` and a `Result` dimension.

The `Result` dimension can have one of the following values:
  
* **Success**: Materialization completed successfully.
* **SourceTableNotFound**: Source table of the materialization view was dropped. The materialized view is automatically disabled as a result.
* **SourceTableSchemaChange**: The schema of the source table has changed in a way that isn't compatible with the materialized view definition (materialized view query doesn't match the materialized view schema). The materialized view is automatically disabled as a result.
* **InsufficientCapacity**: The cluster doesn't have sufficient capacity to materialize the materialized view, due to lack of [ingestion capacity](../capacity-policy.md#ingestion-capacity). Insufficient capacity failures can be transient, but if they reoccur often we recommend scaling out the cluster or increasing relevant capacity in the policy.
* **InsufficientResources:** The database doesn't have sufficient resources (CPU/memory) to materialize the materialized view. This failure may be transient, but if it reoccurs try scaling the cluster up or out, and/or following the suggestions in the [troubleshooting section](#troubleshooting-unhealthy-materialized-views).

## Materialized views in follower databases

Materialized views can be defined in [follower databases](materialized-views-limitations.md#follower-databases). However, the monitoring of these materialized views should be based on the leader database, where the materialized view is defined. Specifically:

::: moniker range="azure-data-explorer"
* [Metrics](/azure/data-explorer/using-metrics#materialized-view-metrics) related to materialized view execution (`MaterializedViewResult`, `MaterializedViewExtentsRebuild`) are only present in the leader database. Metrics related to monitoring (`MaterializedViewAgeSeconds`, `MaterializedViewHealth`, `MaterializedViewRecordsInDelta`) will also appear in the follower databases.
::: moniker-end
* The [.show materialized-view failures command](materialized-view-show-failures-command.md) only works in the leader database.

## Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [`.show commands-and-queries`](../commands-and-queries.md) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```kusto
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```
