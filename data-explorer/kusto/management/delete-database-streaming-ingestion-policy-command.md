---
title: .delete database policy streamingingestion command
description: Learn how to use the `.delete database policy streamingingestion` command to delete the database streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .delete database policy streamingingestion command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Use this command to delete the database streaming ingestion policy. Use the [streaming policy](../management/streaming-ingestion-policy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables across one or more databases. Each table receives a small stream of data (a few records per second), but the total data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

To learn how to implement streaming ingestion, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `streamingingestion`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Example

The following command deletes the streaming ingestion policy:

```kusto
.delete database MyDatabase policy streamingingestion 
```

## Related content

* [Streaming ingestion policy](streaming-ingestion-policy.md)
* [.show database policy streamingingestion command](show-database-streaming-ingestion-policy-command.md)
* [.alter database policy streamingingestion command](alter-database-streaming-ingestion-policy-command.md)
* [.alter-merge database policy streamingingestion command](alter-merge-database-streaming-ingestion-policy-command.md)
* [.delete table policy streamingingestion command](delete-table-streaming-ingestion-policy-command.md)
* [Streaming ingestion and schema changes](data-ingestion/streaming-ingestion-schema-changes.md)
