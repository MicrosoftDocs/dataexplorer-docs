---
title: ".alter-merge capacity policy command- Azure Data Explorer"
description: "This article describes the .alter-merge capacity policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/19/2023
---
# .alter-merge capacity policy

Use this command to turn on or turn off a cluster's [capacity policy](capacitypolicy.md). The policy is used to control the computational resources for data management operations on the cluster. This command requires [AllDatabasesAdmin](access-control/role-based-access-control.md) permission.

## Syntax

`.alter-merge` `cluster` `policy` `capacity` *SerializedArrayOfPolicyObjects*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SerializedArrayOfPolicyObjects*|string|&check;|A serialized array with one or more JSON policy objects. For more information, see [capacity policy](capacitypolicy.md).|

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
