---
title: .show database ingestion batching policy command- Azure Data Explorer
description: This article describes the .show database ingestion batching policy command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/27/2021
---
# .show database ingestion batching policy

Display the database [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `ingestionbatching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Returns

Returns a JSON representation of the policy.

## Example

The following command will return the batching policy on a database.

```kusto
.show database MyDatabase policy ingestionbatching
```

## Next steps

* [show table batching policy](show-table-ingestion-batching-policy.md)
