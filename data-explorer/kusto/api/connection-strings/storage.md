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

A few Kusto commands instruct Kusto to interact with external
storage services. For example, Kusto can be told to export data to an Azure Blob Storage, in which case the specific parameters (such as storage account name or
blob container) need to be provided.

Kusto supports the following storage providers:

* Azure Blob Storage provider
* Azure Data Lake Storage Gen1 provider
* Azure Data Lake Storage Gen2 provider

Each kind of a storage provider defines connection string formats
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

|Provider                       |Scheme    |URI template                          |
|-------------------------------|----------|--------------------------------------|
|Azure Blob Storage             |`https://`|`https://`*Account*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]|
|Azure Data Lake Storage Gen 2  |`https://`|`https://`*Account*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen 2  |`abfss://`|`abfss://`*Filesystem*`@`*Account*`.dfs.core.windows.net/`*PathToDirectoryOrFile*[*CallerCredentials*]|
|Azure Data Lake Storage Gen 1  |`adl://`  |`adl://`*Account*.azuredatalakestore.net/*PathToDirectoryOrFile*[*CallerCredentials*]|

> [!TIP]
> When using impersonation or when using a [user delegation SAS token](/rest/api/storageservices/create-user-delegation-sas) in the connection string, the AAD principal which the operation is executed on-behalf-of must be assigned (minimally) the [Storage Blob Data Reader role](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) for read operations, or [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) for write (for example, export) operations.

## Azure Blob Storage

This provider supports accessing data in Azure Blob Storage. This provider is the most commonly-used and is supported in all scenarios.

The format of the URI is:

`https://`*Account*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]

Where *CallerCredentials* indicates the credentials used to access the service and can be one of the following:
* Shared Access (SAS) key, using the Azure Blob Storage's standard query (`:?sig=...`). Use this method when Kusto needs to access the
  resource for a limited time.
* Storage account key (`;ljkAkl...==`). Use this method when Kusto needs to access the resource on an ongoing basis.
* A base-64 encoded AAD access token (`;token=AadToken`). Make sure the token is for the resource https://storage.azure.com/.

Examples (note that this is showing obfuscated string literals, so as not to expose the account key, SAS or token):

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;<storage_account_key_text, ends with '=='>"`
`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"` 
`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;token=<aad_token>"` 


### Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob Storage. Turning on hierarchical namespace on Azure Blob Storage makes these capabilities accessible. Azure Data Lake Storage Gen2 provider supports accessing data in Azure Data Lake Storage Gen2.

The format of the URI is:

`abfss://` *Filesystem* `@` *StorageAccountName* `.dfs.core.windows.net` [/` *Path* ][*CallerCredentials*]
or
`https://` *StorageAccountName* `.dfs.core.windows.net/` *Filesystem* [`/` *Path*][*CallerCredentials*]

Where:

* _Filesystem_ is the name of the ADLS filesystem object (roughly equivalent to Blob Container)
* _StorageAccountName_ is the name of the storage account
* _Path_ is the path to the directory or file being accessed.
  The slash (`/`) character is used as a delimiter.
* _CallerCredentials_ indicates the credentials used to access the Azure Data Lake Storage Gen2. The following options are available: 
  
   * Append `;sharedkey=`*AccountKey* to the URI, with _AccountKey_ being the storage account key
   * Append `;impersonate` to the URI. Kusto will use the requestor's principal identity and impersonate it to access the resource. Principal needs to have the appropriate RBAC role assignments to be able to perform the read/write operations, as documented [here](/azure/storage/blobs/data-lake-storage-access-control). (For example, for read operations assign `Storage Blob Data Reader` role).
   * Append `;token=`*AadToken* to the URI, with _AadToken_ being a base-64 encoded AAD access token (make sure the token is for the resource `https://storage.azure.com/`).
   * Append `;prompt` to the URI. Kusto requests user credentials when it needs to access the resource. (Prompting the user is disabled for cloud deployments and is only enabled in test environments.)
   * Append a Shared Access (SAS) key, using the Azure Data Lake Storage Gen2's standard query (`?sig=...`). Use this method when Kusto needs to access the resource for a limited time.


### Azure Data Lake Storage Gen1

This provider supports accessing files and directories in Azure Data Lake Storage Gen1.
It must be provided with credentials (Kusto doesn't use its own AAD principal to
access Azure Data Lake.) The following methods of providing credentials are
supported:

* Append `;impersonate` to the URI. Kusto will use the requestor's principal
  identity and impersonate it to access the resource
* Append `;token=`*AadToken* to the URI, with *AadToken* being a base-64
  encoded AAD access token (make sure the token is for the resource `https://management.azure.com/`).
* Append `;prompt` to the URI. Kusto will request user credentials
  when it needs to access the resource. (Prompting the user is disabled for
  cloud deployments and is only enabled in test environments.)
