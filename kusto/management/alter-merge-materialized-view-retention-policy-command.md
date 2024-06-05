---
title:  .alter-merge materialized-view policy retention command
description: Learn how to use the `.alter-merge materialized-view policy retention` command to change the materialized view's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/28/2023
---
# .alter-merge materialized-view policy retention command

Changes the materialized-view's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `retention` *PolicyParameters*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view.|
|*PolicyParameters*| `string` | :heavy_check_mark:|One or more policy parameters. For more information, see [retention policy](retention-policy.md).|

### Example

Sets a retention policy with a 10-day soft-delete period, and disables data recoverability:

```kusto
.alter-merge materialized-view View1 policy retention softdelete = 10d recoverability = disabled
```
