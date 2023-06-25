---
title:  SQL external table authentication methods
description: This article describes how to authenticate to SQL external tables in Azure Data Explorer.
ms.reviewer: urishapira
ms.topic: reference
ms.date: 06/18/2023
---
# SQL external table authentication methods

The connection string provided upon creation of a SQL external table ([SQL Server](../../management/external-mssql-tables.md), [PostgreSQL](../../management/external-postgresql-tables.md), [MySQL](../../management/external-mysql-tables.md), [CosmosDB](../../management/external-cosmosdbsql-tables.md))
defines the resource to access and its authentication information. The following authentication methods are supported:

* [Azure AD-integrated authentication](#azure-ad-integrated-authentication)
* [Managed identity](#managed-identity)
* [Username and Password](#username-and-password)

## Privacy and security

We recommend adding an `h` to connection strings that contain secrets. This practice ensures that the private information in the connection string is [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals).

The following table explains how to hide your private information using the `h` string.

|Goal|Method|Syntax|
|--|--|--|
|Hide the entire connection string|Preface the connection string with `h`.|`h"<connection_string>"`|
|Hide only the secret part of the string|Split the connection string into the resource location and the secret information and add the `h` between the two.| `"<resource_location>"h"<secrets>"`|

## Azure AD-integrated authentication

With this authentication method, the user or application authenticates via Azure AD to Azure Data Explorer, and the same token is then used to access the SQL Server network endpoint. This method is only supported for SQL Server.

To use Azure AD-integrated authentication (impersonation), add `;Authentication="Active Directory Integrated"` to the SQL connection string.

|Example|
|--|
|`"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;"`|

The principal must have the necessary permissions on the SQL database to perform the operation. To manage the access controls for different storage types, see [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

> [!NOTE]
> This method is only supported for SQL Server.

## Managed identity

Azure Data Explorer uses the managed identity to make requests and access resources. This method is only supported for SQL Server.

For a system-assigned managed identity, append `;Authentication="Active Directory Managed Identity"` to the connection string. For a user-assigned managed identity, append `;Authentication="Active Directory Managed Identity";User Id={object_id}` to the connection string.

|Managed identity type|Example|
|--|--|--|
|System-assigned|`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";Initial Catalog=mydatabase;"`|
|User-assigned|`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";User Id=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b;Initial Catalog=mydatabase;"`|

The managed identity must have the necessary permissions on the SQL database to perform the operation. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

## Username and password

To authenticate with username and password, set the keywords `User ID` and `Password` in the connection string.

|Example|
|--|
|`"Server=tcp:myserver.database.windows.net,1433;User Id={myUserId};Password={myPlaceholderPassword};Initial Catalog=mydatabase;"`|

The principal must have the necessary permissions on the SQL database to perform the operation. To manage the access controls for different storage types, see [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions).

## See also

* [Create a SQL Server external table](../../management/external-mssql-tables.md)
* [Create a MySql external table](../../management/external-mysql-tables.md)
* [Create a PostgreSql external table](../../management/external-postgresql-tables.md)
* [Authentication with the sql_request plugin](../../query/sqlrequestplugin.md#authentication-and-authorization)
* [Authentication with the mysql_request plugin](../../query/mysqlrequest-plugin.md#authentication-and-authorization)
* [Authentication with the postgresql_request plugin](../../query/postgresqlrequest-plugin.md#authentication-and-authorization)
