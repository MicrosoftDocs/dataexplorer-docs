---
title: .show cluster capacity policy command- Azure Data Explorer
description: This article describes the .show cluster capacity policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .show cluster capacity policy

Display a cluster's [capacity policy](capacitypolicy.md). A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## Permissions

You must have at least [Cluster AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `capacity` 

## Returns

Returns a JSON representation of the policy.

### Example

Display the cluster's capacity policy.

```kusto
.show cluster policy capacity
```
