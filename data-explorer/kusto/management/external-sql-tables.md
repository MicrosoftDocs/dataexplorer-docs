---
title: Create and alter SQL Server external tables - Azure Data Explorer
description: This article describes how to create and alter external tables based on SQL Server tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/24/2020
---

# Create and alter SQL Server external tables

Creates or alters an external SQL table in the database in which the command is executed.  

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* ([columnName:columnType], ...)  
`kind` `=` `sql`  
`table` `=` *SqlTableName*  
`(`*SqlServerConnectionString*`)`  
[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]

## Parameters

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.
* *SqlTableName* - The name of the SQL table. Not including the database name (example: "MySqlTable" and not "db1.MySqlTable"). If the name of the table contains a period (".") you can use ['Name.of.the.table'] notation.
* *SqlServerConnectionString* - The connection string to the SQL Server. See the supported [SQL authentication methods](../api/connection-strings/sql-authentication-methods.md).

> [!NOTE]
> * If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be performed either by UserName/Password or Managed Identities.
> * When creating or altering an external table using managed identity authentication, [All Databases admin permission](./access-control/role-based-access-control.md) is required.

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. For more information, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals).

## Optional properties

| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `folder`            | `string`        | Table's folder.                      |
| `docString`         | `string`        | String documenting the table.        |
| `firetriggers`      | `bool`          | If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information, see [BULK INSERT](/sql/t-sql/statements/bulk-insert-transact-sql) and [System.Data.SqlClient.SqlBulkCopy](/dotnet/api/system.data.sqlclient.sqlbulkcopy)) |
| `createifnotexists` | `bool`          | If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column that is the primary key. The default is `false`.  |
| `primarykey`        | `string`        | If `createifnotexists` is `true`, the column whose name matches the value provided in this property will be used as the SQL table's primary key if the table is created by this command.                  |

> [!NOTE]
> * If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables. 
> * Altering the schema or format of an external SQL table is not supported. 

Requires [database user permission](./access-control/role-based-access-control.md) for `.create` and [table admin permission](./access-control/role-based-access-control.md) for `.alter`. 
 
**Example** 

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

## Querying an external table of type SQL

Querying an external SQL table is supported. See [querying external tables](../../data-lake-query-data.md). 

> [!Note]
> SQL external table query implementation will execute `SELECT x, s FROM MySqlTable` statement, where `x` and `s` are external table column names. The rest of the query will execute on the Kusto side.

Consider the following external table query: 

```kusto
external_table('MySqlExternalTable') | count
```

Kusto will execute a `SELECT x, s FROM MySqlTable` query to the SQL database, followed by a count on Kusto side. 
In such cases, performance is expected to be better if written in T-SQL directly (`SELECT COUNT(1) FROM MySqlTable`) 
and executed using the [sql_request plugin](../query/sqlrequestplugin.md), instead of using the external table function. 
Similarly, filters are not pushed to the SQL query.  

Use the external table to query the SQL table when the query requires reading the entire table (or relevant columns) for further execution on Kusto side. 
When an SQL query can be optimized in T-SQL, use the [sql_request plugin](../query/sqlrequestplugin.md).

## Next steps

* [External tables overview](../query/schema-entities/externaltables.md)
* [Create and alter Azure Storage external tables](external-tables-azurestorage-azuredatalake.md)
