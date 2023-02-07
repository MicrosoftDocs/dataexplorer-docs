---
title: .alter-merge database retention policy command- Azure Data Explorer
description: This article describes the .alter-merge database retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge database retention policy

Change a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. 

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `retention` *PolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database. 
*PolicyObjects* - Define one or more policy objects.

### Example

Sets a retention policy with a 10-day soft-delete period, and disables data recoverability:

```kusto
.alter-merge database MyDatabase policy retention softdelete = 10d recoverability = disabled
```
