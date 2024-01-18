---
title: .clear table data command
description: Learn how to use the `.clear table data` command to clear data from an existing table.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 05/24/2023
---
# .clear table data command

Clears the data of an existing table, including streaming ingestion data.

> [!NOTE]
> In the event of a partial success or failure, an exception is thrown with detailed information about the error.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `table` *TableName* `data`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to clear the data.|

## Example

The following example clears all of the data in the table named `LyricsAsTable`.

```kusto
.clear table LyricsAsTable data 
```
