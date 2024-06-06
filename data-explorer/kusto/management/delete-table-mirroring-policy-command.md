---
title: .delete table policy mirroring command
description: Learn how to use the `.delete table policy mirroring` command to delete a table's  logical copy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 06/04/2024
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# .delete table policy mirroring command

::: zone pivot="fabric"
Delete a table's [mirroring policy](mirroring-policy.md).

> [!WARNING]
> Deleting the table mirroring policy will permanently delete the delta table in OneLake.

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
.delete table myTable policy mirroring
```

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor"

This feature isn't supported.

::: zone-end
