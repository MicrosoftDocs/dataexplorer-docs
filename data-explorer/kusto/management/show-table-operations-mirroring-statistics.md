---
title: .show table operations mirroring-statistics
description: Learn how to use the `.show table operations mirroring-statistics` command to check the mirroring policy operations.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 04/22/2025
---
# .show table operations mirroring-statistics

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Displays [mirroring policy](mirroring-policy.md) operations statistics for a table. Mirroring statistics allows you to verify the latency and status of your data export.

## Syntax

`.show` `table` *TableName* `operations` `mirroring-statistics`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the operations mirroring statistics.|

## Returns

| Property | Type | Description |
|-----|-----|-----|
|TableName | `string` | The name of the table. |
|IsEnabled | `bool` |Indicates whether or not the mirroring policy is enabled. |
|ManagedIdentityIdentifier |`string`  The identifier of the managed identity |
|IsExportRunning | `bool` | Indicates whether or not the mirroring policy is running. |
|LastExportStartTime | `datetime`| The start time of the last export. |
|LastExportResult | `string` | The status of the last export result. |
|LastExportedDataTime|`datetime` | The time of the last data export.  |
|Latency | `timespan` |The maximum amount of time in minutes between the last and next time new data was added to your logical copy.  |
|CompletionPercentage|`int` | The percentage of a task or operation completed. |
|PendingDataSize|`int` | The size of data in bytes that is pending ingestion or processing.|

[!INCLUDE [mirroring-note](../includes/mirroring-note.md)]

## Example

The following example requests operations mirroring-statistics of the *MTelemetry* table.

```kusto
.show table MTelemetry operations mirroring-statistics 
```

**Output**

| TableName | IsEnabled | ManagedIdentityIdentifier | IsExportRunning | LastExportStartTime | LastExportResult | LastExportedDataTime | Latency | CompletionPercentage | PendingDataSize |
|--|--|--|--|--|--|--|--|--|--|
| MTelemetry | true |  | false | 2025-04-09 18:42:37.3760 | Completed | 2025-04-09 16:47:07.8420 | 00:00:00 | 100 | 0 |