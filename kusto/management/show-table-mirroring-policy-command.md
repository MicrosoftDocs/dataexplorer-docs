---
title: .show table policy mirroring command
description: Learn how to use the `.show table policy mirroring` command to display the table's mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric"
---
# .show table policy mirroring command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)]

Display the table's [mirroring policy](mirroring-policy.md).

## Syntax

`.show` `table` *TableName* `policy` `mirroring`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

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
