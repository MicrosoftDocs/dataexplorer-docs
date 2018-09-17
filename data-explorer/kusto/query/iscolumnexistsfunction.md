---
title: iscolumnexists() - Azure Data Explorer | Microsoft Docs
description: This article describes iscolumnexists() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# iscolumnexists()

Returns a boolean value indicating if the given string argument exists in the schema produced by the preceding tabular operator.

**Syntax**

`iscolumnexists(`*value*`)

**Arguments**

* *value*: A string

**Returns**

A boolean indicating if the given string argument exists in the schema produced by the preceding tabular operator.
**Examples**

```kusto
.create function with (docstring = "Returns a boolean indicating whether a column exists in a table", folder="My Functions")
DoesColumnExistInTable(tableName:string, columnName:string)
{
	table(tableName) | limit 1 | project ColumnExists = iscolumnexists(columnName) 
}

DoesColumnExistInTable("StormEvents", "StartTime")
```