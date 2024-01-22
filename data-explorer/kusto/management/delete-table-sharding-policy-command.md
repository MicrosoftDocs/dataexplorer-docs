---
title: .delete table policy sharding command
description: Learn how to use the `.delete table policy sharding` command to delete a table's sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy sharding command

Delete the table sharding policy. Use the [sharding policy](../management/sharding-policy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in your cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `sharding`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table. A wildcard (`*`) denotes all tables.|

## Example

The following example deleted the sharding policy for a table:

```kusto
.delete table MyTable policy sharding 
```
