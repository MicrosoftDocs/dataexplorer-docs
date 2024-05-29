---
title: .delete table policy restricted_view_access command
description: Learn how to use the `.delete table policy restricted_view_access` command to delete a table's restricted view access policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy restricted_view_access command

Delete the optional table [restricted view access policy](restricted-view-access-policy.md). When this policy is turned on for a table, only principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database can query the data. Deleting a policy is similar to turning off a policy.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `restricted_view_access`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|

## Example

```kusto
.delete table MyTable policy restricted_view_access
```
