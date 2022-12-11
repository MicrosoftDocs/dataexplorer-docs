---
title: Sandboxes - Azure Data Explorer
description: This article describes Sandboxes in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/03/2021
---
# Sandboxes

Kusto can run sandboxes for specific flows that must be run in a secure and isolated environment.
Examples of these flows are user-defined scripts that run using the [Python plugin](../query/pythonplugin.md) or the [R plugin](../query/rplugin.md).

Sandboxes are run locally (meaning, processing is done close to the data), with no extra latency for remote calls.

## Prerequisites and limitations
* Sandboxes that run on [modern VM size](#modern-virtual-machine-sizes) (that supports nested virtualization) don't have any limitations.
* Sandboxes that run on [non-modern VM sizes](./sandboxes-in-non-modern-skus.md#virtual-machine-sizes) are subject to some limitations mentioned [here](./sandboxes-in-non-modern-skus.md).
* The required packages (images) for running the sandboxes are deployed to each of the Data Engine's nodes, and require dedicated SSD space to run.
  * The estimated size is 10 GB.
  * This affects the cluster's data capacity, and may affect the [cost](https://azure.microsoft.com/pricing/details/data-explorer) of the cluster.

## Runtime

* A sandboxed query operator may use one or more sandboxes for its execution.
  * A sandbox is only used for a single run, isn't shared across multiple runs, and is disposed of once that run completes.
  * Sandboxes are lazily initialized on a node, the first time a query requires a sandbox for its execution.
    * This means that the first execution of a plugin that uses sandboxes on a node will include a short warm-up period.
  * When a node is restarted, for example, as part of a service upgrade, all running sandboxes on it are disposed of.
* Each node maintains a predefined number of sandboxes that are ready for running incoming requests.
  * Once a sandbox is used, a new one is automatically made available to replace it.
* If there are no pre-allocated sandboxes available to serve a query operator, it will be throttled until new sandboxes are available. For more information, see [Errors](#errors). New sandbox allocation could take up to 10-15 seconds per sandbox, depending on the SKU and available resources on the data node. 

## Sandbox parameters

Some of the  parameters can be controlled using a cluster-level [sandbox policy](../management/sandboxpolicy.md), for each kind of sandbox.

* **Number of sandboxes per node:** The number of sandboxes per node is limited.
  * Requests that are made when there's no available sandbox will be throttled.
* **Network:** A sandbox can't interact with any resource on the virtual machine (VM) or outside of it.
  * A sandbox can't interact with another sandbox.
* **CPU:** The maximum rate of CPU a sandbox can consume of its host's processors is limited (default is `50%`).
  * When the limit is reached, the sandbox's CPU use is throttled, but execution continues.
* **Memory:** The maximum amount of RAM a sandbox can consume of its host's RAM is limited (default is `20GB`).
  * Reaching the limit results in termination of the sandbox, and a query execution error.
* **Disk:** A sandbox has a unique and independent directory attached to it. It can't access the host's file system.
  * The unique folder provides access to the image/package that matches the sandbox's type. For example, the non-customizable Python or R package.
* **Child processes:** The sandbox is blocked from spawning child processes.

> [!NOTE]
> The resources used with sandbox depend not only on the size of the data being processed as part of the request,
> but also on the logic that runs in the sandbox, and the implementation of libraries being used by it.
> For example, for the `python` and `r` plugins, the latter means the user-provided script and the Python or R libraries it consumes at runtime.

## Errors

|ErrorCode                 |Status                     |Message                                                                                            |Potential reason                                                                                                    |
|--------------------------|---------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
|E_SB_QUERY_THROTTLED_ERROR|TooManyRequests (429)      |The sandboxed query was aborted because of throttling. Retrying after some backoff might succeed   |There are no available sandboxes on the target node. New sandboxes should become available in a few seconds         |
|E_SB_QUERY_THROTTLED_ERROR|TooManyRequests (429)      |Sandboxes of kind '{kind}' haven't yet been initialized                                            |The sandbox policy has recently changed. New sandboxes obeying the new policy will become available in a few seconds|
|                          |InternalServiceError (520) |The sandboxed query was aborted due to a failure in initializing sandboxes                         |An unexpected infrastructure failure.                         |


## Modern Virtual machine sizes

The following table lists all modern VM sizes that support hyper-v sandbox technology.

| **Name**                              | **Category**      |
|---------------------------------------|-------------------|
| Standard_L8s_v3                       | storage-optimized |
| Standard_L16s_v3                      | storage-optimized |
| Standard_L8as_v3                      | storage-optimized |
| Standard_L16as_v3                     | storage-optimized |
| Standard_E8as_v5                      | storage-optimized |
| Standard_E16as_v5                     | storage-optimized |
| Standard_E8s_v4                       | storage-optimized |
| Standard_E16s_v4                      | storage-optimized |
| Standard_E8s_v5                       | storage-optimized |
| Standard_E16s_v5                      | storage-optimized |
| Standard_E2ads_v5                     | compute-optimized |
| Standard_E4ads_v5                     | compute-optimized |
| Standard_E8ads_v5                     | compute-optimized |
| Standard_E16ads_v5                    | compute-optimized |
| Standard_E2d_v4                       | compute-optimized |
| Standard_E4d_v4                       | compute-optimized |
| Standard_E8d_v4                       | compute-optimized |
| Standard_E16d_v4                      | compute-optimized |
| Standard_E2d_v5                       | compute-optimized |
| Standard_E4d_v5                       | compute-optimized |
| Standard_E8d_v5                       | compute-optimized |
| Standard_E16d_v5                      | compute-optimized |


