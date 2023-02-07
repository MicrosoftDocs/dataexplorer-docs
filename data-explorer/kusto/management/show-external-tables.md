---
title: show external table control command - Azure Data Explorer
description: This article describes the show external table control command in Azure Data Explorer 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/20/2021
---
# .show external tables

Returns all external tables in the database (or a specific external table).

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or External Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `external` `tables`

`.show` `external` `table` *TableName*

## Output

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
