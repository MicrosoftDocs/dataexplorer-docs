---
title: .cancel operation command
description: Learn how to use the `.cancel operation` command to cancel a long-running operation.
ms.reviewer: odkadosh
ms.topic: reference
ms.date: 05/24/2023
---
# .cancel operation command

This command cancels a long-running ingest from query operation. This command is useful when the operation is taking too long and you would like to abort it while running.

The cancel operation command isn't guaranteed to succeed. The output of the `.cancel operation` command indicates whether or not cancellation was successful.

> [!NOTE]
> The cancel operation command is only supported for [ingest from query commands](data-ingestion/ingest-from-query.md), and not for canceling any other commands.

## Syntax

`.cancel` `operation` *OperationId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *OperationId* | `guid` |  :heavy_check_mark: | A guid of the operation ID returned from the running command.|
| *ReasonPhrase* | `string` | | The reason for canceling the running command.|

## Returns

|Output parameter |Type |Description
|---|---|---
|OperationId | `guid` | The operation ID of the operation that was canceled.
|Operation | `string` | The operation kind that was canceled.
|StartedOn | `datetime` | The start time of the operation that was canceled.
|CancellationState | `string` | Returns one of the following options: <br> `Cancelled successfully`: the operation was canceled <br> `Cancel failed`: the operation can't be canceled at this point. The operation may still be running or may have completed.
|ReasonPhrase | `string` | Reason why cancellation wasn't successful.

## Example

<!-- csl -->
```Kusto
.cancel operation 078b2641-f10d-4694-96f8-1ee2b75dda48 with(Reason="Command canceled by me")
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c078b2641-f10d-4694-96f8-1ee2b75dda48|TableSetOrAppend|2022-07-18 09:03:55.1387320|Canceled successfully|Command canceled by me|
