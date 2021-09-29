---
title: .show capacity policy command- Azure Data Explorer
description: This article describes the .show capacity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .show capacity policy

Display a cluster's [capacity policy](capacitypolicy.md). A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## Syntax

`.show` `cluster` `policy` `capacity` 

### Examples

Display the cluster's capacity policy.

```kusto
.show cluster policy capacity
```
