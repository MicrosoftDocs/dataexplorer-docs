---
title: .show table policy streamingingestion command
description: Learn how to use the `.show table policy streamingingestion` command to display the table's streaming ingestion policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 12/18/2024
monikerRange: "azure-data-explorer"
---
# .show table policy streamingingestion command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Displays the table's streaming ingestion policy. Use the [streaming policy](../management/streaming-ingestion-policy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables across one or more databases. Each table receives a small stream of data (a few records per second), but the total data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

To learn how to implement streaming ingestion, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `streamingingestion`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Example

The following command displays the streaming ingestion policy:

```kusto
.show table MyTable policy streamingingestion 
```

## Related content

* [Streaming ingestion policy](streaming-ingestion-policy.md)
* [.show database policy streamingingestion command](show-database-streaming-ingestion-policy-command.md)
* [.alter table policy streamingingestion command](alter-table-streaming-ingestion-policy-command.md)
* [.alter-merge table policy streamingingestion command](alter-merge-table-streaming-ingestion-policy-command.md)
* [.delete table policy streamingingestion command](delete-table-streaming-ingestion-policy-command.md)
* [Streaming ingestion and schema changes](data-ingestion/streaming-ingestion-schema-changes.md)
