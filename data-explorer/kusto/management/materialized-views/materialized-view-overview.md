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

[Materialized views](../../query/materializedviewfunction.md) expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh).
Querying a materialized view is expected to be more performant than running the aggregation directly over the source table.

> [!NOTE] 
> Materialized views have some [limitations](#known-issues-and-limitations), and are not guaranteed to work well for all scenarios. Pay attention to [performance considerations](#performance-considerations) before working with the feature.

## Key features

* **Performance improvement:** Querying a materialized view should perform better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, independent of when materialization last took place. The query *combines* the *materialized* part of the view with the records in the source table, which haven't yet been materialized (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:** Querying a materialized view consumes less resources from the cluster than doing the aggregation over the entire source table. Retention policy of source table can be reduced if only aggregation is required, and not the source data itself. This setup reduces hot cache costs for the source table.

## Common scenarios

The following are common scenarios that can be addressed by using a materialized view:

* Query last record per entity - using [arg_max() (aggregation function)](../../query/arg-max-aggfunction.md).
* De-duplicate records in a table - using [any() (aggregation function)](../../query/any-aggfunction.md).
* Reduce the 'resolution' of data by calculating periodic statistics over the raw data - using various [aggregation functions](materialized-view-create-alter.md#supported-aggregation-functions) by period of time (for instance, `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day).

## How materialized views work

A materialized view is made of two components:

* A *materialized* part - a physical Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds the minimal possible number of records - a single record per the dimension's combination (as in the actual aggregation result).
* A *delta* - the newly ingested records in the source table, which haven't been processed yet. 

Querying the Materialized View *combines* the materialized part with the delta part, providing an up-to-date result of the aggregation query. 

The offline materialization process ingests new records from the *delta* to the materialized table, and replaces existing records. The replacement is done by rebuilding extents that hold records to replace. Both processes (ingestion and extents rebuild) require available ingestion capacity. Clusters in which the available ingestion capacity is low may not be able to materialize the view frequently enough, which will negatively impact the materialized view performance. The bigger the *delta* is, the slower queries will perform.

If records in the *delta* constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the pace. The ingestion rate will be higher than the materialization rate. In that case, the view will become unhealthy and the *delta* will constantly grow. Monitor the number of extent rebuilds in each materialization cycle using [metrics](materialized-view-monitoring.md).

## Performance considerations

Track health and performance using [materialized view monitoring](materialized-view-monitoring.md). The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is too overloaded (for example, high CPU), adding materialized views to it may cause a degradation in the cluster's performance. You can monitor your cluster's health using the [Cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently doesn't take materialized views health under consideration as part of autoscale rules.

* **Overlap with materialized data:** During materialization time, all new records ingested to source table since last materialization (the `delta`) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the worse the performance of the materialized view will be. A materialized view will work best if the number of records being updated (for example, in `arg_max` view) is a small subset of the source table. If all or most of the materialized view records need to be updated in every materialization cycle, then the materialized view probably won't perform well. Extents rebuild metrics in the [monitoring article](materialized-view-monitoring.md#troubleshooting) can help you identify when this situation is the case.

* **Ingestion rate:** There are no hard-coded limits on the data volume or ingestion rate in the source table of the materialized view. However, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates may still perform well, depending on cluster size, available resources, and amount of intersection with existing data. 

* **Number of materialized views in cluster:** The above considerations apply to each individual materialized view defined in the cluster. Each view consumes its own resources, and many views will compete with each other on available resources.  There are no hard-coded limits. However, the general recommendation is to have no more than 10 materialized views on a cluster. The [capacity policy](materialized-view-policies.md#capacity-policy) may be adjusted if more than a single materialized view is defined in the cluster.

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

## Next steps

* [Create or alter materialized view](materialized-view-create-alter.md)
* [Materialized views show commands](materialized-view-show-commands.md)
* [Materialized view principals](materialized-view-principals.md)
* [Materialized views monitoring](materialized-view-monitoring.md)