---
title: .delete materialized-view policy merge command
description: Learn how to use the `.delete materialized-view policy merge` command to delete a materialized view's merge policy.
ms.reviewer: yifats
ms.topic: reference
ms.date: 12/03/2024
---
# .delete materialized-view policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Delete a materialized view's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) should get merged.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view for which to delete the merge policy.|

### Example

The following command deletes the merge policy at the materialized view level.

```kusto
.delete materialized-view MyMaterializedView policy merge 
```
