---
title: Materialized views - Azure Data Explorer
description: This article describes materialized views in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---
# Materialized views (preview)

[Materialized views](../../query/materialized-view-function.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](#materialized-views-queries) is more performant than running the aggregation directly over the source table, which is performed each query.

> [!NOTE]
> Materialized views have some [limitations](materialized-view-create.md#materialized-views-limitations-and-known-issues), and aren't guaranteed to work well for all scenarios. Review the [performance considerations](#performance-considerations) before working with the feature.

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

* Query last record per entity using [`arg_max()` (aggregation function)](../../query/arg-max-aggfunction.md).
* De-duplicate records in a table using [`any()` (aggregation function)](../../query/any-aggfunction.md).
* Reduce the resolution of data by calculating periodic statistics over the raw data. Use various [aggregation functions](materialized-view-create.md#supported-aggregation-functions) by period of time.
    * For example, use `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day.

For examples of all use cases, see [materialized view create command](materialized-view-create.md#examples).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - an Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds a single record per the aggregation's group-by combination.
* A *delta* - the newly ingested records in the source table that haven't yet been processed.

Querying the materialized view combines the materialized part with the delta part, providing an up-to-date result of the aggregation query. The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the ingestion rate. In that case, the view will become unhealthy and the *delta* will constantly grow.
The [monitoring](#materialized-views-monitoring) section explains how to troubleshoot such situations.

## Materialized views queries

* The primary way of querying a materialized view is by its name, like querying a table reference. When the materialized view is queried, it combines the materialized part of the view with the records in the source table that haven't been materialized yet (the `delta`). Querying the materialized view will always return the most up-to-date results, based on all records ingested to the source table. For more information about the _materialized_ vs. _non-materialized_ parts in materialized view, see [how materialized views work](#how-materialized-views-work).

    * Combining the materialized part with the `delta` executes a join behind the scenes. By default, this join isn't [shuffled](../../query/shufflequery.md). You can force shuffling of the query by adding a [client request property](../../api/netfx/request-properties.md) named `materialized_view_shuffle`. See [examples](#examples) below. Adding this property can sometimes significantly improve the performance of the materialized view query. In the future, the need for shuffling will be automatically deduced based on the materialized view's current state, but for now this requires an explicit "hint".

* Another way of querying the view is by using the [`materialized_view()` function](../../query/materialized-view-function.md). This option supports querying only the materialized part of the view, while specifying the max latency the user is willing to tolerate. This option isn't guaranteed to return the most up-to-date records, but it should always be more performant than querying the entire view. This function is useful for scenarios in which you're willing to sacrifice some freshness for performance, for example for telemetry dashboards.

The view can participate in cross-cluster or cross-database queries, but aren't included in wildcard unions or searches.

### Examples

1. Query the entire view. The most recent records in source table are included:
    
    <!-- csl -->
    ```kusto
    ViewName
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

1. Query the materialized part of the view only, regardless of when it was last materialized. 

    <!-- csl -->
    ```kusto
    materialized_view("ViewName")
    ```
  
## Performance considerations

The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is overloaded, adding materialized views to it may cause a degradation in the cluster's performance. Monitor your cluster's health using [cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently doesn't take materialized views health under consideration as part of autoscale rules.

* **Overlap with materialized data:** During materialization, all new records ingested to source table since the last materialization (the delta) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the worse the performance of the materialized view will be. A materialized view will work best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view won't perform well. Use [extents rebuild metrics](../../../using-metrics.md#materialized-view-metrics) to identify this situation.
    * Moving the cluster to [Engine V3](../../../engine-v3.md) should have a significant performance impact and the materialized view, when the intersection between new records and the materialized view is relatively high. This is because the extents rebuild phase in Engine V3 is much more optimized than in V2.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well. Performance depends on cluster size, available resources, and amount of intersection with existing data.

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views will compete with each other on available resources. There are no hard-coded limits to the number of materialized views in a cluster. However, the general recommendation is to have no more than 10 materialized views on a cluster. The [capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) may be adjusted if more than a single materialized view is defined in the cluster.

* **Materialized view definition**: The materialized view definition must be defined according to query best practices for best query performance. For more information, see [create command performance tips](materialized-view-create.md#performance-tips).

## Materialized views monitoring

Monitor the materialized view's health in the following ways:

* Monitor [materialized view metrics](../../../using-metrics.md#materialized-view-metrics) in the Azure portal.
* Monitor the `IsHealthy` property returned from [`.show materialized-view`](materialized-view-show-commands.md#show-materialized-view).
* Check for failures using [`.show materialized-view failures`](materialized-view-show-commands.md#show-materialized-view-failures).

> [!NOTE]
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

### Troubleshooting unhealthy materialized views

The `MaterializedViewHealth` metric indicates whether a materialized view is healthy. Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will gradually increase.

A materialized view can become unhealthy for any or all of the following reasons:

* The materialization process is failing. The [MaterializedViewResult metric](#materializedviewresult-metric) and the [.show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures) command can help identify the root cause of the failure.

* The cluster doesn't have sufficient capacity to materialize all incoming data on-time. In this case, there may not be failures in execution. However, the view's age will gradually increase, since it is not able to keep up with the ingestion rate. There could be several root causes for this situation:
  * Materialization is slow since there are too many extents to rebuild in each materialization cycle. To learn more about why extents rebuilds impact the view's performance, see [how materialized views work](#how-materialized-views-work). The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric. Consider the following solutions for this case:
      * Increasing the extents rebuilt concurrency in the [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy).
      * Moving the cluster to [Engine V3](../../../engine-v3.md) should significantly improve performance of rebuild extents.
   * There are additional materialized views in the cluster, and the cluster doesn't have sufficient capacity to run all views. See [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) to change the default settings for number of materialized views executed concurrently.

#### MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle, and can be used to identify issues in the materialized view health status. The metric includes the `Database` and `MaterializedViewName` as well as a `Result` dimension, which can have one of the following values:
  
1. **Success:** materialization completed successfully.
1. **SourceTableNotFound:** source table of the materialization view was dropped. **The materialized view is automatically disabled as a result**.
1. **SourceTableSchemaChange:** the schema of the source table has changed in a way that is not compatible with the materialized view definition (materialized view query does not match the materialized view schema). **The materialized view is automatically disabled as a result**.
1. **InsufficientCapacity:** the cluster does not have sufficient capacity to materialized the materialized view. This can either indicate missing [ingestion capacity](../capacitypolicy.md#ingestion-capacity) or missing [materialized views capacity](../capacitypolicy.md#materialized-views-capacity-policy). Insufficient capacity failures can be transient, but if they reoccur often it is recommended to scale out the cluster and/or increase relevant capacity in policy.
1. **InsufficientResources:** the cluster doesn't have sufficient resources (CPU/memory) to materialized the materialized view. This failure may also be a transient one, but if it reoccurs often a scale out/up is required.

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
