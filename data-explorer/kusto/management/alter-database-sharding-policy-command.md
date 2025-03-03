---
title:  .alter database policy sharding command
description: Learn how to use the `.alter database policy sharding` command to change the database's sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 12/22/2024
monikerRange: "azure-data-explorer"
---
# .alter database policy sharding command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the database sharding policy. The [sharding policy](../management/sharding-policy.md) is used to manage data sharding for databases and tables by defining if and how [extents (data shards)](../management/extents-overview.md) should be sealed.

When a database is created, it contains the default data sharding policy. All tables created in the database inherit this policy unless the policy is explicitly overridden at the table level.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `sharding` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the sharding policy.|
|*PolicyObject*| `string` | :heavy_check_mark:|A policy object that defines the sharding policy. For more information, see the [sharding policy](../management/sharding-policy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the updated extents sharding policy for the database:

````kusto
.alter database MyDatabase policy sharding
```
{
    "ShardEngineMaxRowCount" : 750000,
    "ShardEngineMaxExtentSizeInMb" : 1024,
    "ShardEngineMaxOriginalSizeInMb": 2048
}
```
````

## Related content

* [Data sharding policy](sharding-policy.md) ::: moniker range="azure-data-explorer"
* [.alter table policy sharding command](alter-table-sharding-policy-command.md)
* [.show database policy sharding command](show-database-sharding-policy-command.md)
* [.alter-merge database policy sharding command](alter-merge-database-sharding-policy-command.md)
* [.delete database policy sharding command](delete-database-sharding-policy-command.md) ::: moniker-end
* [Extents (data shards)](extents-overview.md)
