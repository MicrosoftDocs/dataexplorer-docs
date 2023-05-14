---
title: .delete table sharding policy command - Azure Data Explorer
description: Learn how to use the `.delete table sharding policy` command to delete a table's sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table sharding policy

Delete the table sharding policy. Use the [sharding policy](../management/shardingpolicy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `sharding`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table. A wildcard (`*`) denotes all tables.|

## Example

The following example deleted the sharding policy for a table:

```kusto
.delete table MyTable policy sharding 
```
