---
title:  .alter-merge database policy merge command
description: Learn how to use the `.alter-merge database policy merge` command to change the database's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter-merge database policy merge command

Changes the database's [merge policy](mergepolicy.md). The merge policy defines if and how [extents (data shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `merge` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the merge policy.|
|*ArrayOfPolicyObjects*|string|&check;|A serialized array of one or more JSON policy objects. For more information, see [merge policy](mergepolicy.md).|

### Example

Change a single property of the policy at database level, retaining all other properties as before:

```kusto
.alter-merge database database_name policy merge ```
{
    "MaxRangeInHours": 24
}```
```
