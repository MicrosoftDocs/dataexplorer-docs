---
title: .show external table command
description: Learn how to use the `.show external table` command to show the specified external tables in the database. 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/24/2023
---
# .show external table command

Returns a specified external table or all external tables in the database.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Permissions

You must have at least Database User, Database Viewer, Database Monitor to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `external` `tables`

`.show` `external` `table` *TableName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the external table to show.|

## Returns

| Output parameter | Type   | Description                                                         |
|------------------|--------|---------------------------------------------------------------------|
| TableName        | string | Name of external table                                             |
| TableType        | string | Type of external table                                              |
| Folder           | string | Table's folder                                                     |
| DocString        | string | String documenting the table                                       |
| Properties       | string | Table's JSON serialized properties (specific to the type of table) |

## Example

```kusto
.show external tables
.show external table T
```

| TableName | TableType | Folder         | DocString | Properties |
|-----------|-----------|----------------|-----------|------------|
| T         | Blob      | ExternalTables | Docs      | {}         |
