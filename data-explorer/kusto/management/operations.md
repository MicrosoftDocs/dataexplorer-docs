---
title:  .show operation command
description: Learn how to use the `.show operation` command to view a log of the administrative operations that are currently running or completed.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/29/2023
---

# .show operation command

Kusto maintains an internal log of running and historic operations that it processes, such as ingestion operations and data management operations.
Entries are appended to the log when operations start and change their state, including when operations reach their terminal state.
Users can view the ongoing and past operations they started by using the [`.show operations`](#show-operations) management command.
Database administrators can view all operations that apply to the databases they administer.

Users can also view the results of an operation by using the [`.show operation details`](#show-operations)
command. Normally, the results are returned as part of `.show operations` command itself. For asynchronous
management commands, the `.show operation details` command is the only way to view the command's results.

## .show operations

The `.show operations` command returns a table with all administrative operations, both running and completed,
which were executed in the last two weeks. The command may run in two "modes":

* **Log mode**: In this mode, all entries in the log that the user has access to
  are returned. Multiple records might be returned for a single operation. Up to one record indicates the terminal state of `Completed` or `Failed`. This mode is used when the command doesn't indicate the operation ID(s).

* **Latest update mode**: In this mode, the latest updated record for each operation ID
  provided by the user is returned. This mode is used when the command indicates which operation ID(s) to inspect.

**Syntax**

|Syntax option|Description|
|---|---|
|`.show` `operations`              |Returns all operations that the cluster is processing or operations the cluster has processed|
|`.show` `operations` *OperationId*|Returns operation status for a specific ID|
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDs|

**Results**

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

**Example**

|ID |Operation |Node ID |Started On |Last Updated On |Duration |State |Status |
|--|--|--|--|--|--|--|--|
|3827def6-0773-4f2a-859e-c02cf395deaf |SchemaShow | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|841fafa4-076a-4cba-9300-4836da0d9c75 |DataIngestPull |Kusto.Azure.Svc_IN_1 |2015-01-06 08:47:02.0000000 |2015-01-06 08:48:19.0000000 |0001-01-01 00:01:17.0000000 |Completed |
|e198c519-5263-4629-a158-8d68f7a1022f |OperationsShow | |2015-01-06 08:47:18.0000000 |2015-01-06 08:47:18.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|a9f287a1-f3e6-4154-ad18-b86438da0929 |ExtentsDrop | |2015-01-11 08:41:01.0000000 |0001-01-01 00:00:00.0000000 |0001-01-01 00:00:00.0000000 |InProgress |
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified. Enumeration operation may not execute. |

## .show operation details

Operations can (optionally) persist their results, and the results can be retrieved when the operation is complete, using `.show` `operation` `details`.

> [!NOTE]
> Not all management commands persist their results. Those commands that do, usually do so by default on asynchronous executions only, using the `async` keyword. See the documentation for the specific command and check if it does. For example, see [data export](data-export/index.md).
> The output schema of the `.show` `operations` `details` command is the same schema returned from the synchronous execution of the command.
> The `.show` `operation` `details` command can only be invoked after the operation completed successfully. Use the [show operations command](#show-operations) to check the state of the operation, before running this command.

**Syntax**

`.show` `operation` *OperationId* `details`

**Results**

The result is different per type of operation, and matches the schema of the operation result, when executed synchronously.

**Examples**

The *OperationId* in the example, returns from an asynchronous execution of one
of the [data export](../management/data-export/index.md) commands.

```kusto
.export 
  async 
  to csv ( 
    h@"https://storage1.blob.core.windows.net/containerName;secretKey", 
    h@"https://storage1.blob.core.windows.net/containerName2;secretKey" 
  ) 
  <| myLogs 
```

The async export command returned the following operation ID:

|OperationId|
|---|
|56e51622-eb49-4d1a-b896-06a03178efcd|

This operation ID can be used when the command has completed to query the exported blobs.

```kusto
.show operation 56e51622-eb49-4d1a-b896-06a03178efcd details 
```

|Path|NumRecords |
|---|---|
|http://storage1.blob.core.windows.net/containerName/1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/2_454c0f1359e24795b6529da8a0101330.csv|15|
