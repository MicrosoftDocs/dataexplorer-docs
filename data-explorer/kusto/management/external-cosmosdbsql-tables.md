---
title: Create and alter CosmosDB SQL external tables
description: Learn how to create and alter a CosmosDB SQL external table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/21/2023
---

# Create and alter CosmosDB SQL external tables

Creates or alters a CosmosDB SQL [external table](../query/schema-entities/externaltables.md) in the database in which the command is executed.

## Permissions

To `.create` requires at least [Database User](../management/access-control/role-based-access-control.md) permissions and to `.alter` requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* `(`*Schema`)` `kind` `=` `sql` `table` `=` *SqlTableName* `(`*SqlServerConnectionString*`)` [`with` `(`*Property* [`,` ... ]`)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the external table. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.|
| *Schema* | string | &check; | The external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*.|
| *SqlConnectionString*| string |&check;| The connection string to the CosmosDB SQL Server. See the supported [Cosmos DB authentication methods](../query/cosmosdb-plugin.md#authentication-and-authorization).|
|*Property*|string||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [optional properties](#optional-properties).|

> [!NOTE]
> If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be performed either by UserName/Password or Managed Identities.

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. For more information, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals).

## Mandatory property (If not specified, the external table is of type MsSql by default)
| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `sqlDialect`        | `string`        | The SQL type (CosmosDbSql)           |

## Optional properties
| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `folder`            | `string`        | The table's folder.                  |
| `docString`         | `string`        | A string documenting the table.      |


> [!NOTE]
>
> * If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.
> * Altering the schema or format of an external SQL table is not supported.

## Authentication and authorization

The authentication method to access a CosmosDB SQL external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

Currently, only connections strings containing username and password are supported.

## Example

```kusto
.create external table CosmosDBSQLExternalTable (x:long, s:string) 
kind=sql
( 
   h@'AccountEndpoint=https://cosmosdbacc.documents.azure.com/;Database=MyDatabase;Collection=MyCollection;AccountKey=' h'R8PM...;'
)
with 
(
   sqlDialect = "CosmosDbSQL",
   docstring = "Docs",
   folder = "ExternalTables", 
)  
```

## Next steps

* [External tables overview](../query/schema-entities/externaltables.md)
* [Create and alter Azure Storage external tables](external-tables-azurestorage-azuredatalake.md)
