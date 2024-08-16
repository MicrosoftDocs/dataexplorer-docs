---
title:  .alter-merge database policy merge command
description: Learn how to use the `.alter-merge database policy merge` command to change the database's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter-merge database policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the database's [merge policy](merge-policy.md). The merge policy defines if and how [extents (data shards)](../management/extents-overview.md) in the database should get merged.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `merge` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the merge policy.|
|*ArrayOfPolicyObjects*| `string` | :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [merge policy](merge-policy.md).|

### Example

Change a single property of the policy at database level, retaining all other properties as before:

```kusto
.alter-merge database database_name policy merge ```
{
    "MaxRangeInHours": 24
}```
```
