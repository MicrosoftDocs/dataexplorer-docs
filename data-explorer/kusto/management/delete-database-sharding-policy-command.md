---
title: .delete database policy sharding command
description: Learn how to use the `.delete database policy sharding` command to delete the database sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete database policy sharding command

Use this command to delete the database sharding policy. Use the [sharding policy](../management/sharding-policy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in your cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `sharding`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Example

The following example deleted the sharding policy for a database:

```kusto
.delete database MyDatabase policy sharding 
```
