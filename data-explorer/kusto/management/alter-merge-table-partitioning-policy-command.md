---
title: .alter-merge table partitioning policy command- Azure Data Explorer
description: This article describes the .alter-merge table partitioning policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter-merge table partitioning policy

Alters a table [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md). The command requires [DatabaseAdmin](access-control/role-based-authorization.md) permissions.

## Syntax

`.alter-merge` `table` *TableName* `policy` `partitioning` *ArrayOfPolicyObjects*

## Arguments

*TableName* - Specify the name of the table. 
*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.

### Example

Delete the policy at the table level:

```kusto
.alter-merge table MyTable policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
