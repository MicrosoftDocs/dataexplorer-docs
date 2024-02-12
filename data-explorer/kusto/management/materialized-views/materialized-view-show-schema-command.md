---
title:  .show materialized-view schema commands
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

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view. |

### Returns

| Name             | Type   | Description                                          |
|------------------|--------|------------------------------------------------------|
| TableName        | `string` | Name of the materialized view.                       |
| Schema           | `string` | CSL or JSON schema of the materialized view.         |
| DatabaseName     | `string` | Database that the materialized view belongs to.      |
| Folder           | `string` | Folder under which the materialized view is created. |
| DocString        | `string` | Description assigned to the materialized view.       |

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
