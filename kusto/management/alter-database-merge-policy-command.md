---
title:  .alter database policy merge command
description: Learn how to use the `.alter database policy merge` command to change the database's merge policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter database policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the database's [merge policy](merge-policy.md). The merge policy defines if and how [extents (Data Shards)](../management/extents-overview.md) should get merged.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `merge` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the merge policy.|
|*PolicyObject*| `string` | :heavy_check_mark:|A policy object that defines the merge policy. For more information, see [merge policy](merge-policy.md).|

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
