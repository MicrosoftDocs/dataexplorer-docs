---
title: .alter materialized view partitioning policy command- Azure Data Explorer
description: This article describes the .alter materialized view partitioning policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .alter table partitioning policy

Change a materialized view [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md). The command requires [DatabaseAdmin](access-control/role-based-authorization.md) permissions.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `partitioning` 

### Example

Change the policy at the materialized-view level:

```kusto
.alter materialized-view MyMaterializeView policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
