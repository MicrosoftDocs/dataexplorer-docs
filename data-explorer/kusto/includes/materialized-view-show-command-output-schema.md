---
ms.topic: include
ms.date: 01/29/2025
---

**Output schema:**

| Name | Type | Description |
|--|--|--|
| Name | `string` | Name of the materialized view. |
| SourceTable | `string` | Name of source table on which the view is defined. |
| Query | `string` | Query definition of the materialized view. |
| MaterializedTo | `datetime` | Maximum materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](../management/materialized-views/materialized-view-overview.md#how-materialized-views-work). |
| LastRun | `datetime` | Last time materialization was run. |
| LastRunResult | `string` | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`. |
| IsHealthy | `bool` | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`). |
| IsEnabled | `bool` | `true` when view is enabled (see [Disable or enable materialized view](../management/materialized-views/materialized-view-enable-disable.md)). |
| Folder | `string` | Folder under which the materialized view is created. |
| DocString | `string` | Description assigned to the materialized view. |
| AutoUpdateSchema | `bool` | Whether the view is enabled for auto updates. |
| EffectiveDateTime | `datetime` | Effective date time of the view, determined during creation time (see [`.create materialized-view`](../management/materialized-views/materialized-view-create.md#create-materialized-view)). |
| Lookback | `timespan` | The time span that limits the period during which duplicates or updates are expected. For more information, see [Lookback period](../management/materialized-views/materialized-view-create.md#lookback-period). |
| LookbackColumn | `datetime` | A `datetime` column in the view which serves as the reference for the lookback period. If this column is empty, but the `lookback` has a value, then the materialized view uses a default lookback. For more information, see [Lookback period](../management/materialized-views/materialized-view-create.md#lookback-period). |
