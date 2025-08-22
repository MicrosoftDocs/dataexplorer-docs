---
title: Use hot windows for infrequent queries over cold data in Azure Data Explorer
description: In this article, you learn how to efficiently query cold data in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 10/17/2021
---
# Query cold data with hot windows

Hot windows let you efficiently query cold data without the need to export data or use other tools. Use hot windows when the cold data size is large and the relevant data is from any time in the past. Hot windows are defined in the cache policy.

Azure Data Explorer stores its data in reliable long-term storage and caches a portion of this data on the cluster nodes. The [cache policy](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true) governs which data is cached. The cached data is considered *hot*, while the rest of the data is considered *cold*.  

To query cold data, Azure Data Explorer process a loading step that requires accessing a storage tier with much higher latency than the local disk. When the query is limited to a small time window, often called "point-in-time" queries, the amount of data to be retrieved will usually be small, and the query will complete quickly. For example,  forensic analyses querying telemetry on a given day in the past fall under this category. The impact on the query duration depends on the size of data that is pulled from storage, and can be significant. If you're scanning a large amount of cold data, query performance could benefit from using hot windows.



This document shows you how to use hot windows to query cold data.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-and-database.md).
* Ingest data in your cluster with one of the methods described in the [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

## Configure autoscale on cluster

After changing the cache policy, the cluster automatically caches the relevant data on its disks. You'll need to scale the cluster to accommodate the extra disk needed for the new cache definition. We recommend configuring the cluster to use the [optimize autoscale](manage-cluster-horizontal-scaling.md) settings.

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under **Settings**, select **Scale out**. 

1. In the **Scale out** window, select **Optimized autoscale**.

1. Select a minimum instance count and a maximum instance count. The cluster autoscaling ranges between those two numbers, based on load.

1. Select **Save**.

   ![Optimized autoscale method.](media/manage-cluster-horizontal-scaling/optimized-autoscale-method.png)

Now you can expect optimal performance during the use of hot windows.

[!INCLUDE [set-hot-windows](includes/set-hot-windows.md)]

## Related content

* [Cache policy (hot and cold cache)](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true)
* [Optimize Autoscale](manage-cluster-horizontal-scaling.md)
