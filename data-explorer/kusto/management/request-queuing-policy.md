---
title: Request queuing policy - Azure Data Explorer
description: This article describes the request queuing policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 02/02/2021
---
# Request queuing policy (Preview)

A workload group's request queuing policy controls queueing of requests for delayed execution, once a certain threshold of concurrent requests is exceeded.

The request queuing policy reduces the amount of throttling errors during times of peak activity by queueing incoming requests up to a predefined short time period, while polling for available capacity during that time period.

The policy may be defined only for workload groups with a [request rate limit policy](request-rate-limit-policy.md) that limits the max concurrent requests at the scope of the workload group.

## Queuing logic

When the policy is enabled, queuing of requests is done according to the following logic:

1. Requests are queued once the utilizion of the workload's group concurrent requests exceeds 60% of the configured maximum.
    * For example: if the workload group's limit on max concurrent reuqests is 80, then queuing will begin once there are 48 concurrent requests.
1. Once utilization drops under 60%, requests may be dequeued and begin their delayed execution.
1. Maximum queue size:
    * The minimum between 512 and twice the maximum concurrent requests for the workload group.
    * For example: if the workload group's limit on max concurrent reuqests is 80, then the maximum queue size is 160.
    * The queue size is not configurable.
1. Maximum queue time:
    * Queries will be queued for up to 30 seconds.
    * Control commands will be queued for up to 60 seconds.
    * The queue time is not configurable.

> [!NOTE]
> Requests classified into different workload groups are queued in different queues.

## The policy object

The policy includes a single property:

* `IsEnabled`: A boolean indicating if the policy is enabled. The default value is `false`.

## Control commands

Manage the workload group's request limits policy with [Workload groups control commands](workload-groups-commands.md).
