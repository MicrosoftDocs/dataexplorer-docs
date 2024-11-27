---
title:  Show continuous data export
description:  This article describes how to show continuous data export properties.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/11/2024
---
# Show continuous export

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

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

| Output parameter | Type | Description |
|--|--|--|
| CursorScopedTables | `string` | The list of explicitly scoped (fact) tables (JSON serialized). |
| ExportProperties | `string` | The export properties (JSON serialized). |
| ExportedTo | `datetime` | The last datetime (ingestion time) that was exported successfully. |
| ExternalTableName | `string` | The external table name. |
| ForcedLatency | `timeSpan` | The forced latency timespan, if defined. Returns `Null` if no timespan is defined. |
| IntervalBetweenRuns | `timeSpan` | The interval between runs. |
| IsDisabled | `bool` | A boolean value indicating whether the continuous export is disabled. |
| IsRunning | `bool` | A boolean value indicating whether the continuous export is currently running. |
| LastRunResult | `string` | The results of the last continuous-export run (`Completed` or `Failed`). |
| LastRunTime | `datetime` | The last time the continuous export was executed (start time) |
| Name | `string` | The name of the continuous export. |
| Query | `string` | The export query. |
| StartCursor | `string` | The starting point of the first execution of this continuous export. |

## Related content

* [External tables](../../query/schema-entities/external-tables.md)
* [Create or alter continuous export](create-alter-continuous.md)
* [Disable or enable continuous export](disable-enable-continuous.md)
* [Drop continuous export](drop-continuous-export.md)
* [Show continuous export failures](show-continuous-failures.md)
