---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 03/19/2025
---
# .cancel queued ingestion operation command (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.cancel queued ingestion operation` command cancels an ingestion operation. This command is useful for aborting an ingestion operation that is taking too long to complete.

The cancel operation command is done on a best effort basis. For example, ongoing ingestion processes or in-flight ingestion, might not get canceled.

> [!NOTE]
>
> Queued ingestion commands are run on the data ingestion URI endpoint `https://ingest-<YourClusterName><Region>.kusto.windows.net`.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.cancel queued ingestion operation` *IngestionOperationId*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *IngestionOperationId* | `string` |  :heavy_check_mark: | The unique ingestion operation ID returned from the running command.|

## Returns

|Output parameter |Type |Description|
|---|---|---|
|IngestionOperationId | `string` |The unique operation identifier.|
|StartedOn | `datetime` |Date/time, in UTC, at which the `.ingest-from-storage-queued` was executed.|
|LastUpdatedOn | `datetime` |Date/time, in UTC, when the status was updated.|
|State | `string` |The state of the operation.|
|Discovered | `long` |Count of the blobs that were listed from storage and queued for ingestion.|
|Pending | `long` |Count of the blobs to be ingested.|
|Canceled | `long` |Count of the blobs that were canceled due to a call to the [.cancel queued ingestion operation](cancel-queued-ingestion-operation-command.md) command.|
|Ingested | `long` |Count of the blobs that have been ingested.|
|Failed | `long` |Count of the blobs that failed **permanently**.|
|SampleFailedReasons | `string` |A sample of reasons for blob ingestion failures.|
|Database | `string` |The database where the ingestion process is occurring.|
|Table | `string` | The table where the ingestion process is occurring.|

## Example

The following example cancels the ingestion of operation `00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444`.

```Kusto
.cancel queued ingestion operation '00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444'
```

|IngestionOperationId|Started On |Last Updated On |State |Discovered |Pending| Canceled | Ingested |Failed|SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-03-20 15:03:11.0000000 ||Canceled | 10 |10 |0 |0 |0 | |TestDatabase|Logs|

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued command](ingest-from-storage-queued.md)
