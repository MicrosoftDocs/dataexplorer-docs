---
title: .show policy extent_tags_retention command
description: Learn how to use the `.show policy extent_tags_retention` command to show the extent tags' retention policy on a table or database-level.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show policy extent_tags_retention command

Shows a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show`  ( `table` | `database` ) *EntityName* `policy` `extent_tags_retention`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityName*|string| :heavy_check_mark:|The table or database name for which to show the extent tags retention policy.|

## Returns

Returns a JSON representation of the policy.

## Example

Show the extent tags retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy extent_tags_retention
```
