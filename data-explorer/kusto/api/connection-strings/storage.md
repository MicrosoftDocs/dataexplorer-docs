---
title: Storage connection strings - Azure Data Explorer | Microsoft Docs
description: This article describes Storage connection strings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 06/28/2021
---
# Storage authentication methods

Azure Data Explorer can interact with external storage in different ways. One such example would be defining an [External Table](kusto/query/schema-entities/externaltables.md) over an external storage which could then be queried or exported to.
All flows interacting with external storage require specifying the assosiateds storage's `connection string`, which defines the resource being accessed and its authentication information, so Azure Data Explorer will know how to authenticate to that external storage.

All authentication methods and values are specified as part of the `connection string`. 

The following authentication methods are supported:
* Access Key
* Shared Access (SAS) Key
* Token
* Impersonation
* Managed Identity

## Storage authentication availability

Authentication method availability varies between external storage types, and is listed in the following table:

Authentication Type | Access Key | Shared Access (SAS) Key | Token | Impersonation | Managed Identity
--- | --- | --- | --- | --- | --- 
**Azure Blob Storage** | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:
**Azure Data Lake Storage Gen2** | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:
**Azure Data Lake Storage Gen1** | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:

## Access Key
For Azure Blob Storage, append the Storage account key to the connection string `;{key}` (for example: `;ljkAkl...==`).

For Azure Data Lake Storage Gen2, append `sharedkey={key}` with the Storage account key to the connection string. For example: `;sharedkey=ljkAkl...==`.

### When should you use this method?
Access Key could be used to access resources on an ongoing basis. 

## Shared Access (SAS) Key
Append the Shared Access (SAS) key to the end of the connection string `?sig=...`.

### When should you use this method?
SAS Keys have an expiration time and therefore should be used when accessing storage for a limited time.

For help generating SAS keys, click [here](TODO).

## Token
Append a base-64 encoded AAD access token `;token=AadToken`. Make sure the token is for the resource https://storage.azure.com/.

### When should you use this method?
AAD token have an expiration time, and therefore should be used when accessing storage for a limited time.

## Impersonation
Append `;impersonate` to the connection string. Azure Data Explorer will use the requestor's principal identity and impersonate this identity to access the resource. The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations.

### When should you use this method?
In attended flows, impersonation allows for an elaborate access control over the external storage. Access to the external storage can be restricted in the user level, and therefore querying the external storage with Azure Data Explorer requires both the relevant cluster/database permissions, and external storage permissions.

## Managed Identity
Append `;managed_identity=...` to the connection string. Azure Data Explorer will use the managed identity, either system or user-assigned, to make requests and access resources.

* For a system-assigned managed identity, append `;managed_identity=system`.
* For a user-assigned managed identity, append the object ID of the user-assigned managed identity, with the following format: `;managed_identity={object_id}`.

### When should you use this method?
In unattended flows, no AAD principal can be derived in order to execute queries and commands, and therefore managed identities are the only viable authentication solution.

For more information on how to use managed identities with your cluster, see [managed identities overview](/azure/data-explorer/managed-identities-overview).
The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations.

> Managed Identity is only supported in specific Azure Data Explorer flows. For more information, see [Managed identities overview](/azure/data-explorer/managed-identities-overview).

# Storage connection strings

Each external storage connection string has a different format. 
When specifying a connection string in Azure Data Explorer, please use the following template for each storage type:

|Storage Type                  |Scheme    |URI template                          |
|------------------------------|----------|--------------------------------------|
|Azure Blob Storage            |`https://`|`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*]{*Authentication Information*}|
|Azure Data Lake Storage Gen2  |`https://`|`https://`*StorageAccountName*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*]{*Authentication Information*}|
|Azure Data Lake Storage Gen2  |`abfss://`|`abfss://`*Filesystem*`@`*StorageAccountName*`.dfs.core.windows.net/`[*PathToDirectoryOrFile*]{*Authentication Information*}|
|Azure Data Lake Storage Gen1  |`adl://`  |`adl://`*StorageAccountName*.azuredatalakestore.net/[*PathToDirectoryOrFile*]{*Authentication Information*}|

Some examples on how to specify connection strings with authentication infromation:

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;ljkAkl...=="`

`"abfss://fs@fabrikam.dfs.core.windows.net/path/to/file.csv;sharedkey=sv=...&sp=rwd"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token={aad_token}"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`

`"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"`



> Use `h` in the beggining of the connection string to obfuscate it: `h"https://...."
