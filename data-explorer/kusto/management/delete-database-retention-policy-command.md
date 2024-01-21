---
title: .delete database policy retention command
description: Learn how to use the `.delete database policy retention` command to delete a database's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/13/2023
---
# .delete database policy retention command

Delete a database's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `retention`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string| :heavy_check_mark:|The name of the database for which to delete the retention policy.|

### Example

The following command deletes the retention policy at the database level.

```kusto
.delete database MyDatabase policy retention 
```
