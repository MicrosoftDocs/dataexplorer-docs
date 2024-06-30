---
title: .show table policy roworder command
description: Learn how to use the `.show table policy roworder` command to display the table's row order policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/23/2023
---
# .show table policy roworder command

Display the table's [row order policy](row-order-policy.md). The row order policy is an optional policy set on tables, that suggests the desired ordering of rows in an [extent (data shard)](extents-overview.md). The purpose of the policy is to improve performance of queries that are known to be narrowed to a small subset of values in the ordered columns.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `roworder`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

```kusto
.show table events policy roworder 
```
