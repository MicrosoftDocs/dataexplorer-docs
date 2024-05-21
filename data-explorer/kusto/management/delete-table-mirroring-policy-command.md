---
title: .delete table policy mirroring command
description: Learn how to use the `.delete table policy mirroring` command to delete a table's mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/16/2024
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-mirroring
---
# .delete table policy mirroring command

::: zone pivot="fabric"
Delete a table's [mirroring policy](mirroring-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `mirroring`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to delete the policy.|

### Example

The following command deletes the mirroring policy at the table level.

```kusto
.delete table Table1 policy mirroring
```

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor, azurestorage"

This feature isn't supported.

::: zone-end
