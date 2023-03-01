---
title: .alter materialized view lookback - Azure Data Explorer
description: This article describes alter materialized view lookback in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view lookback

Alters the `lookback` value of an existing materialized view. For more information on the lookback property, see [materialized view create command properties](materialized-view-create.md#properties).

> [!NOTE]
> A `lookback` for a materialized view is only supported for [EngineV3](../../../engine-v3.md) clusters, and for arg_max/arg_min/take_any materialized views.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

## Parameters

| Name                   | Type     | Required | Description                                                                 |
|------------------------|----------|----------|-----------------------------------------------------------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name.                                                   |
| *LookbackPeriod*       | timespan | &check;  | The time span limiting the period of time in which duplicates are expected. |

## Returns

| Name              | Type     | Description                                                                                                                                                                                 |
|-------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name              | string   | The name of the materialized view.                                                                                                                                                          |
| SourceTable       | string   | The source table of the materialized view.                                                                                                                                                  |
| Query             | string   | The materialized view query.                                                                                                                                                                |
| MaterializedTo    | datetime | The max materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).        |
| LastRun           | datetime | The last time materialization was run.                                                                                                                                                      |
| LastRunResult     | string   | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.                                                                                                            |
| IsHealthy         | bool     | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`). |
| IsEnabled         | bool     | `true` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).                                                                               |
| Folder            | string   | The materialized view folder.                                                                                                                                                               |
| DocString         | string   | The materialized view doc string.                                                                                                                                                           |
| AutoUpdateSchema  | bool     | Whether the view is enabled for auto updates.                                                                                                                                               |
| EffectiveDateTime | datetime | The effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view)).                             |
| Lookback          | timespan |  The time span limiting the period of time in which duplicates are expected.                                                                                                                |

## Examples

### Set the lookback property of a materialized view

The following command sets the lookback period of materialized view MyView to six hours:

```kusto
.alter materialized-view MyView lookback 6h
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z | 6:00:00:00 |

### Remove the lookback of a materialized view

The following command removes the lookback period of materialized view MyView:

```kusto
.alter materialized-view MyView lookback timespan(null)
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
