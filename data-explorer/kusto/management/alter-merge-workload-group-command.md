---
title: .alter-merge workload group command - Azure Data Explorer
description: This article describes the .alter-merge workload group command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/08/2021
---
# .alter-merge workload_group

Alters a workload group. This command requires [AllDatabasesAdmin](access-control/role-based-authorization.md) permission.

For more information, see [Workload groups](workload-groups.md).

## Syntax

`.alter-merge` `workload_group` *WorkloadGroupName* { *PolicyParameter*:*value* [, *PolicyParameter*:*value*, ...] }

## Argument

*WorkloadGroupName* - Name of the workload group. Can be specified with bracket notation ['WorkLoadGroupName'].
*PolicyParameter* - Name of policy parameter.
*value* - Value of policy parameter, in accordance with parameter type.

## Examples

### Alter specific limits in the request limits policy

Alter specific limits in the request limits policy of the `default` workload group,
while keeping previously defined limits unchanged:

```kusto
.alter-merge workload_group default @'[
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
}]'
```

### Alter the request rate limit policies

Alter the request rate limit policies of the `default` workload group,
while keeping all of its other policies unchanged:

```kusto
.alter-merge workload_group default @'[
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
}]'
```

### Alter the request queuing policy

Enable request queuing for the `default` workload group, while keeping its request limits policy
and request rate limit policies unchanged:

```kusto
.alter-merge workload_group default @'[
{
  "RequestQueuingPolicy": {
      "IsEnabled": true
  }
}]'
```

### Alter the request rate limits enforcement policy

Enable request rate limits enforcement policy for the `default` workload group,
while keeping all of its other policies unchanged:

```kusto
.alter-merge workload_group default @'[
{
  "RequestRateLimitsEnforcementpolicy": {
      "QueriesEnforcementLevel": "QueryHead",
      "CommandsEnforcementLevel": "Cluster"
  }
}]'
```
