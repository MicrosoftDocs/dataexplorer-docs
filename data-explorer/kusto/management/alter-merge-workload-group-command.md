---
title: .alter-merge workload group command - Azure Data Explorer
description: This article describes the .alter-merge workload group command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge workload_group

Alters a workload group.

For more information, see [Workload groups](workload-groups.md). To show the current workload group settings, use the [`.show` command](show-workload-group-command.md).

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `workload_group` *WorkloadGroupName* *SerializedPolicyObject*

## Arguments

- *WorkloadGroupName* - Name of the workload group. Can be escaped with bracket notation ['WorkLoadGroupName'].
- *SerializedPolicyObject* - Define a policy object. The following policies apply to workload groups:   
  
  * [request classification](request-classification-policy.md)
  * [request limits](request-limits-policy.md)
  * [request rate limit](request-rate-limit-policy.md)
  * [request rate limits enforcement](request-rate-limits-enforcement-policy.md).

## Examples

### Alter specific limits in the request limits policy

Alter specific limits in the request limits policy of the `default` workload group,
while keeping previously defined limits unchanged:

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

Alter the request rate limit policies of the `default` workload group,
while keeping all of its other policies unchanged:

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

Enable request queuing for the `default` workload group, while keeping its request limits policy
and request rate limit policies unchanged:

~~~kusto
.alter-merge workload_group default ```
{
  "RequestQueuingPolicy": {
      "IsEnabled": true
  }
} ```
~~~

### Alter the request rate limits enforcement policy

Enable request rate limits enforcement policy for the `default` workload group,
while keeping all of its other policies unchanged:

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

Specify the appliable option for the query consistency model:

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
