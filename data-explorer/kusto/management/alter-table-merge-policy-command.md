---
title:  .alter table policy merge command
description: Learn how to use the `.alter table policy merge` command to change the table's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter table policy merge command

Changes the table's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `merge` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter. |
| *PolicyObject* | string | &check; | A serialized JSON policy object. See [merge policy](merge-policy.md). |

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
