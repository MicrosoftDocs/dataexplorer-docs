---
title:  .list blobs command (list blobs from storage)
description: Learn how to use the list blobs from storage command.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 01/26/2025
---
# .list blobs command

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.list blobs` command lists blobs under a specified container path.

This command is typically used with `[.ingest-from-storage-queued](ingest-from-storage-queued.md)` to ingest data. You can also use it on its own to better understand folder contents and parameterize ingestion commands.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.list blobs` (*SourceDataLocators*) [`Suffix`=*SuffixValue*] [`MaxFiles`=*MaxFilesValue*] [`PathFormat`=*PatternValue*]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SourceDataLocators*| `string` | :heavy_check_mark:|One or many [storage connection strings](../../api/connection-strings/storage-connection-strings.md) separated by a comma character. Each connection string can refer to a storage container or a file prefix within a container. Currently, only one storage connection string is supported. |
|*SuffixValue*| `string` | |The suffix that enables blob filtering.|
|*MaxFilesValue*| `integer` | | The maximum number of blobs to return. |
|*PatternValue*| `string` | | The pattern in the blob’s path that can be used to retrieve the creation time as an output field. |

> [!NOTE]
>
> * We recommend using [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals) for *SourceDataLocators* to scrub credentials in internal traces and error messages.
>
> * When used alone, `.list blob` returns up to 1,000 files, regardless of any larger value specified in *MaxFiles*.

[!INCLUDE [ingestion-properties](../../includes/ingestion-properties.md)]

## Authentication and authorization

Each storage connection string indicates the authorization method to use for access to the storage. Depending on the authorization method, the principal might need to be granted permissions on the external storage to perform the ingestion.

The following table lists the supported authentication methods and the permissions needed for ingesting data from external storage.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Shared Access (SAS) token](../../api/connection-strings/storage-connection-strings.md#shared-access-sas-token)|List + Read|This authentication method isn't supported in Gen1.|
|[Storage account access key](../../api/connection-strings/storage-connection-strings.md#storage-account-access-key)||This authentication method isn't supported in Gen1.|
|[Managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity)|Storage Blob Data Reader|Reader|

The primary use of `.list blobs` is for queued ingestion which is done asynchronously with no user context. Therefore, [Impersonation](../../api/connection-strings/storage-connection-strings.md#impersonation) isn't supported.

## Returns

The result of the command is a table with one record per blob listed.

| Name | Type | Description |
|--|--|--|
| BlobUri | `string` | The URI of the blob. |
| SizeInBytes | `long` | The number of bytes, or content-length, of the blob. |
| CapturedVariables | `dynamic` | The captured variables. Currently only `CreationTime` is supported. |

## Examples

### List maximum number of blobs

The following command lists a maximum of 20 blobs from the `myfolder` folder using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication.

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
MaxFiles=20
```

### List Parquet blobs

The following command lists a maximum of 10 blobs of type `.parquet` from a folder, using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication.

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
Suffix=".parquet"
MaxFiles=10
```

### Capture date from blob path

The following command lists a maximum of 10 blobs of type `.parquet` from a folder, using [system-assigned managed identity](../../api/connection-strings/storage-connection-strings.md#managed-identity) authentication, and extracts the date from the URL path.

```kusto
.list blobs (
    "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
)
Suffix=".parquet"
MaxFiles=10
PathFormat=("myfolder/year=" datetime_pattern("yyyy'/month='MM'/day='dd", creationTime) "/")
```

The `PathFormat` in the example can extract dates from a path such as the following path:

```
https://mystorageaccount.blob.core.windows.net/datasets/myfolder/year=2024/month=03/day=16/myblob.parquet
```

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued into](ingest-from-storage-queued.md)
* [.show queued ingestion operations command](show-queued-ingestion-operations.md)
