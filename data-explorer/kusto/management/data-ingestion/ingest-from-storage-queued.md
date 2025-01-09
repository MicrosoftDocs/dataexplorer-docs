---
title:  .ingest-from-storage-queued into
description: This article describes the DM queued ingest command used to ingest a storage folder in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 11/19/2024
---
# .ingest-from-storage-queued into

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.ingest-from-storage-queued into` command is used with the [`.list blobs`](list-blobs.md) to queue blobs for ingestion into a table.  It allows you to ingest an entire storage container or a folder within a container. More precisely, it allows you to ingest all blobs satisfying a prefix and suffix.

[!INCLUDE [direct-ingestion-note](../../../includes/direct-ingestion-note.md)]

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.ingest-from-storage-queued` `into` `table` [database(*DatabaseName*).]*TableName*

[EnableTracking=EnableTrackingValue]

[SkipBatching=SkipBatchingValue]

[CompressionFactor=CompressionFactorValue]

[with ( *IngestionPropertyName* = *IngestionPropertyValue* [, ...] )]

<|

*.list blobs command*
<!-- clarify whether the list blobs command should be there, and if the syntax/parameters are correct.-->

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | |The name of the database into which to ingest data.  If no database name is provided, the request's context database is used.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table into which to ingest data.|
|*EnableTracking*| `boolean` | | Determines whether blob ingestion is tracked. The default `false`. <so that <span style="background:yellow">TODO</span>.  |
|*SkipBatching*| `boolean` | | Determines whether to skip batching blobs together or with other blobs. When set to `true`, each blob will be ingested individually. Default is `false`.  |
|*CompressionFactor*| `real` | | The compression factor (ratio) between the original size and the compressed size of blobs. This parameter helps estimate the original size of the data, for batching purposes, when blobs are provided in a compressed format. |

<!--not sure what is meant here-->
The [*.list blobs command*](list-blobs.md) is a valid command returning the blobs you want to ingest.

## Returns

The command returns one row / one column table:

| Name | Type | Description |
|--|--|--|
| IngestionOperationId | `string` | A unique ID used to track this set of blobs (regarless if tracking is enabled or not). |
| ClientRequestId | `string` | The client request ID of the command. |
| OperationInfo | `string` | The text of the command to run to get the status of the operation |

<!--is this IngestionOperationId or OperationId like in ingest from storage? |OperationId|`guid`    |A unique ID representing the operation. Can be used with the `.show operation` command.| Are there now more returns?-->

>[!NOTE]
> This command doesn't modify the schema of the target table. If necessary, the data is "coerced" into the table's schema during ingestion. Extra columns are ignored and missing columns are treated as null values.

<!--mapped rather than cooerced? missing columns are filled with null values?-->

## Examples

### Ingesting all blobs in a folder

The following example queues all blobs inside a folder for ingestion using the cluster's system managed identity.

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

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [Ingest from storage](ingest-from-storage.md)
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
* [List blobs from storage](list-blobs.md)