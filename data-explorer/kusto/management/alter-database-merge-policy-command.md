---
title:  .alter database policy merge command
description: Learn how to use the `.alter database policy merge` command to change the database's merge policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter database policy merge command

Changes the database's [merge policy](mergepolicy.md). The merge policy defines if and how [extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `merge` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

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
