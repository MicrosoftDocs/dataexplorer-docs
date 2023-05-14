---
title: .delete table update policy command - Azure Data Explorer
description: Learn how to use the `.delete table update policy` command to delete a table's update policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table update policy

Delete the table update policy. The [update policy](updatepolicy.md) instructs Azure Data Explorer to automatically append data to a target table whenever new data is inserted into the source table, based on a transformation query that runs on the data inserted into the source table.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` [ *DatabaseName*`.`]*TableName* `policy` `update`

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
