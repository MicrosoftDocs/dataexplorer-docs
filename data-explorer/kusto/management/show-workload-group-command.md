---
title: .show workload group command - Azure Data Explorer
description: This article describes the .show workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .show workload group

Shows a specific workload group or all workload group definitions.

For more information, see [Workload groups](workload-groups.md).

## Permissions

You must have [AllDatabasesAdmin](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `workload_group` *WorkloadGroupName*

`.show` `workload_groups`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*WorkloadGroupName*|string|&check;| The name of the workload group. This name can be specified with bracket notation ['WorkLoadGroupName'].|

## Example

```kusto
.show workload_group MyWorkloadGroup
```

| WorkloadGroupName  | WorkloadGroup  |
|--------------------|------_---------|
| MyWorkloadGroup    | {"RequestRateLimitPolicies": [{"IsEnabled": true, "Scope": "WorkloadGroup", "LimitKind": "ConcurrentRequests", "Properties": {"MaxConcurrentRequests": 30}}]} |
