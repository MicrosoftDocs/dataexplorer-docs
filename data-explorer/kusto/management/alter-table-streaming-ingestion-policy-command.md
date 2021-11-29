---
title: ".alter table streaming ingestion policy command - Azure Data Explorer"
description: "This article describes the .alter table streaming ingestion policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter table streaming ingestion policy

Change the table streaming policy ingestion. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion targets scenarios requiring low latency, with an ingestion time of less than 10 seconds for varying volume data. You can use it to optimize operational processing when you have many tables in one or more databases, where the data stream into each table is small, say a few records per second, but the overall data ingestion volume is high, thousands of records per second.

Use the classic bulk ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table. 

* To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md).

## Syntax

`.alter` `table` *TableName* `policy` `streamingingestion` *ArrayOfPolicyObjects*

## Arguments

- *TableName* - Specify the name of the table. 
- *ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Returns

Returns a JSON representation of the policy.

## Example

Enable streaming ingestion and determines the suggested allocation rate for the table:

```kusto
.alter table StormEvents policy streamingingestion '{"IsEnabled": true, "HintAllocatedRate": 2.1}'
```