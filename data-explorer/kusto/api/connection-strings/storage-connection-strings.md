---
title:  Storage connection strings
description: This article describes storage connection strings in Azure Data Explorer.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 02/07/2022
---
# Storage connection strings

Azure Data Explorer can interact with external storage services. For example, you can [create an Azure Storage external tables](../../management/external-tables-azurestorage-azuredatalake.md).

The following types of external storage are supported:

* Azure Blob Storage
* Azure Data Lake Storage Gen2
* Azure Data Lake Storage Gen1
* Amazon S3

Each type of storage has corresponding connection string formats used to describe the storage resources and how to access them.
Azure Data Explorer uses a URI format to describe these storage resources and the properties necessary to access them, such as security credentials.

> [!WARN]
> Be mindful of the fact that the list below is exhaustive. In particular, note that HTTP web services that do not implement the entire API set of
> Azure Blob Storage are **not supported**, even if they appear to work in some scenarios.

## Storage connection string templates

Each storage type has a different connection string format. See the following table for connection string templates for each storage type.

|Storage Type                  |Scheme    |URI template                          |
|------------------------------|----------|--------------------------------------|
|Azure Blob Storage            |`https://`|`https://`*StorageAccountName*`.blob.core.windows.net/`*Container*[`/`*BlobName*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`https://`|`https://`*StorageAccountName*`.dfs.core.windows.net/`*Filesystem*[`/`*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen2  |`abfss://`|`abfss://`*Filesystem*`@`*StorageAccountName*`.dfs.core.windows.net/`[*PathToDirectoryOrFile*][*CallerCredentials*]|
|Azure Data Lake Storage Gen1  |`adl://`  |`adl://`*StorageAccountName*.azuredatalakestore.net/*PathToDirectoryOrFile*[*CallerCredentials*]|
|Amazon S3                     |`https://`|`https://`*BucketName*`.s3.`*RegionName*`.amazonaws.com/`*ObjectKey*[*CallerCredentials*]|

## Storage authentication

For Azure Data Explorer to interact with and authenticate to external storage, you must specify the storage's `connection string`. This `connection string` defines the resource being accessed and its authentication information. For more information, see [Storage authentication methods](storage-authentication-methods.md).
