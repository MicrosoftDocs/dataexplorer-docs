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

Materialized views expose an *aggregation* query over a source table. Materialized views always return an up-to-date result of the aggregation query (always fresh).
Querying a materialized view is expected to be more performant than running the aggregation directly over the source table.



> [!NOTE] 
> Materialized views have some limitations, and are not guaranteed to work well for all scenarios. Carefully read through this article and the [Performance considerations](#performance-considerations) section prior to starting to work with the feature.

Common scenarios that can be addressed by using a materialized view:

* Query last record per entity - using [arg_max() (aggregation function)](../../query/arg-max-aggfunction.md).
* De-duplicate records in a table - using [any() (aggregation function)](../../query/any-aggfunction.md).
* Reduce the 'resolution' of data by calculating periodic statistics over the raw data - using various [aggregation functions](materialized-view-create-alter.md#supported-aggregation-functions) by period of time (for instance, `T | summarize dcount(User) by bin(Timestamp, 1d)` to maintain an up-to-date snapshot of distinct users per day).

## Key features

* **Performance improvement:** Querying a materialized view should perform better than querying the source table for the same aggregation function(s).

* **Freshness:** A materialized view query always returns the most up-to-date results, regardless of when materialization last took place. The query *combines* the *materialized* part of the view with the records in the source table, which were not materialized yet (the `delta` part), always providing the most up-to-date results.

* **Cost reduction:** Querying a materialized view consumes less resources from the cluster, than performing the aggregation over the entire source table. Additionally, retention policy of source table can be reduced (assuming only aggregation is required, and not the source data itself), thus reducing hot cache costs for the source table.

## Behind the scenes

A materialized view is made of 2 "parts":

* A *materialized* part - a physical Azure Data Explorer table holding aggregated records from the source table, which have already been processed.  This table always holds the minimal possible number of records - a single record per the dimension's combination (as in the actual aggregation result).
* A *delta* - the newly ingested records in the source table, which haven't been processed yet. 

Querying the Materialized View *combines* the materialized part with the delta part, providing an up-to-date result of the aggregation query. 

The offline materialization process ingests new records from the delta part to the materialized table and replaces existing records. The latter is done by rebuilding extents which hold records to replace. Both processes (ingestion and extents rebuild) require available ingestion capacity. Therefore, clusters in which the available ingestion capacity is low may not be able to materialize the view frequently enough, which will negatively impact the materialized view performance (queries will perform slower, as the delta part becomes bigger). 

If records in the *delta* part constantly intersect with all data shards in the *materialized* part, each materialization cycle will require rebuilding the entire *materialized* part, and may not keep up with the pace (the ingestion rate will be higher than the materialization rate). In that case, the view will become unhealthy and the *delta* part will constantly grow. You can monitor the number of extent rebuilds in each materialization cycle using metrics, described in the [Materialized views monitoring](materialized-view-monitoring.md) article.

## Performance considerations

The main contributors that can impact a materialized view health are:

* **Cluster resources:** Like any other process running on the cluster, materialized views consume resources (CPU, memory) from the cluster. If the cluster is too overloaded (e.g., high CPU), adding materialized views to it may not work well, and may cause a degradation in the cluster's performance. You can monitor your cluster's health using the [Cluster health metrics](../../../using-metrics.md#cluster-metrics). [Optimized autoscale](../../../manage-cluster-horizontal-scaling.md#optimized-autoscale) currently does not take materialized views health under consideration as part of auto-scale rules.

* **Overlap with materialized data:** During materialization time, all new records ingested to source table since last materialization (the `delta`) are processed and materialized into the view. The higher the intersection between new-records and already-materialized-records is, the performance of the materialized view is expected to be worse. A materialized view will work best if the number of records being updated (for example, in arg_max view) is a small subset of the source table. If all (or most) of the materialized view records need to be updated in every materialization cycle, then there are high chances the materialized view won't perform well. Extents rebuild metrics in the [monitoring article](materialized-view-monitoring.md#troubleshooting) should help you identify when this is the case.

* **Ingestion rate:** While there are no hard coded limits on the data volume and/or ingestion rate in the source table of the materialized view, the recommended ingestion rate for materialized views is no more than 1-2GB/sec. Higher ingestion rates *may* still perform well, depending on cluster size, available resources, and amount of intersection with existing data (explained above), but existing benchmarks show best results for up to 1-2GB/sec.

* **Number of materialized views in cluster:** The above bullets apply to each individual materialized view defined in the cluster. Naturally, each view consumes its own resources, and many views will compete with each other on available resources. The general recommendation is to have no more than 10 materialized views on a cluster (but there are no hard coded limits). The [capacity policy](materialized-view-policies.md#materialized-view-capacity-policy) may be adjusted if more than a single materialized view is defined in the cluster.

* **Materialized view definition**: The materialized view definition must be defined according to query pattern for best query performance. See [Performance tips](materialized-view-create-alter.md#performance-tips) section in the create command for more details. 

## Known issues and limitations

* A materialized View cannot be created on top of another materialized View.
* The source table of a materialized view must be a table which is being ingested to directly, either using one of the [ingestion methods](../../../ingest-data-overview.md#ingestion-methods-and-tools), or using an [update policy](../updatepolicy.md), or [ingest from query commands](../data-ingestion/ingest-from-query.md).
* Materialized view does not work when using [move extents](../move-extents.md) from other tables into the source table of the materialized view.
  * Move extents command, which attempt to move extents from or to the view, may fail with errors like below:
  * `Cannot drop/move extents from/to table 'TableName' since Materialized View 'ViewName' is currently processing some of these extents`.
* Source table cannot be enabled for streaming ingestion.
* Source table cannot be a restricted table or a table with row level security enabled.
* [Cursor functions](../databasecursor.md#cursor-functions) cannot be used on top 
of materialized views.
* Continuous export from a materialized view is not supported.
* Materialized views cannot be created on [follower databases](../../../follower.md) (since follower databases are read-only and materialized views require write operations).  Materialized views defined on leader databases **can** be queried from their followers (just as any other table in the leader), but the view has to be created on the leader cluster.

## Notes

* Materialized view failures don't always indicate that the materialized view is unhealthy. Errors can be transient and materialization process will continue and can be successful in the next execution.
* Materialization never skips any data, even in the case of constant failures. View is always guaranteed to return the most up-to-date snapshot of the query, based on *all* records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.
* Failures can occur due to transient errors (CPU/memory/networking failures) or permanent ones (for example, the source table was changed and the materialized view query is syntactically invalid). The materialized view will be automatically disabled in case of schema changes (that are inconsistent with the view definition) or in case
the materialized view query is no longer semantically valid. For all other failures, the system will continue materialization attempts until the root cause is fixed.
