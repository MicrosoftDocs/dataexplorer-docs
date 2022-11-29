---
title: .alter table - Azure Data Explorer
description: This article describes the .alter table command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/29/2022
---
# .alter table

The `.alter table` command:

* Secures data in "preserved" columns
* Reorders table columns
* Sets a new column schema, `docstring`, and folder to an existing table, overwriting the existing column schema, `docstring`, and folder
* Must run in the context of a specific database that scopes the table name
* Requires [Table Admin permission](../management/access-control/role-based-authorization.md)

## Syntax

`.alter` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter. |
| *columnName* | string | &check; | The name of an existing or new column. |
| *columnType* | string | &check; | The type of data in the specified column. |
| *Documentation* | string | | Free text describing the entity to be added. This string is presented in various UX settings next to the entity names. |
| *FolderName* | string | | The name of the folder to add to the table. |

> [!WARNING]
> If existing columns aren't specified in the command, they'll be dropped. This could lead to unexpected data loss.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.

## How the command affects the data

* Existing data in the listed columns isn't modified
* Existing data in unlisted columns will be deleted
* New columns are added to the end of the schema
* Data in new columns is assumed to be null
* The table will have the same columns, in the same order, as specified

> [!NOTE]
> Altering a column type isn't supported. Use the [`.alter column`](alter-column.md) command instead.

> [!WARNING]
>
> * Data ingestion processes might disregard the order of table columns. If these processes occur in parallel with the `.alter table` command, you risk ingesting data into the wrong columns. To prevent this, stop ingestion during the command or make sure that the ingestion uses a mapping object.
> * Depending on how the cluster is configured, the table's column schema might be modified during ingestion. Be careful not to accidentally remove columns that were added during ingestion.

## Examples

```kusto
.alter table MyTable (ColumnX:string, ColumnY:int) 
.alter table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```

## See also

The `.alter` table command has a counterpart with similar functionality, the `.alter-merge` table command. For more information, see [`.alter-merge table`](../management/alter-merge-table-command.md).
