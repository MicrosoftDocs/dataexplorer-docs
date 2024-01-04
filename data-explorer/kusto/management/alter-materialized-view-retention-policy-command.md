---
title:  .alter materialized-view policy retention command
description: Learn how to use the `.alter materialized-view policy retention` command to change the materialized view's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter materialized-view policy retention command

Changes the materialized view's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based.

The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `retention` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;| The name of the materialized view.|
|*ArrayOfPolicyObjects*|string|&check;| One or more policy objects. For more information, see [retention policy](retention-policy.md).|

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

````kusto
.alter materialized-view MyMaterializedView policy retention
```
{
    "SoftDeletePeriod": "10.00:00:00",
    "Recoverability": "Enabled"
}
```
````
