---
title: .create-or-alter workload_group command
description: Learn how to use the `create-or-alter workload_group` command to create a new workload group or alter an existing workload group.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/01/2025
---
# .create-or-alter workload_group command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Creates a new workload group, or alters an existing workload group.

## Permissions

You must have [Cluster AllDatabasesAdmin](../access-control/role-based-access-control.md) permissions to run this command.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The `admin` role inherits `Cluster AllDatabasesAdmin` permissions.
::: moniker-end

## Syntax

`.create-or-alter` `workload_group` *WorkloadGroupName* *SerializedPolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *WorkloadGroupName* | `string` | :heavy_check_mark: | Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName']. |
| *SerializedPolicyObject* | `string` | :heavy_check_mark: | JSON representation of the policy. `*` |

`*` The following policies apply to workload groups:

* [request classification](request-classification-policy.md)
* [request limits](request-limits-policy.md)
* [request rate limit](request-rate-limit-policy.md)
* [request rate limits enforcement](request-rate-limits-enforcement-policy.md)
* [specify query consistency mode](query-consistency-policy.md)

## Returns

The command returns one row showing the details of the workload group.

Following is the schema of the output returned:

| Name              | Type   | Description                                |
|-------------------|--------|--------------------------------------------|
| WorkloadGroupName | `string` | Name of the workload group.                |
| WorkloadGroup     | `string` | JSON representation of the workload group. |

## Examples

### Define request limits policy

Create **MyWorkloadGroup** workload group with a full definition of its request limits policy:

~~~kusto
.create-or-alter workload_group MyWorkloadGroup ```
{
  "RequestLimitsPolicy": {
    "DataScope": {
      "IsRelaxable": true,
      "Value": "HotCache"
    },
    "MaxMemoryPerQueryPerNode": {
      "IsRelaxable": false,
      "Value": 6442450944
    },
    "MaxMemoryPerIterator": {
      "IsRelaxable": false,
      "Value": 5368709120
    },
    "MaxFanoutThreadsPercentage": {
      "IsRelaxable": true,
      "Value": 100
    },
    "MaxFanoutNodesPercentage": {
      "IsRelaxable": true,
      "Value": 100
    },
    "MaxResultRecords": {
      "IsRelaxable": true,
      "Value": 500000
    },
    "MaxResultBytes": {
      "IsRelaxable": true,
      "Value": 67108864
    },
    "MaxExecutionTime": {
      "IsRelaxable": true,
      "Value": "00:04:00"
    },
    "QueryResultsCacheMaxAge": {
      "IsRelaxable": true,
      "Value": "00:05:00"
    }
  }
} ```
~~~

**Output**

| WorkloadGroupName | WorkloadGroup |
|--|--|
| MyWorkloadGroup | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable":true,"Value":"HotCache"},"MaxMemoryPerQueryPerNode":{"IsRelaxable":false,"Value":6442450944},"MaxMemoryPerIterator":{"IsRelaxable":false,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable":true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable":true,"Value":100},"MaxResultRecords":{"IsRelaxable":true,"Value":500000},"MaxResultBytes":{"IsRelaxable":true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable":true,"Value":"00:04:00"}},"RequestRateLimitPolicies":[{"IsEnabled":true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":20}}]} |

### Define request limits policy and request rate limits policies

Create **My Workload Group** workload group with a full definition of its request limits policy and request rate limits policies:

~~~kusto
.create-or-alter workload_group ['My Workload Group'] ```
{
  "RequestLimitsPolicy": {
    "DataScope": {
      "IsRelaxable": true,
      "Value": "All"
    },
    "MaxMemoryPerQueryPerNode": {
      "IsRelaxable": true,
      "Value": 6442450944
    },
    "MaxMemoryPerIterator": {
      "IsRelaxable": true,
      "Value": 5368709120
    },
    "MaxFanoutThreadsPercentage": {
      "IsRelaxable": true,
      "Value": 100
    },
    "MaxFanoutNodesPercentage": {
      "IsRelaxable": true,
      "Value": 100
    },
    "MaxResultRecords": {
      "IsRelaxable": true,
      "Value": 500000
    },
    "MaxResultBytes": {
      "IsRelaxable": true,
      "Value": 67108864
    },
    "MaxExecutionTime": {
      "IsRelaxable": true,
      "Value": "00:04:00"
    },
    "QueryResultsCacheMaxAge": {
      "IsRelaxable": true,
      "Value": "00:05:00"
    }
  },
  "RequestRateLimitPolicies": [
  {
      "IsEnabled": true,
      "Scope": "WorkloadGroup",
      "LimitKind": "ConcurrentRequests",
      "Properties": {
        "MaxConcurrentRequests": 100
      }
    },
    {
      "IsEnabled": true,
      "Scope": "Principal",
      "LimitKind": "ConcurrentRequests",
      "Properties": {
        "MaxConcurrentRequests": 25
      }
    }
  ]
} ```
~~~

**Output**

| WorkloadGroupName | WorkloadGroup |
|--|--|
| My Workload Group | {"RequestLimitsPolicy":{"DataScope":{"IsRelaxable":true,"Value":"All"},"MaxMemoryPerQueryPerNode":{"IsRelaxable":true,"Value":6442450944},"MaxMemoryPerIterator":{"IsRelaxable":true,"Value":5368709120},"MaxFanoutThreadsPercentage":{"IsRelaxable":true,"Value":100},"MaxFanoutNodesPercentage":{"IsRelaxable":true,"Value":100},"MaxResultRecords":{"IsRelaxable":true,"Value":500000},"MaxResultBytes":{"IsRelaxable":true,"Value":67108864},"MaxExecutionTime":{"IsRelaxable":true,"Value":"00:04:00"}},"RequestRateLimitPolicies":[{"IsEnabled":true,"Scope":"WorkloadGroup","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":100}},{"IsEnabled":true,"Scope":"Principal","LimitKind":"ConcurrentRequests","Properties":{"MaxConcurrentRequests":25}}]} |

## Related content

* [Workload groups](workload-groups.md)
* [.alter-merge workload_group](alter-merge-workload-group-command.md)
* [.drop workload_group](drop-workload-group-command.md)
* [.show workload_group](show-workload-group-command.md)
