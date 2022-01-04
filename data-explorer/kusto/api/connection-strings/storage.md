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

## Storage connection string templates

Each storage type has a different connection string format. Below is a table describing those formats:

|Storage Type                  |Scheme    |URI template                          |
|------------------------------|----------|--------------------------------------|
|Azure Blob Storage            |`https://`|`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`https://`|`https://`*StorageAccountName*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`abfss://`|`abfss://`*Filesystem*`@`*StorageAccountName*`.dfs.core.windows.net/`[*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen1  |`adl://`  |`adl://`*StorageAccountName*.azuredatalakestore.net/*PathToDirectoryOrFile*[*CallerCredentials*]|

Use the above formats when specifying external resources in Azure Data Explorer.

## Storage authentication

Each connection string requires authentication method specification that will be used to authenticate to the external resource. See [storage authentication methods](/storage-authentication-methods.md) for an elaborate explanation on the different authentication methods available, their respected authentication values and their support throughout the different storage types.