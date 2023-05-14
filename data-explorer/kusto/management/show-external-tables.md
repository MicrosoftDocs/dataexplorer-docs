---
title: show external table control command - Azure Data Explorer
description: This article describes the show external table control command in Azure Data Explorer 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/08/2023
---
# .show external tables

Returns all external tables in the database (or a specific external table).

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Permissions

You must have at least Database User, Database Viewer, Database Monitor to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `external` `tables`

`.show` `external` `table` *TableName*

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
