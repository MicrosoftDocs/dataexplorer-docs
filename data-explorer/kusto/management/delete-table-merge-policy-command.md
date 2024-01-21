---
title: .delete table policy merge command
description: Learn how to use the `.delete table policy merge` command to delete a table's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy merge command

Delete a table's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to delete the merge policy.|

### Example

The following command deletes the merge policy at the table level.

```kusto
.delete table MyTable policy merge 
```
