---
title: .delete materialized view partitioning policy command- Azure Data Explorer
description: Learn how to use the `.delete materialized view partitioning policy` command to delete a materialized view's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete materialized view partitioning policy

Deletes the materialized view's [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `partitioning`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view for which to delete the partitioning policy.|

### Example

Delete the policy at the materialized view level:

```kusto
.delete materialized-view MyMaterializeView policy partitioning 
```
