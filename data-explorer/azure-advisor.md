---
title: Azure Advisor's Data Explorer Recommendations - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Advisor's Data Explorer Recommendations
services: data-explorer
author: orspod
ms.author: orpsodek
ms.reviewer: lizlotor
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/08/2020
---

# Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster 

Azure Advisor analyzes the Azure Data Explorer cluster’s configurations and usage telemetry and offers personalized, actionable recommendations to help you optimize your cluster.

## Access the Azure Advisor recommendations

There are two ways in which you can access the Azure Advisor recommendations.

1. In the Azure portal, go to your Azure Data Explorer cluster page. In the left-hand menu, under **Monitoring**, select **Advisor recommendations**. This opens a list of recommendations for that specific cluster.

![resource group advisor recommendations](media\azure-advisor\resource-group-advisor-recommendations.png)

2. In the Azure portal, go to the [Advisor resource](https://ms.portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview) in the portal -> 'Overview' -> choose the subscription(s) for which you want recommendations. Make sure that "Azure Data Explorer Clusters" and "Azure Data Explorer Databases" are selected in the second dropdown list.

![advisor resource](media\azure-advisor\advisor-resource.png)

## Use the Azure Advisor recommendations

There are various Azure Advisor recommendation types.Have only cost and performance (right now) Use the relevant recommendation to help you optimize your cluster.

Select one of the recommendation types to go to a page that contains a list of recommendations.

1. Select **Cost** for cost recommendations.

![click-on recommendation type](media\azure-advisor\click-on-recommendation-type.png)

1. Select a recommendation from the list.

![click-on recommendation](media\azure-advisor\click-on-recommendation.png)

The following pane contains a list of clusters to which the recommendation is relevant. The recommendation details are different for every cluster and include the recommended action.

![recommendations of subtype](media\azure-advisor\recommendations-of-subtype.png)

## Types of recommendations

### Cost recommendations

The **Cost** recommendations are available for clusters that can be changed to reduce cost without compromising performance. Cost recommendations include: 

* [Azure Data Explorer Unused cluster](#azure-data-explorer-unused-cluster), 
* [Right-size Azure Data Explorer clusters for cost](#right-size-azure-data-explorer-clusters-for-cost)
* [Reduce cache for Azure Data Explorer Tables](#reduce-cache-for-azure-data-explorer-tables)

#### Azure Data Explorer unused cluster

A cluster is considered unused if it has a small amount of data, queries, and ingestions during the last 30 days, low CPU usage during the past two days and no followers during the past day. The recommended action is to delete the unused cluster.

#### Correctly size Azure Data Explorer clusters

A cluster whose size or VM SKU aren't cost-optimized, based on parameters such as its data capacity, CPU utilization, and ingestion utilization during the last week, receives this recommendation. You can reduce costs by re-sizing, using [scale down](manage-cluster-vertical-scaling.md) and/or [scale in](manage-cluster-horizontal-scaling.md), to the recommended cluster configuration.

It's recommended to use the [optimized autoscale configuration](manage-cluster-horizontal-scaling.md#optimized-autoscale). If you're using optimized autoscale and you see the size recommendation on your cluster, either your current VM SKU or the optimized autoscale minimum and maximum instance count boundaries aren't optimized.

> [!IMPORTANT]
> Your actual yearly savings may vary. The yearly saving that's presented is based on 'pay as you go' prices. The potential saving doesn't take into consideration Azure Reserved Virtual Machine Instance (RIs) billing discounts you may have.

#### Reduce cache for Azure Data Explorer Tables

This recommendation is published for a cluster that its tables' cache policy can be reduced, based on the actual queries' look-back period during the last 30 days. You can see up to 10 recommendations (top 10 tables by potential cache saving). To help you reduce costs - this recommendation will be delivered only if the cluster can scale-in/down following the cache-policy change, by checking whether the cluster is "bounded by data". It means that the cluster has low CPU level and low ingestion utilization, but only due to high data capacity, the cluster hasn't been able to scale in/down yet.

### Performance recommendations

The purpose of these recommendations is to improve the performance of your Azure Data Explorer clusters. Performance recommendations include: [Right-size Azure Data Explorer cluster](#Right-size-Azure-Data-Explorer-cluster), [Update Cache Policies for Azure Data Explorer tables](#Update-Cache-Policies-for-Azure-Data-Explorer-tables)

#### Right-size Azure Data Explorer cluster

For a cluster that its size or VM SKU are not optimized, in term of performance (so you can boost the performance), based on parameters like its data capacity, CPU utilization, and ingestion utilization, during the last week. You can improve the performance by right-sizing (scale up and/or scale out) to the recommended cluster configuration shown.

> [!NOTE]
> It's always recommended to turn-on optimized autoscale configuration. In case you are already using optimized autoscale and you see the 'right-size' recommendation, it means that your current VM SKU is not optimized or that the optimized autoscale's minimum/maximum instance count boundaries are not optimized so you should consider changing them so that the recommended instance count will be included in your defined boundaries.

> [!WARNING]
> Your actual yearly savings may vary. The yearly saving that is presented is based on 'pay as you go' prices. The potential saving does not take into consideration Azure Reserved VM Instances (RIs) billing discounts you may have.

#### Update Cache Policies for Azure Data Explorer tables

This recommendation is published for a cluster that you should consider altering/limiting your queries look-back period (time-filter) or increasing the cache policy, based on the actual queries' look-back period during the last 30 days. It means that most of the queries that ran in the last 30 days, accessed data that were not in the cache. Querying data that out-side the cache may increase your queries run-time. You can see up to 10 recommendations (top 10 tables by query percentage that accessed out-of-cache data).
