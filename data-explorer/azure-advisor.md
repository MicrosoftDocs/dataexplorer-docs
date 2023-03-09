---
title: Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster
description: This article describes Azure Advisor recommendations used to optimize your Azure Data Explorer cluster
ms.reviewer: lizlotor
ms.topic: how-to
ms.date: 03/08/2023
---

# Use Azure Advisor recommendations to optimize your Azure Data Explorer cluster

Azure Advisor analyzes the Azure Data Explorer cluster configurations and usage telemetry and offers personalized and actionable recommendations to help you optimize your cluster.

## Access the Azure Advisor recommendations

There are two ways to access the Azure Advisor recommendations:

* View recommendations for [your cluster](#view-azure-advisor-recommendations-for-your-azure-data-explorer-cluster)
* View recommendations for [all clusters in your subscription](#view-azure-advisor-recommendations-for-all-clusters-in-your-subscription)

### View Azure Advisor recommendations for your Azure Data Explorer cluster

1. In the Azure portal, go to your Azure Data Explorer cluster page. 
1. In the left-hand menu, under **Monitoring**, select **Advisor recommendations**. A list of recommendations opens for that cluster.

    :::image type="content" source="media/azure-advisor/resource-group-advisor-recommendations.png" alt-text="Azure Advisor recommendations for your Azure Data Explorer cluster."::: 

### View Azure Advisor recommendations for all clusters in your subscription

1. In the Azure portal, go to the [Advisor resource](https://ms.portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview). 
1. In **Overview**, select one or more subscriptions for which you want recommendations. 
1. Select **Azure Data Explorer Clusters** and **Azure Data Explorer Databases** in the second drop-down.
 
    :::image type="content" source="media/azure-advisor/advisor-resource.png" alt-text="Azure Advisor resource.":::

## Use the Azure Advisor recommendations

There are various Azure Advisor recommendation types. Use the relevant recommendation type to help you optimize your cluster. 

1. In **Advisor**, under **Recommendations**, select **Cost** for cost recommendations.

    :::image type="content" source="media/azure-advisor/select-recommendation-type.png" alt-text="Select recommendation type.":::

1. Select a recommendation from the list. 

    :::image type="content" source="media/azure-advisor/select-recommendation.png" alt-text="Select recommendation.":::

1. The following window contains a list of clusters to which the recommendation is relevant. The recommendation details are different for every cluster and include the recommended action.

    :::image type="content" source="media/azure-advisor/clusters-with-recommendations.png" alt-text="List of clusters with recommendations.":::

## Recommendation types

Both cost and performance recommendations are currently available.

> [!IMPORTANT]
> Your actual yearly savings may vary. The yearly savings presented are based on 'pay-as-you-go' prices. These potential saving don't take into account Azure Reserved Virtual Machine Instance (RIs) billing discounts.

### Cost recommendations

The **Cost** recommendations are available for clusters that can be changed to reduce cost without compromising performance. 
Cost recommendations include: 

* [Unused running Azure Data Explorer cluster](#unused-running-azure-data-explorer-cluster)
* [Unused stopped Azure Data Explorer cluster](#unused-stopped-azure-data-explorer-cluster)
* [Correctly size Azure Data Explorer cluster to optimize cost](#correctly-size-azure-data-explorer-clusters-to-optimize-cost)
* [Reduce cache for Azure Data Explorer tables](#reduce-cache-for-azure-data-explorer-tables)
* [Run a cleanup command to delete unused storage artifacts](#delete-unused-storage-artifacts)
* [Enable Optimized autoscale](#enable-optimized-autoscale)

#### Unused running Azure Data Explorer cluster

A cluster is considered unused and running if it is in the running state and has neither ingested data nor run queries in the past five days. 
In some cases, clusters may be [automatically stopped](auto-stop-clusters.md). In the following cases, the cluster won't automatically stop and a recommendation will be shown:
 * Leader clusters. For more information, see [follower databases](follower.md).
 * Clusters deployed in a Virtual Network.
 * Clusters where the [Auto-Stop setting](auto-stop-clusters.md#set-auto-stop-settings-while-creating-a-new-cluster) is turned off
 * Azure Synapse Data Explorer pools
 
The recommendation is to stop the cluster to reduce cost but still preserve the data. If the data isn't needed, consider deleting the cluster to increase your savings.

#### Unused stopped Azure Data Explorer cluster

A cluster is considered unused and stopped if it has been stopped for at least 60 days.

The recommendation is to delete the cluster to reduce cost. 

> [!CAUTION]
> Stopped clusters may still contain data. Before deleting the cluster, verify that the data is no longer needed. Once the cluster is deleted, the data will no longer be accessible.


#### Correctly size Azure Data Explorer clusters to optimize cost

The recommendation **right-size Azure Data Explorer clusters for optimal cost** is given to a cluster whose size or VM SKU aren't cost-optimized. This recommendation is based on parameters such as its data capacity, CPU and ingestion utilization during the last week. You can reduce costs by resizing to the recommended cluster configuration using [scale-down](manage-cluster-vertical-scaling.md) and [scale-in](manage-cluster-horizontal-scaling.md).

It is recommended to use the [optimized autoscale configuration](manage-cluster-horizontal-scaling.md#optimized-autoscale). If you're using optimized autoscale and you see a size recommendation on your cluster, either your current VM SKU or the optimized autoscale minimum and maximum instance count boundaries aren't optimized. The recommended instance count should be included in your defined boundaries. For more information, see [VM SKUs](manage-cluster-choose-sku.md) and [pricing](https://azure.microsoft.com/pricing/details/data-explorer/).

> [!TIP]
> The optimized autoscale configuration doesn’t change the instance count immediately. For immediate changes, use [manual scale](manage-cluster-horizontal-scaling.md#manual-scale) to reset the recommended instance count, and then enable the optimized autoscale for future optimization.

> [!IMPORTANT]
> Due to new SKUs and logical improvements, it's possible that the recommendation won't be shown even if the current SKU is not optimized. 

#### Reduce cache for Azure Data Explorer tables

The **reduce Azure Data Explorer table cache period for cluster cost optimization** recommendation is given for a cluster that can reduce its table's [cache policy](kusto/management/cachepolicy.md). This recommendation is based on the query look-back period during the last 30 days. To see where savings are possible, you can view the most relevant 40 tables per database for potential cache savings. This recommendation is only offered if the cluster can scale-in or scale-down after a cache policy change. Advisor checks if the cluster is "bounded by data", meaning the cluster has low CPU and low ingestion utilization, but because of high data capacity the cluster can't scale-in or scale-down.

#### Delete unused storage artifacts

The recommendation **delete unused storage artifacts** is given for a cluster that has unused storage artifacts left from maintenance and background operations on [data shards (extents)](kusto/management/extents-overview.md). Over time, internal extents merge operations can accumulate redundant and unused storage artifacts that remain beyond the data retention period. While this unreferenced data doesn’t negatively impact the performance, it can lead to more storage use than necessary.

> [!IMPORTANT]
> Data recoverability will be reset to the cleanup time and will not be available on data that was created before running the cleanup.

#### Enable Optimized autoscale


The recommendation **enable Optimized autoscale** is given when enabling [Optimized autoscale](manage-cluster-horizontal-scaling.md#optimized-autoscale) would have reduced the instance count on a cluster. This recommendation is based on usage patterns, cache utilization, ingestion utilization, and CPU. To make sure you don't exceed your planned budget, add a maximum instance count when you enable Optimized autoscale.


### Performance recommendations

The **Performance** recommendations help improve the performance of your Azure Data Explorer clusters. 
Performance recommendations include the following: 
* [Correctly size the Azure Data Explorer cluster to optimize performance](#correctly-size-azure-data-explorer-clusters-to-optimize-performance)
* [Update the cache policy for Azure Data Explorer tables](#update-cache-policy-for-azure-data-explorer-tables)

#### Correctly size Azure Data Explorer clusters to optimize performance

The recommendation **right-size Azure Data Explorer clusters for optimal performance** is given to a cluster whose size or VM SKU aren't performance-optimized. This recommendation is based on parameters such as its data capacity, and CPU and ingestion utilization during the last week. You can improve the performance by correctly sizing to the recommended cluster configuration using [scale-up](manage-cluster-vertical-scaling.md) and [scale-out](manage-cluster-horizontal-scaling.md).

It's recommended to use the [optimized autoscale configuration](manage-cluster-horizontal-scaling.md#optimized-autoscale). If you use optimized autoscale and you see a size recommendation on your cluster, either your current VM SKU or the optimized autoscale minimum and maximum instance count boundaries aren't optimized. The recommended instance count should be included in your defined boundaries. For more information, see [VM SKUs](manage-cluster-choose-sku.md).

> [!TIP]
> The optimized autoscale configuration doesn’t change the instance count immediately. For instant changes, use [manual scale](manage-cluster-horizontal-scaling.md#manual-scale) to reset the recommended instance count, and then enable the optimized autoscale for future optimization.

> [!IMPORTANT]
> Due to new SKUs and logical improvements, it's possible that the recommendation won't be shown even if the current SKU is not optimized. 

#### Update cache policy for Azure Data Explorer tables

The **review Azure Data Explorer table cache-period policy for better performance** recommendation is given for a cluster that requires a different look-back period time filter, or a larger [cache policy](kusto/management/cachepolicy.md). This recommendation is based on the query look-back period of the last 30 days. Most queries run in the last 30 days accessed data not in the cache, which can increase the query run-time. You can view the top 40 tables per database that accessed out-of-cache data, ordered by querying percentage.

You may also get a performance recommendation to reduce the cache policy. This can happen if the cluster is data-bound. A cluster is data-bound if the data to be cached according to the caching policy is larger that the total size of the cluster's cache. Reducing the cache policy for data-bound clusters will reduce the number of cache misses and potentially improves performance.

### Operational Excellence recommendations

The **Operational Excellence** or "best practice" recommendations are recommendations whose implementation does not improve cost or performance immediately but can benefit the cluster in the future. This includes [reducing the table cache policy to match usage patterns](#reduce-table-cache-policy-to-match-usage-patterns).

#### Reduce table cache policy to match usage patterns

You can think about the **Reduce table cache policy to match usage patterns** recommendation as a 'best practice for cleanup' recommendation. The recommendation shows suggestions for:

* Unused tables – for example, let's say the table `ExampleTable` in database `ExampleDatabase` is not being used, with 0 queries run on this table. Since the table is not being used, you might want to delete or reduce the cache policy of this table. If the hot data saving is not significant, implementing this recommendation won't result in an immediate cost reduction for the cluster. The idea is to help you identify unused tables, so you can delete them or reduce the cache policy.

* Tables with redundant cache policy –  which means that your table's actual query look-backs, or usage patterns, are lower than the configured cache policy. However, reducing the cache policy won’t result in an immediate cost saving, since the cluster is not data-bound. The cluster won’t scale in, even if you remove data from the hot cache.

### Reliability recommendations

The **Reliability recommendations** help you ensure and improve the continuity of your business-critical applications. 
Reliability recommendations include the following:

* [Cluster uses subnet without delegation](#cluster-uses-subnet-without-delegation)
* [Cluster uses subnet with invalid IP configuration](#cluster-uses-subnet-with-invalid-ip-configuration)
* [Cluster failed to install or resume due to virtual network issues](#cluster-failed-to-install-or-resume-due-to-virtual-network-issues)

#### Cluster uses subnet without delegation

The strong recommendation is given to a virtual network cluster that uses a subnet without delegation for 'Microsoft.Kusto/clusters'. When you delegate a subnet to a cluster, you allow that service to establish basic network configuration rules for the subnet, which helps the cluster operate its instances in a stable manner.

#### Cluster uses subnet with invalid IP configuration

The recommendation is given to a virtual network cluster where the subnet is also used by other services. The recommendation is to remove all other services from the subnet and only use it for your cluster.

#### Cluster failed to install or resume due to virtual network issues

The recommendation is given to a cluster that failed to install or resume due to virtual network issues. The recommendation is to use the [virtual network troubleshooting guide](vnet-deploy-troubleshoot.md) to resolve the issue.
## Next steps

* [Manage cluster horizontal scaling (scale out) in Azure Data Explorer to accommodate changing demand](manage-cluster-horizontal-scaling.md)
* [Manage cluster vertical scaling (scale up) in Azure Data Explorer to accommodate changing demand](manage-cluster-vertical-scaling.md)
