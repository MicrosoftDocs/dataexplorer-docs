---
title: .show materialized view partitioning policy command- Azure Data Explorer
description: This article describes the .show materialized view partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2021
---
# .show materialized view partitioning policy

Displays a materialized view [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `partitioning` 

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Returns

Returns a JSON representation of the policy.

### Example

Delete the policy at the materialized view level:

```kusto
.show materialized-view MyMaterializeView policy partitioning 
```
