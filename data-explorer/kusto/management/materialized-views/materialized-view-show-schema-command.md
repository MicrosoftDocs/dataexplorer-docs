---
title: show materialized-view schema commands - Azure Data Explorer
description: This article describes show materialized-view schema commands in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .show materialized-view schema

Displays the schema of the materialized view in CSL/JSON.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `cslschema`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `json`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `csl`

## Parameters

| Name                   | Type   | Required | Description                 |
|------------------------|--------|----------|-----------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name. |

### Returns

| Name             | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | string | The name of the materialized view.                        |
| Schema           | string | The materialized view csl or json schema.                 |
| DatabaseName     | string | The database to which the materialized view belongs.      |
| Folder           | string | Materialized view's folder.                               |
| DocString        | string | Materialized view's docstring.                            |

## Examples

### Show CSL schema of one materialized view

The following two commands are equivalent and both display the CSL schema of materialized view ViewName:

```kusto
.show materialized-view ViewName cslschema
.show materialized-view ViewName schema as csl
```

**Output:**

| TableName | Schema                                      | DatabaseName | Folder  | DocString |
|-----------|---------------------------------------------|--------------|---------|-----------|
| ViewName  | Column3:int,Column1:string,Column2:datetime | MyDatabase   |         |           |

### Show JSON schema of one materialized view

The following command displays the JSON schema of materialized view ViewName:

```kusto
.show materialized-view ViewName schema as json
```

**Output:**

| TableName | Schema                                                                                                                                                                                                                        | DatabaseName | Folder  | DocString |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|---------|-----------|
| ViewName  | {"Name":"ViewName","OrderedColumns":[{"Name":"Column3","Type":"System.Int32","CslType":"int"},{"Name":"Column1","Type":"System.String","CslType":"string"},{"Name":"Column2","Type":"System.DateTime","CslType":"datetime"}]} | MyDatabase   |         |           |
