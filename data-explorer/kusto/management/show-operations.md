---
title:  .show operations command
description: Learn how to use the `.show operations` command to view a log of the administrative operations that are currently running or completed.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---

# .show operations command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Kusto maintains an internal log of running and historic operations that it processes, such as ingestion operations and data management operations.
Entries are appended to the log when operations start and change their state, including when operations reach their terminal state.
Users can view the ongoing and past operations they started by using the `.show operations` command.
Database administrators can view all operations that apply to the databases they administer.

The `.show operations` command returns general details about all operations running on the cluster. Some of the operations also support retrieving the operation's results by using the [`.show operation details`](show-operation-details.md) command.

## Syntax

`.show operations` [ *OperationId* ]

`.show operations` `(` *OperationId* [`,` ... ] `)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *OperationId* | `guid` | | The operation ID for which to show details.|

## Returns

When an operation ID is omitted, the command returns a table displaying all administrative operations executed in the last two weeks, whether ongoing or completed. It includes entries accessible to the user, with multiple records possible for a single operation. Only one record indicates the terminal state of 'Completed' or 'Failed.' This mode is for checking the history of operations. Records may take a short time to appear in the historical log. 
You can use [arg_max()](../query/arg-max-aggregation-function.md) over the results of the historical log to view the latest state for each operation ID (see [examples](#example)).

When one or more operation IDs are provided, the command returns the latest update for each ID, given the user's access and the record being less than 6 hours old. This mode helps quickly check the latest status of recently executed operations.

The output table contains the following information:

|Output parameter |Type |Description|
|---|---|---|
|OperationId | `string` |Operation Identifier|
|Operation | `string` |Admin command alias|
|NodeId | `string` |If the command has a remote execution (for example, DataIngestPull) - NodeId will contain the ID of the executing remote node|
|StartedOn | `datetime` |Date/time (in UTC) when the operation started|
|LastUpdatedOn | `datetime` |Date/time (in UTC) when the operation last updated (can be either a step inside the operation, or a completion step)|
|Duration | `datetime` |TimeSpan between LastUpdateOn and StartedOn|
|State | `string` |Command state, as listed in the **State table**|
|Status | `string` |Additional help string that contains errors of failed operations|

**State table**

The following table describes the possible values for the result table's *State* column:

|Value             |Description|
|------------------|-----------|
|InProgress        |The operation is still running|
|Completed         |The operation completed (successfully)|
|Failed            |The operation completed (unsuccessfully)|
|PartiallySucceeded|The operation completed (parts of it successfully and part of it not)|
|Abandoned         |The operation was abandoned before completion|
|BadInput          |The operation didn't start executing as there was bad input|
|Scheduled         |The operation is scheduled for execution|
|Throttled         |The operation has been aborted due to throttling|
|Canceled         |The operation has been canceled by the user|
|Skipped           |The operation was skipped (due to some logical condition provided as the operation input)|

## Example

The following command returns the latest state per operation ID for operations that started after `2026-01-05`:

```kusto
.show operations 
| where StartedOn > datetime(2026-01-05)
| summarize arg_max(LastUpdatedOn, *) by OperationId
| project OperationId, Operation, StartedOn, LastUpdatedOn, Duration, State
```

|OperationId|Operation|StartedOn|LastUpdatedOn|Duration|State|
|---|---|---|---|---|---|
|62e40fad-516c-4133-814f-f509e889d006|DataIngestPull|2026-01-05 18:57:10.4234023|2026-01-05 18:57:53.4074572|00:00:42.9840549|Completed|
|989b527f-20da-48fe-ae22-deba91e20764|OperationsShow|2026-01-05 18:57:54.1959438|2026-01-05 18:57:54.2036051|00:00:00.0076613|Completed|
|1671b635-b42c-45c6-928c-ad3f3436cb75|TableAppend|2026-01-05 18:58:13.3479575|2026-01-05 18:58:13.3974038|00:00:00.0494463|InProgress|
|55bc427e-d576-40dc-bd38-58f9df34d357|DatabasesShow|2026-01-05 18:58:49.4693980|2026-01-05 18:58:49.4697805|00:00:00.0003825|Completed|

The following command returns the entire log (not only latest state) for operation with ID `b152f9da-616a-40a7-8cde-f2390cfc8064`:

```kusto
.show operations 
| where LastUpdatedOn >  ago(1h)
| where OperationId == "b152f9da-616a-40a7-8cde-f2390cfc8064"
| project OperationId, Operation, StartedOn, LastUpdatedOn, Duration, State, Status
```

|OperationId|Operation|StartedOn|LastUpdatedOn|Duration|State|Status|
|---|---|---|---|---|---|---|
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:36.8136477|00:00:00.0000758|InProgress||
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:36.8143127|00:00:00.0006764|InProgress|Assigned|
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:36.8146015|00:00:00.0009574|InProgress|Assigned|
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:40.2102817|00:00:03.3966431|InProgress|Extent(s) created; metadata updated; cluster map updated|
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:40.2103713|00:00:03.3967237|Completed|Extent(s) created; metadata updated; cluster map updated|

The following command returns only the latest state for the same operation. Operations that completed over 6 hours ago will not be returned using this method. Use the options above to query for entries that are older than 6 hours.

```kusto
.show operations b152f9da-616a-40a7-8cde-f2390cfc8064
| project OperationId, Operation, StartedOn, LastUpdatedOn, Duration, State, Status
```

|OperationId|Operation|StartedOn|LastUpdatedOn|Duration|State|Status|
|---|---|---|---|---|---|---|
|b152f9da-616a-40a7-8cde-f2390cfc8064|DataIngestPull|2026-01-06 09:33:36.8136476|2026-01-06 09:33:40.2103713|00:00:03.3967237|Completed|Extent(s) created; metadata updated; cluster map updated|

## Related content

* [.show operation details](show-operation-details.md)
