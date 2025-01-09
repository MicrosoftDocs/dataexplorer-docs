---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: odkadosh
ms.topic: reference
ms.date: 12/04/2024
---
# .cancel queued ingestion operation command

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This command cancels an ingestion operation.  This command is useful when the operation is taking too long and you would like to abort it while running.

The cancel operation command is done on "best effort" conditions.  For example, in flight ingestion will no be cancelled.

## Syntax

`.cancel queued ingestion operation` *OperationId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *OperationId* | `string` |  :heavy_check_mark: | Operation Id returned from the running command.|
| *ReasonPhrase* | `string` | | The reason for canceling the running command.|

## Returns

|Output parameter |Type |Description
|---|---|---
|OperationId | `string` | The operation ID of the operation that was canceled.|
|StartedOn | `datetime` | The start time of the operation that was canceled. |
|ReasonPhrase | `string` | Reason why cancellation wasn't successful. |

## Example

<!-- csl -->
```Kusto
.cancel queued ingestion operation 750ba8ea-28bc-4284-9d1d-edbbb32cbbce with(Reason="Command canceled by me")
```

|OperationId|ReasonPhrase|
|---|---|
|750ba8ea-28bc-4284-9d1d-edbbb32cbbce|Command canceled by me|

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)