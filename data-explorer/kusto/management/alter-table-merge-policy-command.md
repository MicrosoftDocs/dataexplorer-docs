---
title: .alter table merge policy command- Azure Data Explorer
description: This article describes the .alter table merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/13/2022
---
# .alter table merge policy

Change a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Permissions

You must have [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `merge` *PolicyObject* 

## Arguments

- *TableName* - Specify the name of the table. 
- *PolicyObject* - Define a policy object, see also [merge policy](mergepolicy.md).

### Example

~~~kusto
.alter table [table_name] policy merge ```
{
  "RowCountUpperBoundForMerge": 16000000,
  "OriginalSizeMBUpperBoundForMerge": 0,
  "MaxExtentsToMerge": 100,
  "LoopPeriod": "01:00:00",
  "MaxRangeInHours": 24,
  "AllowRebuild": true,
  "AllowMerge": true,
  "Lookback": {
    "Kind": "Default"
  }
}```
~~~