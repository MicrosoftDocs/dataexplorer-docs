---
title: .alter-merge workload group command - Azure Data Explorer
description: This article describes the .alter-merge workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/26/2023
---
# .alter-merge workload_group

Alters a workload group.

For more information, see [Workload groups](workload-groups.md). To show the current workload group settings, use the [`.show` command](show-workload-group-command.md).

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `workload_group` *WorkloadGroupName* *SerializedPolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *WorkloadGroupName* | string | &check; | The name of the workload group. The name can be escaped with bracket notation like ['WorkLoadGroupName']. |
| *SerializedPolicyObject* | string | &check; | A serialized policy object. The following policies apply to workload groups: [request classification](request-classification-policy.md), [request limits](request-limits-policy.md), [request rate limit](request-rate-limit-policy.md), and [request rate limits enforcement](request-rate-limits-enforcement-policy.md).|

## Examples

### Alter specific limits in the request limits policy

The following command alters specific limits in the request limits policy of the `default` workload group,
while keeping previously defined limits unchanged.

~~~kusto
.alter-merge workload_group default ```
{
  "RequestLimitsPolicy": {
    "DataScope": {
      "IsRelaxable": false,
      "Value": "HotCache"
    },
    "MaxExecutionTime": {
      "IsRelaxable": false,
      "Value": "00:01:00"
    }
  }
} ```
~~~

### Alter the request rate limit policies

The following command alters the request rate limit policies of the `default` workload group,
while keeping all of its other policies unchanged.

~~~kusto
.alter-merge workload_group default ```
{
  "RequestRateLimitPolicies": [
    {
      "IsEnabled": true,
      "Scope": "WorkloadGroup",
      "LimitKind": "ConcurrentRequests",
      "Properties": {
        "MaxConcurrentRequests": 100
      }
    }
  ]
} ```
~~~

### Alter the request queuing policy

The following command turns on request queuing for the `default` workload group, while keeping its request limits policy and request rate limit policies unchanged.

~~~kusto
.alter-merge workload_group default ```
{
  "RequestQueuingPolicy": {
      "IsEnabled": true
  }
} ```
~~~

### Alter the request rate limits enforcement policy

The following command turns on request rate limits enforcement policy for the `default` workload group,
while keeping all of its other policies unchanged.

~~~kusto
.alter-merge workload_group default ```
{
  "RequestRateLimitsEnforcementpolicy": {
      "QueriesEnforcementLevel": "QueryHead",
      "CommandsEnforcementLevel": "Cluster"
  }
} ```
~~~

### Alter the query consistency policy

The following command specifies the applicable option for the query consistency model.

~~~kusto
.alter-merge workload_group default ```
{
  "QueryConsistencyPolicy": {
     "QueryConsistency": {
        "IsRelaxable": true,
        "Value": "Weak"
     }
  }
} ```
~~~
