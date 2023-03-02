---
title: Materialized view rename - Azure Data Explorer
description: This article describes rename materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .rename materialized-view

Renames a materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.rename` `materialized-view` *OldName* `to` *NewName*

## Parameters

| Name      | Type    | Required | Description                              |
|-----------|--------|-----------|------------------------------------------|
| *OldName* | string | &check;   | Name of the materialized view to rename. |
| *NewName* | string | &check;   | New name to assign to the view.          |

## Returns

The command returns all materialized views in the database, after the rename, which is the output of the [`.show materialized view(s)`](materialized-view-show-command.md#show-materialized-view) command.

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

### Rename one materialized view

The following command renames materialized view ViewName to NewName:

```kusto
.rename materialized-view ViewName to NewName
```

**Output:**

| Name    | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|---------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ArgMax  | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |
| NewName | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
