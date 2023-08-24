---
title: .alter table policy roworder command
description: Learn how to use the `.alter table policy roworder` command to change a table's row order policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .alter table policy roworder command

Use this command to change a table's [row order policy](roworderpolicy.md). The row order policy is an optional table policy that defines the row order in an [extent (data shard)](extents-overview.md). This policy can improve performance for queries that relate to a small set of values that can be ordered.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `roworder` `(`*SortKey* (`asc` | `desc`) [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check;| The name of the table.|
| *SortKey* |string | &check; | The column by which to sort the data in the extent.|

> [!TIP]
> We recommend setting up to two sort keys. For more information, see [Performance considerations](roworderpolicy.md#performance-considerations).

### Examples

#### Set the row order policy for one table

```kusto
.alter table events policy roworder (TenantId asc, Timestamp desc)
```

#### Set the row order policy for several tables

```kusto
.alter tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)
```

The following example sets the row order policy on the `TenantId` column (ascending) as a primary key, and on the `Timestamp` column (ascending) as the secondary key. The policy is then queried.

```kusto
.alter table events policy roworder (TenantId asc, Timestamp desc)

.alter tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)

.show table events policy roworder 
```

|TableName|RowOrderPolicy|
|---|---|
|events|(TenantId asc, Timestamp desc)|
