---
title:  .alter-merge table policy roworder command
description: Learn how to use the `.alter-merge table policy roworder` command to change the table's row order policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/04/2023
---
# .alter-merge table policy roworder command

Changes the table's [row order policy](roworderpolicy.md). The row order policy is an optional table policy that defines the row order in a data shard. This policy can improve performance for queries that relate to a small set of values that can be ordered.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `roworder` [*column1* [asc|desc], *column2* [asc|desc],...]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|
|*column*|string|&check;|The name of the columns in order followed by an indication of whether columns are ascending, `asc`, or descending, `desc`.|

### Examples

Set the row order policy for one table:

```kusto
.alter-merge table events policy roworder (TenantId asc, Timestamp desc)
```

Set the row order policy for several tables:

```kusto
.alter-merge tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)
```
