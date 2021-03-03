---
title: Workload groups - Azure Data Explorer
description: This article describes workload groups in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 01/18/2021
---
# Workload groups (Preview)

A workload group serves as a container for requests (queries, commands) that have similar classification criteria. A workload allows for aggregate monitoring of the requests, and defines policies for the requests. When a request's execution begins, the request is classified and assigned to a specific workload group. Then, the request runs using the policies assigned to the workload group.

You can define up to 10 custom workload groups, excluding the two built-in workload groups.

> [!NOTE]
> Requests that aren't queries or control commands aren't included in the scope of workload groups. For example: streaming ingestion requests.

## Built-in workload groups

There are two pre-defined workload groups: [the `internal` workload group](#internal-workload-group) and [the `default` workload group](#default-workload-group).

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

### Internal workload group

The `internal` workload group is populated with requests that are for internal use only.

You can't:

* Change the criteria used for routing these requests.
* Change the policies that apply to the `internal` workload group.
* Classify requests into the `internal` workload group.

You can [monitor](#monitoring) what gets classified to the `internal` workload group, and statistics of those requests.

## Request classification

Classification of incoming requests into workload groups is based on a user-defined function.

Defining the criteria for classifying requests is done by defining a [Request classification policy](request-classification-policy.md).

## Workload group policies

The following policies can be defined per workload group:

* [Request limits policy](request-limits-policy.md)
* [Request rate limit policy](request-rate-limit-policy.md)
* [Request queuing policy](request-queuing-policy.md)

## Monitoring

[System commands](systeminfo.md) indicate which workload group requests were classified into.
Use these commands to aggregate resources utilization by workload group for requests that have completed.

Use the [`.show workload groups resources utilization` command](workload-groups-commands.md#show-workload-groups-resources-utilization) to see the *current* resources utilization.

The same information can also be viewed and analyzed in [Azure Monitor insights](/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&bc=/azure/data-explorer/breadcrumb/toc.json).

