---
title: .show table policy merge command
description: Learn how to use the `.show table policy merge` command to display the table's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show table policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Display the table's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) should get merged.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the table level:

```kusto
.show table table_name policy merge 
```
