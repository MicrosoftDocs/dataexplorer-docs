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
# Storage connection strings

A few Kusto commands instruct Kusto to interact with external storage services. For example, Kusto can be told to [create an Azure Storage external tables](../../management/external-tables-azurestorage-azuredatalake.md).

Kusto supports the following types of storage:

* Azure Blob Storage
* Azure Data Lake Storage Gen2
* Azure Data Lake Storage Gen1

Each type of a storage has connection string formats
used to describe the storage resources and how to access them.
Kusto uses a URI format to describe these storage resources and the properties
necessary to access them (such as security credentials).

## Generate a SAS for Azure Storage blob container

To generate a SAS link from your Azure Storage account, follow the following steps:


1. In the Azure portal, open Storage Explorer.
1. From the left menu, select **Containers**.
1. Right-click on the desired container.
1. From the context menu, select **Generate SAS**.

   :::image type="content" source="storage/generate-sas-storage-account.png" alt-text="Screenshot of Azure portal with Containers selected. Specific container is right-clicked and a menu opens. Generate SAS is selected from this menu.":::

1. In the Shared Access Signature dialog, specify the policy, start and expiration dates, time zone, and access levels you want for the resource.

    :::image type="content" source="storage/generate-sas-token-and-url.png" alt-text="Screen shot of the Generate SAS dialog with information filled in and Generate SAS token and URL selected.":::

1. Select **Generate SAS token and URL**.
1. A new section will then display at the bottom of the dialog, listing the blob SAS token and the blob SAS URL. Select the copy icon to the right of the blob SAS URL.

   :::image type="content" source="storage/copy-sas-token-and-url.png" alt-text="Screenshot of Azure portal with blob SAS URL generated.":::

Azure Storage SAS links can also be generated as described in [URI templates](#uri-templates).

## URI templates

|Storage Type                  |Scheme    |URI template                          |
|------------------------------|----------|--------------------------------------|
|Azure Blob Storage            |`https://`|`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`https://`|`https://`*StorageAccountName*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`abfss://`|`abfss://`*Filesystem*`@`*StorageAccountName*`.dfs.core.windows.net/`[*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen1  |`adl://`  |`adl://`*StorageAccountName*.azuredatalakestore.net/*PathToDirectoryOrFile*[*CallerCredentials*]|

> [!TIP]
> When using impersonation or when using a [user delegation SAS token](/rest/api/storageservices/create-user-delegation-sas) in the connection string, the AAD principal which the operation is executed on-behalf-of must be assigned (minimally) the [Storage Blob Data Reader role](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) for read operations, or [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) for write (for example, export) operations.

## Azure Blob Storage

Azure Blob Storage is the most commonly-used and is supported in all scenarios.

The format of the URI is:

`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]

Where *CallerCredentials* indicates the credentials used to access the storage and can be one of the following:
* Append the Shared Access (SAS) key, using the Azure Blob Storage's standard query (`?sig=...`). Use this method when Kusto needs to access the
  resource for a limited time.
* Append the Storage account key (`;ljkAkl...==`). Use this method when Kusto needs to access the resource on an ongoing basis.
* Append a base-64 encoded AAD access token (`;token=AadToken`). Make sure the token is for the resource `https://storage.azure.com/`.
* Append `;impersonate` to the URI. Kusto will use the requestor's principal identity and impersonate this identity to access the resource. The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. For more information, see [blob access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac).
* Append `;managed_identity=...` to the URI. Kusto will use the managed identity (either system or user-assigned) in order to make requests and access resources. For system assigned managed identity, append `;managed_identity=system`. For user-assigned, append the object id of the user-assigned managed identity, as such: `;managed_identity={object_id}`. The managed identity must be assigned to the cluster [as described here](/some_link), and allowed by the managed identity policy, [see](/some_link).
The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. For more information, see [blob access control](/azure/storage/common/authorization-resource-provider#assign-management-permissions-with-azure-role-based-access-control-azure-rbac). 
[Note!] Managed Identity is only supported in specific Kusto flows. For more information, click [here](/managed-identities.md). 


Examples (note that this is showing obfuscated string literals, so as not to expose the account key, SAS or token):

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;<storage_account_key_text, ends with '=='>"`

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"` 

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token=<aad_token>"` 

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;impersonate"` 

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=system"`

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;managed_identity=9ca5bb85-1c1f-44c3-b33a-0dfcc7ec5f6b"` 

### Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob Storage. Turning on hierarchical namespace on Azure Blob Storage makes these capabilities accessible, so the storage can be treated also as an Azure Data Lake Storage Gen2.

The format for the Azure Data Lake Storage Gen2 URI is:

`abfss://` *Filesystem* `@` *StorageAccountName* `.dfs.core.windows.net` [`/` *Path* ][*CallerCredentials*]

or

`https://` *StorageAccountName* `.dfs.core.windows.net/` *Filesystem* [`/` *Path*][*CallerCredentials*]

Where:

* _Filesystem_ is the name of the ADLS filesystem object (roughly equivalent to Blob Container)
* _StorageAccountName_ is the name of the storage account
* _Path_ is the path to the directory or file being accessed.
  The slash (`/`) character is used as a delimiter.
* _CallerCredentials_ indicates the credentials used to access the Azure Data Lake Storage Gen2. The following options are available: 
  
   * Append `;sharedkey=`*AccountKey* to the URI, with _AccountKey_ being the storage account key
   * Append `;impersonate` to the URI. Kusto will use the requestor's principal identity and impersonate this identity to access the resource. The principal must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. For more information, see [data lake access control](/azure/storage/blobs/data-lake-storage-access-control).
   * Append `;token=`*AadToken* to the URI, with _AadToken_ being a base-64 encoded AAD access token (make sure the token is for the resource `https://storage.azure.com/`).
   * Append a Shared Access (SAS) key, using the Azure Data Lake Storage Gen2's standard query (`?sig=...`). Use this method when Kusto needs to access the resource for a limited time.
   * Append `;managed_identity=...` to the URI. Kusto will use the managed identity (either system or user-assigned) in order to make requests and access resources. For system assigned managed identity, append `;managed_identity=system`. For user-assigned, append the object id of the user-assigned managed identity, as such: `;managed_identity={object_id}`. The managed identity must be assigned to the cluster [as described here](/some_link), and allowed by the managed identity policy, [see](/some_link).
The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. For more information, see [data lake access control](/azure/storage/blobs/data-lake-storage-access-control). 
[Note!] Managed Identity is only supported in specific Kusto flows. For more information, click [here](/managed-identities.md). 


### Azure Data Lake Storage Gen1

URI to Azure Data Lake Storage Gen1 enables accessing files and directories. It must be provided with credentials (Kusto doesn't use its own AAD principal to
access Azure Data Lake.) The following methods of providing credentials are
supported:

* Append `;impersonate` to the URI. Kusto will use the requestor's principal
  identity and impersonate it to access the resource
* Append `;token=`*AadToken* to the URI, with *AadToken* being a base-64
  encoded AAD access token (make sure the token is for the resource `https://management.azure.com/`).
* Append `;managed_identity=...` to the URI. Kusto will use the managed identity (either system or user-assigned) in order to make requests and access resources. For system assigned managed identity, append `;managed_identity=system`. For user-assigned, append the object id of the user-assigned managed identity, as such: `;managed_identity={object_id}`. The managed identity must be assigned to the cluster [as described here](/some_link), and allowed by the managed identity policy, [see](/some_link).
The managed identity must have the appropriate role-based access control (RBAC) role assignments to be able to perform the read/write operations. For more information, see [data lake access control](azure/data-lake-store/data-lake-store-access-control). 
[Note!] Managed Identity is only supported in specific Kusto flows. For more information, click [here](/managed-identities.md). 
