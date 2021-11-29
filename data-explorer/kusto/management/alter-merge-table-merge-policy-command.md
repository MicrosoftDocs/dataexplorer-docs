---
title: .alter-merge table merge policy command- Azure Data Explorer
description: This article describes the .alter-merge table merge policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .alter-merge table merge policy

Change a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 
 

## Syntax

`.alter-merge` `table` *TableName* `policy` `merge` 

### Example

Change a single property of the policy at the table level, retaining all other properties as before:

```kusto
.alter-merge table [table_name] policy merge ```
{
    "MaxRangeInHours": 24
}```
```