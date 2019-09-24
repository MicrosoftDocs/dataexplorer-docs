---
title: Export data to SQL - Azure Data Explorer | Microsoft Docs
description: This article describes Export data to SQL in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/18/2019
---
# Export data to SQL

It is possible to run a query and have its results sent
to a table in a SQL database, such as a SQL database hosted by
the Azure SQL Database service.

**Syntax**

`.export` [`async`] `to` `sql` *SqlTableName* *SqlConnectionString* [`with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]
 `<|` *Query*

Where:
* *async*: If specified, indicates that the command runs in asynchronous mode.
* *SqlTableName* is the name of the table in the SQL database to INSERT the data
  into. To protect against injection attacks, this name is restricted, as described
  below.
* *SqlConnectionString* is a `string` literal that follows the `ADO.NET`
  connection string format and describes the SQL endpoint and database
  to connect to. For security reasons, the connection string is restricted,
  as described below.
* *PropertyName*, *PropertyValue* are pairs of a name (identifier) and a value
  (string literal), as described below.

Properties:

|Name               |Values           |Description|
|-------------------|-----------------|-----------|
|`firetriggers`     |`true` or `false`|If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. (For more information see [BULK INSERT](https://msdn.microsoft.com/en-us/library/ms188365.aspx) and [System.Data.SqlClient.SqlBulkCopy](https://msdn.microsoft.com/en-us/library/system.data.sqlclient.sqlbulkcopy(v=vs.110).aspx))|
|`createifnotexists`|`true` or `false`|If `true`, the target SQL table will be created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column which is the primary key. The default is `false`.|
|`primarykey`       |                 |If `createifnotexists` is `true`, indicates the name of the column in the result that will be used as the SQL table's primary key if it is created by this command.|
|`persistDetails`|`bool`  |Indicates that the command should persist its results (see `async` flag). Defaults to `true` in async runs, but can be turned off if the caller does not require the results). Defaults to `false` in synchronous executions, but can be turned on in those as well. |


**Limitations and restrictions**

There are a number of limitations and restrictions when exporting data to a SQL database:

1. Kusto is a cloud service, so that connection string must point to a
   database that is accessible from the cloud. (In particular, one cannot
   export to an on-premises database since it is not accessible from the public
   cloud.)

2. Kusto supports Active Directory Integrated authentication when the calling
   principal is an Azure Active Directory principal (`aaduser=` or `aadapp=`).
   Alternatively, Kusto also supports providing the credentials for the SQL
   database as part of the connection string. Other methods of authentication
   are not supported. In particular, the identity being presented to the SQL
   database always emanates from the command caller; it is never the Kusto service
   identity itself.

3. If the target table in the SQL database exists, it must match the query result
   schema. Note that in some cases (such as Azure SQL Database) this means
   that the table has one column marked as an identity column.

4. Exporting large volumes of data may take a long time. It is recommended that
   the target SQL table be set for minimal logging during bulk import.
   See [SQL Server Database Engine > ... > Database Features > Bulk Import and Export of Data](https://msdn.microsoft.com/en-us/library/ms190422.aspx).

5. Data export is performed using SQL bulk copy and provides no transactional guarantees on the target
   SQL database. See [Transaction and Bulk Copy Operations](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/sql/transaction-and-bulk-copy-operations)
   for more details.

6. The SQL table name is restricted to a name consisting of letters, digits,
   as well as spaces, underscores (`_`), dots (`.`) and hyphens (`-`).

7. The SQL connection string is restricted as follows: `Persist Security Info`
   is explicitly set to `false`, `Encrypt` is set to `true`, and `Trust Server Certificate`
   is set to `false`.

8. The primary key property on the column can be specified when creating
   a new SQL table. If the
   column is of type `string`, then SQL might refuse to create the
   table due to other limitations on the primary key column, in which
   case the workaround is to manually create the table in SQL before
   exporting data to it. (Technically, the reason is that primary key
   columns in SQL cannot be of unlimited size, but Kusto table columns
   have no declared size limitations.)

**Azure DB AAD Integrated Authentication Documentation**

* [Use Azure Active Directory Authentication for authentication with SQL Database](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-aad-authentication)
* [Azure AD authentication extensions for Azure SQL DB and SQL DW tools] (https://azure.microsoft.com/en-us/blog/azure-ad-authentication-extensions-for-azure-sql-db-and-sql-dw-tools/)

**Examples** 

In this example, Kusto runs the query and then exports the first recordset produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.

```kusto 
.export async to sql MySqlTable
    h@"Server=tcp:myserver.database.windows.net,1433;Database=MyDatabase;Authentication=Active Directory Integrated;Connection Timeout=30;"
    <| print Id="d3b68d12-cbd3-428b-807f-2c740f561989", Name="YSO4", DateOfBirth=datetime(2017-10-15)
```

In this example, Kusto runs the query and then exports the first recordset produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.
If the target table does not exist in the target database, it is created.

```kusto 
.export async to sql ['dbo.MySqlTable']
    h@"Server=tcp:myserver.database.windows.net,1433;Database=MyDatabase;Authentication=Active Directory Integrated;Connection Timeout=30;"
    with (createifnotexists="true", primarykey="Id")
    <| print Message = "Hello World!", Timestamp = now(), Id=12345678
```