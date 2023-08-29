---
title:  Show continuous data export
description: This article describes how to show continuous data export properties in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# Show continuous export

Returns the properties of a specified continuous export or all continuous exports in the database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `continuous-export` *ContinuousExportName*

`.show` `continuous-exports`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | string | &check; | The name of the continuous export. |

## Returns

| Output parameter    | Type     | Description                                                             |
|---------------------|----------|-------------------------------------------------------------------------|
| CursorScopedTables  | String   | List of explicitly scoped (fact) tables (JSON serialized)               |
| ExportProperties    | String   | Export properties (JSON serialized)                                     |
| ExportedTo          | DateTime | The last datetime (ingestion time) that was exported successfully       |
| ExternalTableName   | String   | Name of the external table                                              |
| ForcedLatency       | TimeSpan | Forced latency (null if not provided)                                   |
| IntervalBetweenRuns | TimeSpan | Interval between runs                                                   |
| IsDisabled          | Boolean  | True if the continuous export is disabled                               |
| IsRunning           | Boolean  | True if the continuous export is currently running                      |
| LastRunResult       | String   | The results of the last continuous-export run (`Completed` or `Failed`) |
| LastRunTime         | DateTime | The last time the continuous export was executed (start time)           |
| Name                | String   | Name of the continuous export                                           |
| Query               | String   | Export query                                                            |
| StartCursor         | String   | Starting point of the first execution of this continuous export         |