---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: odkadosh
ms.topic: reference
ms.date: 02/09/2025
---
# .cancel queued ingestion operation command

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.cancel queued ingestion operation` command cancels an ingestion operation. This command is useful for aborting an ingestion operation that is taking too long to complete.

The cancel operation command is done on a best effort basis. For example, ongoing ingestion processes or in-flight ingestion, might not get canceled.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.cancel queued ingestion operation` *OperationId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *OperationId* | `string` |  :heavy_check_mark: | The unique ingestion operation ID returned from the running command.|
| *ReasonPhrase* | `string` | | The reason for canceling the running command.|

## Returns

|Output parameter |Type |Description|
|---|---|---|
|OperationId | `string` | The operation ID of the canceled operation.|
|StartedOn | `datetime` | The start time of the canceled operation. |
|ReasonPhrase | `string` | Reason the cancellation wasn't successful. |

## Example

The following example cancels the ingestion of operation `00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444` and provides a reason.

```Kusto
.cancel queued ingestion operation '00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444' with(Reason="Command canceled by me")
```

|OperationId|ReasonPhrase|
|---|---|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444|Command canceled by me|

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued into command](ingest-from-storage-queued.md)
