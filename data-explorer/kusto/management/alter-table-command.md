---
title: .alter table - Azure Data Explorer
description: This article describes the .alter table command.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 06/08/2020
---
# .alter table
 
The `.alter table` command:
* Secures data in "preserved" columns
* Reorders table columns
* Sets a new column schema, `docstring`, and folder to an existing table, overwriting the existing column schema, `docstring`, and folder
* Must run in the context of a specific database that scopes the table name
* Requires [Table Admin permission](../management/access-control/role-based-authorization.md)

> [!WARNING]
> Using the `.alter` command incorrectly may lead to data loss.

> [!TIP]
> The `.alter` has a counterpart, the `.alter-merge` table command that has similar functionality. For more information, see [.alter-merge table](../management/alter-merge-table-command.md)

**Syntax**

`.alter` `table` *TableName* (*columnName*:*columnType*, ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]


 * The table will have exactly the same columns, in the same order, as specified.
 Specify the table columns:
 * If existing columns aren't specified in the command, they'll be dropped and data in them will be lost, like with the `.drop column` command.
 * When you alter a table, altering a column type isn't supported. Use the [.alter column](alter-column.md) command instead.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.


How will the command affect the data?
* Existing data isn't physically modified by the command. Data in removed columns is ignored. Data in new columns is assumed to be null.
* Depending on how the cluster is configured, data ingestion might modify the table's column schema, even without user interaction. When you make changes to a table's column schema, ensure that ingestion won't add needed columns that the command will then remove.

> [!WARNING]
> Data ingestion processes into the table that modify the table's column schema, and that occur in parallel with the `.alter table` command, might be performed agnostic to the order of table columns. There is also a risk that data will be ingested into the wrong columns. Prevent these issues by stopping ingestion during the command, or by making sure that such ingestion operations always use a mapping object.

**Examples**

```kusto
.alter table MyTable (ColumnX:string, ColumnY:int) 
.alter table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```
