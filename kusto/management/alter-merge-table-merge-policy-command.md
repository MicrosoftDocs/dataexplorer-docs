---
title:  .alter-merge table policy merge command
description: Learn how to use the `.alter-merge table policy merge` command to change the table's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter-merge table policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the table's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) should get merged.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `merge` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|
|*PolicyObject*| `string` | :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [merge policy](merge-policy.md).|

### Example

Change a single property of the policy at the table level, retaining all other properties as before:

```kusto
.alter-merge table [table_name] policy merge ```
{
    "MaxRangeInHours": 24
}```
```
