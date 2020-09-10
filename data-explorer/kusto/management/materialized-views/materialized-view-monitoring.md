---
title: Materialized views monitoring - Azure Data Explorer
description: This article describes materialized views monitoring in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---
# Materialized views monitoring 

The health of materialized views describes the resource usage, rate of failures, and latency in execution. Monitor the materialized view's health in the following ways:

* Monitor the `IsHealthy` property returned from [show materialized-view](materialized-view-show-commands.md#show-materialized-view).
* Check for failures using [show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures).
* Monitor [metrics](#materialized-view-metrics) in the Azure portal.

[!INCLUDE [materialized-view-metrics](../../../includes/materialized-view-metrics.md)]

## Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [.show commands-and-queries](../commands-and-queries.md#show-commands-and-queries) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```

## Troubleshooting

The `MaterializedViewHealth` metric indicates whether a Materialized View is healthy. A materialized view can become unhealthy for any or all of the following reasons:
* The materialization process is failing. 
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time.
If failure is because of cluster capacity, execution will succeed. However, the view will be unhealthy, because it's lagging behind and unable to keep up with the ingestion rate. Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will start gradually increasing.
* Materialized view failures don't always indicate that the materialized view is unhealthy. Errors can be transient and the materialization process will continue and can be successful in the next execution.
* Materialization never skips any data, even if there are constant failures. View is always guaranteed to return the most up-to-date snapshot of the query, based on *all* records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.
* Failures can occur because of transient errors (CPU/memory/networking failures) or permanent ones (for example, the source table was changed and the materialized view query is syntactically invalid). The materialized view will be automatically disabled if there are schema changes that are inconsistent with the view definition, or if the materialized view query is no longer semantically valid. For all other failures, the system will continue materialization attempts until the root cause is fixed.

### Why is my materialized view unhealthy?

The following examples can help you diagnose unhealthy views:

|Diagnostic | Reason | Action|
|---|---|---|
| `MaterializedViewResult` metric is fired, and the `Result` dimension is set to `SourceTableSchemaChange`/`SourceTableNotFound`| Source table was changed (or deleted), and the view isn't set to `autoUpdateSchema` or the change in source table isn't supported for auto-updates. |
| `MaterializedViewResult` metric `Result` dimension is set to `InsufficientResources`. | Materialization process failure due insufficient cluster resources (hitting query limits). | Azure Data Explorer will try to automatically recover from this state, so this error may be transient. However, if view is unhealthy and this error is constantly emitted, then it's possible that the current cluster's configuration isn't able to keep up with ingestion rate. In this case, the cluster needs to be scaled up or out.|
| `MaterializedViewResult` metric's `Result` is `UnknownError`.| Materialization process is failing because of another (unknown) reason. | If this failure happens frequently, open a support ticket for the Azure Data Explorer team to investigate further.|
| No materialization failures, `MaterializedViewResult` metric will be fired on every successful execution with `Result`=`Success`. `Age` is above threshold | One of the following circumstances:
| | Materialization is 'slow' since there are too many extents to rebuild in each materialization cycle. | See [Materialized views (preview)](materialized-view-overview.md#how-materialized-views-work) about why extents rebuilds impact the view's performance.  The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric, and the `MaterializedViewExtentsRebuildConcurrency` includes the concurrency used in each cycle. <br> Increasing the extents rebuilt concurrency in the [Materialized view capacity policy](materialized-view-policies.md#capacity-policy) might also help in this case. Carefully read the [capacity policy](materialized-view-policies.md#capacity-policy) before changing the default values.
| | There are additional materialized views in the cluster, and cluster doesn't have sufficient capacity to run all. | See the [Materialized view capacity policy](materialized-view-policies.md#capacity-policy) section about changing the default settings for number of materialized views that were executed concurrently.
| `MaterializedViewDataLoss` is fired, with dimension `Kind`=`SourceDataRetentionApproaching`. After two days of extension, the extents are dropped, and the metric is fired with `Kind`=`SourceDataDropped`.| When the materialized view is unhealthy, it isn't able to process newly ingested records from the source table on time. The lag may continue to increase until the retention period of the source data approaches. Data in source table is dropped without being processed by the materialized view, leading to data loss in the materialized view. Extents about to be dropped from the source table, before they were processed by the materialization, receive an "extension" of two days to their retention period. |
