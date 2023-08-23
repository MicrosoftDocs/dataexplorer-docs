---
title: .delete database policy streamingingestion command
description: Learn how to use the `.delete database policy streamingingestion` command to delete the database streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/13/2023
---
# .delete database policy streamingingestion command

Use this command to delete the database streaming ingestion policy. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (a few records per second) but the overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `streamingingestion`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Example

The following command deletes the streaming ingestion policy:

```kusto
.delete database MyDatabase policy streamingingestion 
```
