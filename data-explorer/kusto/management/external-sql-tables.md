---
title: Create and alter external SQL tables - Azure Data Explorer
description: This article describes how to create and alter external SQL tables.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---

# Create and alter external SQL tables

Creates or alters an external SQL table in the database in which the command is executed.  

## Syntax

(`.create` | `.alter` | `.create-or-alter`) `external` `table` *TableName* ([columnName:columnType], ...)  
`kind` `=` `sql`  
`table` `=` *SqlTableName*  
`(`*SqlServerConnectionString*`)`  
[`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*], *property_name* `=` *value*`,`...`)`]

## Parameters

* *TableName* - External table name. Must follow the rules for [entity names](../query/schema-entities/entity-names.md). An external table can't have the same name as a regular table in the same database.
* *SqlTableName* - The name of the SQL table.
* *SqlServerConnectionString* - The connection string to the SQL server. Can be one of the following methods: 
  * *AAD-integrated authentication* (`Authentication="Active Directory Integrated"`): 
The user or application authenticates via AAD to Kusto, and the same token is then used to access the SQL Server network endpoint.
  * *Username/Password authentication* (`User ID=...; Password=...;`). If the external table is used for [continuous export](data-export/continuous-data-export.md), authentication must be performed by using this method. 

> [!WARNING]
> Connection strings and queries that include confidential information should be obfuscated so that they'll be omitted from any Kusto tracing. For more information, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals).

## Optional properties

| Property            | Type            | Description                          |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------|
| `folder`            | `string`        | The table's folder.                  |
| `docString`         | `string`        | A string documenting the table.      |
| `firetriggers`      | `true`/`false`  | If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information, see [BULK INSERT](https://msdn.microsoft.com/library/ms188365.aspx) and [System.Data.SqlClient.SqlBulkCopy](https://msdn.microsoft.com/library/system.data.sqlclient.sqlbulkcopy(v=vs.110).aspx)) |
| `createifnotexists` | `true`/ `false` | If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column that is the primary key. The default is `false`.  |
| `primarykey`        | `string`        | If `createifnotexists` is `true`, the resulting column name will be used as the SQL table's primary key if it is created by this command.                  |

> [!NOTE]
> * If the table exists, the `.create` command will fail with an error. Use `.create-or-alter` or `.alter` to modify existing tables. 
> * Altering the schema or format of an external SQL table is not supported. 

Requires [database user permission](../management/access-control/role-based-authorization.md) for `.create` and [table admin permission](../management/access-control/role-based-authorization.md) for `.alter`. 
 
**Example** 

```kusto
.create external table ExternalSql (x:long, s:string) 
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
| ExternalSql | Sql       | ExternalTables | Docs      | {<br>  "TargetEntityKind": "sqltable`",<br>  "TargetEntityName": "MySqlTable",<br>  "TargetEntityConnectionString": "Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;",<br>  "FireTriggers": true,<br>  "CreateIfNotExists": true,<br>  "PrimaryKey": "x"<br>} |

## Querying an external table of type SQL 

Querying an external SQL table is supported. See [querying external tables](../../data-lake-query-data.md). 

> [!Note]
> SQL external table query implementation will execute a full 'SELECT *' (or select relevant columns) from the SQL table. The rest of the query will execute on the Kusto side. 

Consider the following external table query: 

```kusto
external_table('MySqlExternalTable') | count
```

Kusto will execute a 'SELECT * from TABLE' query to the SQL database, followed by a count on Kusto side. 
In such cases, performance is expected to be better if written in T-SQL directly ('SELECT COUNT(1) FROM TABLE') 
and executed using the [sql_request plugin](../query/sqlrequestplugin.md), instead of using the external table function. 
Similarly, filters are not pushed to the SQL query.  

Use the external table to query the SQL table when the query requires reading the entire table (or relevant columns) for further execution on Kusto side. 
When an SQL query can be optimized in T-SQL, use the [sql_request plugin](../query/sqlrequestplugin.md).

## Next steps

* [External table general control commands](externaltables.md)
* [Create and alter external tables in Azure Storage or Azure Data Lake](external-tables-azurestorage-azuredatalake.md)
