---
title: .show workload group command - Azure Data Explorer
description: This article describes the .show workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .show workload_group(s)

Shows a specific workload group or all workload group definitions.

## Permissions

You must have [Cluster AllDatabasesAdmin](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `workload_group` *WorkloadGroupName*

`.show` `workload_groups`

## Parameters

| Name                | Type   | Required | Description                                                                                                                                                                                                                       |
|---------------------|--------|----------|-------------------------------------------------------------------------------------------|
| *WorkloadGroupName* | string | &check;  | Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName']. |

## Examples

### Show definition for a given workload group

Show definition for **MyWorkloadGroup** workload group:

```kusto
.show workload_group MyWorkloadGroup
```

**Output:**

| WorkloadGroupName  | WorkloadGroup                                                                                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MyWorkloadGroup    | {"RequestRateLimitPolicies": [{"IsEnabled": true, "Scope": "WorkloadGroup", "LimitKind": "ConcurrentRequests", "Properties": {"MaxConcurrentRequests": 30}}]} |
