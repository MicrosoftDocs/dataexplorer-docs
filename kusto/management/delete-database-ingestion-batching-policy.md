---
title: .delete database policy ingestionbatching command
description: Learn how to use the `.delete database policy ingestionbatching` command to delete the database ingestion batching policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .delete database policy ingestionbatching command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Use this command to remove the database [ingestion batching policy](batching-policy.md) that defines data aggregation for batching. The ingestion batching policy applies to [queued ingestion](/azure/data-explorer/ingest-data-overview.md#continuous-data-ingestion).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `ingestionbatching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Example

The following command deletes the batching policy on a database.

```kusto
.delete database MyDatabase policy ingestionbatching
```

## Related content

* [delete table batching policy](delete-table-ingestion-batching-policy.md)
