---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 09/07/2020
ms.author: orspodek
---

## Materialized view metrics

|**Metric** | **Unit** | **Aggregation** | **Metric description** | **Dimensions** |
|---|---|---|---|---|

|Metric Name|Description
|----------------|---|
|MaterializedViewHealth|Value is 1 if the view is considered healthy, otherwise 0.|
|MaterializedViewAgeMinutes|The `age` of the view is defined by the current time minus the last ingestion time processed by the view. Metric value is time in minutes (the lower the value is, the view is "healthier").
|MaterializedViewResult|Metric includes a `Result` dimension indicating the result of the last materialization cycle (see possible values below). Metric value always equals 1.|
|MaterializedViewRecordsInDelta|The number of records currently in the non-processed part of the source table. For more information, see [behind the scenes](../kusto/management/materialized-views/materialized-view-overview.md#behind-the-scenes.|
|MaterializedViewExtentsRebuild|The number of extents rebuilt in the materialization cycle.|
|MaterializedViewExtentsRebuildConcurrency|The concurrency of extents rebuilt in the materialization cycle.|
|MaterializedViewDataLoss|Metric is fired when unprocessed source data is approaching retention (details below).|
