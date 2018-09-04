---
title: Capacity policy control commands - Azure Kusto | Microsoft Docs
description: This article describes Capacity policy control commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Capacity policy control commands

The following control commands can be used for managing a cluster's [capacity policy](https://kusdoc2.azurewebsites.net/docs/concepts/capacitypolicy.html).

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

**Examples:**

1. Explicitly altering all properties of the cluster policy:
```kusto
.alter cluster policy capacity @'{"IngestionCapacity": { "ClusterMaximumConcurrentOperations": 512, "CoreUtilizationCoefficient": 0.75},"ExtentsMergeCapacity": {"MaximumConcurrentOperationsPerNode": 1}, "ExtentsPurgeRebuildCapacity": {"MaximumConcurrentOperationsPerNode": 1}}'
```

2. Altering a single property of the cluster level policy, keeping all other properties intact:
```kusto
.alter-merge cluster policy capacity @'{   "IngestionCapacity": {"ClusterMaximumConcurrentOperations": 512}}'
```