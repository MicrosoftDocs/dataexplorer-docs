---
title: Operations - Azure Kusto | Microsoft Docs
description: This article describes Operations in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Operations

## .show operations 

`.show` `operations` command returns a table with all administrative operations, both running and completed, which were executed in the last two weeks (which is currently the retention period configuration).

**Syntax**

|||
|---|---| 
|`.show` `operations`              |Returns all operations that Admin node processed or is processing since 
|`.show` `running`   `operations`  |Returns all operations that Admin node is processing right now 
|`.show` `completed` `operations`  |Returns all operations that Admin node processed since  
|`.show` `operations` *OperationId*|Returns operation status for specific ID 
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDS 

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