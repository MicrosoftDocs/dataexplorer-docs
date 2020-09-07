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

Use the following options to monitor the materialized view's health:

* Monitoring the IsHealthy property returned from the [Show materialized-view](materialized-view-show-commands.md#show-materialized-view).

* Checking for failures using the [Show materialized-view failures](materialized-view-show-commands.md#show-materialized-view-failures).

* Monitoring the following metrics in the Azure portal.

[!INCLUDE [materialized-view-metrics](../../../includes/materialized-view-metrics.md)]

## Troubleshooting

The `MaterializedViewHealth` metric indicates whether a Materialized View is healthy. A materialized view can become unhealthy either because its materialization process is failing and/or because the cluster doesn't have sufficient capacity to materialize all incoming data on-time. In the latter case, there will be no failures in execution, but view will still be unhealthy, since it will be lagging behind and not able to keep up with the ingestion rate. Before a Materialized View becomes unhealthy, its age, noted by the `MaterializedViewAgeMinutes` metric, will start gradually increasing.

The following are examples for possible reasons for a view to become unhealthy, and how to diagnose them:

* Source table was changed (or deleted), and the view is not set to `autoUpdateSchema` and/or the change in source table is not supported for auto-updates. In this case, a  `MaterializedViewResult` metric will be fired, and the `Result` dimension will be set to `SourceTableSchemaChange`/`SourceTableNotFound`.

* Materialization process can fail due insufficient cluster resources (hitting query limits). When this happens, `MaterializedViewResult` metric `Result` dimension will be set to `InsufficientResources`. Azure Data Explorer will try to automatically recover from this state, so this error may be transient. However, if view is unhealthy, and this error is constantly emitted, then it's possible that the current cluster's configuration is not able to keep up with ingestion rate, and cluster needs to be scaled up/out.

* Materialization process is failing due to any other (unknown) reason - `MaterializedViewResult` metric's `Result` will be `UnknownError`. If this happens frequently, open a support ticket for the Azure Data Explorer team to investigate further.

* If there are no materialization failures, `MaterializedViewResult` metric will be fired on every successful execution with `Result`=`Success`. A materialized view can be unhealthy, although all executions are successful, if it is lagging behind (`Age` is above threshold). This can happen due to the following circumstances: 
  * Materialization is 'slow' since there are too many extents to rebuild in each materialization cycle. See the [Materialized views (preview)](materialized-view-overview.md#behind-the-scenes) about why extents rebuilds impact the view's performance. If each materialization cycle needs to rebuild close to 100% of the extents in the view,
there are high chances view will not be able to keep up, and will become unhealthy. The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric, and the `MaterializedViewExtentsRebuildConcurrency` includes the concurrency used in each cycle. Increasing the extents rebuilt concurrency in the [Materialized view capacity policy](materialized-view-policies.md#materialized-view-capacity-policy) might also help in this case (carefully read the notes in the capacity section before changing the default values).
   * There are additional materialized views in the cluster, and cluster does not have sufficient capacity to run all. See the [Materialized view capacity policy](materialized-view-policies.md#materialized-view-capacity-policy) section about changing the default settings for number of Materialized Views executed concurrently.

**Materialized view data loss metric:** when the materialized view is unhealthy, it is not able to process newly ingested records from the source table on time. Eventually, the lag may grow bigger and bigger, until the retention period of the source data approaches, and data in source table will be dropped, without being processed by the materialized view, which will lead to data loss in the materialized view. Extents about to be dropped from the source table, before they were processed by the materialization, will receive an "extension" of two days to their retention period. During this time, the metric `MaterializedViewDataLoss` is fired, with dimension `Kind`=`SourceDataRetentionApproaching`. After those two days, the extents will be dropped, and the same metric is fired with `Kind`=`SourceDataDropped`.

**Materialized views resources consumption:** the resources consumed by the materialized views materialization process can be tracked using the [.show commands-and-queries](../commands-and-queries.md#show-commands-and-queries) command. You can filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```
