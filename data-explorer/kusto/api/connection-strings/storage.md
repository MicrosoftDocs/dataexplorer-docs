---
title: Storage connection strings - Azure Data Explorer | Microsoft Docs
description: This article describes Storage connection strings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Storage connection strings

A few Kusto commands instruct Kusto to interact with external
storage services. For example, Kusto can be told to export data to Azure Storage
Blob, in which case the specific parameters (such as storage account name,
blob container, etc.) need to be provided.

Kusto supports the following storage providers:


* Azure Storage Blob storage provider.
* Azure Data Lake Storage storage provider.

Each kind of a storage provider defines a connection string format
that is used to describe the storage resources and how to access them.
Kusto uses a URI format to describe these storage resources and the properties
necessary to access them (such as security credentials).


|Provider          |Scheme    |URI template                          |
|------------------|----------|--------------------------------------|
|Azure Storage Blob|`https://`|`https://`*Account*`.blob.core.windows.net/`*Container*[`/`*BlobName*][`?`*SasKey* \| `;`*AccountKey*]|
|Azure Data Lake   |`adl://`  |`adl://`*Account*.azuredatalakestore.net/*PathToDirectoryOrFile*[`;`*CallerCredentials*]|


## Azure Storage Blob

This provider is the most commonly-used provider, and is supported in all scenarios.
The provider must be provided credentials when accessing the resource. There are
two supported mechanisms of providing credentials:

* By providing a Shared Access (SAS) key, using the Azure Storage Blob's standard
  query (`?sig=...`). This method should be used when Kusto needs to access the
  resource for a limited duration of time.
* By providing the storage account key (`;ljkAkl...==`). This method should be used
  when Kusto needs to access the resource on an ongoing basis.

Examples (note that this is showing obfuscated string literals, so as not to expose
the account key or SAS):

`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv;account_key=="` 
`h"https://fabrikam.blob.core.windows.net/container/path/to/file.csv?sv=...&sp=rwd"` 

## Azure Data Lake Store

This provider supports accessing files and directories in Azure Data Lake Store.
It must be provided with credentials (Kusto doesn't use its own AAD principal to
access Azure Data Lake.) The following methods of providing credentials are
supported:

* By appending `;token=`*AadToken* to the URI, with *AadToken* being a base-64
  encoded AAD access token.
* By appending `;prompt` to the URI. Kusto will ask the user for credentials
  when it needs to access the resource. (Prompting the user is disabled for
  cloud deployments and only enabled in test environments.)
* By appending `;impersonate` to the URI. Kusto will use the requestor's principal
  identity and impersonate it to access the resource.