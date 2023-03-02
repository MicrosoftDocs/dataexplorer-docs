---
title: SQL Server authentication methods - Azure Data Explorer
description: This article describes SQL Server authentication methods used in SQL Server connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 07/02/2022
---
# SQL Server authentication methods

To interact with external SQL databases from Azure Data Explorer, you must specify the external SQL database connection string. The connection string defines the resource to access and its authentication information.

The following authentication methods are supported:

* [AAD-integrated authentication](#aad-integrated-authentication)
* [Managed identity](#managed-identity)
* [Username and Password](#username-and-password)

## Privacy and security

We recommend adding an `h` to connection strings that contain secrets. This practice ensures that the private information in the connection string is [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals).

The following table explains how to hide your private information using the `h` string.

|Goal|Method|Syntax|
|--|--|--|
|Hide the entire connection string|Preface the connection string with `h`.|`h"<connection_string>"`|
|Hide only the secret part of the string|Split the connection string into the resource location and the secret information and add the `h` between the two.| `"<resource_location>"h"<secrets>"`|

## AAD-integrated authentication

To use AAD-integrated authentication (impersonation), add `;Authentication="Active Directory Integrated"` to the SQL connection string. Using this authentication method, the user or application authenticates via Azure AD to Azure Data Explorer, and the same token is then used to access the SQL Server network endpoint.

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions)

### AAD-integrated authentication example

`"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;"`

## Managed identity

To add a managed identity, add `;Authentication="Active Directory Managed Identity"` to the connection string for a system-assigned managed identity, or `;Authentication="Active Directory Managed Identity";User Id={object_id}` for a user-assigned managed identity with its associated object ID. Azure Data Explorer will use the managed identity, either system or user-assigned, to make requests and access resources.
In order to use managed identity please follow these instructions, and allow the relevant sql db permissions to the managed identity.

* For a system-assigned managed identity, add `;Authentication="Active Directory Managed Identity"`.
* For a user-assigned managed identity, add the object ID of the user-assigned managed identity, with the following format: `;Authentication="Active Directory Managed Identity";User Id={object_id}`.

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions)

### Managed identity examples

`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";Initial Catalog=mydatabase;"`

`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";User Id=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b;Initial Catalog=mydatabase;"`

## Username and password

To use username and password, set the keywords `User ID` and `Password` in the connection string.

### Username and password example

`"Server=tcp:myserver.database.windows.net,1433;User Id={myUserId};Password={myPlaceholderPassword};Initial Catalog=mydatabase;"`

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions)
