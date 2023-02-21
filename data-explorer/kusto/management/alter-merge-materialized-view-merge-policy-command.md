---
title: .alter-merge materialized view merge policy command- Azure Data Explorer
description: This article describes the .alter-merge materialized view merge policy command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge materialized view merge policy

Use this command to change a materialized view's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `merge` *PolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|
|*PolicyObject*|string|&check;||A serialized array of one or more JSON policy objects. For more information, see [merge policy](mergepolicy.md).|

### Example

Change a single property of the policy at the materialized view level, retaining all other properties as before:

~~~kusto
.alter-merge materialized-view [materialized_view_name] policy merge ```
{
    "MaxRangeInHours": 24
}```
~~~
