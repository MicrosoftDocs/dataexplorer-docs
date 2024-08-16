---
title: .show workload_group command
description: Learn how to use the `.show workload_group` command to show the specified workload group definitions.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show workload_group command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Shows a specific workload group or all workload group definitions.

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The `admin` role inherits `Cluster AllDatabasesAdmin` permissions.
::: moniker-end

## Syntax

`.show` `workload_group` *WorkloadGroupName*

`.show` `workload_groups`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *WorkloadGroupName* | `string` |  :heavy_check_mark: | Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName']. |

## Examples

### Show definition for a given workload group

Show definition for **MyWorkloadGroup** workload group:

```kusto
.show workload_group MyWorkloadGroup
```

**Output**

| WorkloadGroupName | WorkloadGroup |
|--|--|
| MyWorkloadGroup | {"RequestRateLimitPolicies": [{"IsEnabled": true, "Scope": "WorkloadGroup", "LimitKind": "ConcurrentRequests", "Properties": {"MaxConcurrentRequests": 30}}]} |
