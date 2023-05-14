---
title: .clear table data - Azure Data Explorer
description: Learn how to use the `.clear table data` command to clear data from an existing table.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 02/21/2023
---
# .clear table data

Clears the data of an existing table, including streaming ingestion data.

`.clear` `table` *TableName* `data` 

> [!NOTE]
> In the event of a partial success or failure, an exception is thrown with detailed information about the error.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Example

```kusto
.clear table LyricsAsTable data 
```
