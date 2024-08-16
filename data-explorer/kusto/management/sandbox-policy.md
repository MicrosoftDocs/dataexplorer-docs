---
title:  Sandbox policy
description: This article describes Sandbox policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/25/2023
---
# Sandbox policy

Certain plugins run within [sandboxes](../concepts/sandboxes.md) whose available resources are limited and controlled for security and for resource governance.

Sandboxes run on the nodes of your cluster. Some of their limitations are defined in sandbox policies, where each sandbox kind can have its own policy.

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

## Permissions

You must have [AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

## The policy object

A sandbox policy has the following properties.

* **SandboxKind**: Defines the type of the sandbox (such as, `PythonExecution`, `RExecution`).
* **IsEnabled**: Defines if sandboxes of this type may run on the cluster's nodes.
  * The default value is false.
* **InitializeOnStartup**: Defines whether sandboxes of this type are initialized on startup, or lazily, upon first use.
  * The default value is false. To ensure consistent performance and avoid any delays for running queries following service restart, set this property to *true*.
* **TargetCountPerNode**: Defines how many sandboxes of this type are allowed to run on the cluster's nodes.
  * Values can be between one and twice the number of processors per node.
  * The default value is 16.
* **MaxCpuRatePerSandbox**: Defines the maximum CPU rate as a percentage of all available cores that a single sandbox can use.
  * Values can be between 1 and 100.
  * The default value is 50.
* **MaxMemoryMbPerSandbox**: Defines the maximum amount of memory (in megabytes) that a single sandbox can use.
  * For Hyper-V technology sandboxes, values can be between 200 and 32768 (32 GB). The default value is 1024 (1 GB). The maximum memory of all sandboxes on a node (*TargetCountPerNode* \* *MaxMemoryMbPerSandbox*) is 32768 (32 GB).
  * For legacy sandboxes, values can be between 200 and 65536 (64 GB). The default value is 20480 (20 GB).

If a policy isn't explicitly defined for a sandbox kind, an implicit policy with the default values and `IsEnabled` set to `true` applies.

## Example

The following policy sets different limits for `PythonExecution` and `RExecution` sandboxes:

```json
[
  {
    "SandboxKind": "PythonExecution",
    "IsEnabled": true,
    "InitializeOnStartup": false,
    "TargetCountPerNode": 4,
    "MaxCpuRatePerSandbox": 55,
    "MaxMemoryMbPerSandbox": 8192
  },
  {
    "SandboxKind": "RExecution",
    "IsEnabled": true,
    "InitializeOnStartup": false,
    "TargetCountPerNode": 2,
    "MaxCpuRatePerSandbox": 50,
    "MaxMemoryMbPerSandbox": 10240
  }
]
```

> [!NOTE]
> * There could be a delay of up to five minutes until the change in policy takes effect, because the cluster needs to recycle the sandboxes that have been pre-allocated before the policy change.

## Related content


* [Sandbox policy management commands](./show-cluster-sandbox-policy-command.md)
