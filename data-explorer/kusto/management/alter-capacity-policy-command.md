---
title:  .alter cluster policy capacity command
description: Learn how to use the `.alter cluster policy capacity` command to change the cluster's capacity policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter cluster policy capacity command

Changes the cluster's [capacity policy](capacitypolicy.md). A capacity policy controls the computational resources for data management operations on the cluster.

> [!NOTE]
>
> * Changes to the cluster capacity policy could take up to 1 hour to take effect.
> * All properties other than the ones inputted in the command are reset to their default values. Use [.alter-merge cluster policy capacity command](alter-merge-capacity-policy-command.md) for changing only some of the properties, while keeping the others intact.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `capacity` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *PolicyObject* | string | &check; | A JSON policy object. See [capacity policy](capacitypolicy.md) for policy properties. |

## Returns

Returns a JSON representation of the policy.

## Example

Alter the capacity policy. The resulting policy is the properties in the command's input merged with the default capacity policy.

```kusto
.alter cluster policy capacity ```
{
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  }
}```
```

**Output**

```kusto
"PolicyName": CapacityPolicy,
"EntityName": ,
"Policy": {
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  },
  "ExtentsMergeCapacity": {
    "MinimumConcurrentOperationsPerNode": 1,
    "MaximumConcurrentOperationsPerNode": 5
  },
  "ExtentsPurgeRebuildCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExportCapacity": {
    "ClusterMaximumConcurrentOperations": 100,
    "CoreUtilizationCoefficient": 0.25
  },
  "ExtentsPartitionCapacity": {
    "ClusterMinimumConcurrentOperations": 1,
    "ClusterMaximumConcurrentOperations": 32
  },
  "StreamingIngestionPostProcessingCapacity": {
    "MaximumConcurrentOperationsPerNode": 4
  },
  "MaterializedViewsCapacity": {
    "ClusterMinimumConcurrentOperations": 1,
    "ClusterMaximumConcurrentOperations": 10,
    "ExtentsRebuildCapacity": {
      "ClusterMaximumConcurrentOperations": 50,
      "MaximumConcurrentOperationsPerNode": 5
    }
  },
  "StoredQueryResultsCapacity": {
    "MaximumConcurrentOperationsPerDbAdmin": 250,
    "CoreUtilizationCoefficient": 0.75
  },
  "PurgeStorageArtifactsCleanupCapacity": {
    "MaximumConcurrentOperationsPerCluster": 1
  },
  "PeriodicStorageArtifactsCleanupCapacity": {
    "MaximumConcurrentOperationsPerCluster": 1
  }
},
"ChildEntities": ,
"EntityType": ,
```
