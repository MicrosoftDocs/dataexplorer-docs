---
title: .show workload group command - Azure Data Explorer
description: This article describes the .show workload group command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .show workload group

Shows a specific workload group or all workload group definitions. This command requires [AllDatabasesAdmin](access-control/role-based-authorization.md) permission.

For more information, see [Workload groups](workload-groups.md).

## Syntax

`.show` `workload_group` *WorkloadGroupName*

`.show` `workload_groups`

## Example

```kusto
.show workload_group MyWorkloadGroup
```

| WorkloadGroupName  | WorkloadGroup                                                                                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MyWorkloadGroup    | {"RequestRateLimitPolicies": [{"IsEnabled": true, "Scope": "WorkloadGroup", "LimitKind": "ConcurrentRequests", "Properties": {"MaxConcurrentRequests": 30}}]} |
