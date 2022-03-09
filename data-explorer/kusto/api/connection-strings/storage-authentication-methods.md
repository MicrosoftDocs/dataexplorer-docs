---
title: Storage authentication methods - Azure Data Explorer
description: This article describes storage authentication methods used in connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 02/07/2022
---
# Storage authentication methods

Azure Data Explorer can interact with external storage in different ways. For Azure Data Explorer to interact with and authenticate to external storage, you must specify the storage's `connection string`. The `connection string` defines the resource being accessed and its authentication information.

We recommend adding an `h` to connection strings that contain secrets, so that the connection strings are [obfuscated in telemetry data](../../query/scalar-data-types/string.md#obfuscated-string-literals) using one of the following methods:

* Hide the entire string: Add an `h` to the beginning of the string, like this: `h"https://...."`
* Hiding the secret part of the string: Split the connection string into location and secret and add the `h` before the secret part, like this: "https://fabrikam.blob.core.windows.net/container/path/to/file.csv;" h"ljkAkl...=="

The following authentication methods are supported:

* [Impersonation](#impersonation)
* [Managed identity](#managed-identity)
* [Shared Access (SAS) key](#shared-access-sas-token)
* [Token](#token)
* [Access key](#access-key)

## Storage authentication availability

Different authentication methods are available for different external storage types. The available methods are summarized in the following table:

| Authentication method | Available in Blob storage? | Available in Azure Data Lake Storage Gen 2? | Available in Azure Data Lake Storage Gen 1? | When should you use this method? |
|---|---|---|---|---|
| [Impersonation](#impersonation) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Use for attended flows when you need complex access control over the external storage. For example, in continuous export flows. You can also restrict storage access at the user level. |
| [Managed identity](#managed-identity) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Use in unattended flows, where no Azure Active Directory (Azure AD) principal can be derived to execute queries and commands. Managed identities are the only authentication solution. |
| [Shared Access (SAS) key](#shared-access-sas-token) | :heavy_check_mark: | :heavy_check_mark: | :x: | SAS tokens have an expiration time. Use when accessing storage for a limited time. |
| [Token](#token) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | Azure AD tokens have an expiration time. Use when accessing storage for a limited time. |
| [Access key](#access-key) | :heavy_check_mark: | :heavy_check_mark: | :x: | When you need to access resources on an ongoing basis. storage for a limited time. |

## Impersonation

To use impersonation, append `;impersonate` to the connection string. Azure Data Explorer will use the requestor's principal identity and impersonate this identity to access the resource.

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see:
>
> * [Azure Blob Storage/Azure Data Lake Storage Gen2 access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac)
> * [Azure Data Lake Storage Gen1 access control](/azure/storage/blobs/data-lake-storage-access-control)

### Impersonation example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`

## Managed identity

To add a managed identity, append `;managed_identity=...` to the connection string. Azure Data Explorer will use the managed identity, either system or user-assigned, to make requests and access resources.

* For a system-assigned managed identity, append `;managed_identity=system`.
* For a user-assigned managed identity, append the object ID of the user-assigned managed identity, with the following format: `;managed_identity={object_id}`.

> [!NOTE]
>
> * The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see:
>
>     * [Azure Blob Storage/Azure Data Lake Storage Gen2 access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac)
>     * [Azure Data Lake Storage Gen1 access control](/azure/storage/blobs/data-lake-storage-access-control)
> * Managed identity is only supported in specific Azure Data Explorer flows. For more information, see [Managed identities overview](../../../managed-identities-overview.md).

### Managed identity examples

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"`

## Shared Access (SAS) token

To add a Shared Access (SAS) token, append `?sig=...` to the connection string. For more information, see [Generate a SAS token](generate-sas-token.md).

> [!NOTE]
> The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. To manage the access controls for different storage types, see:
>
> * [Azure Blob Storage/Azure Data Lake Storage Gen2 access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac)
> * [Azure Data Lake Storage Gen1 access control](/azure/storage/blobs/data-lake-storage-access-control)

### Shared Access (SAS) token example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"`

## Token

To add a base-64 encoded Azure AD access token, append `;token={AadToken}` to the connection string. Make sure the token is for the resource `https://storage.azure.com/`. For more information on how to generate an Azure AD access token, see [get an access token for authorization](/azure/storage/common/identity-library-acquire-token).

### Token example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im..."`

## Access key

To add a storage access key, append the key to the connection string, as follows:

* For **Azure Blob Storage**: Append `;{key}` to the connection string.
* For **Azure Data Lake Storage Gen2**: Append `;sharedkey={key}` with the storage account key to the connection string.

### Access key examples

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;ljkAkl...=="`

`"abfss://fs@fabrikam.dfs.core.windows.net/path/to/file.csv;sharedkey=sv=...&sp=rwd"`