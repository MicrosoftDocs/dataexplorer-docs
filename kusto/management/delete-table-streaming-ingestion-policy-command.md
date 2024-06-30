---
title: .delete table policy streamingingestion command
description: Learn how to use the `.delete table policy streamingingestion` command to delete a table's streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy streamingingestion command

Delete the table streaming ingestion policy. Use the [streaming policy](../management/streaming-ingestion-policy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (a few records per second) but the overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

To learn how to implement streaming ingestion, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `streamingingestion`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|

## Example

The following command deletes the streaming ingestion policy:

```kusto
.delete table MyTable policy streamingingestion 
```
