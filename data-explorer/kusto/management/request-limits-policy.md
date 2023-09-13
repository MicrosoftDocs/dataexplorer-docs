---
title: Request limits policy
description: Learn how to use the request limits policy to limit the resources used by the request during its execution.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# Request limits policy

A workload group's request limits policy allows limiting the resources used by the request during its execution.

## The policy object

Each limit consists of:

* A typed `Value` - the value of the limit.
* `IsRelaxable` - a boolean value that defines if the limit can be relaxed by the caller, as part of the request's [query options](../api/rest/query-options.md).

The following limits are configurable:

| Name   | Type    | Description      | Supported values  | Matching client request property       |
|-----------|------------|-----------|---------------------|--------------|
| DataScope     | `QueryDataScope` | The query's data scope - whether the query applies to all data or just the 'hot' portion of it.   | `All`, `HotCache`, or `null`     | `query_datascope`      |
| MaxMemoryPerQueryPerNode   | `long`  | The maximum amount of memory (in bytes) a query can allocate.    | [`1`, *50% of a single node's total RAM*] | `max_memory_consumption_per_query_per_node` |
| MaxMemoryPerIterator       | `long`    | The maximum amount of memory (in bytes) a [query operator](../concepts/querylimits.md#limit-on-memory-consumed-by-query-operators-e_runaway_query) can allocate. | [`1`, *50% of a single node's total RAM*] | `maxmemoryconsumptionperiterator`   |
| MaxFanoutThreadsPercentage | `int`   | The percentage of threads on each node to fan out query execution to. When set to 100%, the cluster assigns all CPUs on each node. For example, 16 CPUs on a cluster deployed on Azure D14_v2 nodes. | [`1`, `100`]   | `query_fanout_threads_percent` |
| MaxFanoutNodesPercentage   | `int`     | The percentage of nodes on the cluster to fan out query execution to. Functions in a similar manner to `MaxFanoutThreadsPercentage`.    | [`1`, `100`]                              |  `query_fanout_nodes_percent`               |
| MaxResultRecords           | `long`     | maximum number of records a request is allowed to return to the caller, above which the results are truncated.    | [`1`, `9223372036854775807`]   | `truncationmaxrecords`  |
| MaxResultBytes     | `long`           | The maximum data size (in bytes) a request is allowed to return to the caller, above which the results are truncated.  | [`1`, `9223372036854775807`]    | `truncationmaxsize`    |
| MaxExecutionTime     | `timespan`   | The maximum duration the request may run for.<br/>**Notes:**<br/>1) This can be used to place more limits on top of the [*default* limits on execution time](../concepts/querylimits.md#limit-execution-timeout), but not extend them.<br/>2) Timeout processing isn't at the resolution of *seconds*, rather it's designed to prevent a query from running for *minutes*.<br/>3) The time it takes to read the payload back at the client isn't treated as part of the timeout. It depends on how quickly the caller pulls the data from the stream.<br/>4) Total execution time may exceed the configured value if aborting execution takes longer to complete. | (`00:00:00`, `01:00:00`]   | `servertimeout`    |

### Notes

* A limit that isn't defined, or is defined as `null`, is taken from the `default` workload group's request limits policy.
* When you alter the policy for the `default` workload group, a limit must be defined and have a non-`null` value.
* The truncation limits `MaxResultRecords` and `MaxResultBytes` affect the final result of the query, as delivered back to the client. They don't apply to intermediate results of subqueries, such as those that result from having cross-cluster references.
* In the default policy for the `default` workload group, all limits have `IsRelaxable` set to `true`.
* Backwards compatibility:
  * Requests limits are disabled, and limits set in the policy don't apply for the following types of commands, when they're classified to the `default` workload group:
    * `.export` commands.
    * Commands that ingest from a query (such as `.set-or-append` or `.set-or-replace`).
  * If these commands are classified to a non-default workload group, the request limits in the policy apply.

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

The `default` workload group has the following policy defined by default. This policy can be altered.

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

## Management commands

Manage the workload group's request limits policy with [Workload groups management commands](./show-workload-group-command.md).
