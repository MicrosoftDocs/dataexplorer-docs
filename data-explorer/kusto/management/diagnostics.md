---
title:  Diagnostic information
description: This article describes Diagnostic information in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/03/2022
---
# Diagnostic information

These commands can be used to display system diagnostic information.

* [`.show capacity`](#show-capacity)
* [`.show operations`](#show-operations)

## .show capacity

### Syntax

`.show` `capacity` *Resource* [`with(``scope` `=` `cluster` | `workloadgroup``)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Paramters

|Name|Type|Required|Description|
|--|--|--|--|
|*Resource*|string||The name of a specific resource for which to return the relevant [capacity policy](../management/capacitypolicy.md) calculation.|

### Returns

Returns the results of a calculation for an estimated cluster capacity for each resource.

The capacity can be based on the [workload group](workload-groups.md) specified in the command or the cluster's total capacity. If unspecified, the default scope is `cluster`.

|Output parameter |Type |Description|
|---|---|---|
|Resource |String |The name of the resource|
|Total |Int64 |The total amount of resources, of type 'Resource', that are available. For example, the number of concurrent ingestions|
|Consumed |Int64 |The amount of resources of type 'Resource' consumed right now|
|Remaining |Int64 |The amount of remaining resources of type 'Resource'|
|Origin |Int64 |The origin of the limit on concurrent requests ([capacity policy](capacitypolicy.md) or [request rate limit policy](request-rate-limit-policy.md))|

**Example output**

|Resource |Total |Consumed |Remaining|Origin|
|---|---|---|---|---|
|ingestions |576 |1 |575|CapacityPolicy/Ingestion|

## .show operations

This command returns a table containing all the administrative operations since the new Admin node was elected.

|Syntax option |Description|
|---|---|
|`.show` `operations`              |Returns all operations that the cluster is processing or have processed|
|`.show` `operations` *OperationId*|Returns the operation status for a specific ID|
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDs|

**Results**

|Output parameter |Type |Description|
|---|---|---|
|ID |String |Operation identifier|
|Operation |String |Admin command alias|
|NodeId |String |If the command is running something remotely, such as DataIngestPull. The node ID will contain the ID of the remote node that is running|
|StartedOn |DateTime |Date/time (in UTC) when the operation started|
|LastUpdatedOn |DateTime |Date/time (in UTC) when the operation last updated. The operation can either be a step inside the operation, or a completion step|
|Duration |DateTime |Time span between LastUpdateOn and StartedOn|
|State |String |Command state, with values "InProgress", "Completed", or "Failed"|
|Status |String |Additional help string that contains the errors for failed operations|

**Example**

|ID |Operation |Node ID |Started On |Last Updated On |Duration |State |Status|
|--|--|--|--|--|--|--|--|
|3827def6-0773-4f2a-859e-c02cf395deaf |SchemaShow | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|841fafa4-076a-4cba-9300-4836da0d9c75 |DataIngestPull |Kusto.Azure.Svc_IN_1 |2015-01-06 08:47:02.0000000 |2015-01-06 08:48:19.0000000 |0001-01-01 00:01:17.0000000 |Completed |
|e198c519-5263-4629-a158-8d68f7a1022f |OperationsShow | |2015-01-06 08:47:18.0000000 |2015-01-06 08:47:18.0000000 |0001-01-01 00:00:00.0000000 |Completed |
|a9f287a1-f3e6-4154-ad18-b86438da0929 |ExtentsDrop | |2015-01-11 08:41:01.0000000 |0001-01-01 00:00:00.0000000 |0001-01-01 00:00:00.0000000 |InProgress |
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified. Enumeration operation may not run |
