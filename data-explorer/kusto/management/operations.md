---
title: Operations management - Azure Data Explorer | Microsoft Docs
description: This article describes Operations management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019

---
# Operations management

## .show operations

`.show` `operations` command returns a table with all administrative operations, both running and completed, which were executed in the last two weeks (which is currently the retention period configuration).

**Syntax**

|||
|---|---| 
|`.show` `operations`              |Returns all operations that the cluster has processed or is processing 
|`.show` `operations` *OperationId*|Returns operation status for a specific ID 
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDs

**Results**
 
|Output parameter |Type |Description 
|---|---|---
|Id |String |Operation Identifier.
|Operation |String |Admin command alias 
|NodeId |String |If the command has a remote execution (e.g. DataIngestPull) - NodeId will contain the id of the executing remote node 
|StartedOn |DateTime |Date/time (in UTC) when the operation has started 
|LastUpdatedOn |DateTime |Date/time (in UTC) when the operation last updated (can be either a step inside the operation, or a completion step) 
|Duration |DateTime |TimeSpan between LastUpdateOn and StartedOn 
|State |String |Command state: can have values of "InProgress", "Completed" or "Failed" 
|Status |String |Additional help string that either holds errors for failed operations 
 
**Example**
 
|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |SchemaShow | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |Completed | 
|841fafa4-076a-4cba-9300-4836da0d9c75 |DataIngestPull |Kusto.Azure.Svc_IN_1 |2015-01-06 08:47:02.0000000 |2015-01-06 08:48:19.0000000 |0001-01-01 00:01:17.0000000 |Completed | 
|e198c519-5263-4629-a158-8d68f7a1022f |OperationsShow | |2015-01-06 08:47:18.0000000 |2015-01-06 08:47:18.0000000 |0001-01-01 00:00:00.0000000 |Completed | 
|a9f287a1-f3e6-4154-ad18-b86438da0929 |ExtentsDrop | |2015-01-11 08:41:01.0000000 |0001-01-01 00:00:00.0000000 |0001-01-01 00:00:00.0000000 |InProgress | 
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified; enumeration operation may not execute. 

## .show operation details

Operations can (optionally) persist their results, and these can be retrieved when the operation is complete using the `.show` `operation` `details` 

**Notes:**

* Not all control commands persist their results, and those that do usually do so by default on asynchronous executions only (using the `async` keyword). Please search the documentation for the specific command and check if it does (see, for example [data export](data-export/index.md)). 
* The output schema of the `.show` `operations` `details` command is the same schema returned from the synchronous execution of the command. 
* The `.show` `operation` `details` command can only be invoked after the operation completed successfully. Use the [show operations command](#show-operations)) to check the State of the operation prior to invoking this command. 

**Syntax**

`.show` `operation` *OperationId* `details`

**Results**

The result is different per type of operation and matches the schema of the operation result, when executed synchronously. 

**Examples**

The *OperationId* in this example is one returned from an asynchronous execution of one
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
The async export command returned the following operation id:

|OperationId|
|---|
|56e51622-eb49-4d1a-b896-06a03178efcd|

This operation id can be used when the command has completed to query the exported blobs, as follows: 

```
.show operation 56e51622-eb49-4d1a-b896-06a03178efcd details 
```

**Results**

|Path|NumRecords|
|---|---|
|http://storage1.blob.core.windows.net/containerName/1_d08afcae2f044c1092b279412dcb571b.csv|10|
|http://storage1.blob.core.windows.net/containerName/2_454c0f1359e24795b6529da8a0101330.csv|15|