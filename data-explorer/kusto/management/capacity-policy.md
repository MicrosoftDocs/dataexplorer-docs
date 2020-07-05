---
title: Capacity policy control commands - Azure Data Explorer | Microsoft Docs
description: This article describes Capacity policy control commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/02/2020
---
# Capacity policy commands

The following control commands can be used for managing a cluster's [capacity policy](../management/capacitypolicy.md).

The commands require [AllDatabasesAdmin](../management/access-control/role-based-authorization.md) permissions.

## show cluster policy capacity

```kusto
.show cluster policy capacity
```

Displays the current capacity policy for the cluster.

**Output**

|Policy Name | Entity Name | Policy | Child entities | Entity Type
|---|---|---|---|---
|CapacityPolicy | | JSON-formatted string that represents the policy | The list of databases in the cluster |Cluster


## alter cluster policy capacity

```kusto
.alter cluster policy capacity @'{ ... capacity policy JSON representation ... }'
.alter-merge cluster policy capacity @'{ ... capacity policy partial-JSON representation ... }'
```

**Note**: Changes to the cluster capacity policy could take up to 1 hour to take effect.

**Examples:**

* Explicitly altering all properties of the cluster policy:

```kusto
.alter cluster policy capacity
'{'
  '"IngestionCapacity": {'
    '"ClusterMaximumConcurrentOperations": 512,'
    '"CoreUtilizationCoefficient": 0.75'
  '},'
  '"ExtentsMergeCapacity": {'
    '"MaximumConcurrentOperationsPerNode": 1'
  '},'
  '"ExtentsPurgeRebuildCapacity": {'
    '"MaximumConcurrentOperationsPerNode": 1'
  '},'
  '"ExportCapacity": {'
    '"ClusterMaximumConcurrentOperations": 100,'
    '"CoreUtilizationCoefficient": 0.25'
  '},'
  '"ExtentsPartitionCapacity": {'
    '"ClusterMaximumConcurrentOperations": 4'
  '}'
'}'
```

* Altering a single property of the cluster level policy, keeping all other properties intact:

```kusto
.alter-merge cluster policy capacity
'{'
  '"ExtentsPartitionCapacity": {'
    '"MaximumConcurrentOperationsPerNode": 4'
  '}'
'}'
```
