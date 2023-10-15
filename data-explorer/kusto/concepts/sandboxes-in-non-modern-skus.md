---
title: Sandboxes in VM sizes not supporting nested virtualization - Azure Data Explorer
description: This article describes Sandboxes limitations in non-modern SKUs in Azure Data Explorer.
ms.reviewer:
ms.topic: reference
ms.date: 11/12/2022
---
# Sandboxes in VM sizes not supporting nested virtualization

In this article, we'll cover the limitations of sandboxes in VM sizes that don't support nested virtualization.

## Prerequisites and limitations

Sandboxes that run on [non-modern VM sizes](#virtual-machine-sizes) are subject to the following limitations:

* The sandbox image is fixed - either Python 3.6.5 or R 3.4.4.
* Data engines that enable both [disk encryption](../../security.md#data-protection) and sandboxes features must run on a VM size that supports [encryption at host](/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data). For more information on supported VM sizes, see [Virtual machine sizes](#virtual-machine-sizes).
    * If encryption is enabled on the cluster before encryption at host is adopted as the default for supported VM sizes, the cluster may not support both features side by side. In this case, stop and start the cluster.
* The required packages (images) for running the sandboxes are deployed to every cluster node and require dedicated SSD space to run.
    * The estimated size is 20 GB, that is roughly 2.5% the SSD capacity of a D14_v2 VM, for example, or 0.7% the SSD capacity of a L16_v1 VM.
    * This affects the cluster's data capacity, and may affect the [cost](https://azure.microsoft.com/pricing/details/data-explorer) of the cluster.
* Hyper-threading is disabled for hyper-threaded VM sizes when sandboxes are enabled. For more information on hyper-threaded VM sizes, see [Virtual machine sizes](#virtual-machine-sizes).
* Child processes: The sandbox in the following VM sizes is blocked from spawning child processes.

## Virtual machine sizes

The following table lists all VM sizes not supporting nested virtualization, and whether they support both encryption and sandbox features running side by side, and hyper-threading:

| **Name**                              | **Category**      | **Supports sandboxes and encryption** | **Supports hyper-threading** |
|---------------------------------------|-------------------|---------------------------------------|------------------------------|
| Dev(No SLA) Standard_D11_v2           | compute-optimized | No                                    |No                            |
| Dev(No SLA) Standard_E2a_v4           | compute-optimized | No                                    |No                            |
| Standard_D11_v2                       | compute-optimized | No                                    |No                            |
| Standard_D12_v2                       | compute-optimized | No                                    |No                            |
| Standard_D13_v2                       | compute-optimized | No                                    |No                            |
| Standard_D14_v2                       | compute-optimized | No                                    |No                            |
| Standard_E2a_v4                       | heavy compute     | No                                    |Yes                           |
| Standard_E4a_v4                       | heavy compute     | No                                    |Yes                           |
| Standard_E8a_v4                       | heavy compute     | No                                    |Yes                           |
| Standard_E16a_v4                      | heavy compute     | No                                    |Yes                           |
| Standard_DS13_v2 + 1&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |No                            |
| Standard_DS13_v2 + 2&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |No                            |
| Standard_DS14_v2 + 3&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |No                            |
| Standard_DS14_v2 + 4&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |No                            |
| Standard_E8as_v4 + 1&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |Yes                           |
| Standard_E8as_v4 + 2&nbsp;TB&nbsp;PS  | storage-optimized | Yes                                   |Yes                           |
| Standard_E16as_v4 + 3&nbsp;TB&nbsp;PS | storage-optimized | Yes                                   |Yes                           |
| Standard_E16as_v4 + 4&nbsp;TB&nbsp;PS | storage-optimized | Yes                                   |Yes                           |
| Standard_L4s                          | storage-optimized | Yes                                   |No                            |
| Standard_L8s                          | storage-optimized | Yes                                   |No                            |
| Standard_L16s                         | storage-optimized | Yes                                   |No                            |
| Standard_L8s_v2                       | storage-optimized | Yes                                   |Yes                           |
| Standard_L16s_v2                      | storage-optimized | Yes                                   |Yes                           |
| Standard_E64i_v3                      | isolated compute  | No                                    |No                            |
| Standard_E80ids_v4                    | isolated compute  | No                                    |Yes                           |
