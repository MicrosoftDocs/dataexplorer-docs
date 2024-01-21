---
title: .show table policy merge command
description: Learn how to use the `.show table policy merge` command to display the table's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy merge command

Display the table's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the table level:

```kusto
.show table database_name policy merge 
```
