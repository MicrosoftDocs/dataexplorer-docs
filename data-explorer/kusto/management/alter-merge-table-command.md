---
title: .alter-merge table - Azure Data Explorer
description: This article describes the .alter-merge table command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/05/2021
---
# .alter-merge table

The `.alter-merge table` command:

* Secures data in existing columns
* Adds new columns, `docstring`, and folder to an existing table
* Must run in the context of a specific database that scopes the table name
* Requires [Table Admin permission](../management/access-control/role-based-authorization.md)

> [!WARNING]
> Using the `.alter-merge` command incorrectly may lead to data loss.

## Syntax

`.alter-merge` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *TableName* | string | &check; | Name of the table to alter. |
| *coulmnName*:*coulmnType* | string | &check; | Name of a column mapped to the type of data in that column. |
| *Documentation* | string | | Free text describing the entity. This string is presented in various UX settings next to the entity names. |
| *FolderName* | string | | Name of folder to add ... ? |

> [!NOTE]
>
> * If you specify a column that does not exist, it will be added at the end of the existing schema.
> * If the passed schema doesn't contain some table of the columns, the columns won't be deleted.
> * If you specify an existing column with a different type, the command will fail.

## How will the command affect the data?

* Existing data isn't physically modified by the command.
* Data in removed columns is ignored.
* Data in new columns is assumed to be null.
* Depending on how the cluster is configured, data ingestion might modify the table's column schema, even without user interaction. When you make changes to a table's column schema, ensure that ingestion won't add needed columns that the command will then remove.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.

## Examples

```kusto
.alter-merge table MyTable (ColumnX:string, ColumnY:int) 
.alter-merge table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```

## See also

The `.alter-merge` has a counterpart, the `.alter` table command that has similar functionality. For more information, see [`.alter table`](../management/alter-table-command.md).
