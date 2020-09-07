---
title: Azure Advisor's Data Explorer Recommendations - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Advisor's Data Explorer Recommendations
services: data-explorer
author: lizlotor
ms.author: lizlotor
ms.reviewer: ??
ms.service: data-explorer
ms.topic: reference
ms.date: ??/??/2020
---
# Azure Advisor's Data Explorer Recommendations

Azure Advisor analyzes the Data Explorer cluster’s configurations and usage telemetry and offers personalized, actionable recommendations to help you optimize your cluster.

## How to access the recommendations

There are two options:

1. In the Azure portal, go to your Azure Data Explorer cluster page -> under 'Monitoring', select Advisor recommendations. This opens a list of recommendations for that cluster.

![picture](images\azure-advisor-data-explorer-recommendations\resource-group-advisor-recommendations.png)

2. In the Azure portal, go to the [Advisor resource](https://ms.portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview) in the portal -> 'Overview' -> choose the subscription(s) for which you want recommendations. Make sure that "Azure Data Explorer Clusters" and "Azure Data Explorer Databases" are selected in the second dropdown list.

![picture](images\azure-advisor-data-explorer-recommendations\advisor-resource.png)

Clicking on one of the recommendation types (for example: cost) will take you to a page that contains a list of the recommendations of that type.

![picture](images\azure-advisor-data-explorer-recommendations\click-on-recommendation-type.png)

Clicking on a recommendation in that list will take you to a page that contains a list of clusters. These clusters are the clusters that this recommendation is relevant to.

![picture](images\azure-advisor-data-explorer-recommendations\click-on-recommendation.png)

For every cluster, the recommendation's details are different and include the recommended action to be taken.

![picture](images\azure-advisor-data-explorer-recommendations\recommendations-of-subtype.png)

## Types of recommendations

### Cost recommendations

The purpose of these recommendations is to save you money. Cost recommendations are published for clusters that can be changed to reduce cost without compromising performance. Cost recommendations include: [Azure Data Explorer Unused cluster](#Azure-Data-Explorer-Unused-cluster), [Right-size Azure Data Explorer clusters for cost](#Right-size-Azure-Data-Explorer-clusters-for-cost), [Reduce cache for Azure Data Explorer Tables](#Reduce-cache-for-Azure-Data-Explorer-Tables).

#### Azure Data Explorer Unused cluster

A cluster that meets the next conditions is considered unused: has a small amount of data, queries, and ingestions during the last 30 days, has low CPU usage during the last two days and has no followers during the last day. The recommended action for an unused cluster is to delete it.

#### Right-size Azure Data Explorer clusters for cost

This recommendation is published for a cluster that its size or VM SKU are not cost-optimized (so you can reduce costs), based on parameters like its data capacity, CPU utilization, and ingestion utilization, during the last week. You can reduce costs by right-sizing (scale down and/or scale in) to the recommended cluster configuration shown.

>[!Note]
It is always recommended to turn-on optimized autoscale configuration. In case you are already using optimized autoscale and you see the 'right-size' recommendation, it means that your current VM SKU is not optimized or that the optimized autoscale's minimum/maximum instance count boundaries are not optimized so you should consider changing them so that the recommended instance count will be included in your defined boundaries.

>[!Warning]
Your actual yearly savings may vary. The yearly saving that is presented is based on 'pay as you go' prices. The potential saving does not take into consideration Azure Reserved VM Instances (RIs) billing discounts you may have.

#### Reduce cache for Azure Data Explorer Tables

This recommendation is published for a cluster that its tables' cache policy can be reduced, based on the actual queries' look-back period during the last 30 days. You can see up to 10 recommendations (top 10 tables by potential cache saving). To help you reduce costs - this recommendation will be delivered only if the cluster can scale-in/down following the cache-policy change, by checking whether the cluster is "bounded by data". It means that the cluster has low CPU level and low ingestion utilization, but only due to high data capacity, the cluster hasn't been able to scale in/down yet.

### Performance recommendations

The purpose of these recommendations is to improve the performance of your Azure Data Explorer clusters. Performance recommendations include: [Right-size Azure Data Explorer cluster](#Right-size-Azure-Data-Explorer-cluster), [Update Cache Policies for Azure Data Explorer tables](#Update-Cache-Policies-for-Azure-Data-Explorer-tables)

#### Right-size Azure Data Explorer cluster

For a cluster that its size or VM SKU are not optimized, in term of performance (so you can boost the performance), based on parameters like its data capacity, CPU utilization, and ingestion utilization, during the last week. You can improve the performance by right-sizing (scale up and/or scale out) to the recommended cluster configuration shown.

>[!Note]
It is always recommended to turn-on optimized autoscale configuration. In case you are already using optimized autoscale and you see the 'right-size' recommendation, it means that your current VM SKU is not optimized or that the optimized autoscale's minimum/maximum instance count boundaries are not optimized so you should consider changing them so that the recommended instance count will be included in your defined boundaries.

>[!Warning]
Your actual yearly savings may vary. The yearly saving that is presented is based on 'pay as you go' prices. The potential saving does not take into consideration Azure Reserved VM Instances (RIs) billing discounts you may have.

#### Update Cache Policies for Azure Data Explorer tables

This recommendation is published for a cluster that you should consider altering/limiting your queries look-back period (time-filter) or increasing the cache policy, based on the actual queries' look-back period during the last 30 days. It means that most of the queries that ran in the last 30 days, accessed data that were not in the cache. Querying data that out-side the cache may increase your queries run-time. You can see up to 10 recommendations (top 10 tables by query percentage that accessed out-of-cache data).
