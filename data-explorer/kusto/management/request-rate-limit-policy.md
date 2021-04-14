---
title: Request rate limit policy - Azure Data Explorer
description: This article describes the request rate limit policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 01/18/2021
---
# Request rate limit policy (Preview)

The workload group's request rate limit policy lets you limit the number of concurrent requests classified into the workload group:
  * Per workload group
  * Per principal

## The policy object

A request rate limit policy has the following properties:

| Name       | Supported values                            | Description                                |
|------------|---------------------------------------------|--------------------------------------------|
| IsEnabled  | `true`, `false`                             | Indicates if the policy is enabled or not. |
| Scope      | `WorkloadGroup`, `Principal`                | The scope in which the limit applies.      |
| LimitKind  | `ConcurrentRequests`, `ResourceUtilization` | The kind of the request rate limit.        |
| Properties | Property bag                                | Properties of the request rate limit.      |

### Concurrent requests rate limit

A request rate limit of kind `ConcurrentRequests` includes the following property:

| Name                  | Type | Description                                | Supported Values |
|-----------------------|------|--------------------------------------------|------------------|
| MaxConcurrentRequests | int  | The maximum number of concurrent requests. | [`1`, `10000`]   |

When a request exceeds the limit on maximum number of concurrent requests:
  * The request's state, as presented by [System information commands](systeminfo.md), will be `Throttled`.
  * The error message will include the *origin* of the throttling and the *capacity* that's been exceeded. For example:
    * Examples:
  
      1. A throttled `.create table` command, that was classified to the `default` workload group, which has a limit of 80 concurrent requests at the scope of the workload group: 
      
         ```
         The control command was aborted due to throttling. Retrying after some backoff might succeed. CommandType: 'TableCreate', Capacity: 80, Origin: 'RequestRateLimitPolicy/WorkloadGroup/default'.
         ```
       
      1. A throttled query, that was classified to a workload group named `MyWorkloadGroup`, which has a limit of 80 concurrent requests at the scope of the workload group:

         ```
         The query was aborted due to throttling. Retrying after some backoff might succeed. Capacity: 50, Origin: 'RequestRateLimitPolicy/WorkloadGroup/MyWorkloadGroup'.
         ```
             
      1. A throttled query, that was classified to a workload group named `MyWorkloadGroup`, which has a limit of 10 concurrent requests at the scope of a principal:

         ```
         The query was aborted due to throttling. Retrying after some backoff might succeed. Capacity: 10, Origin: 'RequestRateLimitPolicy/WorkloadGroup/MyWorkloadGroup/Principal/aaduser=9e04c4f5-1abd-48d4-a3d2-9f58615b4724;6ccf3fe8-6343-4be5-96c3-29a128dd9570'.
         ```
  
  * The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
  * The exception type will be `QueryThrottledException` for queries, and `ControlCommandThrottledException` for control commands.
  
> [!NOTE]
> Control commands may also be throttled as a result of exceeding the limit defined by the cluster's [capacity policy](capacity-policy.md).

### Resource utilization rate limit

A request rate limit of kind `ResourceUtilization` includes the following properties:

| Name           | Type           | Description     | Supported Values      |
|----------------|----------------|----------------|--------------|
| ResourceKind   | `ResourceKind` | The resource to limit. **Note:** when `ResourceKind` is `TotalCpuSeconds`, the limit is enforced based on **post-facto** reports of CPU utilization of *completed* requests: Requests whose execution will *begin after* `MaxUtilization` has been reached within the defined `TimeWindow` (based on reporting of *completed* requests) will fail. | `RequestCount`, `TotalCpuSeconds` |
| MaxUtilization | `long`         | The maximum of the resource that can be utilized.    | [`1`, `9223372036854775807`]      |
| TimeWindow     | `timespan`     | The sliding time window during which the limit is applied.     | [`00:01:00`, `1.00:00:00`]        |

When a request exceeds the limit on resources utilization:
  * The request's state, as presented by [System information commands](systeminfo.md), will be `Throttled`.
  * The error message will include the the *origin* of the throttling and the *quota* that's been exceeded. For example:
    * Examples:
  
      1. A throttled request, that was classified to a workload group named `Automated Requests`, which has a limit of 10000 requests per day at the scope of a principal:

         ```
         The request was denied due to exceeding quota limitations. Resource: 'RequestCount', Quota: '10000', TimeWindow: '1.00:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests/Principal/aadapp=9e04c4f5-1abd-48d4-a3d2-9f58615b4724;6ccf3fe8-6343-4be5-96c3-29a128dd9570'.
         ```
         
      1. A throttled request, that was classified to a workload group named `Automated Requests`, which has a limit of 20000 total CPU seconds per day at the scope of the workload group:

         ```
         The request was denied due to exceeding quota limitations. Resource: 'TotalCpuSeconds', Quota: '20000', TimeWindow: '1.00:00:00', Origin: 'RequestRateLimitPolicy/WorkloadGroup/Automated Requests'.
         ```
         
  * The HTTP response code will be `429`. The subcode will be `TooManyRequests`.
  * The exception type will be `QuotaExceededException`.

### Example

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

* The limit on maximum concurrent requests for the `default` workload group depends on the SKU of the cluster, and is calculated as: `Cores-Per-Node x 10`.
  * For example: A cluster that's set-up with Azure D14_v2 nodes, where each node has 16 vCores, will have the default limit of `16` x `10` = `160`.
* If a workload group has no limit on maximum concurrent requests defined, then the maximum allowed value of `10000` applies.
* When altering the policy for the `default` workload group, there must be a limit defined for the workload group's max concurrent requests.
* The cluster's [capacity policy](capacitypolicy.md) may also limit the request rate of requests that fall under a specific category, for example: *ingestions*.
  * If either of the limits defined by [capacity policy](capacitypolicy.md) or by a request rate limit policy is exceeded, a control command will be throttled.
* When request rate limits of kind `ConcurrentRequests` are applied, the output of [`.show capacity`](diagnostics.md#show-capacity) may change based on those limits.
  * [`.show capacity`](diagnostics.md#show-capacity) will show the capacities for the principal that ran the request, according to the context of the request, the workload group it was classified into, and its effective policies.
  * Different principals may see different outputs when running the command, if their requests are classified into different workload groups.
  * When running `.show capacity with(scope=cluster)`, the request context is ignored, and the output is only affected by the cluster's [capacity policy](capacitypolicy.md).

## Control commands

Manage the workload group's request concurrency policy with [Workload groups control commands](workload-groups-commands.md).
