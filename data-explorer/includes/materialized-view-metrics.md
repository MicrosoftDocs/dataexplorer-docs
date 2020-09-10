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
|MaterializedViewHealth                    | 1, 0    | Avg     |  Value is 1 if the view is considered healthy, otherwise 0. | Database, MaterializedViewName |
|MaterializedViewAgeMinutes                | Minutes | Avg     | The `age` of the view is defined by the current time minus the last ingestion time processed by the view. Metric value is time in minutes (the lower the value is, the view is "healthier"). | Database, MaterializedViewName |
|MaterializedViewResult                    | 1       | Avg     | Metric includes a `Result` dimension indicating the result of the last materialization cycle (see possible values below). Metric value always equals 1. | Database, MaterializedViewName, Result |
|MaterializedViewRecordsInDelta            | Records count | Avg | The number of records currently in the non-processed part of the source table. For more information, see [behind the scenes](../kusto/management/materialized-views/materialized-view-overview.md#behind-the-scenes)| Database, MaterializedViewName |
|MaterializedViewExtentsRebuild            | Extents count | Avg | The number of extents rebuilt in the materialization cycle.| Database, MaterializedViewName|
|MaterializedViewExtentsRebuildConcurrency | Number of concurrent operations | Avg | The concurrency of extents rebuilt in the materialization cycle.| Database, MaterializedViewName|
|MaterializedViewDataLoss                  | 1       | Max     | Metric is fired when unprocessed source data is approaching retention. | Database, MaterializedViewName, Kind |
