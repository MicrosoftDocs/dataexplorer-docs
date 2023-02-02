---
title: .alter-merge table partitioning policy command- Azure Data Explorer
description: This article describes the .alter-merge table partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/13/2022
---
# .alter-merge table partitioning policy

Alters a table [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

This command requires [database admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter-merge` `table` *TableName* `policy` `partitioning` *PolicyObject*

## Arguments

*TableName* - Specify the name of the table.
*PolicyObject* - Define a policy object, see also [partitioning policy](partitioningpolicy.md).

### Example

Alter merge the policy at the table level:

```kusto
.alter-merge table MyTable policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
