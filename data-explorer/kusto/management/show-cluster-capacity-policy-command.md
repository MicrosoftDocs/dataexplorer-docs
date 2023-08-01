---
title: .show cluster policy capacity command
description: Learn how to use the `.show cluster policy capacity` command to display a cluster's capacity policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show cluster policy capacity command

Display a cluster's [capacity policy](capacitypolicy.md). A capacity policy is used for controlling the compute resources of data management operations on the cluster.

## Permissions

You must have at least [AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `capacity`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Returns

Returns a JSON representation of the policy.

### Example

Display the cluster's capacity policy.

```kusto
.show cluster policy capacity
```
