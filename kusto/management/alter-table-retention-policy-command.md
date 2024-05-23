---
title:  .alter table policy retention command
description: Learn how to use the `.alter table policy retention` command to change the table's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/08/2023
---
# .alter table retention policy command

Changes the table's [retention policy](retention-policy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `retention` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark:| The name of the table.|
| *PolicyObject* | `string` |  :heavy_check_mark: | A serialized policy object. For more information, see [retention policy](retention-policy.md).|

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

````kusto
.alter table MySourceTable policy retention
```
{
    "SoftDeletePeriod": "10.00:00:00",
    "Recoverability": "Enabled"
}
```
````
