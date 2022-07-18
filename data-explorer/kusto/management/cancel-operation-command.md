# Cancel operation command

Cancel a long running command. This command is useful when the command is taking too long and you would like to abort it while running.
The command isn't guaranteed to succeed. The output of the `.cancel operation` command indicates whether cancelation was successful. If operation was successfully canceled, it will complete with Canceled State in [`.show operations`](../operations.md#show-operations) command.

> [!NOTE]
> The cancel operation command is only supported for [`ingest from query commands`](../data-ingestion/ingest-from-query.md), and not for canceling any other commands.

### Syntax

`.cancel` `operation` *OperationId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

### Properties

|Property|Type|Description
|----------------|-------|---|
|OperationId|Guid|The operation ID returned from the canceled command.|
|ReasonPhrase|String|Describes the reason for canceling the running command.|

### Output

|Output parameter |Type |Description
|---|---|---
|OperationId|Guid|The operation ID of the canceled command.
|Operation|String|Operation kind of the canceled command.
|StartedOn|DateTime|The start time of the canceled command.
|CancellationState|String|One of - `Cancelled successfully` (command was canceled), `Cancel failed` (command was ended or is still running but it cannot be canceled at this point).
|ReasonPhrase|String|Reason why cancellation wasn't successful.

### Example

<!-- csl -->
```
.cancel operation 078b2641-f10d-4694-96f8-1ee2b75dda48 with(Reason="Command cancelled by me")
```

|OperationId|Operation|StartedOn|CancellationState|ReasonPhrase|
|---|---|---|---|---|
|c078b2641-f10d-4694-96f8-1ee2b75dda48|TableSetOrAppend|2022-07-18 09:03:55.1387320|Canceled successfully|Command cancelled by me|