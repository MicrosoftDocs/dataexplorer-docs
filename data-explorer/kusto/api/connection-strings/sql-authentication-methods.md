---
title:  SQL external table authentication methods
description: This article describes how to authenticate to SQL external tables in Azure Data Explorer.
ms.reviewer: urishapira
ms.topic: reference
ms.date: 06/28/2023
---
# SQL external table authentication methods

The connection string provided upon creation of a SQL external table defines the resource to access and its authentication information. Supported SQL external table types include Microsoft SQL Server, MySQL, PostgreSQL, and Cosmos DB. For information on how to manage SQL external tables, see [Create and alter SQL external tables](../../management/external-sql-tables.md).

## Supported authentication methods by table type

The following table shows the supported authentication methods by external table type.

| Authentication method | SQL Server | PostgreSQL | MySQL | Cosmos DB |
|--|--|--|--|
| [Azure AD-integrated (impersonation)](#azure-ad-integrated-impersonation) | :heavy_check_mark: | :x: | :x: | :x: |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :x: | :x: | :x: |
| [Username and Password](#username-and-password) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

## Azure AD-integrated (impersonation)

With this authentication method, the user or application authenticates via Azure AD to Azure Data Explorer, and the same token is then used to access the SQL Server network endpoint. This method is only supported for SQL Server.

To use Azure AD-integrated authentication (impersonation), add `;Authentication="Active Directory Integrated"` to the SQL connection string.

|Example|
|--|
|`"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;"`|

The principal must have the [necessary permissions on the SQL database](#additional-required-permissions) to perform the operation. To manage the access controls for different storage types, see [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

## Managed identity

Azure Data Explorer makes requests on behalf of a managed identity and uses its identity to access resources. This method is only supported for SQL Server.

For a system-assigned managed identity, append `;Authentication="Active Directory Managed Identity"` to the connection string. For a user-assigned managed identity, append `;Authentication="Active Directory Managed Identity";User Id={object_id}` to the connection string.

|Managed identity type|Example|
|--|--|--|
|System-assigned|`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";Initial Catalog=mydatabase;"`|
|User-assigned|`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";User Id=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b;Initial Catalog=mydatabase;"`|

The managed identity must have the [necessary permissions on the SQL database](#additional-required-permissions) to perform the operation. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

## Username and password

To authenticate with username and password, set the keywords `User ID` and `Password` in the connection string.

|Example|
|--|
|`"Server=tcp:myserver.database.windows.net,1433;User Id={myUserId};Password={myPlaceholderPassword};Initial Catalog=mydatabase;"`|

The principal must have the necessary permissions on the SQL database to perform the operation. To manage the access controls for different storage types, see [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

## Additional required permissions

The following table lists the additional permissions required to read or write to a table by authentication method.

|Authentication method|Read permissions|Write permissions|
|--|--|--|
|[Azure AD-integrated (impersonation)](#azure-ad-integrated-impersonation)|table SELECT|Existing table: table UPDATE and INSERT<br/>New table: CREATE, UPDATE, and INSERT|
|[Managed identity](#managed-identity)|table SELECT|Existing table: table UPDATE and INSERT<br/>New table: CREATE, UPDATE, and INSERT|

## See also

* [Create a SQL external table](../../management/external-sql-tables.md)
* [Authentication with the sql_request plugin](../../query/sqlrequestplugin.md#authentication-and-authorization)
* [Authentication with the mysql_request plugin](../../query/mysqlrequest-plugin.md#authentication-and-authorization)
* [Authentication with the postgresql_request plugin](../../query/postgresql-request-plugin.md#authentication-and-authorization)
