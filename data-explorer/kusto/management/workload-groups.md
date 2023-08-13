---
title: Workload groups
description: Learn how to use workload groups to govern incoming requests to the cluster.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/23/2023
---
# Workload groups

A workload group serves as a container for requests (queries, commands) that have similar classification criteria. Workload groups and [workload group policies](#workload-group-policies) are a means of resource governance for incoming requests to the cluster, and allow aggregate monitoring of the requests. When a request's execution begins, the request is classified and assigned to a specific workload group. Then, the request runs using the policies assigned to the workload group.

Workload groups are defined at the cluster level. Up to 10 custom workload groups may be defined in addition to the three built-in workload groups.

> [!NOTE]
> Requests that aren't queries or management commands aren't included in the scope of workload groups. For example: streaming ingestion requests.

## Built-in workload groups

The pre-defined workload groups are:

* [`internal` workload group](#internal-workload-group)
* [`default` workload group](#default-workload-group)
* [`$materialized-views` workload group](#materialized-views-workload-group)

### Default workload group

Requests are classified into the `default` group when any of the following conditions is met:

* There are no criteria to classify a request.
* An attempt was made to classify the request into a non-existent group.
* A general classification failure has occurred.

You can:

* Change the criteria used for routing these requests.
* Change the policies that apply to the `default` workload group.
* Classify requests into the `default` workload group.

Monitor what gets classified to the internal workload group and the statistics of those requests using the [Monitoring recommendations](#monitoring).

> [!NOTE]
>
> * A limit on the maximum amount of concurrent *queries* may have been defined on some cluster using the optional *"Query throttling policy"*, which has been deprecated.
> * In these clusters, the limit on the maximum amount of concurrent *queries* was automatically applied on the `default` workload group's [request rate limits policies](request-rate-limit-policy.md).
> * While the old limit applied only to *queries*, the new limit applies to *all requests* - queries and management commands.

### Internal workload group

The `internal` workload group is populated with requests that are for internal use only.

You can't:

* Change the criteria used for routing these requests.
* Change the policies that apply to the `internal` workload group.
* Classify requests into the `internal` workload group.

You can [monitor](#monitoring) what gets classified to the `internal` workload group, and statistics of those requests.

### Materialized views workload group

The `$materialized-views` workload group applies to the materialized views materialization process. For more information on how materialized views work, see [materialized views overview](materialized-views/materialized-view-overview.md#how-materialized-views-work).

You can change the following values in the workload group's [request limits policy](request-limits-policy.md):

* MaxMemoryPerQueryPerNode
* MaxMemoryPerIterator
* MaxFanoutThreadsPercentage
* MaxFanoutNodesPercentage

> [!NOTE]
> You can't change the criteria used for routing these requests.

## Request classification

Classification of incoming requests into workload groups is based on a user-defined function.

Defining the criteria for classifying requests is done by defining a [Request classification policy](request-classification-policy.md).

## Workload group policies

The following policies can be defined per workload group:

* [Request limits policy](request-limits-policy.md)
* [Request rate limit policy](request-rate-limit-policy.md)
* [Request rate limits enforcement policy](request-rate-limits-enforcement-policy.md)
* [Request queuing policy](request-queuing-policy.md)
* [Query consistency policy](query-consistency-policy.md)

## Monitoring

[System commands](systeminfo.md) indicate which workload group requests were classified into.
Use these commands to aggregate resources utilization by workload group for requests that have completed.

The same information can also be viewed and analyzed in [Azure Monitor insights](/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&bc=/azure/data-explorer/breadcrumb/toc.json).

## Management commands

Managing workload groups and their policies is done using [workload groups management commands](./show-workload-group-command.md).
