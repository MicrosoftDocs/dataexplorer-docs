---
title:  Show continuous data export
description:  This article describes how to show continuous data export properties.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# Show continuous export

Returns the properties of a specified continuous export or all continuous exports in the database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../../access-control/role-based-access-control.md).

## Syntax

`.show` `continuous-export` *ContinuousExportName*

`.show` `continuous-exports`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

| Output parameter    | Type     | Description                                                             |
|---------------------|----------|-------------------------------------------------------------------------|
| CursorScopedTables  | `string` | List of explicitly scoped (fact) tables (JSON serialized)               |
| ExportProperties    | `string` | Export properties (JSON serialized)                                     |
| ExportedTo          | `datetime` | The last datetime (ingestion time) that was exported successfully       |
| ExternalTableName   | `string` | Name of the external table                                              |
| ForcedLatency       | `timeSpan` | Forced latency (null if not provided)                                   |
| IntervalBetweenRuns | `timeSpan` | Interval between runs                                                   |
| IsDisabled          | `bool` | True if the continuous export is disabled                               |
| IsRunning           | `bool` | True if the continuous export is currently running                      |
| LastRunResult       | `string` | The results of the last continuous-export run (`Completed` or `Failed`) |
| LastRunTime         | `datetime` | The last time the continuous export was executed (start time)           |
| Name                | `string` | Name of the continuous export                                           |
| Query               | `string` | Export query                                                            |
| StartCursor         | `string` | Starting point of the first execution of this continuous export         |