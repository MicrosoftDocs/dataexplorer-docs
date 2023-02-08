---
title: ".show table ingestion batching policy command- Azure Data Explorer"
description: "This article describes the .show table ingestion batching policy command in Azure Data Explorer."
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/27/2021
---
# .show table ingestion batching policy

Display the table [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestionbatching`

## Arguments

*TableName* - Specify the name of the table.

## Returns

Returns a JSON representation of the policy.

## Example

The following command will return the batching policy on a table.

```kusto
.show table MyTable policy ingestionbatching
```

## Next steps

* [show database batching policy](show-database-ingestion-batching-policy.md)
