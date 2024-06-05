---
title:  .alter table command
description: This article describes the .alter table command.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .alter table command

The `.alter table` command:

* Secures data in "preserved" columns
* Reorders table columns
* Sets a new column schema, `docstring`, and folder to an existing table, overwriting the existing column schema, `docstring`, and folder
* Must run in the context of a specific database that scopes the table name

> [!WARNING]
> Using the `.alter` command incorrectly may lead to data loss.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *tableName* `(`*columnName*`:`*columnType* [`,` ...]`)`  [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | `string` |  :heavy_check_mark: | The name of the table to alter. |
| *columnName*, *columnType* | `string` |  :heavy_check_mark: | The name of an existing or new column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

> [!WARNING]
> Existing columns that aren't specified in the command will be dropped. This could lead to unexpected data loss.

> [!TIP]
> Use `.show table [tableName] cslschema` to get the existing table schema before you alter it.

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`| `string` |Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`| `string` |The name of the folder to add to the table.|

## How the command affects the data

* Existing data in columns listed in the command won't be modified
* Existing data in columns not listed in the command will be deleted
* New columns will be added to the end of the schema
* Data in new columns is assumed to be null
* The table will have the same columns, in the same order, as specified

> [!NOTE]
> If you try to alter a column type, the command will fail. Use [`.alter column`](alter-column.md) instead.

> [!WARNING]
>
> * Data ingestion that disregards the order of columns and occurs in parallel with `.alter table` risks ingesting data into the wrong columns. To prevent this, make sure that ingestion uses a mapping object or stop ingestion while running the `.alter table` command.
> * Data ingestion may modify a table's column schema. Be careful not to accidentally remove desired columns that were added during ingestion.

## Examples

```kusto
.alter table MyTable (ColumnX:string, ColumnY:int) 
.alter table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```

## Related content

Use `.alter-merge` when you wish to preserve the table settings and only override or expand certain columns. For more information, see [.alter-merge table](../management/alter-merge-table-command.md).
