---
title: .create-merge table - Azure Data Explorer
description: This article describes .create-merge table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/15/2023
---
# .create-merge table

Creates a new table or extends an existing table. 

The command must run in the context of a specific database. 

Requires [Database user permission](./access-control/role-based-access-control.md).

## Syntax

`.create-merge` `table` *TableName* `(`*ColumnName*`:`*ColumnType* [`,` ...]`)`  [`with` `(`*PropertyName* `=` *PropertyValue*`)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to create or extend. |
| *ColumnName*, *ColumnType* | string | &check; | The name of an existing or new column mapped to the type of data in that column. The list of these mappings defines the output column schema.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of properties. See [supported properties](#supported-properties) to learn more about the optional property values.|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|Free text describing the entity to be added. This string is presented in various UX settings next to the entity names.|
|`folder`|string|The name of the folder to add to the table.|

## Returns

If the table doesn't exist, functions exactly as `.create table` command.

If table T exists, and you send a `.create-merge table T (<columns specification>)` command, then:

* Any column in \<columns specification> that didn't previously exist in T will be added to the end of T's schema.
* Any column in T that is not in \<columns specification> won't be removed from T.
* Any column in \<columns specification> that exists in T, but with a different data type will cause the command to fail.

## See also

* [`.create-merge tables`](create-merge-tables-command.md)
* [`.create table`](create-table-command.md)
