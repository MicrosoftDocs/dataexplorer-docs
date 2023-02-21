---
title: .create-or-alter workload group - Azure Data Explorer
description: This article describes the .create-or-alter workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .create-or-alter workload_group

Creates a new workload group, or alters an existing workload group.

For more information, see [Workload groups](workload-groups.md). To show the current workload group settings, use the [`.show` command](show-workload-group-command.md).

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create-or-alter` `workload_group` *WorkloadGroupName* *SerializedArrayOfPolicyObjects*

## Arguments

- *WorkloadGroupName* - Name of the workload group. Can be escaped with bracket notation ['WorkLoadGroupName'].
- *SerializedArrayOfPolicyObjects* - An array with one or more policy objects defined. The following policies apply to workload groups:   
  
  * [request classification](request-classification-policy.md)
  * [request limits](request-limits-policy.md)
  * [request rate limit](request-rate-limit-policy.md)
  * [request rate limits enforcement](request-rate-limits-enforcement-policy.md).

## Examples

### Define request limits policy

Create a workload group with a full definition of its request limits policy:

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

### Define request limits policy and request rate limits policies

Create a workload group with a full definition of its request limits policy and request rate limits policies:

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