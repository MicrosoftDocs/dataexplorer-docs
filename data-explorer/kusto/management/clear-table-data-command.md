---
title: .clear table data - Azure Data Explorer
description: This article describes the `.clear table data` command in Azure Data Explorer.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 02/21/2023
---
# .clear table data

Clears the data of an existing table, including streaming ingestion data.

> [!NOTE]
> In the event of a partial success or failure, an exception is thrown with detailed information about the error.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `table` *TableName* `data`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to clear the data.|

## Example

The following example clears all of the data in the table named `LyricsAsTable`.

```kusto
.clear table LyricsAsTable data 
```
