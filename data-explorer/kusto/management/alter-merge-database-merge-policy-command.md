---
title: .alter-merge database merge policy command- Azure Data Explorer
description: This article describes the .alter-merge database merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge database merge policy

Change a database's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `merge` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database. 
*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.

### Example

Change a single property of the policy at database level, retaining all other properties as before:

```kusto
.alter-merge database database_name policy merge ```
{
    "MaxRangeInHours": 24
}```
```
