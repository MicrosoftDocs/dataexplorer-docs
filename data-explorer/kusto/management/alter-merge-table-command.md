---
title: .alter-merge table - Azure Data Explorer
description: This article describes the .alter-merge table command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/29/2022
---
# .alter-merge table

The `.alter-merge table` command:

* Secures data in existing columns
* Adds new columns, `docstring`, and folder to an existing table
* Must run in the context of a specific database that scopes the table name
* Requires [Table Admin permission](../management/access-control/role-based-authorization.md)

## Syntax

`.alter-merge` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter. |
| *columnName* | string | &check; | The name of an existing or new column. |
| *columnType* | string | &check; | The type of data in the specified column. |
| *Documentation* | string | | Free text describing the entity to be added. This string is presented in various UX settings next to the entity names. |
| *FolderName* | string | | The name of the folder to add to the table. |

> [!NOTE]
> If you try to alter a column type, the command will fail. Use the [`.alter column`](alter-column.md) command instead.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.

## How the command affects the data

* Existing data isn't modified or deleted
* New columns are added to the end of the schema
* Data in new columns is assumed to be null

## Examples

```kusto
.alter-merge table MyTable (ColumnX:string, ColumnY:int) 
.alter-merge table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```

## See also

The `.alter-merge` has a counterpart, the `.alter` table command that has similar functionality. For more information, see [`.alter table`](../management/alter-table-command.md).
