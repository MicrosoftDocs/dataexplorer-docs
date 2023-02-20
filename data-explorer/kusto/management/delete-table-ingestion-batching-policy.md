---
title: .delete table ingestion batching policy command - Azure Data Explorer
description: This article describes the .delete table ingestion batching policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/19/2022
---
# .delete table ingestion batching policy

Remove the table [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `ingestionbatching`

## Arguments

*TableName* - Specify the name of the table.

## Example

The following command deletes the batching policy on a table.

```kusto
.delete table MyTable policy ingestionbatching
```

## Next steps

* [delete database batching policy](delete-database-ingestion-batching-policy.md)
