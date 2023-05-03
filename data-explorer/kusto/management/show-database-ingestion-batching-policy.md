---
title:  .show database ingestion batching policy command
description: This article describes the .show database ingestion batching policy command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/09/2023
---
# .show database ingestion batching policy

Display the database [ingestion batching policy](batchingpolicy.md) that defines data aggregation for batching.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `ingestionbatching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the batching policy on a database.

```kusto
.show database MyDatabase policy ingestionbatching
```

## See also

* [show table batching policy](show-table-ingestion-batching-policy.md)
