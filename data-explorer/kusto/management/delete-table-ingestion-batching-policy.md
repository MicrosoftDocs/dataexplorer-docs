---
title: .delete table ingestion batching policy command - Azure Data Explorer
description: Learn how to use the `.delete table ingestion batching policy` command to remove a table's ingestion batching policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table ingestion batching policy

Remove the table's [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `ingestionbatching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|

## Example

The following command deletes the batching policy on a table.

```kusto
.delete table MyTable policy ingestionbatching
```

## See also

* [delete database batching policy](delete-database-ingestion-batching-policy.md)
