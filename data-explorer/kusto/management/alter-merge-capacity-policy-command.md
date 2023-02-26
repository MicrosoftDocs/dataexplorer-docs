---
title: ".alter-merge capacity policy command- Azure Data Explorer"
description: "This article describes the .alter-merge capacity policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge capacity policy

Adds the [capacity policy](capacitypolicy.md) provided in this command to any other already existing capacity policy. The policy is used to control the computational resources for data management operations on the cluster.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `capacity` *SerializedArrayOfPolicyObjects*

## Arguments

*SerializedArrayOfPolicyObjects* - A serialized array with one or more JSON policy objects.

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
