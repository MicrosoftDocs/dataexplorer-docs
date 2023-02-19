---
title: ".alter database merge policy command - Azure Data Explorer"
description: "This article describes the .alter database merge policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/19/2023
---
# .alter database merge policy

Use this command to change a database's [merge policy](mergepolicy.md). The merge policy defines if and how [extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Syntax

`.alter` `database` *DatabaseName* `policy` `merge` *PolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the merge policy.|
|*PolicyObject*|string|&check;|A policy object that defines the merge policy. For more information, see [merge policy](mergepolicy.md).|

### Examples

Set all properties of the policy explicitly, at the database level:

~~~kusto
.alter database [database_name] policy merge ```
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

Set the *default* merge policy at database level:

```kusto
.alter database [database_name] policy merge '{}'
```
