---
title: SQL Server authentication methods - Azure Data Explorer
description: This article describes SQL authentication methods used in SQL connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 07/02/2022
---
# Storage authentication methods

Azure Data Explorer can interact with external SQL databases in different ways. For Azure Data Explorer to interact with and authenticate to SQL databases, you must specify the SQL Server's `connection string`. The `connection string` defines the database being accessed and its authentication information.

We recommend adding an `h` to connection strings that contain secrets, so that the connection strings are [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals) using one of the following methods:

* Hide the entire string: Add an `h` to the beginning of the string, like this: `h"Server=tcp:myserver.database.windows.net..."`
* Hiding the secret part of the string: Split the connection string into location and secret and add the `h` before the secret part, like this: "https://fabrikam.blob.core.windows.net/container/path/to/file.csv;" h"ljkAkl...=="


The following authentication methods are supported:

* [AAD-integrated authentication](#AAD-integrated-authentication)
* [Managed identity](#managed-identity)
* [Username and Password](#Username-and-Password)
* [Token](#token)

## Storage authentication availability

Different authentication methods are available for different external storage types. The available methods are summarized in the following table:

| Authentication method | Available in Blob storage? | Available in Azure Data Lake Storage Gen 2? | Available in Azure Data Lake Storage Gen 1? | When should you use this method? |
|---|---|---|---|---|
| [Impersonation](#impersonation) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Use for attended flows when you need complex access control over the external storage. For example, in continuous export flows. You can also restrict storage access at the user level. |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Use in unattended flows, where no Azure Active Directory (Azure AD) principal can be derived to execute queries and commands. Managed identities are the only authentication solution. |
| [Shared Access (SAS) key](#shared-access-sas-token) | :heavy_check_mark: | :heavy_check_mark: | :x: | SAS tokens have an expiration time. Use when accessing storage for a limited time. |
| [Token](#token) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Azure AD tokens have an expiration time. Use when accessing storage for a limited time. |
| [Access key](#access-key) | :heavy_check_mark: | :heavy_check_mark: | :x: | When you need to access resources on an ongoing basis. storage for a limited time. |

## AAD-integrated authentication

To use AAD-integrated authentication (impersonation), add `;Authentication="Active Directory Integrated"` to the SQL connection string. Using this authentication method, the user or application authenticates via AAD to Azure Data Explorer, and the same token is then used to access the SQL Server network endpoint.

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions?view=sql-server-ver16)

### AAD-integrated authentication example

`"Server=tcp:myserver.database.windows.net,1433;Authentication=Active Directory Integrated;Initial Catalog=mydatabase;"`

## Managed identity

To add a managed identity, add `;Authentication="Active Directory Managed Identity"` to the connection string for a system-assigned managed identity, or `;Authentication="Active Directory Managed Identity";User Id={object_id}` for a user-assigned managed identity with its assosiated object ID. Azure Data Explorer will use the managed identity, either system or user-assigned, to make requests and access resources. 
In order to use managed identity please follow these instructions, and allow the relevant sql db permissions to the managed identity.

* For a system-assigned managed identity, add `;Authentication="Active Directory Managed Identity"`.
* For a user-assigned managed identity, add the object ID of the user-assigned managed identity, with the following format: `;Authentication="Active Directory Managed Identity";User Id={object_id}`.

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions?view=sql-server-ver16)

### Managed identity examples

`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";Initial Catalog=mydatabase;"`

`"Server=tcp:myserver.database.windows.net,1433;Authentication="Active Directory Managed Identity";User Id=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b;Initial Catalog=mydatabase;"`

## Username and Password

To use username and password, add `User ID=...; Password=...;` to connection string.

### Username and Password example

`"Server=tcp:myserver.database.windows.net,1433;User Id={some-userId};Password={some-password};Initial Catalog=mydatabase;"`

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see: [SQL Authentication Access](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions?view=sql-server-ver16)