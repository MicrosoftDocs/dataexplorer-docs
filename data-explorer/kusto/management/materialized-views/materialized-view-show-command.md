---
title: show materialized-view command - Azure Data Explorer
description: This article describes show materialized-view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .show materialized-view

Displays definition and current state for one or all materialized views.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName*

`.show` `materialized-views`

## Parameters

| Name                   | Type   | Required | Description                 |
|------------------------|--------|----------|-----------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name. |

### Returns

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
| Lookback          | timespan | The time span limiting the period of time in which duplicates are expected.                                                                                                                 |

## Examples

### Show details about one materialized view

The following command shows details for materialized view ViewName:

```kusto
.show materialized-view ViewName
```

**Output:**

| Name     | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Show details about all materialized view

The following command shows details for all materialized views:

```kusto
.show materialized-views
```

**Output:**

| Name     | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
| ArgMax   | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |
