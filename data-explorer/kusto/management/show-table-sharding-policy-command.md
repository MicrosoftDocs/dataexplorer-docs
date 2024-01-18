---
title: .show table policy sharding command
description: Learn how to use the `.show table policy sharding` command to show the table's sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show table policy sharding command

Show the table sharding policy. Use the [sharding policy](../management/sharding-policy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in your cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `sharding`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to show the policy details. A wildcard (`*`) denotes all tables.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the sharding policies for all tables:

```kusto
.show table * policy sharding 
```
