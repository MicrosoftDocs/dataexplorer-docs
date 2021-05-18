---
title: show external table control command - Azure Data Explorer
description: This article describes the show external table control command in Azure Data Explorer 
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/18/2021
---
# .show external tables

Returns all external tables in the database (or a specific external table).

Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

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
