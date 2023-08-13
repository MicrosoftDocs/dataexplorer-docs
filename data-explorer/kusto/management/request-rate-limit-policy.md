---
title: Request rate limit policy
description: Learn how to use the request rate limit policy to limit the number of concurrent requests classified into a workload group.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# Request rate limit policy

The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group, per workload group or per principal.

## The policy object

A request rate limit policy has the following properties:

| Name       | Supported values                            | Description                                |
|------------|---------------------------------------------|--------------------------------------------|
| IsEnabled  | `true`, `false`                             | Indicates if the policy is enabled or not. |
| Scope      | `WorkloadGroup`, `Principal`                | The scope to which the limit applies.      |
| LimitKind  | `ConcurrentRequests`, `ResourceUtilization` | The kind of the request rate limit.        |
| Properties | Property bag                                | Properties of the request rate limit.      |

### Concurrent requests rate limit

A request rate limit of kind `ConcurrentRequests` includes the following property:

| Name                  | Type | Description                                | Supported Values |
|-----------------------|------|--------------------------------------------|------------------|
| MaxConcurrentRequests | int  | The maximum number of concurrent requests. | [`0`, `10000`]   |

When a request exceeds the limit on maximum number of concurrent requests:

* The request's state, as presented by [System information commands](systeminfo.md), will be `Throttled`.
* The error message will include the *origin* of the throttling and the *capacity* that's been exceeded.

The following table shows a few examples of concurrent requests that exceed the maximum limit and the error message that these requests return:

| Scenario | Error message |
|----------------|----------------|
| A throttled `.create table` command that was classified to the `default` workload group, which has a limit of 80 concurrent requests at the scope of the workload group. | The management command was aborted due to throttling. Retrying after some backoff might succeed. CommandType: 'TableCreate', Capacity: 80, Origin: 'RequestRateLimitPolicy/WorkloadGroup/default'. |
| A throttled query that was classified to a workload group named `MyWorkloadGroup`, which has a limit of 50 concurrent requests at the scope of the workload group. | The query was aborted due to throttling. Retrying after some backoff might succeed. Capacity: 50, Origin: 'RequestRateLimitPolicy/WorkloadGroup/MyWorkloadGroup'.|
| A throttled query that was classified to a workload group named `MyWorkloadGroup`, which has a limit of 10 concurrent requests at the scope of a principal. | The query was aborted due to throttling. Retrying after some backoff might succeed. Capacity: 10, Origin: 'RequestRateLimitPolicy/WorkloadGroup/MyWorkloadGroup/Principal/aaduser=9e04c4f5-1abd-48d4-a3d2-9f58615b4724;6ccf3fe8-6343-4be5-96c3-29a128dd9570'. |
  
* The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
* The exception type will be `QueryThrottledException` for queries, and `ControlCommandThrottledException` for management commands.
  
> [!NOTE]
> Management commands may also be throttled as a result of exceeding the limit defined by the cluster's [capacity policy](./show-cluster-capacity-policy-command.md).

### Resource utilization rate limit

A request rate limit of kind `ResourceUtilization` includes the following properties:

| Name           | Type           | Description     | Supported Values      |
|----------------|----------------|----------------|--------------|
| ResourceKind   | `ResourceKind` | The resource to limit. **Note:** when `ResourceKind` is `TotalCpuSeconds`, the limit is enforced based on *post-execution* reports of CPU utilization of *completed* requests: Requests whose execution will *begin after* `MaxUtilization` has been reached within the defined `TimeWindow` (based on reporting of *completed* requests) will fail. Requests that report utilization of 0.005 seconds of CPU or lower are not counted. | `RequestCount`, `TotalCpuSeconds` |
| MaxUtilization | `long`         | The maximum of the resource that can be utilized.    | RequestCount: [`1`, `1000000000`]; TotalCpuSeconds: [`1`, `828000`]      |
| TimeWindow     | `timespan`     | The sliding time window during which the limit is applied.     | [`00:01:00`, `1.00:00:00`]        |

When a request exceeds the limit on resources utilization:

* The request's state, as presented by [System information commands](systeminfo.md), will be `Throttled`.
* The error message will include the *origin* of the throttling and the *quota* that's been exceeded. For example:

The following table shows a few examples of requests that exceed the resource utilization rate limit and the error message that these requests return:

| Scenario | Error message |
|----------------|----------------|
| A throttled request that was classified to a workload group named `Automated Requests`, which has a limit of 1000 requests per hour at the scope of a principal. | The request was denied due to exceeding quota limitations. Resource: 'RequestCount', Quota: '1000', TimeWindow: '01:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests/Principal/aadapp=9e04c4f5-1abd-48d4-a3d2-9f58615b4724;6ccf3fe8-6343-4be5-96c3-29a128dd9570'. |
| A throttled request, that was classified to a workload group named `Automated Requests`, which has a limit of 2000 total CPU seconds per hour at the scope of the workload group. | The request was denied due to exceeding quota limitations. Resource: 'TotalCpuSeconds', Quota: '2000', TimeWindow: '01:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests'. |

* The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
* The exception type will be `QuotaExceededException`.

### Examples

The following policies allow up to:

* 500 concurrent requests for the workload group.
* 25 concurrent requests per principal.
* 50 requests per principal per hour.

```json
[
  {
    "IsEnabled": true,
    "Scope": "WorkloadGroup",
    "LimitKind": "ConcurrentRequests",
    "Properties": {
      "MaxConcurrentRequests": 500
    }
  },
  {
    "IsEnabled": true,
    "Scope": "Principal",
    "LimitKind": "ConcurrentRequests",
    "Properties": {
      "MaxConcurrentRequests": 25
    }
  },
  {
    "IsEnabled": true,
    "Scope": "Principal",
    "LimitKind": "ResourceUtilization",
    "Properties": {
      "ResourceKind": "RequestCount",
      "MaxUtilization": 50,
      "TimeWindow": "01:00:00"
    }
  }
]
```

The following policies will block all requests classified to the workload group:

```json
[
  {
    "IsEnabled": true,
    "Scope": "WorkloadGroup",
    "LimitKind": "ConcurrentRequests",
    "Properties": {
      "MaxConcurrentRequests": 0
    }
  },
]
```

### The `default` workload group

The `default` workload group has the following policy defined by default. This policy can be altered.

```json
[
  {
    "IsEnabled": true,
    "Scope": "WorkloadGroup",
    "LimitKind": "ConcurrentRequests",
    "Properties": {
      "MaxConcurrentRequests": < Cores-Per-Node x 10 >
    }
  }
]
```

#### Notes

* Rate limits are enforced at the level defined by the workload group's [Request rate limits enforcement policy](request-rate-limits-enforcement-policy.md).
* The default limit on maximum concurrent requests depends on the SKU of the cluster, and is calculated as: `Cores-Per-Node x 10`.
    * For example: A cluster that's set up with Azure D14_v2 nodes, where each node has 16 vCores, will have a default limit of `16` x `10` = `160`.
    * This default limit applies to the `default` workload group, and any newly created workload group that doesn't have request rate limit policies specified at the time of its creation.
* If a workload group has no limit on maximum concurrent requests defined, then the maximum allowed value of `10000` applies.
* When you alter the policy for the `default` workload group, a limit must be defined for the workload group's max concurrent requests.
* The cluster's [capacity policy](capacitypolicy.md) may also limit the request rate of requests that fall under a specific category, for example *ingestions*.
    * If either of the limits defined by the [capacity policy](capacitypolicy.md) or by a request rate limit policy is exceeded, a management command will be throttled.
* When request rate limits of kind `ConcurrentRequests` are applied, the output of [`.show capacity`](diagnostics.md#show-capacity) may change based on those limits.
    * [`.show capacity`](diagnostics.md#show-capacity) can show the capacities for the principal that ran the request, according to: the context of the request, the workload group it was classified into, and its effective policies.
    * When running `.show capacity with(scope=workloadgroup)`, different principals may see different outputs if their requests are classified into different workload groups.
    * Otherwise, the request context is ignored, and the output is only affected by the cluster's [capacity policy](capacitypolicy.md).

## Management commands

Manage the workload group's request rate limit policies with [Workload groups management commands](./show-workload-group-command.md).
