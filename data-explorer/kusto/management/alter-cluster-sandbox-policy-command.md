---
title: ".alter cluster sandbox policy command - Azure Data Explorer"
description: "This article describes the .alter cluster sandbox policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/30/2021
---
# .alter cluster sandbox policy

Change the cluster sandbox policy. Azure Data Explorer runs specified plugins within [sandboxes](../concepts/sandboxes.md) whose resources are managed for security and resource governance. Sandbox limitations are defined in sandbox policies, where each sandbox kind can have its own policy. Azure Data Explorer's Data Engine service run sandboxes for specific flows that need secure isolation. 
Examples of these flows are user-defined scripts that run using the [Python plugin](../query/pythonplugin.md) or the [R plugin](../query/rplugin.md).

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

To alter the policies, you'll need [AllDatabasesAdmin](../management/access-control/role-based-authorization.md) permissions.

## Syntax

`.alter` `cluster` `policy` `sandbox` *ArrayOfPolicyObjects*

## Arguments

*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Returns

Returns a JSON representation of the policy.

## Example

Modifies the collection of sandbox policies at the cluster level.

```kusto
.alter cluster policy sandbox @'['
  '{'
    '"SandboxKind": "PythonExecution",'
    '"IsEnabled": true,'
    '"InitializeOnStartup": false,'
    '"TargetCountPerNode": 4,'
    '"MaxCpuRatePerSandbox": 50,'
    '"MaxMemoryMbPerSandbox": 10240'
  '},'
  '{'
    '"SandboxKind": "RExecution",'
    '"IsEnabled": true,'
    '"InitializeOnStartup": false,'
    '"TargetCountPerNode": 4,'
    '"MaxCpuRatePerSandbox": 50,'
    '"MaxMemoryMbPerSandbox": 10240'
  '}'
']'
```
