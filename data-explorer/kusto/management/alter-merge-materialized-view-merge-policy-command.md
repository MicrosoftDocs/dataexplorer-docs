---
title: .alter-merge materialized view merge policy command- Azure Data Explorer
description: This article describes the .alter-merge materialized view merge policy command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge materialized view merge policy

Change a materialized view's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `merge` *PolicyObject*

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.
*PolicyObject* - Define a policy object. For more information, see  [merge policy](mergepolicy.md).

### Example

Change a single property of the policy at the materialized view level, retaining all other properties as before:

~~~kusto
.alter-merge materialized-view [materialized_view_name] policy merge ```
{
    "MaxRangeInHours": 24
}```
~~~
