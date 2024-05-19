---
title: .show table policy mirroring command
description: Learn how to use the `.show table policy mirroring` command to display the table's mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/21/2024
---
# .show table policy mirroring command

Display the table's [mirroring policy](mirroring-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `mirroring`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

```kusto
.show table Automotive policy mirroring 
```
