---
title: .delete materialized-view policy partitioning command
description: Learn how to use the `.delete materialized-view policy partitioning` command to delete a materialized view's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete materialized-view policy partitioning command

Deletes the materialized view's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `partitioning`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view for which to delete the partitioning policy.|

### Example

Delete the policy at the materialized view level:

```kusto
.delete materialized-view MyMaterializeView policy partitioning 
```
