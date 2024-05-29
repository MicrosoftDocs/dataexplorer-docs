---
ms.topic: include
ms.date: 03/05/2023
---

**Output schema:**

| Name              | Type     | Description                                                                                                                                                                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name              | `string` | Name of the materialized view.                                                                                                                                                                                              |
| SourceTable       | `string` | Name of source table on which the view is defined.                                                                                                                                                                          |
| Query             | `string` | Query definition of the materialized view.                                                                                                                                                                                  |
| MaterializedTo    | `datetime` | Maximum materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](../kusto/management/materialized-views/materialized-view-overview.md#how-materialized-views-work). |
| LastRun           | `datetime` | Last time materialization was run.                                                                                                                                                                                          |
| LastRunResult     | `string` | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.                                                                                                                                            |
| IsHealthy         | `bool` | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`).                                 |
| IsEnabled         | `bool` | `true` when view is enabled (see [Disable or enable materialized view](../kusto/management/materialized-views/materialized-view-enable-disable.md)).                                                                        |
| Folder            | `string` | Folder under which the materialized view is created.                                                                                                                                                                        |
| DocString         | `string` | Description assigned to the materialized view.                                                                                                                                                                              |
| AutoUpdateSchema  | `bool` | Whether the view is enabled for auto updates.                                                                                                                                                                               |
| EffectiveDateTime | `datetime` | Effective date time of the view, determined during creation time (see [`.create materialized-view`](../kusto/management/materialized-views/materialized-view-create.md#create-materialized-view)).                          |
| Lookback          | `timespan` | Time span limiting the period of time in which duplicates are expected.                                                                                                                                                     |