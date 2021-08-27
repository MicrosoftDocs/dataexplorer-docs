---
title: Workload groups management - Azure Data Explorer
description: This article describes management commands for workload groups in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 04/30/2021
---
# Workload groups - Control commands

These commands require [AllDatabasesAdmin](access-control/role-based-authorization.md) permission.

## .create-or-alter workload_group

Creates a new workload group, or alters an existing workload group.

### Syntax

`.create-or-alter` `workload_group` *WorkloadGroupName* `"`*Serialized workload group and policies*`"`

### Examples

#### Full definition of request limits policy

Create a workload group with a full definition of its request limits policy:

```kusto
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
    }
  }
}```
```

#### Full definition of request limits policy and request rate limits policies

Create a workload group with a full definition of its request limits policy and request rate limits policies:

```kusto
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
}```
```

## .alter-merge workload_group

### Syntax

`.alter-merge` `workload_group` *WorkloadGroupName* `"`*Serialized partial workload group and policies*`"`

### Examples

#### Alter specific limits in the request limits policy

Alter specific limits in the request limits policy of the `default` workload group,
while keeping previously defined limits unchanged:

```kusto
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
}``
```

#### Alter the request rate limit policies

Alter the request rate limit policies of the `default` workload group, while keeping its other policies unchanged:

```kusto
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
}```
```

#### Alter the request queuing policy

Enable request queuing for the `default` workload group, while keeping its other policies unchanged:

```kusto
.alter-merge workload_group default ```
{
  "RequestQueuingPolicy": {
      "IsEnabled": true
  }
}```
```

#### Alter the request consistency policy

Set the query consistency policy for the `default` workload group, while keeping its other policies unchanged:

```kusto
.alter-merge workload_group default ```
{
  "QueryConsistencyPolicy": {
      "QueryConsistency": {
          "IsRelaxable": true,
          "Value": "Weak"
      },
      "CachedResultsMaxAge": {
          "IsRelaxable": true,
          "Value": "05:00:00"
      }
  }
}```
```

#### Alter the request rate limits enforcement policy

Set the request rate limits enforcement policy for the `default` workload group,
while keeping all of its other policies unchanged:

```kusto
.alter-merge workload_group default ```
{
  "RequestRateLimitsEnforcementpolicy": {
      "QueriesEnforcementLevel": "QueryHead",
      "CommandsEnforcementLevel": "Cluster"
  }
}```
```

## .drop workload_group

Drops a workload group.

The `internal` and `default` workload groups may not be dropped.

### Syntax

`.drop` `workload_group` *WorkloadGroupName*

### Examples

```kusto
.drop workload_group MyWorkloadGroup
```

```kusto
.drop workload_group ['MyWorkloadGroup']
```

## .show workload_group

Shows a specific or all workload group definitions.

### Syntax

`.show` `workload_group` *WorkloadGroupName*

`.show` `workload_groups`

### Output

| ColumnName        | DataType | Description                                          |
|-------------------|----------|------------------------------------------------------|
| WorkloadGroupName | string   | The name of the workload group.                      |
| WorkloadGroup     | string   | JSON serialization of the workload group's policies. |

### Example

```kusto
.show workload_group MyWorkloadGroup
```

| WorkloadGroupName  | WorkloadGroup                                                                                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MyWorkloadGroup    | {"RequestRateLimitPolicies": [{"IsEnabled": true, "Scope": "WorkloadGroup", "LimitKind": "ConcurrentRequests", "Properties": {"MaxConcurrentRequests": 30}}]} |

## Example

This example does the following steps:

1. Creates a workload group named `My Workload Group`.
1. Creates a `request_classification` policy that classifies requests with the following characteristics to `My Workload Group`:
    * The request is a query.
    * The current principal is an AAD user, and is a member of the AAD group `MyGroup@contoso.com`.
    * The current application is named `Kusto.Explorer`.
    * The current database is named `My Database`.
1. Applies the following **request limits** to requests classified to `My Workload Group`:
    * Default data scope: hot cache (caller *can't* relax the limit in client request properties).
    * Maximum records in result set: 100,000 (caller *can* relax the limit in client request properties).
    * Maximum size of result set: 50 MB (caller *can* relax the limit in client request properties).
    * Maximum execution time: 1 minute (caller *can't* relax the limit in client request properties).
1. Applies the following **request rate limits** to requests classified to `My Workload Group`:
    * Maximum number of concurrent requests: 10.
    * Maximum number of concurrent requests per principal: 3.
    * Total number of requests per minute per principal: 12.

Any other request is classified to the `default` workload group.
Request limits that aren't defined in `My Workload Group`'s policy are taken from the `default` workload group's policy.

```kusto
.alter cluster policy request_classification '{"IsEnabled":true}' <|
    case(current_principal_is_member_of("aadgroup=MyGroup@microsoft.com") and
         request_properties.current_database == "My Database" and
         request_properties.current_application == "Kusto.Explorer" and
         request_properties.current_principal startswith 'aaduser=' and
         request_properties.request_type == 'Query', "My Workload Group",
         "default")
```

```kusto
.create-or-alter workload_group ['My Workload Group'] ```
{
  "RequestLimitsPolicy": {
    "DataScope": {
      "IsRelaxable": false,
      "Value": "HotCache"
    },
    "MaxResultRecords": {
      "IsRelaxable": true,
      "Value": 100000
    },
    "MaxResultBytes": {
      "IsRelaxable": true,
      "Value": 52428800
    },
    "MaxExecutionTime": {
      "IsRelaxable": false,
      "Value": "00:01:00"
    }
  },
  "RequestRateLimitPolicies": [
    {
      "IsEnabled": true,
      "Scope": "WorkloadGroup",
      "LimitKind": "ConcurrentRequests",
      "Properties": {
        "MaxConcurrentRequests": 10
      }
    },
    {
      "IsEnabled": true,
      "Scope": "Principal",
      "LimitKind": "ConcurrentRequests",
      "Properties": {
        "MaxConcurrentRequests": 3
      }
    },
    {
      "IsEnabled": true,
      "Scope": "Principal",
      "LimitKind": "ResourceUtilization",
      "Properties": {
        "ResourceKind": "RequestCount",
        "MaxUtilization": 12,
        "TimeWindow": "00:01:00"
      }
    }
  ]
}```
```
