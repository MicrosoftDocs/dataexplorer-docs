---
title: columnifexists() - Azure Data Explorer | Microsoft Docs
description: This article describes columnifexists() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# columnifexists()

Takes a column name as a string or its zero based index and a default value. Returns a reference to the column if it exists, 
otherwise - returns the default value.

**Syntax**

`columnifexists(`*columnName*`, `*defaultValue*)

`columnifexists(`*columnZeroBasedIndex*`, `*defaultValue*)

**Arguments**

* *columnName*: The name of the column
* *columnZeroBasedIndex*: The zero based index of the column
* *defaultValue*: The value to use if the column doesn't exist in the context that the function was used in.
				  This value can be any scalar expression (e.g. a reference to another column).

**Returns**

If *columnName* exists, then the column it refers to. Otherwise - *defaultValue*.

If *columnZeroBasedIndex* exists, then the column it refers to. Otherwise - *defaultValue*.

**Examples**

```kusto
.create function with (docstring = "Wraps a table query that allows querying the table even if columnName doesn't exist ", folder="My Functions")
ColumnOrDefault(tableName:string, columnName:string)
{
	// There's no column "Capital" in "StormEvents", therefore, the State column will be used instead
	table(tableName) | project columnifexists(columnName, State)
}

.create function with (docstring = "Wraps a table query that allows querying the table even if columnIndex doesn't exist ", folder="My Functions")
ColumnIndexOrDefault(tableName:string, columnIndex:long)
{
    // There's no column with index 100 in "StormEvents", therefore, the State column will be used instead
	table(tableName) | project columnifexists(columnIndex, State)
}


ColumnOrDefault("StormEvents", "Captial");
ColumnOrDefault(100, "Captial")
```