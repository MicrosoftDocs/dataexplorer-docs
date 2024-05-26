---
title: Workload groups
description: Learn how to use workload groups to govern incoming requests to the cluster.
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/27/2023
---
# Workload groups

Workload groups allow you to group together sets of management commands and queries based on shared characteristics, and apply policies to control per-request limits and request rate limits for each of these groups.

Together with [workload group policies](#workload-group-policies), workload groups serve as a resource governance system for incoming requests to the cluster. When a request is initiated, it gets classified into a workload group. The classification is based on a user-defined function defined as part of a [request classification policy](request-classification-policy.md). The request follows the policies assigned to the designated workload group throughout its execution.

Workload groups are defined at the cluster level, and up to 10 custom groups can be defined in addition to the three [built-in workload groups](#built-in-workload-groups).

> [!NOTE]
> Requests that aren't queries or management commands, such as streaming ingestion requests, aren't included in the scope of workload groups.

## Use cases for custom workload groups

The following list covers some common use cases for creating custom workload groups:

* **Protect against runaway queries:** Create a workload group with a [requests limits policy](request-limits-policy.md) to set restrictions on resource usage and parallelism during query execution. For example, this policy can regulate result set size, memory per iterator, memory per node, execution time, and CPU resource usage.

* **Control the rate of requests:** Create a workload group with a [request rate limit policy](request-rate-limit-policy.md) to manage the behavior of concurrent requests from a specific principal or application. This policy can restrict the number of concurrent requests, request count within a time period, and total CPU seconds per time period. While your cluster comes with default limits, such as [query limits](../concepts/query-limits.md), you have the flexibility to adjust these limits based on your requirements.

* **Create shared environments:** Imagine a scenario where you have 3 different customer teams are running queries and commands on a shared cluster, possibly even accessing shared databases. If you're billing these teams based on their resource usage, you can create three distinct workload groups, each with unique limits. These workload groups would allow you to effectively manage and monitor the resource usage of each customer team.

* **Monitor resources utilization:** Workload groups can help you create periodic reports on the resource consumption of a given principal or application. For instance, if these principals represent different clients, such reports can facilitate accurate billing. For more information, see [Monitor requests by workload group](#monitor-requests-by-workload-group).

## Create and manage workload groups

Use the following commands to manage workload groups and their policies:

* [.alter-merge workload_group](alter-merge-workload-group-command.md)
* [.create-or-alter workload_group](create-or-alter-workload-group-command.md)
* [.drop workload_group](drop-workload-group-command.md)
* [.show workload_group](show-workload-group-command.md)

## Workload group policies

The following policies can be defined per workload group:

* [Request limits policy](request-limits-policy.md)
* [Request rate limit policy](request-rate-limit-policy.md)
* [Request rate limits enforcement policy](request-rate-limits-enforcement-policy.md)
* [Request queuing policy](request-queuing-policy.md)
* [Query consistency policy](query-consistency-policy.md)

## Built-in workload groups

The pre-defined workload groups are:

* [`internal` workload group](#internal-workload-group)
* [`default` workload group](#default-workload-group)
* [`$materialized-views` workload group](#materialized-views-workload-group)

### Default workload group

Requests are classified into the `default` group under these conditions:

* There are no criteria to classify a request.
* An attempt was made to classify the request into a non-existent group.
* A general classification failure has occurred.

You can:

* Change the criteria used for routing these requests.
* Change the policies that apply to the `default` workload group.
* Classify requests into the `default` workload group.

To monitor what gets classified to the `default` workload group, see [Monitor requests by workload group](#monitor-requests-by-workload-group).

> [!NOTE]
> Some clusters may have a maximum concurrent query limit defined through the deprecated *Query throttling policy*. In such clusters, this limit was automatically applied to the `default` workload group's [request rate limits policies](request-rate-limit-policy.md). While the old limit only affected queries, the new one applies to all requests, including queries and management commands.

### Internal workload group

The `internal` workload group is populated with requests that are for internal use only.

You can't:

* Change the criteria used for routing these requests.
* Change the policies that apply to the `internal` workload group.
* Classify requests into the `internal` workload group.

To monitor what gets classified to the `internal` workload group, see [Monitor requests by workload group](#monitor-requests-by-workload-group).

### Materialized views workload group

The `$materialized-views` workload group applies to the materialized views materialization process. For more information on how materialized views work, see [Materialized views overview](materialized-views/materialized-view-overview.md#how-materialized-views-work).

You can change the following values in the workload group's [request limits policy](request-limits-policy.md):

* MaxMemoryPerQueryPerNode
* MaxMemoryPerIterator
* MaxFanoutThreadsPercentage
* MaxFanoutNodesPercentage

> [!NOTE]
> You can't change the criteria used for routing these requests.

## Monitor requests by workload group

[System commands](system-info.md) indicate the workload group into which a request was classified. You can use these commands to aggregate resources utilization by workload group for completed requests.

The same information can also be viewed and analyzed in [Azure Monitor insights](/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&bc=/azure/data-explorer/breadcrumb/toc.json).

## Related content

* [Requests classification policy](request-classification-policy.md)
