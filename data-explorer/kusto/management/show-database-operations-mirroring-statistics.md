---
title: .show database operations mirroring-statistics
description: Learn how to use the `.show database operations mirroring statistics` command to check the mirroring policy operations.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 04/22/2025
---

# .show database operations mirroring-statistics

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Displays [mirroring policy](mirroring-policy.md) operations statistics for all tables in the database. Mirroring statistics allows you to verify the latency and status of your data export.

## Syntax

`.show` `database` *DatabaseName* `operations` `mirroring-statistics`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to show the operations mirroring statistics.|

## Returns

| Property | Type | Description |
|-----|-----|-----|
|DatabaseName| `string` | The name of the database. |
|CompletionPercentage|`int` | The status of the mirroring operation as a percentage. |
|PendingDataSize| `int` | The size of data in bytes that is pending ingestion or processing. |
|MaxLatency| `timespan`| The maximum amount of time in minutes between the last and next time new data was added to your logical copy. |
|NumOfTables| `int`| The number of tables in the database. |

[!INCLUDE [mirroring-note](../includes/mirroring-note.md)]

## Example

The following example requests operations mirroring statistics of the *Telemetry* database.

```kusto
.show database Telemetry operations mirroring-statistics 
```

**Output**

| DatabaseName                         | CompletionPercentage | PendingDataSize | MaxLatency | NumOfTables |
| ------------------------------------ | -------------------- | --------------- | ---------- | ----------- |
| 4145dac4-ee39-4ec2-aafb-11315b5b7c9b | 100                  | 0               | 00:00:00   | 1           |