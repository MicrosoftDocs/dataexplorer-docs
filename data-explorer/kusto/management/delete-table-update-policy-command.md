---
title: .delete table policy update command
description: Learn how to use the `.delete table policy update` command to delete a table's update policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy update command

Delete the table update policy. The [update policy](update-policy.md) simplifies the process of syncing and updating data between two tables. When new data is inserted into the source table, a transformation query runs over this data to modify and insert the data into the target table.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` [ *DatabaseName*`.`]*TableName* `policy` `update`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string||The name of the database. This is required when running the command from outside the database context of the specified table.|
|*TableName*|string|&check;|The name of the table.|

## Returns

Returns a JSON representation of the policy.

## Example

Delete the update policy for a table:

```kusto
.delete table MyDatabase.MyTable policy update 
```
