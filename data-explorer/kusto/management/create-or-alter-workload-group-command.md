---
title: .create-or-alter workload group - Azure Data Explorer
description: This article describes the .create-or-alter workload group command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/08/2021
---
# .create-or-alter workload_group

Creates a new workload group, or alters an existing workload group. This command requires [AllDatabasesAdmin](access-control/role-based-authorization.md) permission.

For more information, see [Workload groups](workload-groups.md).

## Syntax

`.create-or-alter` `workload_group` *WorkloadGroupName*  { *PolicyName*: [*parameter*:*value* [, *parameter*:*value*, ...] } }

## Argument

*WorkloadGroupName* - Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName'].
*PolicyName* - Name of policy.
*parameter* - Name of policy parameter.
*value* - Value of policy parameter, in accordance with parameter type.

## Examples

### Full definition of request limits policy

Create a workload group with a full definition of its request limits policy:

```kusto
.create-or-alter workload_group MyWorkloadGroup 
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
}
```

### Full definition of request limits policy and request rate limits policies

Create a workload group with a full definition of its request limits policy and request rate limits policies:

```kusto
.create-or-alter workload_group ['My Workload Group'] 
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
}
```
