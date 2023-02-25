---
title: Materialized view rename - Azure Data Explorer
description: This article describes rename materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .rename materialized-view

Renames a materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax
`.rename` `materialized-view` *OldName* `to` *NewName*

## Properties

| Property | Type| Description |
|----------------|-------|-----|
| OldName| string| Name of the materialized view to rename.|
| NewName| string| New name to assign to the view.|

## Returns

The command returns all materialized views in the database, after the rename, which is the output of the [.show materialized-views](materialized-view-show-commands.md#show-materialized-view) command.

## Example

```kusto
.rename materialized-view ViewName to NewName
```

## Output

|Output parameter |Type |Description
|---|---|---|
|Name  |string |The name of the materialized view.
|SourceTable|string|The source table of the materialized view.
|Query|string|The materialized view query.
|MaterializedTo|datetime|The max materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).
|LastRun|datetime |The last time materialization was run.
|LastRunResult|string|Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.
|IsHealthy|bool|`true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`).
|IsEnabled|bool|`true` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).
|Folder|string|The materialized view folder.
|DocString|string|The materialized view doc string.
|AutoUpdateSchema|bool|Whether the view is enabled for auto updates.
|EffectiveDateTime|datetime|The effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view))
|Lookback|timespan|The period of time in which duplicates are expected. For more information, see [materialized view creation properties](materialized-view-create#properties).
