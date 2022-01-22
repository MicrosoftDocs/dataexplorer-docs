---
title: ".alter materialized view merge policy command- Azure Data Explorer"
description: "This article describes the .alter materialized view merge policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter materialized view merge policy

Change a merge view's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `merge` *PolicyObject*

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.
*PolicyObject* - Define a policy object. For more information, see  [merge policy](mergepolicy.md).

### Example

Sets a merge policy with a 10 day soft-delete period, and enable data recoverability:

~~~kusto
.alter materialized-view [materialized_view_name] policy merge ```
{
  "RowCountUpperBoundForMerge": 16000000,
  "OriginalSizeMBUpperBoundForMerge": 0,
  "MaxExtentsToMerge": 100,
  "LoopPeriod": "01:00:00",
  "MaxRangeInHours": 24,
  "AllowRebuild": true,
  "AllowMerge": true,
  "Lookback": {
    "Kind": "Default"
  }
}```
