---
title: .alter database policy streamingingestion command
description: Learn how to use the `.alter database policy streamingingestion` command to change the database streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 12/22/2024
monikerRange: "azure-data-explorer"
---
# .alter database policy streamingingestion command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the database streaming ingestion policy. The [streaming policy](../management/streaming-ingestion-policy.md) manages streaming ingestion of data into databases and tables.

Streaming ingestion is best suited for low latency scenarios where the ingestion time is under 10 seconds for varying data volume. It can optimize processing for multiple tables across one or more databases, especially when the tables receive only a few records per second but the ingestion volume is thousands of records per second.

However, when the amount of data grows beyond 4 GB per hour per table, we recommend switching to classic bulk ingestion instead of streaming ingestion.

To learn how to implement streaming ingestion, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming).
Streaming ingestion must be enabled at the cluster level before it can be used at the database level.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `streamingingestion` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

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

## Related content

* [Streaming ingestion policy](streaming-ingestion-policy.md)
* [.alter table policy streamingingestion command](alter-table-streaming-ingestion-policy-command.md)
* [.show database policy streamingingestion command](show-database-streaming-ingestion-policy-command.md)
* [.alter-merge database policy streamingingestion command](alter-merge-database-streaming-ingestion-policy-command.md)
* [.delete database policy streamingingestion command](delete-database-streaming-ingestion-policy-command.md)
* [Streaming ingestion and schema changes](data-ingestion/streaming-ingestion-schema-changes.md)
