---
title:  .alter-merge table policy streamingingestion command
description: Learn how to use the `.alter-merge table policy streamingingestion` command to change the table's streaming ingestion policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .alter-merge table policy streamingingestion command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the table's streaming ingestion policy. Use the [streaming policy](../management/streaming-ingestion-policy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is best suited for low latency scenarios where the ingestion time is under 10 seconds for varying data volume. It can optimize processing for multiple tables across one or more databases, especially when the tables receive only a few records per second but the ingestion volume is thousands of records per second.

However, when the amount of data grows beyond 4 Gb per hour per table, it's recommended to switch to classic bulk ingestion instead of streaming ingestion.

To learn how to implement streaming ingestion, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `streamingingestion` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|
|*PolicyObject*| `string` | :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [streaming ingestion policy](streaming-ingestion-policy.md).|

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
