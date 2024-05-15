---
title: Create and alter Azure SQL external tables
description: Learn how to create and alter an SQL external table.
ms.reviewer: urishapira
ms.topic: reference
ms.date: 06/28/2023
---

# Create and alter Azure SQL external tables

Creates or alters an Azure SQL [external table](../query/schema-entities/external-tables.md) in the database in which the command is executed.

> [!NOTE]
>
> * If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables.
> * Altering the schema of an external Azure SQL table is not supported.

## Supported Azure SQL external table types

1. SQL Server
2. MySQL
3. PostgreSQL
4. Cosmos DB

## Permissions

To `.create` requires at least [Database User](access-control/role-based-access-control.md) permissions and to `.alter` requires at least [Table Admin](access-control/role-based-access-control.md) permissions.

To `create` / `.alter` / `.create-or-alter` an external table using managed identity authentication requires [Database Admin](access-control/role-based-access-control.md) permissions. Currently, this is supported for SQL Server and Cosmos DB external tables.

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* `(`*Schema*`)` `kind` `=` `sql` [ `table` `=` *SqlTableName* ] `(`*SqlConnectionString*`)` [`with` `(` [ `sqlDialect` `=` *SqlDialect* ] `,` [ *Property* `,` ... ]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*TableName* | `string` |  :heavy_check_mark: | The name of the external table. The name must follow the rules for [entity names](../query/schema-entities/entity-names.md), and an external table can't have the same name as a regular table in the same database.|
|*Schema* | `string` |  :heavy_check_mark: | The external data schema is a comma-separated list of one or more column names and [data types](../query/scalar-data-types/index.md), where each item follows the format: *ColumnName* `:` *ColumnType*.|
|*SqlTableName*| `string` | | The name of the SQL table not including the database name. For example, "MySqlTable" and not "db1.MySqlTable". If the name of the table contains a period ("."), use ['Name.of.the.table'] notation.
</br></br>This specification is required for all types of tables except for Cosmos DB, as for Cosmos DB the collection name is part of the connection string. |
|*SqlConnectionString*| `string` | :heavy_check_mark:| The connection string to the SQL server. |
|*SqlDialect*| `string` | |Indicates the type of Azure SQL external table. SQL Server is the default. For MySQL, specify `MySQL`. For PostgreSQL, specify `PostgreSQL`. For Cosmos DB, specify `CosmosDbSql`.|
|*Property*| `string` ||A key-value property pair in the format *PropertyName* `=` *PropertyValue*. See [optional properties](#optional-properties).|

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. For more information, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals).

### Optional properties

| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `folder`            | `string`        | The table's folder.                  |
| `docString`         | `string`        | A string documenting the table.      |
| `firetriggers`      | `true`/`false`  | If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information, see [BULK INSERT](/sql/t-sql/statements/bulk-insert-transact-sql) and [System.Data.SqlClient.SqlBulkCopy](/dotnet/api/system.data.sqlclient.sqlbulkcopy)) |
| `createifnotexists` | `true`/ `false` | If `true`, the target SQL table is created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column that is the primary key. The default is `false`.  |
| `primarykey`        | `string`        | If `createifnotexists` is `true`, the resulting column name is used as the SQL table's primary key if it's created by this command.                  |

## Authentication and authorization

To interact with an external Azure SQL table from Azure Data Explorer, you must specify authentication means as part of the *SqlConnectionString*. The *SqlConnectionString* defines the resource to access and its authentication information.

For more information, see [Azure SQL external table authentication methods](../api/connection-strings/sql-authentication-methods.md).

> [!NOTE]
> If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be performed either by username/password or managed identities.

## Examples

The following examples show how to create each type of Azure SQL external table.

### SQL Server

```kusto
.create external table MySqlExternalTable (x:long, s:string) 
kind=sql
table=MySqlTable
( 
   h@'Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;'
)
with 
(
   docstring = "Docs",
   folder = "ExternalTables", 
   createifnotexists = true,
   primarykey = x,
   firetriggers=true
)  
```

**Output**

| TableName   | TableType | Folder         | DocString | Properties                            |
|-------------|-----------|----------------|-----------|---------------------------------------|
| MySqlExternalTable | Sql       | ExternalTables | Docs      | {<br>  "TargetEntityKind": "sqltable`",<br>  "TargetEntityName": "MySqlTable",<br>  "TargetEntityConnectionString": "Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;",<br>  "FireTriggers": true,<br>  "CreateIfNotExists": true,<br>  "PrimaryKey": "x"<br>} |

### MySQL

```kusto
.create external table MySqlExternalTable (x:long, s:string) 
kind=sql
table=MySqlTable
( 
   h@'Server=myserver.mysql.database.windows.net;Port = 3306;UID = USERNAME;Pwd = PASSWORD;Database = mydatabase;'
)
with 
(
   sqlDialect = "MySql",
   docstring = "Docs",
   folder = "ExternalTables", 
)  
```

### PostgreSQL

```kusto
.create external table PostgreSqlExternalTable (x:long, s:string) 
kind=sql
table=PostgreSqlTable
( 
   h@'Host = hostname.postgres.database.azure.com; Port = 5432; Database= db; User Id=user; Password=pass; Timeout = 30;'
)
with 
(
   sqlDialect = "PostgreSQL",
   docstring = "Docs",
   folder = "ExternalTables", 
)  
```

### Cosmos DB

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

## Related content

* [External tables overview](../query/schema-entities/external-tables.md)
* [SQL external table authentication methods](../api/connection-strings/sql-authentication-methods.md)
* [Create and alter Azure Storage external tables](external-tables-azurestorage-azuredatalake.md)
