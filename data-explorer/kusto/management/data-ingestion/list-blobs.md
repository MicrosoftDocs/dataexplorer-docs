---
title:  .list blobs command (list blobs from storage)
description: This article describes the DM list blobs command in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 11/19/2024
---
# List blobs from storage
<!--what does DM stand for?-->
> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.list blobs` command lists blobs under a specified container path.

This command is typically used in conjunction with [.ingest-from-storage-queued](ingest-from-storage-queued.md) to ingest data.  It can also be used by itself to better understand a folder content and parameterize ingestion commands.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.list blobs` (*SourceDataLocators*)
[Suffix=SuffixValue]
[MaxFiles=MaxFilesValue]
[PathFormat=PatternValue]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SourceDataLocators*| `string` | :heavy_check_mark:|One or many [storage connection strings](../../api/connection-strings/storage-connection-strings.md) separated by a comma character (currently only one is supported).  Each connection string can refer to a storage container or a file prefix within a container.|
|*Suffix*| `string` | |Suffix for each blob, allows filtering of blobs.|
|*MaxFiles*| `integer` | | Maximum number of blobs to return.  See note below.  |
|*PathFormat*| `string` | | Pattern in blob path in order to grab creation time as output field.  |

> [!NOTE]
> We recommend using [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals) for the *SourceDataLocators*. The service will scrub credentials in internal traces and error messages.
>
> [!NOTE]
> When used standalone, this command will return a maximum of 1000 files, even if a bigger value is specified in *MaxFiles*.

[!INCLUDE [ingestion-properties](../../includes/ingestion-properties.md)]

## Authentication and authorization

Each storage connection string indicates the authorization method to use for access to the storage. Depending on the authorization method, the principal may need to be granted permissions on the external storage to perform the ingestion.

The following table lists the supported authentication methods and the permissions needed for ingesting data from external storage.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Shared Access (SAS) token](../../api/connection-strings/storage-connection-strings.md#shared-access-sas-token)|List + Read|This authentication method isn't supported in Gen1.|
|[Storage account access key](../../api/connection-strings/storage-connection-strings.md#storage-account-access-key)||This authentication method isn't supported in Gen1.|
|[Managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity)|Storage Blob Data Reader|Reader|

[Impersonation](../../api/connection-strings/storage-connection-strings.md#impersonation) isn't supported.  This command primary usage is queued ingestion which is done asynchronously with no user context.

## Returns

The result of the command is a table with one record per blob listed.

|Name       |Type      |Description                                                                |
|-----------|----------|---------------------------------------------------------------------------|
|BlobUri |`string`    |URI of the blob
|SizeInBytes |`long`    |Number of bytes (or content-length) of the blob
|CapturedVariables |`dynamic`    |Captured variables (only `CreationTime` is supported at the moment)

## Examples

### Listing 20 blobs

This command lists a maximum of 20 blobs out of a folder using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication:

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
MaxFiles=20
```

### Listing *.parquet* blobs

This command lists a maximum of 10 blobs ending with ".parquet" out of a folder using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication:

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
Suffix=".parquet"
MaxFiles=10
```

### Capture date from blob path

This command lists a maximum of 10 blobs ending with ".parquet" out of a folder using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication and extract the date out of the URL:

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
Suffix=".parquet"
MaxFiles=10
PathFormat=("myfolder/year=" datetime_pattern("yyyy'/month='MM'/day='dd", creationTime) "/")
```

This `PathFormat` is able to extract the date for URL of the form:

```
https://mystorageaccount.blob.core.windows.net/datasets/myfolder/year=2024/month=03/day=16/myblob.parquet
```

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)