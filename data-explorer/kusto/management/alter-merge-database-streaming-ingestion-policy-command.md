---
title: .alter-merge database streaming ingestion policy command - Azure Data Explorer
description: This article describes the .alter-merge database streaming ingestion policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge database streaming ingestion policy

Change the database streaming ingestion policy. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (a few records per second) but the overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table. 

To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md). Streaming ingestion must be enabled on the cluster level before it can be used at the database level.

## Permissions

You must have [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `streamingingestion` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database. 
*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns enables streaming ingestion and determines the suggestion allocated rate for the database:

```kusto
.alter-merge database MyDatabase policy streamingingestion 
'{"IsEnabled": true, "HintAllocatedRate": 1.5}'
```

The following command disables the streaming ingestion policy:

```kusto
.alter-merge database MyDatabase policy streamingingestion 
'{"IsEnabled": false}'
```
