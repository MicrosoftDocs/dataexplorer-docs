---
title: Create and alter PostgreSQL external tables
description: Learn how to create and alter a PostgreSQL external table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/26/2023
---

# Create and alter PostgreSQL external tables

Creates or alters a PostgreSQL [external table](../query/schema-entities/externaltables.md) in the database in which the command is executed.

## Permissions

To `.create` requires at least [Database User](../management/access-control/role-based-access-control.md) permissions and to `.alter` requires at least [Table Admin](../management/access-control/role-based-access-control.md) permissions.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* `(`*Schema*`)` `kind` `=` `sql` `table` `=` *SqlTableName* `(`*SqlServerConnectionString*`)` [`with` `( sqlDialect = PostgreSQL ,` [ *Property*`,` ... ]`)`]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the external table. The name must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.|
| *Schema* | string | &check; | The external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*.|
|*SqlTableName*| string | &check; | The name of the SQL table not including the database name. For example, "PostgreSqlTable" and not "db1.PostgreSqlTable". If the name of the table contains a period ("."), use ['Name.of.the.table'] notation.|
| *SqlConnectionString*| string |&check;| The connection string to the PostgreSQL Server. See the supported [SQL external table authentication methods](../api/connection-strings/sql-authentication-methods.md).|
|*Property*|string||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [Optional properties](#optional-properties). The `sqlDialect = PostgreSQL` specification is also a property but is required for the connection to succeed.|

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. For more information, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals).

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

The authentication method to access a PostgreSQL external table is based on the connection string provided during its creation, and the permissions required to access the table vary depending on the authentication method.

Currently, only connections strings containing username and password are supported.

## Example

```kusto
.create external table PostgreSqlExternalTable (x:long, s:string) 
kind=sql
table=PostgreSqlTable
( 
   h@'Host = hostname.postgres.database.azure.com; Port = 5432; Database= db}; User Id=user; Password==pass; Timeout = 30;'
)
with 
(
   sqlDialect = "PostgreSQL",
   docstring = "Docs",
   folder = "ExternalTables", 
)  
```

## Next steps

* [External tables overview](../query/schema-entities/externaltables.md)
* [Create and alter Azure Storage external tables](external-tables-azurestorage-azuredatalake.md)
