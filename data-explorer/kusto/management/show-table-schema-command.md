---
title: .show table schema command
description: Learn how to use the `.show table schema` command to display the specified table's schema.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show table schema command

Gets the schema to use in create/alter commands and additional table metadata.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

Get the schema to use in create/alter commands and additional table metadata:

`.show` `table` *TableName* `cslschema`

Get the schema in JSON format and additional table metadata:

`.show` `table` *TableName* `schema` `as` `json`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the schema.|

## Returns

| Output parameter | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | `string` | The name of the table.                                    |
| Schema           | `string` | The table schema either as should be used for table create/alter or in JSON format|
| DatabaseName     | `string` | The database to which the table belongs                   |
| Folder           | `string` | Table's folder                                            |
| DocString        | `string` | Table's docstring                                         |
