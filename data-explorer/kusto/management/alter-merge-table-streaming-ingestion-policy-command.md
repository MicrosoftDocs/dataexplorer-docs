---
title:  .alter-merge table policy streamingingestion command
description: Learn how to use the `.alter-merge table policy streamingingestion` command to change the table's streaming ingestion policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/04/2023
---
# .alter-merge table policy streamingingestion command

Changes the table's streaming ingestion policy. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is best suited for low latency scenarios where the ingestion time is under 10 seconds for varying data volume. It can optimize processing for multiple tables across one or more databases, especially when the tables receive only a few records per second but the ingestion volume is thousands of records per second.

However, when the amount of data grows beyond 4 Gb per hour per table, it's recommended to switch to classic bulk ingestion instead of streaming ingestion.

To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `streamingingestion` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|
|*PolicyObject*|string|&check;|A serialized array of one or more JSON policy objects. For more information, see [streaming ingestion policy](streamingingestionpolicy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns enables streaming ingestion and determines the suggestion allocated rate for the table:

```kusto
.alter-merge table MyTable policy streamingingestion 
'{"IsEnabled": true, "HintAllocatedRate": 1.5}'
```

The following command disables the streaming ingestion policy:

```kusto
.alter-merge table MyTable policy streamingingestion 
'{"IsEnabled": false}'
```
