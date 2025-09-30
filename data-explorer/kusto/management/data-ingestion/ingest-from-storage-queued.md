---
title:  .ingest-from-storage-queued into command
description: This article describes the `.ingest-from-storage-queued` `into` command used to ingest a storage folder in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 09/30/2025
---
# .ingest-from-storage-queued command (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.ingest-from-storage-queued` command is used to queue blobs for ingestion into a table. It supports ingestion of individual blobs by URL, multiple blobs from a source file, specific folders, or an entire storage container. 
This command is useful for testing and managing ingestion scenarios, helping ensure that schema, partitioning, and other configurations are correctly applied.

[!INCLUDE [direct-ingestion-note](../../includes/direct-ingestion-note.md)]

> [!NOTE]
>
> Queued ingestion commands are run on the data ingestion URI endpoint `https://ingest-<YourClusterName><Region>.kusto.windows.net`.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.ingest-from-storage-queued` `into` `table` [database(*DatabaseName*).]*TableName*[`EnableTracking`=*EnableTracking*] [`SkipBatching`=*SkipBatching*] [`CompressionFactor`=*CompressionFactor*] [with (*IngestionPropertyName* = *IngestionPropertyValue* [, ...])] `<|` *IngestionSource*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark: |The name of the database into which to ingest data. If no database name is provided, the request's context database is used.|
|*TableName*| `string` | :heavy_check_mark: |The name of the table into which to ingest data.|
|*EnableTracking*| `boolean` | | Determines whether to track the blob ingestion. For more information, see [.show queued ingestion operations command](show-queued-ingestion-operations.md). The default is `false`.|
|*SkipBatching*| `boolean` | | If set to  `true`, the blobs are ingested individually rather than batched together with other blobs. The default value is `false`.|
|*CompressionFactor*| `real` | |The compression factor (ratio) between the original size and the compressed size of blobs. Compression factor is used to estimate the original size of the data for batching purposes, when blobs are provided in a compressed format.|
|*IngestionPropertyName*, *IngestionPropertyValue* | `string` | |Optional ingestion properties. For more information about ingestion properties, see [Data ingestion properties](../../ingestion-properties.md).|
|*IngestionSource* | `string` | :heavy_check_mark: | The ingestion source. The source can be a URL, source file, or a list of blobs returned using the [.list blobs](list-blobs.md) command. |

> [!NOTE]
> The `.list blobs` command can be used with the `.ingest-from-storage-queued` command to return the blobs you want to ingest. For detailed information about the command and a full list of its parameters, see [.list blobs command](list-blobs.md).

## Returns

The result of the command is a table with one row and one column.

| Name | Type | Description |
|--|--|--|
| IngestionOperationId | `string` | A unique ID used to track the set of blobs, whether or not tracking is enabled. |
| ClientRequestId | `string` | The client request ID of the command. |
| OperationInfo | `string` | Displays the command to run to retrieve the current status of the operation. |

>[!NOTE]
> This command doesn't modify the schema of the target table. If necessary, the data is converted to fit the table's schema during ingestion. Extra columns are ignored and missing columns are treated as null values.

## Examples

The examples in this section show how to use the syntax to help you get started.

### Ingest blobs from files

The following example queues blobs from source files.

```kusto
.ingest-from-storage-queued into table database ('MyDatabase').mytable
EnableTracking=true
with (
  format='csv',
  ingestionMappingReference='MyMapping'
)
<| 'https://https://sample.blob.core.windows.net/sample/test_1.csv?...'
   'https://https://sample.blob.core.windows.net/sample/test_2.csv?...'
   'https://https://sample.blob.core.windows.net/sample/test_3.csv?...'
```

>[!NOTE]
> Make sure to include a SAS token or use a managed identity to grant the service permission to access and download the blob.

### Ingest all blobs in a folder

The following example queues all blobs within a folder for ingestion using the cluster's system managed identity.

```kusto
.ingest-from-storage-queued into table database('LogDb').RawLogs
EnableTracking=true
with (
  format='csv',
  ingestionMappingReference='LogMapping',
  ignoreFirstRecord=false  
)
<|
  .list blobs (
      "https://mystorageaccount.blob.core.windows.net/datasets/myfolder;managed_identity=system"
  )
```

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.list blobs command](list-blobs.md)
* [.ingest into](ingest-into-command.md)
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
