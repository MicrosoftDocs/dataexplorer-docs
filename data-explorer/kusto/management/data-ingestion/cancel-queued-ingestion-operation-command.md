---
title: .cancel queued ingestion operation command
description: Learn how to use the `.cancel queued operation` command to cancel a long-running operation.
ms.reviewer: odkadosh
ms.topic: reference
ms.date: 01/12/2025
---
# .cancel queued ingestion operation command

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The `.cancel queued ingestion operation` command cancels an ingestion operation. This command is useful for aborting an ingestion operation that is taking too long to complete.

The cancel operation command is done on a "best effort" basis.  For example, ongoing ingestion processes (in-flight ingestion) might not be canceled.

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
|OperationId | `string` | The operation ID of the operation that was canceled.|
|StartedOn | `datetime` | The start time of the operation that was canceled. |
|ReasonPhrase | `string` | Reason why cancellation wasn't successful. |

## Example

<!-- csl -->
```Kusto
.cancel queued ingestion operation aaaaaaaa-0b0b-1c1c-2d2d-333333333333 with(Reason="Command canceled by me")
```

|OperationId|ReasonPhrase|
|---|---|
|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|Command canceled by me|

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)