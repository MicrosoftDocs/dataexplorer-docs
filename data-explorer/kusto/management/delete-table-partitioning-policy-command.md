---
title: .delete table partitioning policy command- Azure Data Explorer
description: Learn how to use the `.delete table partitioning policy` command to delete a table's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table partitioning policy

Deletes a table's [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `partitioning`

### Example

Delete the policy at the table level:

```kusto
.delete table MyTable policy partitioning 
```
