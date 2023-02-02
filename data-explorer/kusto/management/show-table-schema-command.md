---
title: .show table schema - Azure Data Explorer
description: This article describes .show table schema in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/04/2020
---
# .show table schema

Gets the schema to use in create/alter commands and additional table metadata.

```kusto
.show table TableName cslschema 
```

| Output parameter | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | String | The name of the table.                                    |
| Schema           | String | The table schema as should be used for table create/alter |
| DatabaseName     | String | The database to which the table belongs                   |
| Folder           | String | Table's folder                                            |
| DocString        | String | Table's docstring                                         |

## Permissions

This command requires [Database User](../management/access-control/role-based-access-control.md) permissions.

## .show table schema as JSON

Gets the schema in JSON format and additional table metadata.

Requires [Database user permission](./access-control/role-based-access-control.md).

```kusto
.show table TableName schema as json
```

| Output parameter | Type   | Description                             |
|------------------|--------|-----------------------------------------|
| TableName        | String | The name of the table                   |
| Schema           | String | The table schema in JSON format         |
| DatabaseName     | String | The database to which the table belongs |
| Folder           | String | Table's folder                          |
| DocString        | String | Table's docstring                       |
