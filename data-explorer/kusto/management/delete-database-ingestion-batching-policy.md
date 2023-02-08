---
title: ".delete database ingestion batching policy command - Azure Data Explorer"
description: "This article describes the delete database ingestion batching policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/19/2022
---
# .delete database ingestion batching policy

Remove the database [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `ingestionbatching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following command deletes the batching policy on a database.

```kusto
.delete database MyDatabase policy ingestionbatching
```

## Next steps

* [delete table batching policy](delete-table-ingestion-batching-policy.md)
