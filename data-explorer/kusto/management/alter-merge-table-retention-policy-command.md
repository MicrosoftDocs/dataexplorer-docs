---
title:  .alter-merge table policy retention command
description: Learn how to use the `.alter-merge table policy retention` command to change the table's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/04/2023
---
# .alter-merge table policy retention command

Changes the table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `retention` *PolicyParameters*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|
|*PolicyParameters*|string|&check;|One or more policy parameters. For more information, see [retention policy](retentionpolicy.md).|

### Example

Sets a retention policy with a 10-day soft-delete period, and disables data recoverability:

```kusto
.alter-merge table Table1 policy retention softdelete = 10d recoverability = disabled
```
