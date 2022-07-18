# Cancel operation command

Cancel a specific running command. This action is useful when the command is taking too long and you want to abort it while running.
The [`.show operations`](../operations.md#show-operations) command will indicate if operation was canceled.

> [!NOTE]
> The cancel operation command is only supported for [`ingest from query commands`](../data-ingestion/ingest-from-query.md), and not for canceling any other commands.

### Syntax

`.cancel` `operation` *OperationId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

### Properties

|Property|Type|Description
|----------------|-------|---|
|OperationId|Guid|The operation ID returned from the control command.|
|ReasonPhrase|String|Describes the reason for canceling the running command.|

### Output

|Output parameter |Type |Description
|---|---|---
|OperationId|Guid|The operation ID of the control command.
|Operation|String|Operation kind.
|StartedOn|DateTime|The start time of the create operation.
|CancellationState|String|One of - `Cancelled successfully` (command was canceled), `Cancel failed` (the command is still running, but can't be canceled at this point).
|ReasonPhrase|String|Reason why cancellation wasn't successful.

An error message will be returned if it is not possible to cancel operation ID because the command is no longer in progress.

### Example

<!-- csl -->
```
.cancel operation 078b2641-f10d-4694-96f8-1ee2b75dda48 with(Reason="Command cancelled by me")
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c078b2641-f10d-4694-96f8-1ee2b75dda48|TableSetOrAppend|2022-07-18 09:03:55.1387320|Canceled successfully|Command cancelled by me|