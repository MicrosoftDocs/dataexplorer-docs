---
title: .clear table data command
description: Learn how to use the `.clear table data` command to clear data from an existing table.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 08/11/2024
---
# .clear table data command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Clears the data of an existing table, including streaming ingestion data.

> [!NOTE]
> In the event of a partial success or failure, an exception is thrown with detailed information about the error.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `table` *TableName* `data`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to clear the data.|

## Example

The following example clears all of the data in the table named `LyricsAsTable`.

```kusto
.clear table LyricsAsTable data 
```
