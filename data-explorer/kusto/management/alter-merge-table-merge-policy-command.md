---
title: .alter-merge table merge policy command- Azure Data Explorer
description: This article describes the .alter-merge table merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/13/2022
---
# .alter-merge table merge policy

Change a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Permissions

You must have [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `merge` *PolicyObject*

## Arguments

*TableName* - Specify the name of the table.
*PolicyObject* - Define a policy object, see also [merge policy](mergepolicy.md).

### Example

Change a single property of the policy at the table level, retaining all other properties as before:

```kusto
.alter-merge table [table_name] policy merge ```
{
    "MaxRangeInHours": 24
}```
```
