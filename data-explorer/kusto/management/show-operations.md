---
title:  .show operations command
description: Learn how to use the `.show operations` command to view a log of the administrative operations that are currently running or completed.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/30/2023
---

# .show operations command

Kusto maintains an internal log of running and historic operations that it processes, such as ingestion operations and data management operations.
Entries are appended to the log when operations start and change their state, including when operations reach their terminal state.
Users can view the ongoing and past operations they started by using the `.show operations` command.
Database administrators can view all operations that apply to the databases they administer.

Users can also view the results of an operation by using the [`.show operation details`](show-operation-details.md)
command. Normally, the results are returned as part of `.show operations` command itself. For asynchronous
management commands, the `.show operation details` command is the only way to view the command's results.

## Syntax

`.show operations` [ *OperationId* ]

`.show operations` `(` *OperationId* [`,` ... ] `)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *OperationId* | `guid` | | The operation ID for which to show details.|

## Returns

When an operation ID is omitted, the command returns a table displaying all administrative operations executed in the last two weeks, whether ongoing or completed. It includes entries accessible to the user, with multiple records possible for a single operation. Only one record indicates the terminal state of 'Completed' or 'Failed.' This mode is for checking the history of operations, but note that records may take time to appear in the historic log.

When one or more operation IDs are provided, the command returns the latest update for each ID, given the user's access and the record being less than 6 hours old. This mode helps quickly check the latest status of recently executed operations.

The output table contains the following information:

|Output parameter |Type |Description|
|---|---|---|
|OperationId |String |Operation Identifier|
|Operation |String |Admin command alias|
|NodeId |String |If the command has a remote execution (for example, DataIngestPull) - NodeId will contain the ID of the executing remote node|
|StartedOn |DateTime |Date/time (in UTC) when the operation started|
|LastUpdatedOn |DateTime |Date/time (in UTC) when the operation last updated (can be either a step inside the operation, or a completion step)|
|Duration |DateTime |TimeSpan between LastUpdateOn and StartedOn|
|State |String |Command state, as listed in the **State table**|
|Status |String |Additional help string that contains errors of failed operations|

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

```kusto
.show operations
```

|ID |Operation |Node ID |Started On |Last Updated On |Duration |State |Status |
|--|--|--|--|--|--|--|--|
|3827def6-0773-4f2a-859e-c02cf395deaf |SchemaShow | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|841fafa4-076a-4cba-9300-4836da0d9c75 |DataIngestPull |Kusto.Azure.Svc_IN_1 |2015-01-06 08:47:02.0000000 |2015-01-06 08:48:19.0000000 |0001-01-01 00:01:17.0000000 |Completed |
|e198c519-5263-4629-a158-8d68f7a1022f |OperationsShow | |2015-01-06 08:47:18.0000000 |2015-01-06 08:47:18.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|a9f287a1-f3e6-4154-ad18-b86438da0929 |ExtentsDrop | |2015-01-11 08:41:01.0000000 |0001-01-01 00:00:00.0000000 |0001-01-01 00:00:00.0000000 |InProgress |
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified. Enumeration operation may not execute. |

## Related content

* [.show operation details](show-operation-details.md)
