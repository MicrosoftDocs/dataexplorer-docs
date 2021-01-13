---
title: Request limits policy - Azure Data Explorer
description: This article describes the request limits policy in Azure Data Explorer.
services: data-explorer
author: yonileibowitz
ms.author: yonil
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: reference
ms.date: 12/31/2020
---
# Request limits policy (Preview)

A workload group's request limits policy allows limiting the resources used by the request during its execution.

## The policy object

Each limit consists of:

* A typed `Value` - the value of the limit.
* `IsRelaxable` - a boolean value that defines if the limit can be relaxed
  by the caller, as part of the request's [Client request properties](../api/netfx/request-properties.md).

The following limits are configurable:

| Name                       | Type             | Description                                                                                                                                                                                              | Supported values                          | Matching client request property            |
|----------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|---------------------------------------------|
| DataScope                  | `QueryDataScope` | The query's data scope - whether the query applies to all data or just the 'hot' portion of it.                                                                                                          | `All`, `HotCache`, or `null`              | `query_datascope`                           |
| MaxMemoryPerQueryPerNode   | `long`           | The maximum amount of memory a query can allocate.                                                                                                                                                       | [`1`, *50% of a single node's total RAM*] | `max_memory_consumption_per_query_per_node` |
| MaxMemoryPerIterator       | `long`           | The maximum amount of memory a query operator can allocate.                                                                                                                                              | [`1`, *50% of a single node's total RAM*] | `maxmemoryconsumptionperiterator`           |
| MaxFanoutThreadsPercentage | `int`            | The percentage of threads on each node to fan out query execution to. When set to 100%, the cluster will assign all CPUs on each node. For example, 16 CPUs on a cluster deployed on Azure D14_v2 nodes. | [`1`, `100`]                              | `query_fanout_threads_percent`              |
| MaxFanoutNodesPercentage   | `int`            | The percentage of nodes on the cluster to fan out query execution to. Functions in a similar manner to `MaxFanoutThreadsPercentage`.                                                                     | [`1`, `100`]                              |  `query_fanout_nodes_percent`               |
| MaxResultRecords           | `long`           | maximum number of records a request is allowed to return to the caller (above it, results are truncated).                                                                                                | [`1`, `9223372036854775807`]              | `truncationmaxrecords`                      |
| MaxResultBytes             | `long`           | The maximum data size (in bytes) a request is allowed to return to the caller (above it, results are truncated).                                                                                         | [`1`, `9223372036854775807`]              | `truncationmaxsize`                         |
| MaxExecutionTime           | `timespan`       | The maximum duration the request may run for.                                                                                                                                                            | (`00:00:00`, `01:00:00`]                  | `servertimeout`                             |

### Notes

* A limit that isn't defined, or is defined as `null`, is taken from the `default` workload group's request limits policy.
* When altering the policy for the `default` workload group, a limit must be defined and have a non-`null` value.
* For backwards compatibility: For export commands or ingest-from-query commands (such as `.set-or-append`, .`set-or-replace`, etc.) that are classified to
  the `default` workload group, requests limits are disabled, and limits set in the policy don't apply.
  * When such commands are classified to a non-default workload group, the limits in the policy do apply.

### Example

```json
{
  "DataScope": {
    "IsRelaxable": true,
    "Value": "HotCache"
  },
  "MaxMemoryPerQueryPerNode": {
    "IsRelaxable": true,
    "Value": 2684354560
  },
  "MaxMemoryPerIterator": {
    "IsRelaxable": true,
    "Value": 2684354560
  },
  "MaxFanoutThreadsPercentage": {
    "IsRelaxable": true,
    "Value": 50
  },
  "MaxFanoutNodesPercentage": {
    "IsRelaxable": true,
    "Value": 50
  },
  "MaxResultRecords": {
    "IsRelaxable": true,
    "Value": 1000
  },
  "MaxResultBytes": {
    "IsRelaxable": true,
    "Value": 33554432
  },
  "MaxExecutiontime": {
    "IsRelaxable": true,
    "Value": "00:01:00"
  }
}
```

### The `default` workload group

The `default` workload group has the following policy defined by default. It can be altered.

```json
{
  "DataScope": {
    "IsRelaxable": true,
    "Value": "All"
  },
  "MaxMemoryPerQueryPerNode": {
    "IsRelaxable": true,
    "Value": < 50% of a single node's total RAM >
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
  "MaxExecutiontime": {
    "IsRelaxable": true,
    "Value": "00:04:00"
  }
}
```

## Control commands

A workload group's request limits policy is managed using [Workload groups control commands](workload-groups-commands.md).
