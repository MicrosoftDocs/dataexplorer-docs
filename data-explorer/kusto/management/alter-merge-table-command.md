---
title:  .alter-merge table command
description: Learn how to use the `.alter-merge table` command to secure data in existing columns or add new columns to an existing table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/20/2023
---
# .alter-merge table command

The `.alter-merge table` command:

* Secures data in existing columns
* Adds new columns, `docstring`, and folder to an existing table
* Must run in the context of a specific database that scopes the table name

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *tableName* `(`*columnName*`:`*columnType* [`,` ...]`)`  [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | string |  :heavy_check_mark: | The name of the table to alter. |
| *columnName*, *columnType* | string |  :heavy_check_mark: | The name of an existing or new column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

> [!NOTE]
> If you try to alter a column type, the command will fail. Use [`.alter column`](alter-column.md) instead.

> [!TIP]
> Use `.show table [tableName] cslschema` to get the existing column schema before you alter it.

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`|string|The name of the folder to add to the table.|

## How the command affects the data

* Existing data won't be modified or deleted
* New columns will be added to the end of the schema
* Data in new columns is assumed to be null

## Examples

```kusto
.alter-merge table MyTable (ColumnX:string, ColumnY:int) 
.alter-merge table MyTable (ColumnX:string, ColumnY:int) with (docstring = "Some documentation", folder = "Folder1")
```

## Related content

Use the `.alter` table command when you wish to further redefine the table settings. For more information, see [.alter table](../management/alter-table-command.md).
