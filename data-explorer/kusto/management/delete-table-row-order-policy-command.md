---
title: .delete table policy roworder command
description: Learn how to use the `.delete table policy roworder` command to delete a table's row order policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table policy roworder command

Remove a table's [row order policy](row-order-policy.md). The row order policy is an optional policy set on tables that suggests the desired ordering of rows in an [extent (data shard)](extents-overview.md). The purpose of the policy is to improve performance of queries that are known to be narrowed to a small subset of values in the ordered columns.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `roworder`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|

### Example

```kusto
.delete table events policy roworder 
```
