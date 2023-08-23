---
title:  Export data to SQL
description: This article describes Export data to SQL in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/20/2023
---
# Export data to SQL

Export data to SQL allows you to run a query and have its results sent to a table in an SQL database, such as an SQL database hosted by the Azure SQL Database service.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.export` [`async`] `to` `sql` *sqlTableName* *sqlConnectionString* [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *query*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`|string||If specified, the command runs asynchronously.|
|*SqlTableName*|string|&check;|The name of the SQL database table into which to insert the data. To protect against injection attacks, this name is restricted.|
|*SqlConnectionString*|string|&check;|The connection string for the SQL endpoint and database. The string must follow the `ADO.NET` connection string format. For security reasons, the connection string is restricted.|
|*PropertyName*, *PropertyValue*|string||A list of optional [properties](#properties).|

## Properties

|Name               |Values           |Description|
|-------------------|-----------------|-----------|
|`firetriggers`     |`true` or `false`|If `true`, instructs the target system to fire INSERT triggers defined on the SQL table. The default is `false`. For more information, see [BULK INSERT](/sql/t-sql/statements/bulk-insert-transact-sql) and [System.Data.SqlClient.SqlBulkCopy](/dotnet/api/system.data.sqlclient.sqlbulkcopy).|
|`createifnotexists`|`true` or `false`|If `true`, the target SQL table is created if it doesn't already exist; the `primarykey` property must be provided in this case to indicate the result column that is the primary key. The default is `false`.|
|`primarykey`       |                 |If `createifnotexists` is `true`, this property indicates the name of the column in the result that will be used as the SQL table's primary key if it's created by this command.|
|`persistDetails`   |`bool`           |Indicates that the command should persist its results (see `async` flag). Defaults to `true` in async runs, but can be turned off if the caller doesn't require the results). Defaults to `false` in synchronous executions, but can be turned on. |
|`token`            |`string`         |The Azure AD access token that Kusto will forward to the SQL endpoint for authentication. When set, the SQL connection string shouldn't include authentication information like `Authentication`, `User ID`, or `Password`.|

## Authentication and authorization

The authentication method is based on the connection string provided, and the permissions required to access the SQL database vary depending on the authentication method.

The supported authentication methods for exporting data to SQL are [Azure AD-integrated (impersonation) authentication](../../api/connection-strings/sql-authentication-methods.md#azure-ad-integrated-impersonation) and [username/password authentication](../../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token). For impersonation authentication, be sure that the principal has the following permissions on the database:

* Existing table: table UPDATE and INSERT
* New table: CREATE, UPDATE, and INSERT

## Limitations and restrictions

There are some limitations and restrictions when exporting data to an SQL database:

1. Kusto is a cloud service, so the connection string must point to a
   database that is accessible from the cloud. (In particular, one can't
   export to an on-premises database since it's not accessible from the public
   cloud.)

2. Kusto supports Active Directory Integrated authentication when the calling
   principal is an Azure Active Directory principal (`aaduser=` or `aadapp=`).
   Alternatively, Kusto also supports providing the credentials for the SQL
   database as part of the connection string. Other methods of authentication
   aren't supported. The identity being presented to the SQL
   database always emanates from the command caller not the Kusto service
   identity itself.

3. If the target table in the SQL database exists, it must match the query result
   schema. Note that in some cases (such as Azure SQL Database) this means
   that the table has one column marked as an identity column.

4. Exporting large volumes of data may take a long time. It's recommended that
   the target SQL table is set for minimal logging during bulk import.
   See [SQL Server Database Engine > ... > Database Features > Bulk Import and Export of Data](/sql/relational-databases/import-export/prerequisites-for-minimal-logging-in-bulk-import).

5. Data export is performed using SQL bulk copy and provides no transactional guarantees on the target SQL database. See [Transaction and Bulk Copy Operations](/dotnet/framework/data/adonet/sql/transaction-and-bulk-copy-operations).

6. The SQL table name is restricted to a name consisting of letters, digits, spaces, underscores (`_`), dots (`.`) and hyphens (`-`).

7. The SQL connection string is restricted as follows: `Persist Security Info`
   is explicitly set to `false`, `Encrypt` is set to `true`, and `Trust Server Certificate`
   is set to `false`.

8. The primary key property on the column can be specified when creating
   a new SQL table. If the column is of type `string`, then SQL might refuse to create the
   table due to other limitations on the primary key column. The workaround is to manually create the table in SQL before exporting the data. The reason for this limitation is that primary key columns in SQL can't be of unlimited size, but Kusto table columns
   have no declared size limitations.

## Azure DB Azure AD Integrated Authentication Documentation

* [Use Azure Active Directory Authentication for authentication with SQL Database](/azure/sql-database/sql-database-aad-authentication)
<!-- * [Azure AD authentication extensions for Azure SQL DB and SQL DW tools](https://azure.microsoft.com/blog/azure-ad-authentication-extensions-for-azure-sql-db-and-sql-dw-tools/) -->

## Examples

In this example, Kusto runs the query and then exports the first record set produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.

```kusto 
.export async to sql MySqlTable
    h@"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;Connection Timeout=30;"
    <| print Id="d3b68d12-cbd3-428b-807f-2c740f561989", Name="YSO4", DateOfBirth=datetime(2017-10-15)
```

In this example, Kusto runs the query and then exports the first record set produced by the query to the `MySqlTable` table in the `MyDatabase` database in server `myserver`.
If the target table doesn't exist in the target database, it's created.

```kusto 
.export async to sql ['dbo.MySqlTable']
    h@"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=MyDatabase;Connection Timeout=30;"
    with (createifnotexists="true", primarykey="Id")
    <| print Message = "Hello World!", Timestamp = now(), Id=12345678
```
