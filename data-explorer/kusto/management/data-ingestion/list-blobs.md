---
title:  Kusto list blobs command (list blobs from storage)
description: This article describes the DM list blobs command in Azure Data Explorer.
ms.reviewer: ???
ms.topic: reference
ms.date: 09/15/2024
---
# List blobs from storage

The `.list blobs` command lists blobs under a specified container path.

This command is typically used in conjunction with [.ingest-from-storage-queued](todo) to ingest data.  <span style="background:yellow">TODO</span>  But it can be used standalone to understand a folder content and better parameterize ingestion commands.

## Permissions

You must have at least [Table Ingestor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.list blobs` (*SourceDataLocators*)
[Suffix=SuffixValue]
[MaxFiles=MaxFilesValue]
[PathFormat=PatternValue]

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SourceDataLocators*| `string` | :heavy_check_mark:|One or many (maximum <span style="background:yellow">TODO</span> ???) [storage connection strings](../../api/connection-strings/storage-connection-strings.md) separated by a comma character.  Each connection string can refer to a storage container or a file prefix within a container.|
|*Suffix*| `string` | |Suffix for each blob, allows filtering of blobs.|
|*MaxFiles*| `integer` | | Maximum number of blobs to return.  See note below.  |
|*PathFormat*| `string` | | Pattern in blob path in order to grab creation time as output field.  |

> [!NOTE]
> We recommend using [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals) for the *SourceDataLocators*. The service will scrub credentials in internal traces and error messages.
>
> [!NOTE]
> When used standalone, this command will return a maximum of 1000 files, regardless of the value specified in *MaxFiles*.

[!INCLUDE [ingestion-properties](../../../includes/ingestion-properties.md)]

## Authentication and authorization

Each storage connection string indicates the authorization method to use for access to the storage. Depending on the authorization method, the principal may need to be granted permissions on the external storage to perform the ingestion.

The following table lists the supported authentication methods and the permissions needed for ingesting data from external storage.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Shared Access (SAS) token](../../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token)|List + Read|This authentication method isn't supported in Gen1.|
|[Storage account access key](../../api/connection-strings/storage-authentication-methods.md#storage-account-access-key)||This authentication method isn't supported in Gen1.|
|[Managed identity](../../api/connection-strings/storage-authentication-methods.md#managed-identity)|Storage Blob Data Reader|Reader|

[Impersonation](../../api/connection-strings/storage-authentication-methods.md#impersonation) isn't supported.  This command primary usage is queued ingestion which is done asynchronously and where the user context is lost.

## Returns

The result of the command is a table with one record per blob listed.

|Name       |Type      |Description                                                                |
|-----------|----------|---------------------------------------------------------------------------|
|BlobUri |`string`    |URI of the blob
|SizeInBytes |`long`    |Number of bytes (or content-length) of the blob
|CapturedVariables |`dynamic`    |Captured variables (only CreationTime is supported at the moment)

## Examples

### Listing 20 blobs

This command lists a maximum of 20 blobs out of a folder using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings#managed-identity) authentication:

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
MaxFiles=20
```

