---
title: .delete table policy mirroring command
description: Learn how to use the `.delete table policy mirroring` command to delete a table's  logical copy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 06/04/2024
monikerRange: "microsoft-fabric"
---
# .delete table policy mirroring command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)]

Delete a table's [mirroring policy](mirroring-policy.md).

> [!WARNING]
> Deleting the table mirroring policy will permanently delete the delta table in OneLake.

## Syntax

`.delete` `table` *TableName* `policy` `mirroring`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to delete the policy.|

### Example

The following command deletes the mirroring policy at the table level.

```kusto
.delete table myTable policy mirroring
```
