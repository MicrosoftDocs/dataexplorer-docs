---
title: .delete database policy merge command
description: Learn how to use the `.delete database policy merge` command to delete a database's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .delete database policy merge command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Delete a database's [merge policy](merge-policy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) should get merged.

## Syntax

`.delete` `database` *DatabaseName* `policy` `merge`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to delete the merge policy.|

### Example

The following command deletes the merge policy at the database level.

```kusto
.delete database database_name policy merge 
```
