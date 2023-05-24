---
title: .delete database retention policy command
description: Learn how to use the `.delete database retention policy` command to delete a database's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/24/2023
---
# .delete database retention policy

Delete a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `retention`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to delete the retention policy.|

### Example

The following command deletes the retention policy at the database level.

```kusto
.delete database MyDatabase policy retention 
```
