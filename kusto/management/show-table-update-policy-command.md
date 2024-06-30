---
title: .show table policy update command
description: Learn how to use the `.show table policy update` command to show the table's update policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy update command

Show the table update policy. The [update policy](update-policy.md) simplifies the process of syncing and updating data between two tables. When new data is inserted into the source table, a transformation query runs over this data to modify and insert the data into the target table.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` [ *DatabaseName*`.`]*TableName* `policy` `update`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` ||The name of the database. This is required when running the command from outside the database context of the specified table.|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the update policies for all tables:

```kusto
.show table * policy update 
```
