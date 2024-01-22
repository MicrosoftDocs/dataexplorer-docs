---
title: Request rate limit policy
description: Learn how to use the request rate limit policy to limit the number of concurrent requests classified into a workload group.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# Request rate limit policy

The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group, per workload group or per principal.

Rate limits are enforced at the level defined by the workload group's [Request rate limits enforcement policy](request-rate-limits-enforcement-policy.md).

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

> [!NOTE]
> * If a workload group doesn't have a specified limit on the maximum concurrent requests, it's subject to the default maximum value of `10000`.

When a request exceeds the limit on maximum number of concurrent requests:

* The request's state, as presented by [System information commands](system-info.md), will be `Throttled`.
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
> * If either of the limits defined by the [capacity policy](capacity-policy.md) or by a request rate limit policy is exceeded, a management command will be throttled.
> * The [capacity policy](capacity-policy.md) may limit the request rate of requests that fall under a specific category, such as ingestions.

### Resource utilization rate limit

A request rate limit of kind `ResourceUtilization` includes the following properties:

| Name           | Type           | Description     | Supported Values      |
|----------------|----------------|----------------|--------------|
| ResourceKind   | `ResourceKind` | The resource to limit.</br></br>When `ResourceKind` is `TotalCpuSeconds`, the limit is enforced based on post-execution reports of CPU utilization of completed requests. Requests that report utilization of 0.005 seconds of CPU or lower aren't counted. The limit (`MaxUtilization`) represents the total CPU seconds that can be consumed by requests within a specified time window (`TimeWindow`). For example, a user running ad-hoc queries may have a limit of 1000 CPU seconds per hour. If this limit is exceeded, subsequent queries will be throttled, even if started concurrently, as the cumulative CPU seconds have surpassed the defined limit within the sliding window period. | `RequestCount`, `TotalCpuSeconds` |
| MaxUtilization | `long`         | The maximum of the resource that can be utilized.    | RequestCount: [`1`, `16777215`]; TotalCpuSeconds: [`1`, `828000`]      |
| TimeWindow     | `timespan`     | The sliding time window during which the limit is applied.     | [`00:01:00`, `1.00:00:00`]        |

When a request exceeds the limit on resources utilization:

* The request's state, as presented by [System information commands](system-info.md), will be `Throttled`.
* The error message will include the *origin* of the throttling and the *quota* that's been exceeded. For example:

The following table shows a few examples of requests that exceed the resource utilization rate limit and the error message that these requests return:

| Scenario | Error message |
|----------------|----------------|
| A throttled request that was classified to a workload group named `Automated Requests`, which has a limit of 1000 requests per hour at the scope of a principal. | The request was denied due to exceeding quota limitations. Resource: 'RequestCount', Quota: '1000', TimeWindow: '01:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests/Principal/aadapp=9e04c4f5-1abd-48d4-a3d2-9f58615b4724;6ccf3fe8-6343-4be5-96c3-29a128dd9570'. |
| A throttled request, that was classified to a workload group named `Automated Requests`, which has a limit of 2000 total CPU seconds per hour at the scope of the workload group. | The request was denied due to exceeding quota limitations. Resource: 'TotalCpuSeconds', Quota: '2000', TimeWindow: '01:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests'. |

* The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
* The exception type will be `QuotaExceededException`.

## How consistency affects rate limits

With strong consistency, the default limit on maximum concurrent requests depends on the SKU of the cluster, and is calculated as: `Cores-Per-Node x 10`. For example, a cluster that's set up with Azure D14_v2 nodes, where each node has 16 vCores, will have a default limit of `16` x `10` = `160`.

With weak consistency, the effective default limit on maximum concurrent requests depends on the SKU of the cluster and number of query heads, and is calculated as: `Cores-Per-Node x 10 x Number-Of-Query-Heads`. For example, a cluster that's set up with Azure D14_v2 and 5 query heads, where each node has 16 vCores, will have an effective default limit of `16` x `10` x `5` = `800`.

For more information, see [Query consistency](../concepts/queryconsistency.md).

## The `default` workload group

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

> [!NOTE]
> * When you alter the policy for the `default` workload group, a limit must be defined for the maximum concurrent requests.

## Examples

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

## Related content

* [.show workload_group command](show-workload-group-command.md)
