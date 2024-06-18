---
title: .show database policy ingestionbatching command
description: Learn how to use the `.show database policy ingestionbatching` command to show the database's ingestion batching policy.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show database policy ingestionbatching command

Display the database's [ingestion batching policy](batching-policy.md) that defines data aggregation for batching. The ingestion batching policy applies to [queued ingestion](/azure/data-explorer/ingest-data-overview.md#continuous-data-ingestion).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `ingestionbatching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the batching policy on a database.

```kusto
.show database MyDatabase policy ingestionbatching
```

## Related content

* [show table batching policy](show-table-ingestion-batching-policy.md)
