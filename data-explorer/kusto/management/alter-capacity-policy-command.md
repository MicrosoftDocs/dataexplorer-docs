---
title: Alter capacity policy command - Azure Data Explorer
description: This article describes the .alter capacity policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/30/2021
---
# .alter capacity policy

Change the cluster's [capacity policy](capacitypolicy.md). A capacity policy controls the computational resources for data management operations on the cluster.

> [!NOTE]
> Changes to the cluster capacity policy could take up to 1 hour to take effect.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `capacity` *PolicyObject* 

## Arguments

*PolicyObject* - Define a JSON policy object. See [capacity policy](capacitypolicy.md) for policy properties. 

## Returns

Returns a JSON representation of the policy.

## Example

```kusto
.alter cluster policy capacity
{
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  }
}
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
    "ClusterMaximumConcurrentOperations": 1,
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
