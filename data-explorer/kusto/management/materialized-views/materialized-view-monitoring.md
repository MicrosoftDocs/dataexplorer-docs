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

## Troubleshooting

The `MaterializedViewHealth` metric indicates whether a Materialized View is healthy. A materialized view can become unhealthy for any or all of the following reasons:
* The materialization process is failing. 
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time.
If failure is due to cluster capacity, execution will succeed, but the view will be unhealthy, because it be lagging behind and not able to keep up with the ingestion rate. Before a Materialized View becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will start gradually increasing.

## Why is my materialized view unhealthy?

The following examples can help you diagnose unhealthy views:

|Diagnostic | Reason | Actions|
|---|---|---|
| `MaterializedViewResult` metric is fired, and the `Result` dimension is set to `SourceTableSchemaChange`/`SourceTableNotFound`| Source table was changed (or deleted), and the view is not set to `autoUpdateSchema` and/or the change in source table is not supported for auto-updates. |
| `MaterializedViewResult` metric `Result` dimension is set to `InsufficientResources`. | Materialization process failure due insufficient cluster resources (hitting query limits). | Azure Data Explorer will try to automatically recover from this state, so this error may be transient. However, if view is unhealthy, and this error is constantly emitted, then it's possible that the current cluster's configuration is not able to keep up with ingestion rate, and cluster needs to be scaled up/out.|
| `MaterializedViewResult` metric's `Result` is `UnknownError`.| Materialization process is failing due to another (unknown) reason. | If this happens frequently, open a support ticket for the Azure Data Explorer team to investigate further.|

* If there are no materialization failures, `MaterializedViewResult` metric will be fired on every successful execution with `Result`=`Success`. A materialized view can be unhealthy, although all executions are successful, if it is lagging behind (`Age` is above threshold). This can happen due to the following circumstances: 
  * Materialization is 'slow' since there are too many extents to rebuild in each materialization cycle. See the [Materialized views (preview)](materialized-view-overview.md#behind-the-scenes) about why extents rebuilds impact the view's performance. If each materialization cycle needs to rebuild close to 100% of the extents in the view,
there are high chances view will not be able to keep up, and will become unhealthy. The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric, and the `MaterializedViewExtentsRebuildConcurrency` includes the concurrency used in each cycle. Increasing the extents rebuilt concurrency in the [Materialized view capacity policy](materialized-view-policies.md#materialized-view-capacity-policy) might also help in this case (carefully read the notes in the capacity section before changing the default values).
   * There are additional materialized views in the cluster, and cluster does not have sufficient capacity to run all. See the [Materialized view capacity policy](materialized-view-policies.md#materialized-view-capacity-policy) section about changing the default settings for number of Materialized Views executed concurrently.

**Materialized view data loss metric:** when the materialized view is unhealthy, it is not able to process newly ingested records from the source table on time. The lag may continue to increase until the retention period of the source data approaches. Data in source table is dropped without being processed by the materialized view, leading to data loss in the materialized view. Extents about to be dropped from the source table, before they were processed by the materialization, will receive an "extension" of two days to their retention period. During this time, the metric `MaterializedViewDataLoss` is fired, with dimension `Kind`=`SourceDataRetentionApproaching`. After those two days, the extents will be dropped, and the same metric is fired with `Kind`=`SourceDataDropped`.

**Materialized views resources consumption:** the resources consumed by the materialized views materialization process can be tracked using the [.show commands-and-queries](../commands-and-queries.md#show-commands-and-queries) command. You can filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```
