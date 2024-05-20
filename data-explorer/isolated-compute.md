---
title: Enable isolated compute on your Azure Data Explorer cluster
description: 'In this article, you learn how to enable isolated compute on your Azure Data Explorer cluster by selecting the correct SKU.'
ms.reviewer: dagrawal
ms.topic: how-to
ms.date: 05/20/2024
ms.custom: references_regions

#Customer intent: I want to deploy Azure Data Explorer cluster in an isolated compute SKU.
---

# Enable isolated compute on your Azure Data Explorer cluster

Isolated compute virtual machines (VMs) enable customers to run their workload in a hardware isolated environment dedicated to single customer. Clusters deployed with isolated compute VMs are best suited for workloads that require a high degree of isolation for compliance and regulatory requirements. The compute SKUs offer isolation to secure data without sacrificing the flexibility in configuration. For more information, see [compute isolation](/azure/security/fundamentals/isolation-choices#compute-isolation) and [Azure guidance for isolated compute](/azure/azure-government/azure-secure-isolation-guidance#compute-isolation).

Azure Data Explorer provides support for isolated compute using SKU **Standard_E64i_v3**. This SKU can scale up and down automatically to meet the needs of your application or enterprise.

Isolated compute VMs, although highly priced, are the ideal SKU for running workloads that require server instance-level isolation. For more information about supported SKUs for Azure Data Explorer, see [select the correct VM SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md).

> [!NOTE]
> [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/) isn't currently supported by Azure Data Explorer. 

## Enable isolated compute on Azure Data Explorer cluster 

To enable isolated compute in Azure Data Explorer, follow one of these processes:
* [Create a cluster with isolated compute SKU](#create-a-cluster-with-isolated-compute-sku)
* [Select the isolated compute SKU on an existing cluster](#select-the-isolated-compute-sku-on-an-existing-cluster)

## Create a cluster with isolated compute SKU

1. Follow the instructions to [create an Azure Data Explorer cluster and database in the Azure portal](create-cluster-and-database.md)
2. In [create a cluster](create-cluster-and-database.md#create-a-cluster) within the **Basics** tab, select **Standard_E64i_v3** in **Compute specifications** drop-down.

## Select the isolated compute SKU on an existing cluster

1. In your Azure Data Explorer cluster **Overview** screen, select **Scale up**
1. In search box, search for *Standard_E64i_v3* and select the SKU name or select the **Standard_E64i_v3** SKU from the SKU list.
1. Select **Apply** to update your SKU. 

:::image type="content" source="media/isolated-compute/select-isolated-compute-sku.png" alt-text="Select the isolated compute SKU.":::

> [!TIP]
> The scale up process may take a few minutes.

## Related content

* [Manage cluster vertical scaling (scale up) in Azure Data Explorer to accommodate changing demand](manage-cluster-vertical-scaling.md)
* [Select the correct VM SKU for your Azure Data Explorer cluster](manage-cluster-choose-sku.md)
