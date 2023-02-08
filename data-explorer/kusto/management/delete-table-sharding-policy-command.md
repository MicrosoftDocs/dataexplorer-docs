---
title: .delete table sharding policy command - Azure Data Explorer
description: This article describes the .delete table sharding policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/10/2021
---
# .delete table sharding policy

Delete the table sharding policy. Use the [sharding policy](../management/shardingpolicy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `sharding`

## Arguments

*TableName* - Specify the name of the table. A wildcard (*) denotes all tables.

## Example

The following example deleted the sharding policy for a table:

```kusto
.delete table MyTable policy sharding 
```