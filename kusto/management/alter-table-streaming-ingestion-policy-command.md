---
title: .alter table policy streamingingestion command
description: Learn how to use the `.alter table policy streamingingestion` command to change the table streaming policy ingestion.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .alter table policy streamingingestion command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Use this command to change the table streaming policy ingestion. Use the [streaming policy](../management/streaming-ingestion-policy.md) to manage streaming ingestion for databases and tables.  

Use in low latency scenarios, where ingestion time is less than 10 seconds for varying data volume. You can optimize processing for many tables in one or more databases, when tables receive a few records per second, whereas the ingestion volume is thousands of records per second.

Use the classic bulk ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

To learn how to implement streaming ingestion, see [streaming policy](../management/streaming-ingestion-policy.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `streamingingestion` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark:| The name of the table.|
| *PolicyObject* | `string` |  :heavy_check_mark: | A serialized policy object. For more information, see [streaming ingestion](/azure/data-explorer/ingest-data-streaming.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following command turns on streaming ingestion and determines the suggested allocation rate for the table.

```kusto
.alter table Table1 policy streamingingestion '{"IsEnabled": true, "HintAllocatedRate": 2.1}'
```
