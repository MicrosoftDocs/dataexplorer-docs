---
title: .alter table retention policy command- Azure Data Explorer
description: This article describes the .alter table retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter table retention policy

Change a table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `retention` *PolicyObject*

## Arguments

- *TableName* - Specify the name of the table.  
- *PolicyObject* - Define a policy object, see also  [retention policy](retentionpolicy.md).

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
