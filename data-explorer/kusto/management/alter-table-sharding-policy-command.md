---
title: .alter table policy sharding command
description: Learn how to use the `.alter table policy sharding` command to change the table sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .alter table policy sharding command

Use this command to change the table sharding policy. Use the [sharding policy](../management/sharding-policy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in your cluster should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `sharding` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | string |  :heavy_check_mark:| The name of the table.|
| *PolicyObject* |string |  :heavy_check_mark: | A serialized policy object. For more information, see [sharding policy](../management/sharding-policy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns the updated extents sharding policy for the table.

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
