---
title: Sandboxes - Azure Data Explorer | Microsoft Docs
description: This article describes Sandboxes in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/30/2020
---
# Sandboxes

Kusto's Data Engine service is capable of running sandboxes for executing specific flows which require secure isolation.
Examples for these flows are user-defined scripts, which are run using the [Python plugin](../query/pythonplugin.md) or the
[R plugin](../query/rplugin.md).

For running these sandboxes, Kusto uses an evolution of Microsoft's [Drawbridge](https://www.microsoft.com/research/project/drawbridge/)
project. This solution is used by other Microsoft services to run user-defined objects in a multi-tenant environment.

Flows which are run in sandboxes are not only isolated, but are also local (close to the data), which means there is no
additional latency added for remote calls.

## Prerequisites

* The data engine must **not** have [disk encryption](https://docs.microsoft.com/azure/data-explorer/security#data-encryption) enabled.
  * Support for having both features running side-by-side is expected in the future.
* The required packages (images) for running the sandboxes are deployed to each of the Data Engine's nodes, and require dedicated SSD space in order to run
  * The estimated size is 20GB, which, for example, is roughly 2.5% the SSD capacity of a D14_v2 VM, or 0.7% the SSD capacity of a L16_v1 VM.
  * This affects the cluster's data capacity, and therefore may affect the [cost](https://azure.microsoft.com/pricing/details/data-explorer) of the cluster.

## Runtime

* A sandboxed query operator may utilize one or more sandboxes for its execution.
  * A sandbox is only used for a single run, isn't shared across multiple runs, and is disposed of once that run completes.
  * Sandboxes are lazily initialized on a node on the first time a query requires a sandbox for its execution.
    * This means the first execution of a plugin that uses sandboxes on a node will include a short warm-up period.
  * When a node is restarted (e.g. as part of a service upgrade), all running sandboxes on it are disposed of.
* Each node maintains a pre-defined amount of sandboxes which are ready for executing incoming requests.
  * Once a sandbox is used, a new one is automatically allocated to replace it.
* In case there are no pre-allocated sandboxes available to serve a query operator, it will be throttled.
  (see [Errors](#errors), until new sandboxes are allocated (could take up to 10-15 seconds per sandbox, depending on the SKU and available resources on the data node).

## Limitations

Some of these limitations can be controlled using a cluster-level [sandbox policy](../management/sandboxpolicy.md), for each kind of sandbox.

* **Number of sandboxes per node:** The number of sandboxes per node is limited.
  * Requests which encounter a state where there is no available sandbox will be throttled.
* **Network:** A sandbox cannot interact with any resource on the VM or outside of it.
  * A sandbox cannot interact with another sandbox.
* **CPU:** The maximum rate of CPU a sandbox can consume of its host's processors is limited (by default to `50%`).
  * When this limit is reached, the sandbox's CPU use is throttled, but execution continues.
* **Memory:** The maximum amount of RAM a sandbox can consume of its host's RAM is limited (by default to `20GB`).
  * Reaching this limit will result with termination of the sandbox (and a query execution error).
* **Disk:** A sandbox has a unique directory attached to it, asides for which, it can't access the host's file system.
  * This folder provides access to the image/package which matches the sandbox's kind (e.g. the non-customizable Python or R package).
* **Child processes:** The sandbox is blocked from spawning child processes.

> [!NOTE]
> The resource utilization of sandbox depends not only on the size of the data being processed as part of the request,
> but also on the logic which runs in the sandbox, and the implementation of libraries being used by it.
> (e.g. for the `python` and `r` plugins, the latter means the user-provided script and the Python or R libraries it consumes at runtime)

## Errors

|Code                      |Message                                                                                        |Potential reason                                                                                                    |
|--------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
|E_SB_QUERY_THROTTLED_ERROR|The sandboxed query was aborted due to throttling. Retrying after some backoff might succeed   |There are no available sandboxes on the target node. New sandboxes should become available in a few seconds         |
|E_SB_QUERY_THROTTLED_ERROR|Sandboxes of kind '{kind}' have not yet been initialized                                       |The sandbox policy has recently changed. New sandboxes obeying the new policy will become available in a few seconds|
