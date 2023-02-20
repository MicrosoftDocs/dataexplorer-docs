---
title: .clear table data - Azure Data Explorer
description: This article describes the `.clear table data` command in Azure Data Explorer.
ms.reviewer: vrozov
ms.topic: reference
ms.date: 10/01/2020
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
