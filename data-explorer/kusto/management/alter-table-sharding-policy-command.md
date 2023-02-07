---
title: .alter table sharding policy command - Azure Data Explorer
description: This article describes the .alter table sharding policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2022
---
# .alter table sharding policy

Change the table sharding policy. Use the [sharding policy](../management/shardingpolicy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

This command requires at least [Table Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `table` *TableName* `policy` `sharding` *PolicyObject*

## Arguments

- *TableName* - Specify the name of the table. A wildcard (*) denotes all tables.
- *PolicyObject* - Define a policy object, see also [sharding policy](../management/shardingpolicy.md).

## Returns

Returns a JSON representation of the policy.

## Example

The following command  returns the updated extents sharding policy for the table:

````kusto
.alter table MyTable policy sharding
```
{
    "MaxRowCount" : 750000,
    "MaxExtentSizeInMb" : 1024,
    "MaxOriginalSizeInMb" : 2048
}
```
````