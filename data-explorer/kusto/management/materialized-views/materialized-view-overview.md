---
title: Materialized views - Azure Data Explorer
description: This article describes materialized views in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 04/23/2021
---
# Materialized views

Materialized views expose an *aggregation* query over a source table, or over [another materialized view](#materialized-view-over-materialized-view-preview).

Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](#materialized-views-queries) is more performant than running the aggregation directly over the source table.

> [!NOTE]
> Materialized views have some [limitations](materialized-view-create.md#materialized-views-limitations-and-known-issues), and don't work well for all scenarios. Review the [performance considerations](#performance-considerations) before working with the feature.

Use the following commands to manage materialized views:

* [`.create materialized-view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [`.drop materialized-view`](materialized-view-drop.md)
* [`.disable | .enable materialized-view`](materialized-view-enable-disable.md)
* [`.show materialized-views commands`](materialized-view-show-commands.md)

## Why use materialized views?

By investing resources (data storage, background CPU cycles) for materialized views of commonly-used aggregations, you get the following benefits:

* **Performance improvement:** Querying a materialized view commonly performs better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, independent of when materialization last took place. The query combines the materialized part of the view with the records in the source table, which haven't yet been materialized (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:** [Querying a materialized view](#materialized-views-queries) consumes less resources from the cluster than doing the aggregation over the source table. Retention policy of source table can be reduced if only aggregation is required. This setup reduces hot cache costs for the source table.

## Materialized views use cases

The following are common scenarios that can be addressed by using a materialized view:

* Update data by returning the last record per entity using [`arg_max()` (aggregation function)](../../query/arg-max-aggfunction.md).

* Reduce the resolution of data by calculating periodic statistics over the raw data. Use various [aggregation functions](materialized-view-create.md#supported-aggregation-functions) by period of time.
  * For example, use `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day.

* Deduplicate records in a table using [`take_any()` (aggregation function)](../../query/take-any-aggfunction.md).
  * In deduplication scenarios, it might sometimes be useful to "hide" the source table with the materialized view, such that callers querying the table will query the deduplicated materialized view instead.
  * You can achieve this by creating a function with same name as the source table, that will reference the view instead of the source table. Since [functions override tables with same name](../../query/schema-entities/tables.md), users calling the "table" will actually query the materialized view.
  * When doing so, the materialized view definition must reference the source table using the [table()](../../query/tablefunction.md) function, to avoid cyclic references in the view definition:
    <!-- csl -->
    ```kusto
    .create materialized-view MV on table T
    {
        table('T')
        | summarize take_any(*) by EventId
    } 
    ```

For examples of all use cases, see [materialized view create command](materialized-view-create.md#examples).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - an Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds a single record per the aggregation's group-by combination.
* A *delta* - the newly ingested records in the source table that haven't yet been processed.

Querying the materialized view combines the materialized part with the delta part, providing an up-to-date result of the aggregation query. The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the ingestion rate. In that case, the view will become unhealthy and the *delta* will constantly grow.
The [monitoring](#materialized-views-monitoring) section explains how to troubleshoot such situations.

## Materialized views queries

There are 2 ways to query a materialized view:

* **Query the entire view**: when you query the materialized view by its name, similarly to querying a table, the materialized view query _combines_ the materialized part of the view with the records in the source table that haven't been materialized yet (the `delta`). 
  * Querying the materialized view will always return the most up-to-date results, based on all records ingested to the source table. For more information about the _materialized_ vs. _non-materialized_ parts in materialized view, see [how materialized views work](#how-materialized-views-work).
  * This option will might not perform best as it needs to materialize the `delta` part during query time. Performance in this case depends on the view's age and the filters applied in the query. The [materialized view query optimizer section](#materialized-view-query-optimizer) includes possible ways to improve query performance when querying the entire view.

* **Query the materialized part only**: another way of querying the view is by using the [`materialized_view()` function](../../query/materialized-view-function.md). This option supports querying only the materialized part of the view, while specifying the max latency the user is willing to tolerate.
  * This option isn't guaranteed to return the most up-to-date records, but it should always be more performant than querying the entire view. 
  * This function is useful for scenarios in which you're willing to sacrifice some freshness for performance, for example for telemetry dashboards.

> [!TIP]
> Queries over the materialized part only will always perform better than querying the entire view. Always use the `materialized_view()` function when applicable for your use case.

* Materialized views participate in cross-cluster or cross-database queries, but aren't included in wildcard unions or searches.
  * The following examples will all **include** materialized views by the name `ViewName`:
   <!-- csl -->
    ```kusto
    cluster('cluster1').database('db').ViewName
    cluster('cluster1').database('*').ViewName
    database('*').ViewName
    database('DB*').ViewName
    database('*').materialized_view('ViewName')
    database('DB*').materialized_view('ViewName')
    ```

  * The following examples will **not** include records from materialized views:
   <!-- csl -->
    ```kusto
    cluster('cluster1').database('db').*
    database('*').View*
    search in (*)
    search * 
    ```

### Materialized view query optimizer

When querying the entire view, the materialized part is combined with the `delta` during query time. This includes aggregating the `delta` and joining it with the materialized part.

* Querying the entire view will perform better if the query includes filters on the group by keys of the materialized view query. See more tips about how to create your materialized view, based on your query pattern, in the [`.create materialized-view` performance tips](materialized-view-create.md#performance-tips) section.
* Azure Data Explorer's query optimizer chooses summarize/join strategies that are expected to improve query performance. For example, the decision on whether to [shuffle](../../query/shufflequery.md) the query is based on number of records in `delta` part. The following [client request properties](../../api/netfx/request-properties.md) provide some control over the optimizations applied. You can test these properties with your materialized view queries and evaluate their impact on queries performance.

|Client request property name|Type|Description|
|------------------------|-------|-------------------|
|`materialized_view_query_optimization_costbased_enabled`|bool|If set to `false`, disables  summarize/join optimizations in materialized view queries. Will use default strategies. Default is `true`.|
|`materialized_view_shuffle`|dynamic|Force shuffling of the materialized view query, and (optionally) provide specific keys to shuffle by. See [examples](#examples) below.|

### `ingestion_time()` function in the context of materialized views

[ingestion_time()](../../query/ingestiontimefunction.md) function returns null values, when used in the context of a materialized view, if [querying the entire view](#materialized-views-queries).
When querying the materialized part of the view, the return value depends on the type of materialized view:

* In materialized views which include a single `arg_max()`/`arg_min()`/`take_any()` aggregation, the `ingestion_time()` is equal to the `ingestion_time()` of the corresponding record in the source table.
* In all other materialized views, the value of `ingestion_time()` is approximately the time of materialization (see [how materialized views work](#how-materialized-views-work)).

### Examples

1. Query the entire view. The most recent records in source table are included:  
    <!-- csl -->
    ```kusto
    ViewName
    ```

1. Query the materialized part of the view only, regardless of when it was last materialized.
    <!-- csl -->
    ```kusto
    materialized_view("ViewName")
    ```

1. Query the entire view, and provide a "hint" to use `shuffle` strategy. The most recent records in source table are included:

    * **Example #1**: shuffle based on the `Id` column (similarly to using `hint.shufflekey=Id`):
    <!-- csl -->
    ```kusto
    set materialized_view_shuffle = dynamic([{"Name" : "ViewName", "Keys" : [ "Id" ] }]);
    ViewName
    ```

    * **Example #2**: shuffle based on all keys (similarly to using `hint.strategy=shuffle`):
    <!-- csl -->
    ```kusto
    set materialized_view_shuffle = dynamic([{"Name" : "ViewName" }]);
    ViewName
    ```
  
## Performance considerations

The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is overloaded, adding materialized views to it may cause a degradation in the cluster's performance. Monitor your cluster's health using [cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently doesn't take materialized views health under consideration as part of autoscale rules.

* **Overlap with materialized data:** During materialization, all new records ingested to source table since the last materialization (the delta) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the worse the performance of the materialized view will be. A materialized view will work best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view won't perform well. Use [extents rebuild metrics](../../../using-metrics.md#materialized-view-metrics) to identify this situation.
    * Moving the cluster to [Engine V3](../../../engine-v3.md) should have a significant performance impact and the materialized view, when the intersection between new records and the materialized view is relatively high. This is because the extents rebuild phase in Engine V3 is much more optimized than in V2.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well. Performance depends on cluster size, available resources, and amount of intersection with existing data.

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views will compete with each other on available resources. While there are no hard-coded limits to the number of materialized views in a cluster, the cluster may not be able to handle all materialized views, when there are many defined. The [capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) can be adjusted if there is more than a single materialized view in the cluster. Increase the value of `ClusterMinimumConcurrentOperations` in the policy to run more materialized views concurrently.

* **Materialized view definition**: The materialized view definition must be defined according to query best practices for best query performance. For more information, see [create command performance tips](materialized-view-create.md#performance-tips).

## Materialized view over materialized view (preview)

A materialized view can be created over another materialized view if the source materialized view is a deduplication view. Specifically, the aggregation of the source materialized view must be `take_any(*)` in order to deduplicate source records. The second materialized view can use any [supported aggregation functions](materialized-view-create.md#supported-aggregation-functions). For specific information on how to create a materialized view over a materialized view, see [`.create materialized-view` command](materialized-view-create.md#create-materialized-view-over-materialized-view-preview).

> [!TIP]
> When querying a materialized view that is defined over another materialized view, we recommend querying the materialized part only using the `materialized_view()` function. Querying the entire view will not be performant when both views aren't fully materialized. For more information, see [materialized views queries](#materialized-views-queries).

## Materialized views monitoring

Monitor the materialized view's health in the following ways:

* Monitor [materialized view metrics](../../../using-metrics.md#materialized-view-metrics) in the Azure portal.
  * The materialized view age metric (`MaterializedViewAgeSeconds`) can be used to monitor the freshness of the view. This should be the primary metric to monitor.
* Monitor the `IsHealthy` property returned from [`.show materialized-view`](materialized-view-show-commands.md#show-materialized-view).
* Check for failures using [`.show materialized-view failures`](materialized-view-show-commands.md#show-materialized-view-failures).

> [!NOTE]
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

### Troubleshooting unhealthy materialized views

The `MaterializedViewHealth` metric indicates whether a materialized view is healthy. Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeSeconds` metric, will gradually increase.

A materialized view can become unhealthy for any or all of the following reasons:

* The materialization process is failing. The [MaterializedViewResult metric](#materializedviewresult-metric) and the [.show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures) command can help identify the root cause of the failure.
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time. In this case, there may not be failures in execution. However, the view's age will gradually increase, since it is not able to keep up with the ingestion rate. There could be several root causes for this situation:
  * Materialization is slow because there are too many extents to rebuild in each materialization cycle. To learn more about why extents rebuilds impact the view's performance, see [how materialized views work](#how-materialized-views-work). The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric. The following solutions may help:
      * Increasing the extents rebuilt concurrency in the [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy).
      * Moving the cluster to [Engine V3](../../../engine-v3.md) should significantly improve performance of rebuild extents.
   * There are additional materialized views in the cluster, and the cluster doesn't have sufficient capacity to run all views. See [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) to change the default settings for number of materialized views executed concurrently.

#### MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle, and can be used to identify issues in the materialized view health status. The metric includes the `Database` and `MaterializedViewName` as well as a `Result` dimension. 

The `Result` dimension can have one of the following values:
  
* **Success**: Materialization completed successfully.
* **SourceTableNotFound**: Source table of the materialization view was dropped. The materialized view is automatically disabled as a result.
* **SourceTableSchemaChange**: The schema of the source table has changed in a way that is not compatible with the materialized view definition (materialized view query does not match the materialized view schema). The materialized view is automatically disabled as a result.
* **InsufficientCapacity**: The cluster does not have sufficient capacity to materialized the materialized view. This can either indicate missing [ingestion capacity](../capacitypolicy.md#ingestion-capacity) or missing [materialized views capacity](../capacitypolicy.md#materialized-views-capacity-policy). Insufficient capacity failures can be transient, but if they reoccur often it is recommended to scale out the cluster and/or increase relevant capacity in policy.
* **InsufficientResources:** The cluster doesn't have sufficient resources (CPU/memory) to materialized the materialized view. This failure may also be a transient one, but if it reoccurs often a scale out/up is required.

### Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [`.show commands-and-queries`](../commands-and-queries.md#show-commands-and-queries) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```

## Next steps

* [`.create materialized view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [Materialized views show commands](materialized-view-show-commands.md)
* [Materialized views policies](materialized-view-policies.md)
