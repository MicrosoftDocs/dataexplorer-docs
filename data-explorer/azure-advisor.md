---
title: Azure Advisor's Data Explorer Recommendations - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Advisor's Data Explorer Recommendations
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: lizlotor
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/14/2020
---

# Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster (Preview)

Azure Advisor analyzes the Azure Data Explorer cluster configurations and usage telemetry and offers personalized and actionable recommendations to help you optimize your cluster.

## Access the Azure Advisor recommendations

There are two ways to access the Azure Advisor recommendations.

### View Azure Advisor recommendations for your Azure Data Explorer cluster

1. In the Azure portal, go to your Azure Data Explorer cluster page. 
1. In the left-hand menu, under **Monitoring**, select **Advisor recommendations**. A list of recommendations opens for that cluster.

    :::image type="content" source="media/azure-advisor/resource-group-advisor-recommendations.png" alt-text="Azure Advisor recommendations for your Azure Data Explorer cluster"::: 

### View Azure Advisor recommendations for all clusters in your subscription

1. In the Azure portal, go to the [Advisor resource](https://ms.portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview) 
1. In **Overview**, select the subscription(s) for which you want recommendations. 
1. Select **Azure Data Explorer Clusters** and **Azure Data Explorer Databases** in the second drop-down.
 
    :::image type="content" source="media/azure-advisor/advisor-resource.png" alt-text="Azure Advisor resource":::

## Use the Azure Advisor recommendations

There are various Azure Advisor recommendation types. Use the relevant recommendation type to help you optimize your cluster. 

1. In **Advisor**, under **Recommendations**, select **Cost** for cost recommendations.

    :::image type="content" source="media/azure-advisor/select-recommendation-type.png" alt-text="Select recommendation type":::

1. Select a recommendation from the list. 

    :::image type="content" source="media/azure-advisor/select-recommendation.png" alt-text="Select recommendation":::

1. The following window contains a list of clusters to which the recommendation is relevant. The recommendation details are different for every cluster and include the recommended action.

    :::image type="content" source="media/azure-advisor/clusters-with-recommendations.png" alt-text="List of clusters with recommendations":::

## Recommendation types

Both cost and performance recommendations are currently available.

> [!IMPORTANT]
> Your actual yearly savings may vary. The presented yearly savings are based on 'pay-as-you-go' prices. The potential saving doesn't take into account Azure Reserved Virtual Machine Instance (RIs) billing discounts.

### Cost recommendations

The **Cost** recommendations are available for clusters that can be changed to reduce cost without compromising performance. 
Cost recommendations include: 

* [Azure Data Explorer unused cluster](#azure-data-explorer-unused-cluster) 
* [Correctly size Azure Data Explorer cluster to optimize cost](#correctly-size-azure-data-explorer-clusters-to-optimize-cost)
* [Reduce cache for Azure Data Explorer tables](#reduce-cache-for-azure-data-explorer-tables)

#### Azure Data Explorer unused cluster

A cluster is considered unused if it has a small amount of data, queries, and ingestion events during the past 30 days, low CPU usage during the past two days, and no followers during the past day. The recommendation **consider deleting empty / unused clusters** has the recommended action to delete the unused cluster.

#### Correctly size Azure Data Explorer clusters to optimize cost

The recommendation **right-size Azure Data Explorer clusters for optimal cost** is given to a cluster whose size or VM SKU aren't cost-optimized. This recommendation is based on parameters such as its data capacity, CPU and ingestion utilization during the past week. You can reduce costs by resizing to the recommended cluster configuration using [scale-down](manage-cluster-vertical-scaling.md) and [scale-in](manage-cluster-horizontal-scaling.md).

It's recommended to use [optimized autoscale configuration](manage-cluster-horizontal-scaling.md#optimized-autoscale). If you're using optimized autoscale and you see the size recommendation on your cluster, either your current VM SKU or the optimized autoscale minimum and maximum instance count boundaries aren't optimized. The recommended instance count should be included in your defined boundaries.

> [!TIP]
> The optimized autoscale configuration doesn’t change the instance count immediately. For instant changes, use [manual scale](manage-cluster-horizontal-scaling.md#manual-scale) to reset the recommended instance count, and then enable the optimized autoscale for future optimization.

#### Reduce cache for Azure Data Explorer tables

The **reduce Azure Data Explorer table cache period for cluster cost optimization** recommendation is given for a cluster that can reduce its table's cache policy. This recommendation is based on the queries look-back period during the past 30 days. You see the top 10 tables with potential cache savings. 
This recommendation is only offered if the cluster can scale-in or scale-down following the cache policy change. Advisor checks if the cluster is "bounded by data" meaning the cluster has low CPU and low ingestion utilization, but because of high data capacity the cluster couldn't scale-in or scale-down.

### Performance recommendations

The **Performance** recommendations help improve the performance of your Azure Data Explorer clusters. 
Performance recommendations include: 
* [Correctly size Azure Data Explorer cluster to optimize performance](#correctly-size-azure-data-explorer-clusters-to-optimize-performance)
* [Update cache policy for Azure Data Explorer tables](#update-cache-policy-for-azure-data-explorer-tables)

#### Correctly size Azure Data Explorer clusters to optimize performance

The recommendation **right-size Azure Data Explorer clusters for optimal performance** is given to a cluster whose size or VM SKU aren't performance-optimized. This recommendation is based on parameters such as its data capacity, and CPU and ingestion utilization during the past week. You can improve the performance by correctly sizing to the recommended cluster configuration using [scale-up](manage-cluster-vertical-scaling.md) and [scale-out](manage-cluster-horizontal-scaling.md).

It's recommended to use [optimized autoscale configuration](manage-cluster-horizontal-scaling.md#optimized-autoscale). If you use optimized autoscale and you see the size recommendation on your cluster, either your current VM SKU or the optimized autoscale minimum and maximum instance count boundaries aren't optimized. The recommended instance count should be included in your defined boundaries.

> [!TIP]
> The optimized autoscale configuration doesn’t change the instance count immediately. For instant changes, use [manual scale](manage-cluster-horizontal-scaling.md#manual-scale) to reset the recommended instance count, and then enable the optimized autoscale for future optimization.

#### Update cache policy for Azure Data Explorer tables

The **review Azure Data Explorer table cache-period (policy) for better performance** recommendation is given for a cluster that requires a different look-back period (time filter) or a greater cache policy. This recommendation is based on the queries look-back period during the past 30 days. Most of the queries that ran in the past 30 days accessed data that wasn't in the cache, which may increase your query run-time.  You see the top 10 tables that accessed out-of-cache data ordered by query percentage.