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

[Materialized views](../../query/materializedviewfunction.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](#materialized-views-queries), which is a one-time data grooming process, is more performant than running the aggregation directly over the source table, which is work performed each query.

> [!NOTE] 
> Materialized views have some [limitations](#limitations-on-creating-materialized-views), and are not guaranteed to work well for all scenarios. Review the [performance considerations](#performance-considerations) before working with the feature.

Use the following commands to manage materialized views:
* [.create materialized-view](materialized-view-create.md)
* [.alter materialized-view](materialized-view-alter.md)
* [.drop materialized-view](materialized-view-drop.md)
* [.disable | .enable materialized-view](materialized-view-enable-disable.md)
* [.show materialized-views commands](materialized-view-show-commands.md)

## Why use materialized views?

By investing resources (data storage, background CPU cycles) for materialized views of commonly-used aggregations, you get the following benefits:

* **Performance improvement:** Querying a materialized view commonly performs better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, independent of when materialization last took place. The query combines the materialized part of the view with the records in the source table, which haven't yet been materialized (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:** [Querying a materialized view](#materialized-views-queries) consumes less resources from the cluster than doing the aggregation over the entire source table. Retention policy of source table can be reduced if only aggregation is required. This setup reduces hot cache costs for the source table.

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - an Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds a single record per the aggregation's group-by combination.
* A *delta* - the newly ingested records in the source table that haven't yet been processed.

Querying the materialized view combines the materialized part with the delta part, providing an up-to-date result of the aggregation query. The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the pace. The ingestion rate will be higher than the materialization rate. In that case, the view will become unhealthy and the *delta* will constantly grow.

## Create a materialized view

There are two possible ways to create a materialized view, noted by the *backfill* option in the [create command](materialized-view-create.md):
 * **Create based on the existing records in the source table:** 
      * Creation may take a long while to complete, depending on the number of records in the source table. The view won't be available for queries until completion.
      * When using this option, the create command must be `async` and execution can be monitored using the [.show operations](../operations.md#show-operations) command.
    
      > [!IMPORTANT]
      > * Using the backfill option is not supported for data in cold cache. Increase the hot cache period, if necessary, for the creation of the view. This may require scale-out.    
      > * Using the backfill option may take a long time to complete for large source tables. If this process transiently fails while running, it will not be automatically retried, and a re-execution of the create command is required.
    
* **Create the materialized view from now onwards:** 
    * The materialized view is created empty, and will only include records ingested after view creation. Creation of this kind returns immediately, doesn't require `async`, and the view will be immediately available for query.

### Limitations on creating materialized views

* A materialized view can't be created:
    * On top of another materialized view.
    * On [follower databases](../../../follower.md). Follower databases are read-only and materialized views require write operations.  Materialized views that are defined on leader databases can be queried from their followers, like any other table in the leader. 
* The source table of a materialized view:
    * Must be a table that is being ingested to directly, either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools), using an [update policy](../updatepolicy.md), or [ingest from query commands](../data-ingestion/ingest-from-query.md).
        * Specifically, using [move extents](../move-extents.md) from other tables into the source table of the materialized view is not supported. Move extents may fail with the following error: `Cannot drop/move extents from/to table 'TableName' since Materialized View 'ViewName' is currently processing some of these extents`. 
    * Must have [IngestionTime policy](../ingestiontimepolicy.md) enabled (the default is enabled).
    * Can't be enabled for streaming ingestion.
    * Can't be a restricted table or a table with row level security enabled.
* [Cursor functions](../databasecursor.md#cursor-functions) can't be used on top of materialized views.
* Continuous export from a materialized view isn't supported.

### Materialized view retention policy

The materialized view derives the database retention policy by default. The policy can be changed using [control commands](../retentionpolicy.md).
   
   * The retention policy of the materialized view is unrelated to the retention policy of the source table.
   * If the source table records aren't otherwise used, the retention policy of the source table can be dropped to a minimum. The materialized view will still store the data according to the retention policy set on the view. 
   * While materialized views are in preview mode, the recommendation is to allow a minimum of at least seven days and recoverability set to true. This setting allows for fast recovery for errors and for diagnostic purposes.
    
> [!NOTE]
> Zero retention policy on the source table is currently not supported.

## Materialized views queries

The primary way of querying a materialized view is by its name, like querying a table reference. When the materialized view is queried, it combines the materialized part of the view with the records in the source table that haven't been materialized yet. Querying the materialized view will always return the most up-to-date results, based on all records ingested to the source table. For more information about the breakdown of the materialized view parts, see [how materialized views work](#how-materialized-views-work). 

Another way of querying the view is by using the [materialized_view() function](../../query/materializedviewfunction.md). This option supports querying only the materialized part of the view, while specifying the max latency the user is willing to tolerate. This option isn't guaranteed to return the most up-to-date records, but it should always be more performant than querying the entire view. This function is useful for scenarios in which you're willing to sacrifice some freshness for performance, for example for telemetry dashboards.

The view can participate in cross-cluster or cross-database queries, but aren't included in wildcard unions or searches.

### Query use cases

The following are common scenarios that can be addressed by using a materialized view:

* Query last record per entity using [arg_max() (aggregation function)](../../query/arg-max-aggfunction.md).
* De-duplicate records in a table using [any() (aggregation function)](../../query/any-aggfunction.md).
* Reduce the resolution of data by calculating periodic statistics over the raw data. Use various [aggregation functions](materialized-view-create.md#supported-aggregation-functions) by period of time.
    * For example, use `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day.

### Query examples

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
    
## Performance considerations

The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is overloaded, adding materialized views to it may cause a degradation in the cluster's performance. Monitor your cluster's health using [cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently doesn't take materialized views health under consideration as part of autoscale rules.

* **Overlap with materialized data:** During materialization, all new records ingested to source table since the last materialization (the delta) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the worse the performance of the materialized view will be. A materialized view will work best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view won't perform well. Use [extents rebuild metrics](../../../using-metrics.md#materialized-view-metrics) to identify this situation.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well. Performance depends on cluster size, available resources, and amount of intersection with existing data.

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views will compete with each other on available resources. There are no hard-coded limits to the number of materialized views in a cluster. However, the general recommendation is to have no more than 10 materialized views on a cluster. The [capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) may be adjusted if more than a single materialized view is defined in the cluster.

* **Materialized view definition**: The materialized view definition must be defined according to query best practices for best query performance. For more information, see [create command performance tips](materialized-view-create.md#performance-tips).

## Materialized views monitoring

Monitor the materialized view's health in the following ways:

* Monitor [materialized view metrics](../../../using-metrics.md#materialized-view-metrics) in the Azure portal.
* Monitor the `IsHealthy` property returned from [show materialized-view](materialized-view-show-commands.md#show-materialized-view).
* Check for failures using [show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures).

> [!NOTE]
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

### Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [.show commands-and-queries](../commands-and-queries.md#show-commands-and-queries) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```

### Troubleshooting unhealthy materialized views

The `MaterializedViewHealth` metric indicates whether a materialized view is healthy. A materialized view can become unhealthy for any or all of the following reasons:
* The materialization process is failing.
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time. There won't be failures in execution. However, the view will still be unhealthy, since it will be lagging behind and not able to keep up with the ingestion rate.

Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will gradually increase.

 ### Troubleshooting examples

The following examples can help you diagnose and fix unhealthy views:

* **Failure:** The source table was changed or deleted, the view wasn't set to `autoUpdateSchema`, or the change in source table isn't supported for auto-updates. <br>
   **Diagnostic:**  A `MaterializedViewResult` metric is fired, and the `Result` dimension is set to `SourceTableSchemaChange`/`SourceTableNotFound`.

* **Failure:** Materialization process fails due insufficient cluster resources, and query limits are hit. <br>
  **Diagnostic:** `MaterializedViewResult` metric `Result` dimension is set to `InsufficientResources`. Azure Data Explorer will try to automatically recover from this state, so this error may be transient. However, if view is unhealthy and this error is constantly emitted, it's possible that the current cluster's configuration isn't able to keep up with ingestion rate, and cluster needs to be scaled up or out.

* **Failure:** The materialization process is failing because of any other (unknown) reason. <br> 
   **Diagnostic**: `MaterializedViewResult` metric's `Result` will be `UnknownError`. If this failure happens frequently, open a support ticket for the Azure Data Explorer team to investigate further.

If there are no materialization failures, `MaterializedViewResult` metric will be fired on every successful execution, with `Result`=`Success`. A materialized view can be unhealthy, despite successful executions, if it's lagging behind (`Age` is above threshold). This situation can happen in the following circumstances:
   * Materialization is slow since there are too many extents to rebuild in each materialization cycle. To learn more about why extents rebuilds impact the view's performance, see [how materialized views work](#how-materialized-views-work). 
   * If each materialization cycle needs to rebuild close to 100% of the extents in the view, the view may not keep up, and will become unhealthy. The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric. Increasing the extents rebuilt concurrency in the [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) may also help in this case. 
   * There are additional materialized views in the cluster, and the cluster doesn't have sufficient capacity to run all views. See [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) to change the default settings for number of materialized views executed concurrently.

## Next steps

* [.create materialized view](materialized-view-create.md)
* [.alter materialized-view](materialized-view-alter.md)
* [Materialized views show commands](materialized-view-show-commands.md)
