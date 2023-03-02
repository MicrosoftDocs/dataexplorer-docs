---
title: .alter materialized view autoUpdateSchema - Azure Data Explorer
description: This article describes alter materialized view autoUpdateSchema in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. For information on the autoUpdateSchema property, see [materialized view create command properties](materialized-view-create.md#properties).

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `autoUpdateSchema` {`true`|`false`}

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

## Returns

Following is the schema of the output returned:

| Name              | Type     | Description                                                                                                                                                                                 |
|-------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name              | string   | Name of the materialized view.                                                                                                                                                              |
| SourceTable       | string   | Name of source table on which the view is defined.                                                                                                                                          |
| Query             | string   | Query definition of the materialized view.                                                                                                                                                  |
| MaterializedTo    | datetime | Maximum materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).        |
| LastRun           | datetime | Last time materialization was run.                                                                                                                                                          |
| LastRunResult     | string   | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.                                                                                                            |
| IsHealthy         | bool     | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`). |
| IsEnabled         | bool     | `true` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).                                                                               |
| Folder            | string   | Folder under which the materialized view is created.                                                                                                                                        |
| DocString         | string   | Description assigned to the materialized view.                                                                                                                                              |
| AutoUpdateSchema  | bool     | Whether the view is enabled for auto updates.                                                                                                                                               |
| EffectiveDateTime | datetime | Effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view)).                                 |
| Lookback          | timespan | Time span limiting the period of time in which duplicates are expected.                                                                                                                     |

## Examples

### Enable auto update schema for a materialized view

The following command enables autoUpdateSchema for materialized view MyView, so that when the schema of the source table on which the view is based changes, the schema of the view is automatically updated to reflect those changes.

```kusto
.alter materialized-view MyView autoUpdateSchema true
```

**Output:**

| Name   | SourceTable | Query                            | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|----------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Disable auto update schema for a materialized view

The following command disables autoUpdateSchema for materialized view MyView, so that when the schema of the source table on which the view is based changes, the schema of the view doesn't update automatically to reflect those changes.

```kusto
.alter materialized-view MyView autoUpdateSchema false
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        |           | false            | 2023-02-23T14:01:42.5172342Z |            |
