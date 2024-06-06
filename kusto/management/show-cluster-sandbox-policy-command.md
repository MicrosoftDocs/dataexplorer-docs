---
title: .show cluster policy sandbox command
description: Learn how to use the `.show cluster policy sandbox` command to display the cluster's sandbox policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show cluster policy sandbox command

Display the cluster sandbox policy. Specified plugins run within [sandboxes](../concepts/sandboxes.md) whose resources are managed for security and resource governance. Sandbox limitations are defined in sandbox policies, where each sandbox kind can have its own policy.

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

## Permissions

You must have at least [AllDatabasesMonitor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `sandbox`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

Returns a JSON representation of the policy.

## Example

Display the cluster's sandbox policy:

```kusto
.show cluster policy sandbox
```
