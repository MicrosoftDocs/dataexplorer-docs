---
title: Storage authentication methods - Azure Data Explorer
description: This article describes storage authentication methods used in connection strings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: shanisolomon
ms.service: data-explorer
ms.topic: reference
ms.date: 01/05/2022
---
# Storage authentication methods

Azure Data Explorer can interact with external storage in different ways. For Azure Data Explorer to interact with and authenticate to external storage, you must specify the storage's `connection string`. This `connection string` defines the resource being accessed and its authentication information.

The following authentication methods are supported:
* [Access key](#access-key)
* [Shared Access (SAS) key](#shared-access-sas-key)
* [Token](#token)
* [Impersonation](#impersonation)
* [Managed identity](#managed-identity)

> [!NOTE]
> All types of connection strings can be obfuscated by adding `h` to the beginning of the connection string as follows: `h"https://...."`

## Storage authentication availability

Different authentication methods are available for different external storage types. The available methods are summarized in the following table:

Authentication type | [Access key](#access-key) | [Shared Access (SAS) key](#shared-access-sas-key) | [Token](#token) | [Impersonation](#impersonation) | [Managed identity](#managed-identity)
--- | --- | --- | --- | --- | ---|
**Azure Blob Storage** | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:
**Azure Data Lake Storage Gen2** | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:
**Azure Data Lake Storage Gen1** | :x: | :x: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:

## Access key

**Azure Blob Storage**: Append the storage account key to the connection string `;{key}` 
* Example: `;ljkAkl...==`
**Azure Data Lake Storage Gen2**: Append `;sharedkey={key}` with the storage account key to the connection string. 
* Example: `;sharedkey=ljkAkl...==`

### When should you use this method?

An Access Key can be used to access resources on an ongoing basis.

### Access key example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;ljkAkl...=="`

## Shared Access (SAS) token

Append the Shared Access (SAS) token `?sig=...` to the end of the connection string.

### When should you use this method?

SAS tokens have an expiration time, so use them when accessing storage for a limited time.

For more information, see [Generate a SAS token](generate-sas-token.md).

### Shared Access (SAS) token example

`"abfss://fs@fabrikam.dfs.core.windows.net/path/to/file.csv;sharedkey=sv=...&sp=rwd"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"`

## Token

Append a base-64 encoded AAD access token `;token=AadToken` to the connection string. Make sure the token is for the resource https://storage.azure.com/.

### When should you use this method?

AAD tokens have an expiration time, so use them when accessing storage for a limited time.

### Token example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token={aad_token}"`

## Impersonation

Append `;impersonate` to the connection string. Azure Data Explorer will use the requestor's principal identity and impersonate this identity to access the resource. The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations.

### When should you use this method?

In attended flows, impersonation allows for an elaborate access control over the external storage. Access to the external storage can be restricted in the user level, and therefore querying the external storage with Azure Data Explorer requires both the relevant cluster/database permissions, and external storage permissions.

### Impersonation example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`

## Managed identity

Append `;managed_identity=...` to the connection string. Azure Data Explorer will use the managed identity, either system or user-assigned, to make requests and access resources.

* For a system-assigned managed identity, append `;managed_identity=system`.
* For a user-assigned managed identity, append the object ID of the user-assigned managed identity, with the following format: `;managed_identity={object_id}`.

### When should you use this method?

In unattended flows, no AAD principal can be derived in order to execute queries and commands, and therefore managed identities are the only viable authentication solution.

For more information on how to use managed identities with your cluster, see [managed identities overview](/azure/data-explorer/managed-identities-overview).
The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations.

>[!NOTE]
> Managed identity is only supported in specific Azure Data Explorer flows. For more information, see [Managed identities overview](/azure/data-explorer/managed-identities-overview).

### Managed identity example

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"`

## Storage access control

When using `impersonation`, `SAS key` and `managed identity` authentication methods, the principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations.

To manage the access controls for different storage types, see:
* [Azure Blob Storage/Azure Data Lake Storage Gen2 access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac)
* [Azure Data Lake Storage Gen1 access control](/azure/storage/blobs/data-lake-storage-access-control)