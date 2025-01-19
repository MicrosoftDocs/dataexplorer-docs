---
title:  Materialized views
description:  This article describes materialized views.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/11/2024
---
# Materialized views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

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

* **Cost reduction:** [Querying a materialized view](#materialized-views-queries) consumes less resources than doing the aggregation over the source table. Retention policy of source table can be reduced if only aggregation is required. This setup reduces hot cache costs for the source table.

For example use cases, see [Materialized view use cases](materialized-view-use-cases.md).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - a table holding aggregated records from the source table, which have already been processed. This table always holds a single record per the aggregation's group-by combination.
* A *delta* - the newly ingested records in the source table that haven't yet been processed.

Querying the materialized view combines the materialized part with the delta part, providing an up-to-date result of the aggregation query. The offline materialization process ingests new records from the *delta* to the materialized table, and updates existing records. If the intersection between the *delta* and the *materialized* part is large, and many records require updates, this might have a negative impact on the materialization process. See [monitor materialized views](materialized-views-monitoring.md) on how to troubleshoot such situations.

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

:::moniker range="azure-data-explorer"
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
::: moniker-end

:::moniker range="microsoft-fabric"
* Materialized views participate in cross-Eventhouse or cross-database queries, but aren't included in wildcard unions or searches.
  * The following examples all **include** materialized views by the name `ViewName`:
   <!-- csl -->
    ```kusto
    cluster("<serviceURL>").database('db').ViewName
    cluster("<serviceURL>").database('*').ViewName
    database('*').ViewName
    database('DB*').ViewName
    database('*').materialized_view('ViewName')
    database('DB*').materialized_view('ViewName')
    ```

  * The following examples do **not** include records from materialized views:
   <!-- csl -->
    ```kusto
    cluster("<serviceURL>").database('db').*
    database('*').View*
    search in (*)
    search * 
    ```
::: moniker-end

### Materialized view query optimizer

When querying the entire view, the materialized part is combined with the `delta` during query time. This includes aggregating the `delta` and joining it with the materialized part.

* Querying the entire view performs better if the query includes filters on the group by keys of the materialized view query. See more tips about how to create your materialized view, based on your query pattern, in the [`.create materialized-view` performance tips](materialized-view-create.md#performance-tips) section.
* The query optimizer chooses summarize/join strategies that are expected to improve query performance. For example, the decision on whether to [shuffle](../../query/shuffle-query.md) the query is based on number of records in `delta` part. The following [client request properties](../../api/rest/request-properties.md) provide some control over the optimizations applied. You can test these properties with your materialized view queries and evaluate their impact on queries performance.

|Client request property name|Type|Description|
|------------------------|-------|-------------------|
|`materialized_view_query_optimization_costbased_enabled`| `bool` |If set to `false`, disables  summarize/join optimizations in materialized view queries. Uses default strategies. Default is `true`.|
|`materialized_view_shuffle`| `dynamic` |Force shuffling of the materialized view query, and (optionally) provide specific keys to shuffle by. See [examples](#examples) below.|

### `ingestion_time()` function in the context of materialized views

[ingestion_time()](../../query/ingestion-time-function.md) function returns null values, when used in the context of a materialized view, if [querying the entire view](#materialized-views-queries).
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
  
### Lookback period

The Lookback period defines the time window during which deduplication occurs when merging newly ingested data with existing records in the view. The purpose of the lookback period is to prevent the need for merging the newly ingested data with the *entire* view, which would be resource-intensive and inefficient. Instead, only the portion of the view that falls within the lookback period is merged with the newly ingested data (i.e., the delta).

In other words, the lookback period sets a threshold for the minimum record in the view that should be included in the merge process. By restricting the scope of the merge operation, a significant performance improvement is achieved. However, an incorrectly set lookback period could result in duplicate records in the materialized view, as explained in the example below. 

**Lookback period reference**

The lookback period can be defined by setting the lookback property and, optionally, also the lookback_column property. 
When only the lookback property is specified, the lookback period is relative to [ingestion_time()](../query/ingestion-time-function.md).
However, if both the lookback and lookback_column properties are specified, the lookback period is instead relative to the column indicated by the lookback_column. The lookback_column should reference one of the view's table columns, and it must be of type `datetime`.

For instance, if only the lookback property is provided and set to 6 hours, deduplication between newly ingested records and existing ones will take into consideration only records that were ingested within the past 6 hours. That is a significant performance improvement, but it also means that if a record for a specific key is ingested 10 hours after a record for the same key was ingested, then that key will be a duplicate in the view. Therefore, it is important to carefully configure the lookback property to avoid unintentionally introducing duplicate records into the view.

Note that, under certain conditions, a lookback period optimization can be applied implicitly even if neither the lookback nor lookback_column properties are specified. This can heppen, for instance, in `arg_max`/`arg_min`/`take_any` materialized views, if one of view's group-by keys is a `datetime` column (see [Performance tips](materialized-view-create.md#performance-tips)), and assuming that the materialied view query preserves the [ingestion_time()](../query/ingestion-time-function.md) value (see [materialized views limitations and known issues](../management/materialized-views/materialized-views-limitations.md)).
An implicit lookback optimization is reltive to [ingestion_time()](../query/ingestion-time-function.md).

To summarize, the lookback period either references [ingestion_time()](../query/ingestion-time-function.md) or a specified `datetime` column in the view.
The following table outlines when each type of lookback period is valid and when it is applied: 

| lookback period reference | Conditions | When applied |
|--|--|--|
| ingestion_time() lookback | Used when the lookback property is provided, but the lookback_column is not. It can also be applied as an implicit optimization if the materialized view query includes at least one `datetime` group-by key. This is valid only for `arg_max`/`arg_min`/`take_any` materialized views, and only for views that preserve ingestion time. (See Materialized Views Limitations and Known Issues.) | During both [materialization time](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work) and [query time](../management/materialized-views/materialized-view-overview.md#materialized-views-queries) |
| Column-based lookback     | Used when both the lookback and lookback_column properties are specified. The lookback_column must reference a `datetime` column in the view schema. | During [materialization time](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work) only.  |

**Known limitations**
* If a lookback_column is already defined, the lookback_column name cannot be changed, and the lookback period cannot be increased.
* Usage of a lookback_column might lead to duplicates if the lookback column is expected to have datetime(null) values.


## Performance considerations

The main contributors that can impact a materialized view health are:

:::moniker range="azure-data-explorer"
* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is overloaded, adding materialized views to it may cause a degradation in the cluster's performance. Monitor your cluster's health using [cluster health metrics](/azure/data-explorer/using-metrics#cluster-metrics). [Optimized autoscale](/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-recommended-option) currently doesn't take materialized views health under consideration as part of autoscale rules.
  * The [materialization process](#how-materialized-views-work) is limited by the amount of memory and CPU it can consume. These limits are defined, and can be changed, in the [materialized views workload group](../workload-groups.md#materialized-views-workload-group).
::: moniker-end
  
* **Overlap with materialized data:** During materialization, all new records ingested to the source table since the last materialization (the delta) are processed and materialized into the view. The higher the intersection between new records and already materialized records is, the worse the performance of the materialized view will be. A materialized view works best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view might not perform well.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well. Performance depends on database size, available resources, and amount of intersection with existing data.

:::moniker range="azure-data-explorer"
* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views compete with each other on available resources. While there are no hard-coded limits to the number of materialized views in a cluster, the cluster may not be able to handle all materialized views, when there are many defined. The [capacity policy](../capacity-policy.md#materialized-views-capacity-policy) can be adjusted if there is more than a single materialized view in the cluster. Increase the value of `ClusterMinimumConcurrentOperations` in the policy to run more materialized views concurrently.
::: moniker-end

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
