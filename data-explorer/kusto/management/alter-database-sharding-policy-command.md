---
title: ".alter database sharding policy command - Azure Data Explorer"
description: "This article describes the .alter database sharding policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2022
---
# .alter database sharding policy

Change the database sharding policy. Use the [sharding policy](../management/shardingpolicy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `database` *DatabaseName* `policy` `sharding` *PolicyObject*

## Arguments

- *DatabaseName* - Specify the name of the database.
- *PolicyObject* - Define a policy object. For more information, see the [sharding policy](../management/shardingpolicy.md).

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the updated extents sharding policy for the database:

````kusto
.alter database MyDatabase policy sharding
```
{
    "MaxRowCount" : 750000,
    "MaxExtentSizeInMb" : 1024,
    "MaxOriginalSizeInMb": 2048
}
```
````
