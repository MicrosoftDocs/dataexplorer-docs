---
title: Enable confidential compute on your Azure Data Explorer cluster
description: Learn how to deploy Azure Data Explorer clusters with confidential compute SKUs for hardware-based security and sensitive workload protection.
ms.reviewer: bwatts
ms.topic: how-to
ms.date: 09/30/2025
ms.custom: references_regions

#Customer intent: I want to deploy Azure Data Explorer cluster in an confidential compute SKU.
---

# Enable confidential compute on your Azure Data Explorer cluster (preview)

Confidential compute virtual machines (VMs) provide strong security and confidentiality for tenants. They establish a hardware-enforced boundary between your application and the virtualization stack. Clusters deployed with confidential compute VMs ensure hardware-based security and data confidentiality for sensitive workloads by establishing a trusted execution environment (TEE). For more information, see [confidential compute](/azure/confidential-computing/confidential-vm-overview) and [Azure guidance for isolated compute](/azure/confidential-computing/confidential-vm-faq).

Azure Data Explorer supports confidential compute using the SKU [**ECasv5 and ECadsv5 Series Virtual Machines**](https://learn.microsoft.com/en-us/azure/virtual-machines/ecasv5-ecadsv5-series). This SKU can scale up and down automatically to meet the needs of your application or enterprise.

Confidential compute VMs are ideal for running sensitive workloads that require a trusted execution environment (TEE). For more information about supported SKUs for Azure Data Explorer, see [Select the correct VM SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md).

## Enable confidential compute on Azure Data Explorer cluster

To enable confidential compute in Azure Data Explorer, follow one of these steps:

* [Create a cluster with confidential compute SKU](#create-a-cluster-with-confidential-compute-sku)
* [Select the confidential compute SKU on an existing cluster](#select-the-confidential-compute-sku-on-an-existing-cluster)

## Create a cluster with confidential compute SKU

1. Follow the instructions in [create an Azure Data Explorer cluster and database in the Azure portal](create-cluster-and-database.md).
2. In [create a cluster](create-cluster-and-database.md#create-a-cluster) within the **Basics** tab, select one of the **ECasv5 and ECadsv5 Series Virtual Machine** SKUs from the **Compute specifications** dropdown.

## Select the confidential compute SKU on an existing cluster

1. On your Azure Data Explorer cluster **Overview** screen, select **Scale up**.
1. In the **Compute optimized** section, select one of the **ECasv5 and ECadsv5 Series Virtual Machine** SKUs.
1. Select **Apply** to update the SKU.

> [!TIP]
> The scale-up process might take a few minutes.

## Related content

* [Manage cluster vertical scaling (scale up) in Azure Data Explorer to accommodate changing demand](manage-cluster-vertical-scaling.md)
* [Select the correct VM SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md)

