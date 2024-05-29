---
title:  .alter-merge cluster policy capacity command
description: Learn how to use the `.alter-merge cluster policy capacity` command to turn on or turn off a cluster's capacity policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter-merge cluster policy capacity command

Changes a cluster's [capacity policy](capacity-policy.md). The policy is used to control the computational resources for data management operations on the cluster.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `capacity` *SerializedArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SerializedArrayOfPolicyObjects*| `string` | :heavy_check_mark:|A serialized array with one or more JSON policy objects. For more information, see [capacity policy](capacity-policy.md).|

### Examples

Alter a single property in the cluster level policy, keeping all other properties intact:

```kusto
.alter-merge cluster policy capacity ```
{
  "ExtentsPartitionCapacity": {
    "MaximumConcurrentOperationsPerNode": 4
  }
}```
```
