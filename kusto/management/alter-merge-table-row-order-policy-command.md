---
title:  .alter-merge table policy roworder command
description: Learn how to use the `.alter-merge table policy roworder` command to change the table's row order policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/24/2023
---
# .alter-merge table policy roworder command

Changes the table's [row order policy](row-order-policy.md). The row order policy is an optional table policy that defines the row order in an [extent (data shard)](extents-overview.md). This policy can improve performance for queries that relate to a small set of values that can be ordered.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `roworder` `(`*SortKey* (`asc` | `desc`) [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|
| *SortKey* | `string` |  :heavy_check_mark: | The column by which to sort the data in the extent.|

> [!TIP]
> We recommend using a maximum of two sort keys. For more information, see [Performance considerations](row-order-policy.md#performance-considerations).

### Examples

Set the row order policy for one table:

```kusto
.alter-merge table events policy roworder (TenantId asc, Timestamp desc)
```

Set the row order policy for several tables:

```kusto
.alter-merge tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)
```
