---
title:  .alter database policy retention command
description: Learn how to use the `.alter database policy retention` command to change the database's retention policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter database policy retention command

Changes the database's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. The policy removes data whose relevance is age-based.

The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy` `retention` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string| :heavy_check_mark:|The name of the database for which to alter the retention policy.|
|*PolicyObject*|string| :heavy_check_mark:|A policy object that defines the retention policy. For more information, see [retention policy](retention-policy.md).|

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

````kusto
.alter database MyDatabase policy retention
```
{
    "SoftDeletePeriod" : "10.00:00:00",
    "Recoverability" : "Enabled"
}
```
````
