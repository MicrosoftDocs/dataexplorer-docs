---
title: .show database policy merge command
description: Learn how to use the `.show database policy merge` command to show the database's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show database policy merge command

Display a database's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the database level:

```kusto
.show database database_name policy merge 
```
