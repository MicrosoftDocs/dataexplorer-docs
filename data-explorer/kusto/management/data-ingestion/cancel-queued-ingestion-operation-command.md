---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: odkadosh
ms.topic: reference
ms.date: 02/04/2025
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

The following example cancels the ingestion of operation `aaaaaaaa-0b0b-1c1c-2d2d-333333333333` and provides a reason.

<!-- csl -->
```Kusto
.cancel queued ingestion operation aaaaaaaa-0b0b-1c1c-2d2d-333333333333 with(Reason="Command canceled by me")
```

|OperationId|ReasonPhrase|
|---|---|
|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|Command canceled by me|

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued into command](ingest-from-storage-queued.md)
