---
title: .show external table schema command
description: Learn how to use the `.show external table schema` command to show the schema of the external table as JSON or CSL. 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/24/2023
---
# .show external table schema command

Returns the schema of the external table, as JSON or CSL.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/external-tables.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor, or External Table Admin permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `external` `table` *TableName* `schema` `as` (`json` | `csl`)

`.show` `external` `table` *TableName* `cslschema`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the schema.|

## Returns

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
