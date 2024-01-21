---
title: .delete table policy retention command
description: Learn how to use the `.delete table policy retention` command to delete a table's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table policy retention command

Delete a table's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `retention`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to delete the policy.|

### Example

The following command deletes the retention policy at the table level.

```kusto
.delete table Table1 policy retention
```
