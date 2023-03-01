---
title: .alter-merge materialized view partitioning policy command- Azure Data Explorer
description: This article describes the .alter-merge materialized view partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge materialized view partitioning policy

Use this command to create a materialized view [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `partitioning` *PolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|
|*PolicyObject*|string|&check;|A serialized array of one or more JSON policy objects. For more information, see [partitioning policy](partitioningpolicy.md).|

## Example

Change the policy at the materialized view level:

```kusto
.alter-merge materialized-view MyMaterializeView policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
