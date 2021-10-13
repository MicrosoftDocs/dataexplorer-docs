---
title: .alter-merge database merge policy command- Azure Data Explorer
description: This article describes the .alter-merge database merge policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .alter-merge database merge policy

Change a database's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 
 

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `merge` 

### Example

Change a single property of the policy at database level, retaining all other properties as before:

```kusto
.alter-merge database database_name policy merge ```
{
    "MaxRangeInHours": 24
}```
```