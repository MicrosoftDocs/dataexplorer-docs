---
title:  Materialized views
description: This article describes materialized views in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/19/2023
---
# Materialized views

Materialized views expose an *aggregation* query over a source table, or over [another materialized view](#materialized-view-over-materialized-view).

Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](#materialized-views-queries) is more performant than running the aggregation directly over the source table.

> [!NOTE]
>
> * To decide whether materialized views are suitable for you, review the materialized views [use cases](materialized-view-use-cases.md).
> * Materialized views have some [limitations](materialized-views-limitations.md). Before working with the feature, review the [performance considerations](#performance-considerations).
> * Consider using [update policies](../update-policy.md) where appropriate. For more information, see [Materialized views vs. update policies](materialized-view-use-cases.md#materialized-views-vs-update-policies).
> * Monitor the health of your materialized views based on the recommendations in [Monitor materialized views](materialized-views-monitoring.md).

## Why use materialized views?

By investing resources (data storage, background CPU cycles) for materialized views of commonly used aggregations, you get the following benefits:

* **Performance improvement:** Querying a materialized view commonly performs better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, independent of when materialization last took place. The query combines the materialized part of the view with the records in the source table, which haven't yet been materialized (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:** [Querying a materialized view](#materialized-views-queries) consumes less resources from the cluster than doing the aggregation over the source table. Retention policy of source table can be reduced if only aggregation is required. This setup reduces hot cache costs for the source table.

For example use cases, see [Materialized view use cases](materialized-view-use-cases.md).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - a table holding aggregated records from the source table, which have already been processed. This table always holds a single record per the aggregation's group-by combination.
* A *delta* - the newly ingested records in the source table that haven't yet been processed.

Querying the materialized view combines the materialized part with the delta part, providing an up-to-date result of the aggregation query. The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle requires rebuilding the entire *materialized* part, and may not keep up with the ingestion rate. In that case, the view becomes unhealthy and the *delta* constantly grows.
The [materialized views monitoring](materialized-views-monitoring.md) page explains how to troubleshoot such situations.

## Materialized views queries

There are 2 ways to query a materialized view:

* **Query the entire view**: when you query the materialized view by its name, similarly to querying a table, the materialized view query *combines* the materialized part of the view with the records in the source table that haven't been materialized yet (the `delta`).
  * Querying the materialized view always returns the most up-to-date results, based on all records ingested to the source table. For more information about the *materialized* vs. *non-materialized* parts in materialized view, see [how materialized views work](#how-materialized-views-work).
  * This option might not perform best as it needs to materialize the `delta` part during query time. Performance in this case depends on the view's age and the filters applied in the query. The [materialized view query optimizer section](#materialized-view-query-optimizer) includes possible ways to improve query performance when querying the entire view.

* **Query the materialized part only**: another way of querying the view is by using the [`materialized_view()` function](../../query/materialized-view-function.md). This option supports querying only the materialized part of the view, while specifying the max latency the user is willing to tolerate.
  * This option isn't guaranteed to return the most up-to-date records, but it should always be more performant than querying the entire view.
  * This function is useful for scenarios in which you're willing to sacrifice some freshness for performance, for example for telemetry dashboards.

> [!TIP]
> Queries over the materialized part only always perform better than querying the entire view. Always use the `materialized_view()` function when applicable for your use case.

* Materialized views participate in cross-cluster or cross-database queries, but aren't included in wildcard unions or searches.
  * The following examples all **include** materialized views by the name `ViewName`:
   <!-- csl -->
    ```kusto
    cluster('cluster1').database('db').ViewName
    cluster('cluster1').database('*').ViewName
    database('*').ViewName
    database('DB*').ViewName
    database('*').materialized_view('ViewName')
    database('DB*').materialized_view('ViewName')
    ```

  * The following examples do **not** include records from materialized views:
   <!-- csl -->
    ```kusto
    cluster('cluster1').database('db').*
    database('*').View*
    search in (*)
    search * 
    ```

### Materialized view query optimizer

When querying the entire view, the materialized part is combined with the `delta` during query time. This includes aggregating the `delta` and joining it with the materialized part.

* Querying the entire view performs better if the query includes filters on the group by keys of the materialized view query. See more tips about how to create your materialized view, based on your query pattern, in the [`.create materialized-view` performance tips](materialized-view-create.md#performance-tips) section.
* The query optimizer chooses summarize/join strategies that are expected to improve query performance. For example, the decision on whether to [shuffle](../../query/shuffle-query.md) the query is based on number of records in `delta` part. The following [client request properties](../../api/netfx/request-properties.md) provide some control over the optimizations applied. You can test these properties with your materialized view queries and evaluate their impact on queries performance.

|Client request property name|Type|Description|
|------------------------|-------|-------------------|
|`materialized_view_query_optimization_costbased_enabled`| `bool` |If set to `false`, disables  summarize/join optimizations in materialized view queries. Uses default strategies. Default is `true`.|
|`materialized_view_shuffle`| `dynamic` |Force shuffling of the materialized view query, and (optionally) provide specific keys to shuffle by. See [examples](#examples) below.|

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

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is overloaded, adding materialized views to it may cause a degradation in the cluster's performance. Monitor your cluster's health using [cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale-recommended-option) currently doesn't take materialized views health under consideration as part of autoscale rules.
  * The [materialization process](#how-materialized-views-work) is limited by the amount of memory and CPU it can consume. These limits are defined, and can be changed, in the [materialized views workload group](../workload-groups.md#materialized-views-workload-group).
  
* **Overlap with materialized data:** During materialization, all new records ingested to the source table since the last materialization (the delta) are processed and materialized into the view. The higher the intersection between new records and already materialized records is, the worse the performance of the materialized view will be. A materialized view works best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view might not perform well.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well. Performance depends on cluster size, available resources, and amount of intersection with existing data.

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views compete with each other on available resources. While there are no hard-coded limits to the number of materialized views in a cluster, the cluster may not be able to handle all materialized views, when there are many defined. The [capacity policy](../capacity-policy.md#materialized-views-capacity-policy) can be adjusted if there is more than a single materialized view in the cluster. Increase the value of `ClusterMinimumConcurrentOperations` in the policy to run more materialized views concurrently.

* **Materialized view definition**: The materialized view definition must be defined according to query best practices for best query performance. For more information, see [create command performance tips](materialized-view-create.md#performance-tips).

## Materialized view over materialized view

A materialized view can be created over another materialized view if the source materialized view is a deduplication view. Specifically, the aggregation of the source materialized view must be `take_any(*)` in order to deduplicate source records. The second materialized view can use any [supported aggregation functions](materialized-view-create.md#supported-aggregation-functions). For specific information on how to create a materialized view over a materialized view, see [`.create materialized-view` command](materialized-view-create.md#create-materialized-view-over-materialized-view).

> [!TIP]
> When querying a materialized view that is defined over another materialized view, we recommend querying the materialized part only using the `materialized_view()` function. Querying the entire view is not performant when both views aren't fully materialized. For more information, see [materialized views queries](#materialized-views-queries).

## Related content

* [Materialized views policies](materialized-view-policies.md)
* [Materialized views limitations and known issues](materialized-views-limitations.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [Monitor materialized views](materialized-views-monitoring.md)
* [`.create materialized view`](materialized-view-create.md)
* [`.alter materialized-view`](materialized-view-alter.md)
* [`{.disable | .enable} materialized-view`](materialized-view-enable-disable.md)
