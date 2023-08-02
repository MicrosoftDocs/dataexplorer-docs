---
title: .create-merge table command
description: Learn how to use the `.create-merge table` command to create a new table or extend an existing table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .create-merge table command

Creates a new table or extends an existing table.

The command must run in the context of a specific database.

## Permissions

This command requires [Database User](access-control/role-based-access-control.md) permissions, and [Table Admin](access-control/role-based-access-control.md) permissions for extending existing tables.

## Syntax

`.create-merge` `table` *tableName* `(`*columnName*`:`*columnType* [`,` ...]`)`  [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *tableName* | string | &check; | The name of the table to create or extend. |
| *columnName*, *columnType* | string | &check; | The name of an existing or new column mapped to the type of data in that column. The list of mappings defines the output column schema.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`|string|The name of the folder to add to the table.|

## Returns

If the table doesn't exist, functions exactly as `.create table` command.

If table T exists, and you send a `.create-merge table T (<columns specification>)` command, then:

* Any column in \<columns specification> that didn't previously exist in T will be added to the end of T's schema.
* Any column in T that isn't in \<columns specification> won't be removed from T.
* Any column in \<columns specification> that exists in T, but with a different data type will cause the command to fail.

## See also

* [`.create-merge tables`](create-merge-tables-command.md)
* [`.create table`](create-table-command.md)
