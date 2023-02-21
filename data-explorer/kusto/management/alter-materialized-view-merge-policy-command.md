---
title: ".alter materialized view merge policy command- Azure Data Explorer"
description: "This article describes the .alter materialized view merge policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter materialized view merge policy

Use this command to change a materialized view's [merge policy](mergepolicy.md). The merge policy defines if and how [extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `merge` *PolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;| The name of the materialized view.|
|*PolicyObject*|string|&check;| A policy object used to set the merge policy. For more information, see  [merge policy](mergepolicy.md).|

### Example

```kusto
.alter materialized-view [materialized_view_name] policy merge ```
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
```
