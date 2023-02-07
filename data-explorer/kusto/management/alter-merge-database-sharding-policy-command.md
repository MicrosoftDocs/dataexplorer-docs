---
title: .alter-merge database sharding policy command - Azure Data Explorer
description: This article describes the .alter-merge database sharding policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge database sharding policy

Change the database sharding policy. Use the [sharding policy](../management/shardingpolicy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `sharding` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database. 
*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.

## Returns

Returns a JSON representation of the policy.

## Example

The following command changes a single property for the sharding policy for a database:

```kusto
.alter-merge database MyDatabase policy sharding 
@'{ "MaxExtentSizeInMb": 1024}'
```
