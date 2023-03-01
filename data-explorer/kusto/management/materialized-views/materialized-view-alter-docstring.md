---
title: .alter materialized view docstring - Azure Data Explorer
description: This article describes the alter materialized-view docstring command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view docstring

Alters the *DocString* value associated to an existing materialized view to describe it.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `docstring` '*DocString*'

## Parameters

| Name                   | Type   | Required | Description                                                                                                                                    |
|------------------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name.                                                                                                                    |
| *DocString*            | string | &check;  | Free text that you can attach to a materialized view to describe it. This string is presented in various UX settings next to the entity names. |

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

### Set the docstring of a materialized view

The following command sets the description of a materialized via its docstring property:

```kusto
.alter materialized-view MyView docstring "docs here..."
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString      | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|----------------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        | "docs here..." | true             | 2023-02-23T14:01:42.5172342Z |            |
