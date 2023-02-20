---
title: ".alter materialized-view retention policy command- Azure Data Explorer"
description: "This article describes the .alter materialized-view retention policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2022
---
# .alter materialized-view retention policy

Change a materialized view's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `retention` *ArrayOfPolicyObjects*

## Arguments

*MaterializedViewName* - Specify the name of the materialized view. 
*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

### Example

Sets a retention policy with a 10 day soft-delete period, and enable data recoverability:

````kusto
.alter materialized-view MyMaterializedView policy retention
```
{
    "SoftDeletePeriod": "10.00:00:00",
    "Recoverability": "Enabled"
}
```
````
