---
title: .delete table policy ingestionbatching command
description: Learn how to use the `.delete table policy ingestionbatching` command to remove a table's ingestion batching policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table policy ingestionbatching command

Remove the table's [ingestion batching policy](batching-policy.md) that defines data aggregation for batching. The ingestion batching policy applies to [queued ingestion](../../ingest-data-overview.md#continuous-data-ingestion).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `ingestionbatching`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table.|

## Example

The following command deletes the batching policy on a table.

```kusto
.delete table MyTable policy ingestionbatching
```

## Related content

* [delete database batching policy](delete-database-ingestion-batching-policy.md)
