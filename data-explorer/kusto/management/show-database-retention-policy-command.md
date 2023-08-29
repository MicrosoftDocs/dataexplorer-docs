---
title: .show database policy retention command
description: Learn how to use the `.show database policy retention` command to show the database's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show database policy retention command

Display a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `retention`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Returns

Returns a JSON representation of the policy.

### Example

Display a retention policy:

```kusto
.show database MyDatabase policy retention 
```
