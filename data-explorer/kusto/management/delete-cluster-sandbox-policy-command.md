---
title: .delete cluster policy sandbox command
description: Learn how to use the `.delete cluster policy sandbox` command to delete the cluster sandbox policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/13/2023
---
# .delete cluster policy sandbox command

Delete the cluster sandbox policy. Specified plugins run within [sandboxes](../concepts/sandboxes.md) whose resources are managed for security and resource governance. Sandbox limitations are defined in sandbox policies, where each sandbox kind can have its own policy.

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `sandbox`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Example

Delete the sandbox policy for a cluster.

```kusto
.delete cluster policy sandbox 
```
