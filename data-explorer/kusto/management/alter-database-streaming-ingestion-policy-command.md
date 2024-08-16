---
title: .alter database policy streamingingestion command
description: Learn how to use the `.alter database policy streamingingestion` command to change the database streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter database  policy streamingingestion command

Changes the database streaming ingestion policy. The [streaming policy](../management/streaming-ingestion-policy.md) manages streaming ingestion of data into databases and tables.

Streaming ingestion is best suited for low latency scenarios where the ingestion time is under 10 seconds for varying data volume. It can optimize processing for multiple tables across one or more databases, especially when the tables receive only a few records per second but the ingestion volume is thousands of records per second.

However, when the amount of data grows beyond 4 Gb per hour per table, it's recommended to switch to classic bulk ingestion instead of streaming ingestion.

To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md). Streaming ingestion must be enabled at the cluster level before it can be used at the database level.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `streamingingestion` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the streaming ingestion policy.|
|*PolicyObject*| `string` | :heavy_check_mark:|A policy object that defines the streaming ingestion policy. For more information, see the [streaming policy](../management/streaming-ingestion-policy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following command enables streaming ingestion and determines the suggestion allocated rate for the database:

```kusto
.alter database MyDatabase policy streamingingestion 
'{"IsEnabled": true, "HintAllocatedRate": 2.1}'
```
