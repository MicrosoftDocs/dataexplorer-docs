---
title: Sandbox policy - Azure Data Explorer | Microsoft Docs
description: Learn about sandbox policy commands in Azure Data Explorer. See how to view, adjust, and drop sandbox policies.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---
# sandbox policy command

The following commands allow management of [sandboxes](../concepts/sandboxes.md) and [sandbox policies](sandboxpolicy.md)
in a Kusto engine service.

The commands require [AllDatabasesAdmin](access-control/role-based-authorization.md) permissions.

## Sandbox policy

### .show cluster policy sandbox

Shows all configured sandbox policies at the cluster level.

```kusto
.show cluster policy sandbox
```

### .alter cluster policy sandbox

Modifies the collection of sandbox policies at the cluster level.

```kusto
.alter cluster policy sandbox @'['
  '{'
    '"SandboxKind": "PythonExecution",'
    '"IsEnabled": true,'
    '"TargetCountPerNode": 4,'
    '"MaxCpuRatePerSandbox": 50,'
    '"MaxMemoryMbPerSandbox": 10240'
  '},'
  '{'
    '"SandboxKind": "RExecution",'
    '"IsEnabled": true,'
    '"TargetCountPerNode": 4,'
    '"MaxCpuRatePerSandbox": 50,'
    '"MaxMemoryMbPerSandbox": 10240'
  '}'
']'
```

### .drop cluster policy sandbox

For dropping **all** sandbox policies, use the following command:

```kusto
.delete cluster policy sandbox
```

