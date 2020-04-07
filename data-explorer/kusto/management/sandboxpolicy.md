---
title: Sandbox policy - Azure Data Explorer | Microsoft Docs
description: This article describes Sandbox policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---
# Sandbox policy

## Overview

Kusto supports running certain plugins within [sandboxes](../concepts/sandboxes.md), where the resources available to the sandbox are
limited and controlled, both for security purposes, as well resource governance purposes.

Sandboxes are run on the nodes of the Kusto engine service, and some of their limitations are defined in sandbox policies, where
each sandbox kind can have its own Sandbox policy.

Sandbox policies are managed at cluster-level and affect all the nodes in the cluster.

Altering the policies requires [AllDatabasesAdmin](../management/access-control/role-based-authorization.md) permissions.

## The policy object

a Sandbox policy has the following properties:

* **SandboxKind**: defines the kind of the sandbox (e.g. `PythonExecution`, `RExecution`).
* **IsEnabled**: defines whether or not sandboxes of this kind are enabled to run on the cluster's nodes.
* **TargetCountPerNode**: defines how many sandboxes of this kind are allowed to run on the cluster's nodes.
  * Values can be between 1 and twice the number of processors per node.
  * The default value is `16`.
* **MaxCpuRatePerSandbox**: defines the maximum CPU rate in percentage of all available cores a single sandbox can use.
  * Values can be between 1 and 100.
  * The default value is `50`.
* **MaxMemoryMbPerSandbox**: defines the maximum amount of memory (in megabytes) a single sandbox can use.
  * Values can be between 200 and 65536 (64GB).
  * The default value is `20480` (20GB).

## Example

The following policy sets different limits for 2 different kinds of sandboxes - `PythonExecution` and `RExecution`:

```json
[
  {
    "SandboxKind": "PythonExecution",
    "IsEnabled": true,
    "TargetCountPerNode": 4,
    "MaxCpuRatePerSandbox": 55,
    "MaxMemoryMbPerSandbox": 65536
  },
  {
    "SandboxKind": "RExecution",
    "IsEnabled": true,
    "TargetCountPerNode": 2,
    "MaxCpuRatePerSandbox": 50,
    "MaxMemoryMbPerSandbox": 10240
  }
]
```

## Notes

* Changes to the sandbox policy apply to sanboxes created starting the time the change is applied.
  * Sandboxes that have been pre-allocated prior to the policy change will continue running according to the previous policy limits, until they are used as part of a query.
* There could be a delay of up to 5 minutes until the change in policy takes effect, as the cluster nodes periodically poll for policy changes.

## Next steps

Use the [sandbox policy control commands](../management/sandbox-policy.md) to manage the cluster's sandbox policy.