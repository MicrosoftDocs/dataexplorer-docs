---
title:  .alter cluster policy sandbox command
description: Learn how to use the `.alter cluster policy sandbox` command to change the cluster sandbox policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter cluster policy sandbox command

Changes the [cluster sandbox policy](sandboxpolicy.md). Specified plugins run within [sandboxes](../concepts/sandboxes.md) whose resources are managed for security and resource governance. Sandbox limitations are defined in sandbox policies, where each sandbox kind can have its own policy. The engine service can run sandboxes for specific flows that need secure isolation.
Examples of these flows are user-defined scripts that run using the [Python plugin](../query/pythonplugin.md) or the [R plugin](../query/rplugin.md).

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `cluster` `policy` `sandbox` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ArrayOfPolicyObjects* | string | &check;  | An array with one or more policy objects defined. For policy object definitions, the [sandbox policy](sandboxpolicy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

Modifies the collection of sandbox policies at the cluster level.

```kusto
.alter cluster policy sandbox ```[
  {
    "SandboxKind": "PythonExecution",
    "IsEnabled": true,
    "InitializeOnStartup": false,
    "TargetCountPerNode": 4,
    "MaxCpuRatePerSandbox": 50,
    "MaxMemoryMbPerSandbox": 10240
  },
  {
    "SandboxKind": "RExecution",
    "IsEnabled": true,
    "InitializeOnStartup": false,
    "TargetCountPerNode": 4,
    "MaxCpuRatePerSandbox": 50,
    "MaxMemoryMbPerSandbox": 10240
  }
]```
```
