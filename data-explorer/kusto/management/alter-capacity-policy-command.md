---
title: .alter capacity policy command - Azure Data Explorer
description: This article describes the .alter capacity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .alter capacity policy

Change the cluster's [capacity policy](capacitypolicy.md). A capacity policy is used for controlling the compute resources of data management operations on the cluster.

> [!NOTE]
> Changes to the cluster capacity policy could take up to 1 hour to take effect.

## Syntax

`.alter` `cluster` `policy` `capacity` `"`*Serialized policy*`"`

## Examples

```kusto
.alter cluster policy capacity ```
{
  "IngestionCapacity": {
    "ClusterMaximumConcurrentOperations": 512,
    "CoreUtilizationCoefficient": 0.75
  },
  "ExtentsMergeCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExtentsPurgeRebuildCapacity": {
    "MaximumConcurrentOperationsPerNode": 1
  },
  "ExportCapacity": {
    "ClusterMaximumConcurrentOperations": 100,
    "CoreUtilizationCoefficient": 0.25
  },
  "ExtentsPartitionCapacity": {
    "ClusterMaximumConcurrentOperations": 4
  }
}```
```
