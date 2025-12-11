---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 12/10/2025
---
# .cancel queued ingestion operation command

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.cancel queued ingestion operation` command cancels an ingestion operation. Use this command to stop an ingestion operation that takes too long to finish.

The cancel operation command works on a best-effort basis. For example, ongoing ingestion processes or in-flight ingestion might not be canceled.

> [!NOTE]
>
> Queued ingestion commands run on the data ingestion URI endpoint `https://ingest-<YourClusterName><Region>.kusto.windows.net`.

## Permissions

You need at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.cancel queued ingestion operation` *IngestionOperationId*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *IngestionOperationId* | `string` |  :heavy_check_mark: | The unique ingestion operation ID returned by the running command.|

## Returns

|Output parameter |Type |Description|
|---|---|---|
|IngestionOperationId | `string` |The unique operation identifier.|
|StartedOn | `datetime` |Date and time, in UTC, when the `.ingest-from-storage-queued` operation is executed.|
|LastUpdatedOn | `datetime` |Date and time, in UTC, when the status is updated.|
|State | `string` |The state of the operation.|
|Discovered | `long` |Count of the blobs that were listed from storage and queued for ingestion.|
|Pending | `long` |Count of the blobs to be ingested.|
|Canceled | `long` |Count of the blobs that are canceled due to a call to the [.cancel queued ingestion operation](cancel-queued-ingestion-operation-command.md) command.|
|Ingested | `long` |Count of the blobs that have been ingested.|
|Failed | `long` |Count of the blobs that fail **permanently**.|
|SampleFailedReasons | `string` |A sample of reasons for blob ingestion failure.|
|Database | `string` |The database where the ingestion process is occurring.|
|Table | `string` | The table where the ingestion process is occurring.|

## Example

This example cancels the ingestion operation `00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444`.

```Kusto
.cancel queued ingestion operation '00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444'
```

|Ingestion operation ID|Started on|Last updated on|State|Discovered|Pending|Canceled|Ingested|Failed|Sample failed reasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444|2025-03-20 15:03:11.0000000||Canceled|10|10|0|0|0||TestDatabase|Logs|

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued into command](ingest-from-storage-queued.md)
