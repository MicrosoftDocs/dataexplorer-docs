---
title: .alter table and .alter-merge table - Azure Data Explorer
description: This article describes the .alter table and .alter-merge table commands.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/17/2020
---
# .alter table and .alter-merge table

The `.alter table` command sets a new column schema, `docstring`, and folder to an existing table, overwriting the existing column schema, `docstring`, and folder.
Data in columns that are "preserved" by the command is secured.
The command can be used, for example, to reorder the columns of a table.

The `.alter-merge table` command adds new columns, `docstring`, and folder, to an existing table. Data in existing columns is secured.

Both commands must run in the context of a specific database that scopes the table name.

Requires [Table Admin permission](../management/access-control/role-based-authorization.md).

**Syntax**

`.alter` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

`.alter-merge` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

Specify the columns that the table should have after a successful completion.

> [!WARNING]
> Using the `.alter` command incorrectly may lead to data loss.
> Carefully read the differences between `.alter` and `.alter-merge` below.

`.alter-merge`.

 * Columns that don't exist and which you specify, are added at the end of the existing schema.
 * If the passed schema doesn't contain some table columns, the columns won't be deleted.
 * If you specify an existing column with a different type, the command will fail.

`.alter` only (not `.alter-merge`).

 * The table will have exactly the same columns, in the same order, as specified.
 * If existing columns are not specified in the command, they will be dropped and data in them will be lost, like with the `.drop column` command.
 * When you alter a table, altering a column type is not supported. Use the.alter column](alter-column.md) command instead.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.

Both commands will affect the data.

* Existing data is not physically modified by these commands. Data in removed columns is ignored. Data in new columns is assumed to be null.
* Depending on how the cluster is configured, data ingestion might modify the table's column schema, even without user interaction. 
When you make changes to a table's column schema, ensure that ingestion will not add needed columns that the command will then remove.

> [!WARNING]
> Data ingestion processes into the table that modify the table's column schema, and that occur in parallel with the `.alter table` command, might be performed agnostic to the order of table columns. There is also a risk that data will be ingested into the wrong columns. Prevent these issues by stopping ingestion during such commands, or by making sure that such ingestion operations always use a mapping object.

**Examples**

```kusto
.alter table MyTable (ColumnX:string, ColumnY:int) 
.alter table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
.alter-merge table MyTable (ColumnX:string, ColumnY:int) 
.alter-merge table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```
