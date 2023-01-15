---
title: show external table schema control command - Azure Data Explorer
description: This article describes the show external table schema control command in Azure Data Explorer 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/20/2021
---
# .show external table schema

Returns the schema of the external table, as JSON or CSL. 

Requires [Database monitor permission](./access-control/role-based-access-control.md). This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Syntax 

`.show` `external` `table` *TableName* `schema` `as` (`json` | `csl`)

`.show` `external` `table` *TableName* `cslschema`

## Output

| Output parameter | Type   | Description                        |
|------------------|--------|------------------------------------|
| TableName        | string | Name of external table            |
| Schema           | string | The table schema in a JSON format |
| DatabaseName     | string | Table's database name             |
| Folder           | string | Table's folder                    |
| DocString        | string | String documenting the table      |

## Examples

```kusto
.show external table T schema as json
```

```kusto
.show external table T schema as csl
.show external table T cslschema
```

### Example output

*json:*

| TableName | Schema    | DatabaseName | Folder         | DocString |
|-----------|----------------------------------|--------------|----------------|-----------|
| T         | {"Name":"ExternalBlob",<br>"Folder":"ExternalTables",<br>"DocString":"Docs",<br>"OrderedColumns":[{"Name":"x","Type":"System.Int64","CslType":"long","DocString":""},{"Name":"s","Type":"System.String","CslType":"string","DocString":""}]} | DB           | ExternalTables | Docs      |


*csl:*

| TableName | Schema          | DatabaseName | Folder         | DocString |
|-----------|-----------------|--------------|----------------|-----------|
| T         | x:long,s:string | DB           | ExternalTables | Docs      |

