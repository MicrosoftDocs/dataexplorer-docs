---
title: .show table mirroring operations command
description: Learn how to use the `.show table mirroring operations` command to check the mirroring policy operations.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric"
---
# .show table mirroring operations command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)]

Check the table's [mirroring policy](mirroring-policy.md) operations mirroring status. Mirroring status allows you to verify the latency and status of your data export.

## Syntax

`.show` `table` *TableName* `operations` `mirroring-status`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the mirroring status.|

## Returns

| Property | Type | Description |
|-----|-----|-----|
|TableName | `string` | The name of the table. |
|IsEnabled | `bool` | A boolean value indicating whether or not the mirroring policy is enabled. |
|ExportProperties |`string` | A JSON string with various data export properties. |
|IsExportRunning | `bool` | A boolean value indicating whether or not the mirroring policy is running. |
|LastExportStartTime | `datetime`| The start time of the last export. |
|LastExportResult | `string` | The status of the last export result. |
|LastExportedDataTime|`datetime` | The time of the last data export.  |
|Latency | `timespan` |The maximum amount of time in minutes between the last and next time new data was added to your logical copy.  |

## Example

The following example requests operations mirroring status of the *myTable* table.

```kusto
.show table myTable operations mirroring-status 
```
