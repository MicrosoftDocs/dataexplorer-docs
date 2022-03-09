---
title: .alter-merge materialized view partitioning policy command- Azure Data Explorer
description: This article describes the .alter-merge materialized view partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge materialized view partitioning policy

Change a materialized view [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md). The command requires [DatabaseAdmin](access-control/role-based-authorization.md) permissions.

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `partitioning` *ArrayOfPolicyObjects*

## Arguments

*MaterializedViewName* - Specify the name of the materialized view. 
*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.

### Example

Change the policy at the materialized view level:

```kusto
.alter-merge materialized-view MyMaterializeView policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
