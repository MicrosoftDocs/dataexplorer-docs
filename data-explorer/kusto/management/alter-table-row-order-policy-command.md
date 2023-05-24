---
title:  ".alter table row order policy command"
description: "This article describes the .alter table row order policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/08/2023
---
# .alter table row order policy

Use this command to change a table's [row order policy](roworderpolicy.md). The row order policy is an optional table policy that defines the row order in a data shard. This policy can improve performance for queries that relate to a small set of values that can be ordered.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `roworder` *PolicyObject*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check;| The name of the table.|
| *PolicyObject* |string | &check; | A serialized policy object. For more information, see [row order policy](roworderpolicy.md).|

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
