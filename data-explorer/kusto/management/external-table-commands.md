---
title: Kusto External table general control commands - Azure Data Explorer
description: This article describes general external table control commands 
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/26/2020
---
# External table general control commands

See [external tables](../query/schema-entities/externaltables.md) for an overview of external tables. 
The following commands are relevant to _any_ external table (of any type).

## .show external tables

* Returns all external tables in the database (or a specific external table).
* Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `tables`

`.show` `external` `table` *TableName*

**Output**

| Output parameter | Type   | Description                                                         |
|------------------|--------|---------------------------------------------------------------------|
| TableName        | string | Name of external table                                             |
| TableType        | string | Type of external table                                              |
| Folder           | string | Table's folder                                                     |
| DocString        | string | String documenting the table                                       |
| Properties       | string | Table's JSON serialized properties (specific to the type of table) |


**Examples:**

```kusto
.show external tables
.show external table T
```

| TableName | TableType | Folder         | DocString | Properties |
|-----------|-----------|----------------|-----------|------------|
| T         | Blob      | ExternalTables | Docs      | {}         |


## .show external table schema

* Returns the schema of the external table, as JSON or CSL. 
* Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

**Syntax:** 

`.show` `external` `table` *TableName* `schema` `as` (`json` | `csl`)

`.show` `external` `table` *TableName* `cslschema`

**Output**

| Output parameter | Type   | Description                        |
|------------------|--------|------------------------------------|
| TableName        | string | Name of external table            |
| Schema           | string | The table schema in a JSON format |
| DatabaseName     | string | Table's database name             |
| Folder           | string | Table's folder                    |
| DocString        | string | String documenting the table      |

**Examples:**

```kusto
.show external table T schema as JSON
```

```kusto
.show external table T schema as CSL
.show external table T cslschema
```

**Output:**

*json:*

| TableName | Schema    | DatabaseName | Folder         | DocString |
|-----------|----------------------------------|--------------|----------------|-----------|
| T         | {"Name":"ExternalBlob",<br>"Folder":"ExternalTables",<br>"DocString":"Docs",<br>"OrderedColumns":[{"Name":"x","Type":"System.Int64","CslType":"long","DocString":""},{"Name":"s","Type":"System.String","CslType":"string","DocString":""}]} | DB           | ExternalTables | Docs      |


*csl:*

| TableName | Schema          | DatabaseName | Folder         | DocString |
|-----------|-----------------|--------------|----------------|-----------|
| T         | x:long,s:string | DB           | ExternalTables | Docs      |

## .drop external table

* Drops an external table 
* The external table definition can't be restored following this operation
* Requires [database admin permission](../management/access-control/role-based-authorization.md).

**Syntax:**  

`.drop` `external` `table` *TableName* [`ifexists`]

**Output**

Returns the properties of the dropped table. For more information, see [`.show external tables`](#show-external-tables).

**Examples:**

```kusto
.drop external table ExternalBlob
```

| TableName | TableType | Folder         | DocString | Schema       | Properties |
|-----------|-----------|----------------|-----------|-----------------------------------------------------|------------|
| T         | Blob      | ExternalTables | Docs      | [{ "Name": "x",  "CslType": "long"},<br> { "Name": "s",  "CslType": "string" }] | {}         |

## Next steps

* [Create and alter external tables in Azure Storage or Azure Data Lake](external-tables-azurestorage-azuredatalake.md)
* [Create and alter external SQL tables](external-sql-tables.md)
