---
title: .show table policy mirroring command
description: Learn how to use the `.show table policy mirroring` command to display the table's mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 06/03/2024
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# .show table policy mirroring command

::: zone pivot="fabric"
Display the table's [mirroring policy](mirroring-policy.md).

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

The following example requests information about the *myTable* table mirroring policy.

```kusto
.show table myTable policy mirroring 
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities| EntityType|
|------|------|------|------|------|
|MirroringPolicy|[a9c1234-b1c2-34d9-a9c1-b23c45d3e2fg3].[MyTable]	|{"ConnectionStrings": ["https://example.microsoft.com/45a01bcd-cd22-41e0/45a01bcd-cd22-41e0-567f-g891-30hij152536kl/Tables/myTable/;******"], "Format": "parquet", "IsEnabled": true,"Partitions": null, "PathFormat": null} | | Table|

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor"

This feature isn't supported.

::: zone-end
