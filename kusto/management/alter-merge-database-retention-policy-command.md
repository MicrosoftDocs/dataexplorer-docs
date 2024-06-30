---
title:  .alter-merge database policy retention command
description: Learn how to use the `.alter-merge database policy retention` command to change the database's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter-merge database policy retention command

Changes the database's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `retention` *PolicyObjects*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the retention policy.|
|*ArrayOfPolicyObjects*| `string` | :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [retention policy](retention-policy.md).|

### Example

Sets a retention policy with a 10-day soft-delete period, and disables data recoverability:

```kusto
.alter-merge database MyDatabase policy retention softdelete = 10d recoverability = disabled
```
