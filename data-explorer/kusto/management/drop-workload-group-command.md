---
title: .drop workload group command - Azure Data Explorer
description: This article describes the .drop workload group command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .drop workload_group

Drops a workload group. This command requires [AllDatabasesAdmin](access-control/role-based-authorization.md) permission.

> [!NOTE]
> The `internal` and `default` workload groups can't be dropped.  

For more information, see [Workload groups](workload-groups.md).

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
