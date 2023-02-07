---
title: .delete table partitioning policy command- Azure Data Explorer
description: This article describes the .delete table partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2021
---
# .delete table partitioning policy

Deletes a table [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

This command requires at least [Table Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.delete` `table` *TableName* `policy` `partitioning` 

### Example

Delete the policy at the table level:

```kusto
.delete table MyTable policy partitioning 
```
