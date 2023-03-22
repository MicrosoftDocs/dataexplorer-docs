---
title: drop workload_group command - Azure Data Explorer
description: This article describes the drop workload_group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .drop workload_group

Drop a workload group.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `workload_group` *WorkloadGroupName*

## Parameters

| Name                | Type   | Required | Description                                                                                                                                                                                                                       |
|---------------------|--------|----------|-------------------------------------------------------------------------------------------|
| *WorkloadGroupName* | string | &check;  | Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName']. |

## Returns

The command returns all workload groups in the cluster, after the drop, which is the output of the [`.show workload_groups`](show-workload-group-command.md#show-workload_groups) command.

Following is the schema of the output returned:

| Name              | Type   | Description                                |
|-------------------|--------|--------------------------------------------|
| WorkloadGroupName | string | Name of the workload group.                |
| WorkloadGroup     | string | JSON representation of the workload group. |

## Examples

### Drop one workload group

Drop **MyWorkloadGroup** workload group:

```kusto
.drop workload_group MyWorkloadGroup
```

**Output:**

| WorkloadGroupName | WorkloadGroup                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| My Workload Group | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable": true,"Value":"All"},"MaxMemoryPerQueryPerNode":{"IsRelaxable": true,"Value":6442450944},"MaxMemoryPerIterator":{"IsRelaxable": true,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable": true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable": true,"Value":100},"MaxResultRecords":{"IsRelaxable": true,"Value":500000},"MaxResultBytes":{"IsRelaxable": true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable": true,"Value":"00:04:00"}},"RequestRateLimitPolicies":[{"IsEnabled": true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":100}},{"IsEnabled": true,"Scope":"Principal","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":25}}]}       |
| default           | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable": false,"Value":"HotCache"},"MaxMemoryPerQueryPerNode":{"IsRelaxable": true,"Value":8589699072},"MaxMemoryPerIterator":{"IsRelaxable": true,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable": true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable": true,"Value":100},"MaxResultRecords":{"IsRelaxable": true,"Value":500000},"MaxResultBytes":{"IsRelaxable": true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable":false,"Value":"00:01:00"}},"RequestRateLimitPolicies":[{"IsEnabled": true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":100}}],"RequestRateLimitsEnforcementPolicy":{"QueriesEnforcementLevel":"QueryHead","CommandsEnforcementLevel":"Database"}} |

### Drop one workload group escaping its name with square brackets

Drop **My Workload Group** workload group:

```kusto
.drop workload_group ['My Workload Group']
```

**Output:**

| WorkloadGroupName | WorkloadGroup                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MyWorkloadGroup   | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable": true,"Value":"HotCache"},"MaxMemoryPerQueryPerNode":{"IsRelaxable":false,"Value":6442450944},"MaxMemoryPerIterator":{"IsRelaxable":false,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable": true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable": true,"Value":100},"MaxResultRecords":{"IsRelaxable": true,"Value":500000},"MaxResultBytes":{"IsRelaxable": true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable": true,"Value":"00:04:00"}},"RequestRateLimitPolicies":[{"IsEnabled": true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":20}}]}                                                                                                                     |
| default           | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable":false,"Value":"HotCache"},"MaxMemoryPerQueryPerNode":{"IsRelaxable": true,"Value":8589699072},"MaxMemoryPerIterator":{"IsRelaxable": true,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable": true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable": true,"Value":100},"MaxResultRecords":{"IsRelaxable": true,"Value":500000},"MaxResultBytes":{"IsRelaxable": true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable":false,"Value":"00:01:00"}},"RequestRateLimitPolicies":[{"IsEnabled": true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":100}}],"RequestRateLimitsEnforcementPolicy":{"QueriesEnforcementLevel":"QueryHead","CommandsEnforcementLevel":"Database"}} |

## Remarks

The `internal` and `default` workload groups can't be dropped. An attempt to drop either of them aborts the command with an error indicating the reason.
