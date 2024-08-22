---
title: .show table policy ingestionbatching command
description: Learn how to use the `.show table policy ingestionbatching` command to display the table's ingestion batching policy.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# .show table policy ingestionbatching command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Displays the table's [ingestion batching policy](batching-policy.md) that defines data aggregation for batching. The ingestion batching policy applies to [queued ingestion](/azure/data-explorer/ingest-data-overview#continuous-data-ingestion).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestionbatching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the batching policy on a table.

```kusto
.show table MyTable policy ingestionbatching
```

## Related content

* [show database batching policy](show-database-ingestion-batching-policy.md)
