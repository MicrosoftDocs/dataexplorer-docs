---
title: .alter-merge callout policy command- Azure Data Explorer
description: This article describes the .alter-merge callout policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .alter-merge callout policy

Enables or disables a cluster's [capacity policy](capacitypolicy.md). A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## Syntax

`.alter-merge` `cluster` `policy` `callout` `"`*Serialized policy*`"`

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