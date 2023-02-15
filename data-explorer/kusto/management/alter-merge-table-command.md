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
* Requires [Table Admin permission](./access-control/role-based-access-control.md)

## Syntax

`.alter-merge` `table` *TableName* `(`*ColumnName*`:`*ColumnType* [`,` ...]`)`  [`with` `(`*PropertyName* `=` *PropertyValue*`)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter. |
| *ColumnName*, *ColumnType* | string | &check; | The name of an existing or new column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of properties. See [supported properties](#supported-properties) to learn more about the optional property values.|

> [!NOTE]
> If you try to alter a column type, the command will fail. Use [`.alter column`](alter-column.md) instead.

> [!TIP]
> Use `.show table [TableName] cslschema` to get the existing column schema before you alter it.

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

## See also

Use the `.alter` table command when you wish to further redefine the table settings. For more information, see [.alter table](../management/alter-table-command.md).
