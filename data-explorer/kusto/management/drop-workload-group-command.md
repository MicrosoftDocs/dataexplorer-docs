---
title: .drop workload group command - Azure Data Explorer
description: This article describes the .drop workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .drop workload_group

Drops a workload group.

> [!NOTE]
> The `internal` and `default` workload groups can't be dropped.  

For more information, see [Workload groups](workload-groups.md).

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `workload_group` *WorkloadGroupName*

## Argument

*WorkloadGroupName* - Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName'].

## Examples

```kusto
.drop workload_group MyWorkloadGroup
```

```kusto
.drop workload_group ['MyWorkloadGroup']
```
