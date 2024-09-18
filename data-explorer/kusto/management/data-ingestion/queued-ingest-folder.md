---
title:  Kusto.ingest into command (pull data from storage)
description: This article describes the DM queued ingest command (pull data from storage) in Azure Data Explorer.
ms.reviewer: ???
ms.topic: reference
ms.date: 09/18/2024
---
# Queued ingest from storage

The `.ingest-from-storage-queued into` command queues data from one or more cloud storage files for ingestion into a table.

[!INCLUDE [direct-ingestion-note](../../../includes/direct-ingestion-note.md)]

## Permissions

You must have at least [Table Ingestor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.ingest-from-storage-queued` `into` `table` [database(*DatabaseName*).]*TableName*

[EnableTracking=EnableTrackingValue]

[SkipBatching=SkipBatchingValue]

[CompressionFactor=CompressionFactorValue]

[with ( *IngestionPropertyName* = *IngestionPropertyValue* [, ...] )]

<|

*SourceDataLocators*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

SkipBatching is false
EnableTracking is false

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | |The name of the database into which to ingest data.  If no database name is provided, the request's context database is used.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table into which to ingest data.|
|*EnableTracking*| `boolean` | | If `true`, the blob ingestion will be tracked so that <span style="background:yellow">TODO</span>. Default is `false`.  |
|*SkipBatching*| `boolean` | | If `true`, the blobs will not be batched (neither together nor with other blobs):  each blob will be ingested individually. Default is `false`.  |
|*CompressionFactor*| `real` | |Compression factor (ratio) between the original size and the compressed size of blobs.  This is useful when blobs are provided in a compressed format to estimate the original size of the data (for batching purposes). |
|*SourceDataLocators*| `string` | :heavy_check_mark:|One or many (maximum 100) [storage connection strings](../../api/connection-strings/storage-connection-strings.md) separated by a return character.  Each connection string must refer to a single file hosted by a storage account.|

> [!NOTE]
> We recommend using [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals) for the *SourceDataLocators*. The service will scrub credentials in internal traces and error messages.

[!INCLUDE [ingestion-properties](../../../includes/ingestion-properties.md)]

## Authentication and authorization

Each storage connection string indicates the authorization method to use for access to the storage. Depending on the authorization method, the principal may need to be granted permissions on the external storage to perform the ingestion.

The following table lists the supported authentication methods and the permissions needed for ingesting data from external storage.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Shared Access (SAS) token](../../api/connection-strings/storage-authentication-methods.md#shared-access-sas-token)|List + Read|This authentication method isn't supported in Gen1.|
|[Microsoft Entra access token](../../api/connection-strings/storage-authentication-methods.md#azure-ad-access-token)||
|[Storage account access key](../../api/connection-strings/storage-authentication-methods.md#storage-account-access-key)||This authentication method isn't supported in Gen1.|
|[Managed identity](../../api/connection-strings/storage-authentication-methods.md#managed-identity)|Storage Blob Data Reader|Reader|

[Impersonation](../../api/connection-strings/storage-authentication-methods.md#impersonation) isn't supported:  with queued ingestion the ingestion can be potentially be done much later where the user context is lost.

## Returns

The command returns one row / one column table:

|Name       |Type      |Description                                                                |
|-----------|----------|---------------------------------------------------------------------------|
|IngestionOperationId |`string`    |The ID used to track this set of blobs (regarless if tracking is enabled or not).

>[!NOTE]
> This command doesn't modify the schema of the table being ingested into. If necessary, the data is "coerced" into this schema during ingestion, not the other way around (extra columns are ignored, and missing columns are treated as null values).

## Examples

### Ingesting one blob

This command queues one blob for ingestion using the cluster's system managed identity.

```kusto
.ingest-from-storage-queued into table database('LogDb').RawLogs
with (
  format='csv',
  ingestionMappingReference='LogMapping',
  ignoreFirstRecord=false  
) <|
  https://mylogs.blob.core.windows.net/logs/2014/03/12/05/logs-a.csv.gz;managed_identity=system
```

