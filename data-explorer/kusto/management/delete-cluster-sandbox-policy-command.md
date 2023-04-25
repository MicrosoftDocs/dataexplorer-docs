---
title: .delete cluster sandbox policy command - Azure Data Explorer
description: This article describes the .delete cluster sandbox policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/25/2023
---
# .delete cluster sandbox policy

Delete the cluster sandbox policy. Specified plugins run within [sandboxes](../concepts/sandboxes.md) whose resources are managed for security and resource governance. Sandbox limitations are defined in sandbox policies, where each sandbox kind can have its own policy.

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `sandbox`

## Example

Delete the sandbox policy for a cluster.

```kusto
.delete cluster policy sandbox 
```
