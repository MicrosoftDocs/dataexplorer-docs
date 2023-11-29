---
title: Request queuing policy
description: Learn how to use the request queuing policy to control queueing of requests for delayed execution.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/27/2023
---
# Request queuing policy (Preview)

A workload group's request queuing policy controls queueing of requests for delayed execution, once a certain threshold of concurrent requests is exceeded.

Queuing of requests can reduce the number of throttling errors during times of peak activity. It does so by queueing incoming requests up to a predefined short time period, while polling for available capacity during that time period.

The policy may be defined only for workload groups with a [request rate limit policy](request-rate-limit-policy.md) that limits the max concurrent requests at the scope of the workload group.

Use the [.alter-merge workload group](alter-merge-workload-group-command.md#alter-the-request-queuing-policy) management command to enable request queuing.

## The policy object

The policy includes a single property:

* `IsEnabled`: A boolean indicating if the policy is enabled. The default value is `false`.

## Related content

* [.show workload_group command](show-workload-group-command.md)
* [.create-or-alter workload_group command](create-or-alter-workload-group-command.md)
