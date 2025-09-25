---
title: "Scale Azure Data Explorer Clusters Vertically to Match Demand"
description: Learn how to scale up or down your Azure Data Explorer cluster to match changing demand and optimize performance with minimal service disruption.
#customer intent: As an Azure admin, I want to scale up an Azure Data Explorer cluster so that I can handle increased demand efficiently.
ms.reviewer: radennis
ms.topic: how-to
ms.date: 09/24/2025
---


# Manage cluster vertical scaling (scale up) in Azure Data Explorer to accommodate changing demand

Azure Data Explorer cluster performance depends on appropriate sizing to match your workload demands. When demand changes, you can scale your cluster vertically by changing the Stock Keeping Unit (SKU) to add or remove CPU and memory resources.

Vertical scaling (scaling up or down) changes the compute power of your cluster by switching to a different SKU with more or fewer resources. This process maintains your data while upgrading or downgrading the underlying infrastructure to better match your performance needs.

Use vertical scaling when you need to:
- Handle increased query complexity or data processing requirements
- Optimize costs by moving to a more appropriate SKU
- Improve performance for CPU or memory-intensive workloads

> [!NOTE]
> To learn about horizontal scaling, see [horizontal scaling](manage-cluster-horizontal-scaling.md). One of the reasons you might want to scale the cluster horizontally is when you need to handle massive traffic loads that exceed what a single server can manage.

## Configure vertical scaling

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under **Settings**, select **Scale up**.
1. In the **Scale up** window, you see available (Stock Keeping Unit) SKUs for your cluster. For example, in the following figure, there are eight recommended SKUs available. Expand the **Storage optimized**, **Compute optimized**, and **Dev/test** dropdowns to see more options.

    :::image type="content" source="media/manage-cluster-vertical-scaling/scale-up.png" alt-text="Screenshot of the Scale up window in Azure portal showing eight recommended SKUs with dropdowns for Storage optimized, Compute optimized, and Dev/test." lightbox="media/manage-cluster-vertical-scaling/scale-up.png":::

    The SKUs are disabled because they're the current SKU, or they aren't available in the region where the cluster is located.
1. To change your SKU, select a new SKU and then select **Apply**.

    > [!NOTE]
    >
    > * During the vertical scaling process, while a new cluster's resources are prepared, the old cluster's resources continuing to provide service. This process might take tens of minutes. Only when the new cluster's resources are ready, switchover is performed to the new cluster. The parallel process makes the SKU migration experience relatively seamless, with minimal service disruption during the switchover process that takes about one to three minutes to complete. Query performance might be impacted during SKU migration. The impact might vary due to usage patterns.
    > * We recommend enabling [Optimized Autoscale](/azure/data-explorer/manage-cluster-horizontal-scaling) to allow the cluster to scale-in following migration. For SKU migration recommendation, see [Change Data Explorer clusters to a more cost effective and better performing SKU](/azure/data-explorer/azure-advisor).
    > * Clusters with Virtual Network configuration might experience longer service disruptions.
    > * The price is an estimate of the cluster's virtual machines and Azure Data Explorer service costs. Other costs aren't included. For an estimate, see the Azure Data Explorer [cost estimator](https://dataexplorer.azure.com/AzureDataExplorerCostEstimator.html). For full pricing, see the Azure Data Explorer [pricing page](https://azure.microsoft.com/pricing/details/data-explorer/).

You've now configured vertical scaling for your Azure Data Explorer cluster. Add another rule for a horizontal scaling. If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Related content

* [Manage cluster horizontal scaling](manage-cluster-horizontal-scaling.md) to dynamically scale out the instance count based on metrics that you specify.
* [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md).
