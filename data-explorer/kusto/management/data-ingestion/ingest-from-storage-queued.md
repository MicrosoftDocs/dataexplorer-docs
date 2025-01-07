---
title:  Queue ingest storage folder
description: This article describes the DM queued ingest command used to ingest a storage folder in Azure Data Explorer.
ms.reviewer: ???
ms.topic: reference
ms.date: 11/19/2024
---
# Queued ingest storage folder

The `.ingest-from-storage-queued into` command used with the [`.list blobs`](list-blobs.md) queues blobs for ingestion into a table.  It allows to ingest an entire storage container or a folder within a container (more precisely all blobs satisfying a prefix and suffix).

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

*.list blobs command*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | |The name of the database into which to ingest data.  If no database name is provided, the request's context database is used.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table into which to ingest data.|
|*EnableTracking*| `boolean` | | If `true`, the blob ingestion will be tracked so that <span style="background:yellow">TODO</span>. Default is `false`.  |
|*SkipBatching*| `boolean` | | If `true`, the blobs will not be batched (neither together nor with other blobs):  each blob will be ingested individually. Default is `false`.  |
|*CompressionFactor*| `real` | |Compression factor (ratio) between the original size and the compressed size of blobs.  This is useful when blobs are provided in a compressed format to estimate the original size of the data (for batching purposes). |

The [*.list blobs command*](list-blobs.md) is a valid command returning the blobs you want to ingest.

## Returns

The command returns one row / one column table:

|Name       |Type      |Description                                                                |
|-----------|----------|---------------------------------------------------------------------------|
|IngestionOperationId |`string`    |The ID used to track this set of blobs (regarless if tracking is enabled or not).
|ClientRequestId |`string`    |The client request ID of the command.
|OperationInfo |`string`    |The text of the command to run to get the status of the operation

>[!NOTE]
> This command doesn't modify the schema of the table being ingested into. If necessary, the data is "coerced" into this schema during ingestion, not the other way around (extra columns are ignored, and missing columns are treated as null values).

## Examples

### Ingesting all blobs in a folder

This command queues all blobs under a folder for ingestion using the cluster's system managed identity.

```kusto
.ingest-from-storage-queued into table database('LogDb').RawLogs
with (
  format='csv',
  ingestionMappingReference='LogMapping',
  ignoreFirstRecord=false  
)
EnableTracking=true
<|
  .list blobs (
      "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
  )
```

