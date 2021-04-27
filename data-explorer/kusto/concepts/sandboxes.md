---
title: Sandboxes - Azure Data Explorer
description: This article describes Sandboxes in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/27/2021
---
# Sandboxes

Kusto's Data Engine service can run sandboxes for specific flows that need secure isolation.
Examples of these flows are user-defined scripts that run using the [Python plugin](../query/pythonplugin.md) or the [R plugin](../query/rplugin.md).

To run these sandboxes, Kusto uses an evolved version of Microsoft's [Drawbridge](https://www.microsoft.com/research/project/drawbridge/) project. This solution is used by other Microsoft services to run user-defined objects in a multi-tenant environment.

Flows that run in sandboxes aren't isolated. They're also local (close to the data). For these reasons, there's no extra latency added for remote calls.

## Prerequisites

* Data engines that support both [disk encryption](../../security.md#data-protection) and sandboxes features must run on a VM size that supports [encryption at host](/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data). For more information on supported VM sizes, see [Virtual machine sizes](#virtual-machine-sizes).
  * If encryption is enabled on the data engine before encryption at host is adopted as the default for supporting VM sizes, the data engine may not support both features side by side. In this case, stop and start the cluster.
* The required packages (images) for running the sandboxes are deployed to each of the Data Engine's nodes, and require dedicated SSD space to run.
  * The estimated size is 20 GB, that is roughly 2.5% the SSD capacity of a D14_v2 VM, for example, or 0.7% the SSD capacity of a L16_v1 VM.
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

## Limitations

Some of the  limitations can be controlled using a cluster-level [sandbox policy](../management/sandboxpolicy.md), for each kind of sandbox.

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

## Virtual machine sizes

The following table shows VM sizes that support both features running side by side:

| **Name**                              | **Category**      | **Supports sandboxes and encryption** |
|---------------------------------------|-------------------|---------------------------------------|
| Dev(No SLA) Standard_D11_v2           | compute-optimized | No                                    |
| Dev(No SLA) Standard_E2a_v4           | compute-optimized | No                                    |
| Standard_D11_v2                       | compute-optimized | No                                    |
| Standard_D12_v2                       | compute-optimized | No                                    |
| Standard_D13_v2                       | compute-optimized | No                                    |
| Standard_D14_v2                       | compute-optimized | No                                    |
| Standard_E2a_v4                       | heavy compute     | No                                    |
| Standard_E4a_v4                       | heavy compute     | No                                    |
| Standard_E8a_v4                       | heavy compute     | No                                    |
| Standard_E16a_v4                      | heavy compute     | No                                    |
| Standard_DS13_v2 + 1&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_DS13_v2 + 2&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_DS14_v2 + 3&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_DS14_v2 + 4&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_E8as_v4 + 1&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_E8as_v4 + 2&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |
| Standard_E16as_v4 + 3&nbsp;TB&nbsp;PS | storage-optimized | Yes                                   |
| Standard_E16as_v4 + 4&nbsp;TB&nbsp;PS | storage-optimized | Yes                                   |
| Standard_L4s                          | storage-optimized | Yes                                   |
| Standard_L8s                          | storage-optimized | Yes                                   |
| Standard_L16s                         | storage-optimized | Yes                                   |
| Standard_L8s_v2                       | storage-optimized | Yes                                   |
| Standard_L16s_v2                      | storage-optimized | Yes                                   |
| Standard_E64i_v3                      | isolated compute  | No                                    |
| Standard_E80ids_v4                    | isolated compute  | No                                    |
