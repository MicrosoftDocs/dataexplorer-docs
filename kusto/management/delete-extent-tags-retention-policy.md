---
title: .delete extent tags retention policy command
description: Learn how to use the `.delete extent tags retention policy` command to delete the extent tags retention policy on a table or database level.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete extent tags retention policy command

Deletes a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `extent_tags_retention`

`.delete` `database` *DatabaseName* `policy` `extent_tags_retention`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to delete the extent tags retention policy.|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to delete the extent tags retention policy.|

## Example

The following command deletes the extent tags retention policy for a table named `MyTable`.

```kusto
.delete table MyTable policy extent_tags_retention
```
