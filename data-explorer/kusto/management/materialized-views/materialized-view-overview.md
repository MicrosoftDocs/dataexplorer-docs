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

[Materialized views](../../query/materializedviewfunction.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh). [Querying a materialized view](../../query/materializedviewfunction.md) is expected to be more performant than running the aggregation directly over the source table.

> [!NOTE] 
> Materialized views have some [limitations](#known-issues-and-limitations), and are not guaranteed to work well for all scenarios. Review the [performance considerations](#performance-considerations) before working with the feature.

## Key features

* **Performance improvement:** Querying a materialized view should perform better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, independent of when materialization last took place. The query combines the *materialized* part of the view with the records in the source table, which haven't yet been materialized (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:**[ Querying a materialized view](../../query/materializedviewfunction.md) consumes less resources from the cluster than doing the aggregation over the entire source table. Retention policy of source table can be reduced if only aggregation is required, and not the source data itself. This setup reduces hot cache costs for the source table.

## Common scenarios

The following are common scenarios that can be addressed by using a materialized view:

* Query last record per entity using [arg_max() (aggregation function)](../../query/arg-max-aggfunction.md).
* De-duplicate records in a table using [any() (aggregation function)](../../query/any-aggfunction.md).
* Reduce the resolution of data by calculating periodic statistics over the raw data using various [aggregation functions](materialized-view-create-alter.md#supported-aggregation-functions) by period of time.
    * For example, use `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - a physical Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds the minimal possible number of records - a single record per the dimension's combination (as in the actual aggregation result).
* A *delta* - the newly ingested records in the source table, which haven't yet been processed.

Querying the Materialized View *combines* the materialized part with the delta part, providing an up-to-date result of the aggregation query. 

The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. Both processes (ingestion and extents rebuild) require available ingestion capacity. Clusters in which the available ingestion capacity is low may not be able to materialize the view frequently enough, which will negatively impact the materialized view performance. The bigger the *delta* is, the slower queries will perform.

If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the pace. The ingestion rate will be higher than the materialization rate. In that case, the view will become unhealthy and the *delta* will constantly grow. Monitor the number of extent rebuilds in each materialization cycle using [metrics](materialized-view-monitoring.md).

## Performance considerations

The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is too overloaded (for example, high CPU), adding materialized views to it may cause a degradation in the cluster's performance. You can monitor your cluster's health using the [Cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently doesn't take materialized views health under consideration as part of autoscale rules.

* **Overlap with materialized data:** During materialization time, all new records ingested to source table since last materialization (the `delta`) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the worse the performance of the materialized view will be. A materialized view will work best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view probably won't perform well. Use [extents rebuild metrics](../../../using-metrics.md#materialized-view-metrics) to identify this situation.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well, depending on cluster size, available resources, and amount of intersection with existing data.

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views will compete with each other on available resources. There are no hard-coded limits to the number of materialized views in a cluster. However, the general recommendation is to have no more than 10 materialized views on a cluster. The [capacity policy](materialized-view-policies.md#capacity-policy) may be adjusted if more than a single materialized view is defined in the cluster.

* **Materialized view definition**: The materialized view definition must be defined according to query pattern for best query performance. For more information, see [create command performance tips](materialized-view-create-alter.md#performance-tips).

## Known issues and limitations

* A materialized view can't be created:
    * On top of another materialized view.
    * On [follower databases](../../../follower.md) (since follower databases are read-only and materialized views require write operations).  Materialized views that are defined on leader databases can be queried from their followers as any other table in the leader. However, the view must be created on the leader cluster.
* The source table of a materialized view:
    * Must be a table that is being ingested to directly, either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools),  using an [update policy](../updatepolicy.md), or [ingest from query commands](../data-ingestion/ingest-from-query.md).
    * Can't be enabled for streaming ingestion.
    * Can't be a restricted table or a table with row level security enabled.
* Materialized view doesn't work when using:
    * [move extents](../move-extents.md) from other tables into the source table of the materialized view. Move extents may fail with the following error: `Cannot drop/move extents from/to table 'TableName' since Materialized View 'ViewName' is currently processing some of these extents`.
    * [Cursor functions](../databasecursor.md#cursor-functions) can't be used on top of materialized views.
* Continuous export from a materialized view isn't supported.

## Materialized views monitoring 

The health of materialized views describes the resource usage, rate of failures, and latency in execution. Monitor the materialized view's health in the following ways:

* Monitor the `IsHealthy` property returned from [show materialized-view](materialized-view-show-commands.md#show-materialized-view).
* Check for failures using [show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures).
* Monitor [metrics](#materialized-view-metrics) in the Azure portal.

> [!NOTE]
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

### Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [.show commands-and-queries](../commands-and-queries.md#show-commands-and-queries) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```

### Why is my materialized view unhealthy?

The `MaterializedViewHealth` metric indicates whether a Materialized View is healthy. A materialized view can become unhealthy for any or all of the following reasons:
* The materialization process is failing.
    * Materialized view failures don't always indicate that the materialized view is unhealthy. Errors can be transient. The materialization process will continue and can still be successful in the next execution.
    * Failures can occur because of transient errors, for example CPU, memory, or networking failures. Failures can occur because of or permanent errors, for example, the source table was changed and the materialized view query is syntactically invalid. The materialized view will be automatically disabled if there are schema changes that are inconsistent with the view definition, or if the materialized view query is no longer semantically valid. For all other failures, the system will continue materialization attempts until the root cause is fixed.
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time. If failure is because of cluster capacity, the execution will succeed. However, the view will be unhealthy, because it's lagging behind and unable to keep up with the ingestion rate. Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will gradually increase.

### How to troubleshoot unhealthy views

The following examples can help you diagnose and fix unhealthy views:

|Diagnostic | Reason | Action|
|---|---|---|
| `MaterializedViewResult` metric is fired, and the `Result` dimension is set to `SourceTableSchemaChange`/`SourceTableNotFound`| Source table was changed or deleted, and the view isn't set to `autoUpdateSchema` or the change in source table isn't supported for auto-updates. |
| `MaterializedViewResult` metric `Result` dimension is set to `InsufficientResources`. | Materialization process failure due insufficient cluster resources, for example hitting query limits. | Azure Data Explorer will try to automatically recover from this state, so this error may be transient. However, if view is unhealthy and this error is constantly emitted, then it's possible that the current cluster's configuration isn't able to keep up with ingestion rate. In this case, the cluster needs to be scaled up or out.|
| `MaterializedViewResult` metric's `Result` is `UnknownError`.| Materialization process is failing because of another unknown reason. | If this failure happens frequently, open a support ticket for the Azure Data Explorer team to investigate further.|
| No materialization failures, `MaterializedViewResult` metric will be fired on every successful execution with `Result`=`Success`. `Age` is above threshold | One of the following circumstances:
| | Materialization is 'slow' since there are too many extents to rebuild in each materialization cycle. | See [Materialized views (preview)](materialized-view-overview.md#how-materialized-views-work) about why extents rebuilds impact the view's performance.  The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric, and the `MaterializedViewExtentsRebuildConcurrency` includes the concurrency used in each cycle. <br> Increasing the extents rebuilt concurrency in the [Materialized view capacity policy](materialized-view-policies.md#capacity-policy) might also help in this case. Carefully read the [capacity policy](materialized-view-policies.md#capacity-policy) before changing the default values.
| | There are additional materialized views in the cluster, and cluster doesn't have sufficient capacity to run all. | See the [Materialized view capacity policy](materialized-view-policies.md#capacity-policy) section about changing the default settings for number of materialized views that were executed concurrently.

`MaterializedViewDataLoss` is fired, with dimension `Kind`=`SourceDataRetentionApproaching`. After two days of extension, the extents are dropped, and the metric is fired with `Kind`=`SourceDataDropped`.
* When the materialized view is unhealthy, it isn't able to process newly ingested records from the source table on time. The lag may continue to increase until the retention period of the source data approaches. Data in source table is dropped without being processed by the materialized view, leading to data loss in the materialized view. Extents about to be dropped from the source table, before they were processed by the materialization, receive an "extension" of two days to their retention period.

## Next steps

* [Create or alter materialized view](materialized-view-create-alter.md)
* [Materialized views show commands](materialized-view-show-commands.md)
* [Materialized view principals](materialized-view-principals.md)
* [Materialized views monitoring](materialized-view-monitoring.md)