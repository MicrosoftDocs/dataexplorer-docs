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

Go to the [Advisor resource](https://ms.portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview) in the portal > 'Overview' > choose the subscription(s) for which you want recommendations. Make sure that "Azure Data Explorer Clusters" is selected in the second dropdown list.

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

A cluster that meets the next conditions is considered unused: has a small amount of data, queries, and ingestions in the last 30 days, has low cpu usage in the last two days and has no followers in the last day. The recommended action for an unused cluster is to stop it if the data it contains is important, or delete it otherwise.

#### Right-size Azure Data Explorer clusters for cost

This recommendation is published for a cluster that its sku is stronger than necessary, based on its usage telemetry in the last week, and can be cheaper with a weaker sku. A weaker sku can be a lower-level machine and/or a lower number of instances.

#### Reduce cache for Azure Data Explorer Tables

If a cluster's caching policy's period is higher than necessary, it might save unused or rarely used data in cache, resulting unnecessary charge. Thus, this recommendation is published for a cluster that its caching policy does not fit the vast majority of the queries it ran in the last 30 days.

### Performance recommendations

The purpose of these recommendations is to improve the performance of your Azure Data Explorer clusters. Performance recommendations include: [Right-size Azure Data Explorer cluster](#Right-size-Azure-Data-Explorer-cluster), [Update Cache Policies for Azure Data Explorer tables](#Update-Cache-Policies-for-Azure-Data-Explorer-tables)

#### Right-size Azure Data Explorer cluster

This recommendation is published for a cluster that its sku is weaker than it should be, based on its usage telemetry in the last week, and can be better performing with a stronger sku. A stronger sku can be a higher-level machine and/or a higher number of instances.

#### Update Cache Policies for Azure Data Explorer tables

If a cluster's caching policy's period is lower than necessary (meaning most of the queries it ran in the last 30 days accessed data that was not in cache), its queries will take more time to finish than they should. Thus, this recommendation is published for a cluster that its caching policy does not fit the vast majority of the queries it ran in the last 30 days.
