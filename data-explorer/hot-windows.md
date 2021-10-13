---
title: Use hot windows for infrequent queries over cold data
description: In this article, you learn how to efficiently query cold data in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: vplauzon
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/13/2021
---
# Hot windows for queries over cold data

Hot windows let you efficiently query cold data without the need to export data or use other tools.

Azure Data Explorer stores its data in reliable long-term storage and caches a portion of this data on the cluster engine nodes. The [cache policy](/azure/data-explorer/kusto/management/cachepolicy) governs which data is cached. We recommend caching the frequently used data to maximize performance while minimizing cost.

By default, the cache policy applies to the latest ingested data by specifying the last number of days to be cached. The cached data is considered *hot*, while the rest of the data is considered *cold*.  

## Cold data

To query cold data, Azure Data Explorer applies applicable filters into the compute nodes disks, loads the relevant cold data, and then process the query. The loading step requires accessing a storage tier that has much higher latency than the local disk. The impact on the query duration depends on the size of data that is pulled from storage, and can be significant.

When the query is limited to a small time window, often called "point-in-time" queries, the amount of data that needs to be retrieved will usually be small, and the query will complete quickly. For example,  forensic analyses that query telemetry on a given day in the past fall under this category.

Later queries on the same data may perform similarly to queries that run on the hot cache, because a specific portion of the disk is allocated for caching the cold data that was used in queries.  

However, if you're scanning a large amount of cold data, query performance may not be sufficient. In this scenario, try using [hot windows](#hot-windows).

## Hot windows

Use hot windows when the cold data size is large and the relevant data is from any time in the past. Hot windows are defined in the caching policy and span any time span in the past. The caching policy can be altered to add/remove these windows.

> [!NOTE]
> It can take up to an hour to fully update the cluster disk cache based on the updated caching policy definition.

### Example

The following queries examine the last 14 days of data, on data that is kept for three years. An investigation that spans a specific couple of months last year uses hot windows for these months. The hot windows are set with the [`.alter policy caching` command](/azure/data-explorer/kusto/management/cachepolicy#alter-the-cache-policy):

```kusto
.alter table MyTable policy caching 
        hot = 14d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

After changing the caching policy, the cluster automatically caches the relevant data on its disks. You'll need to scale the cluster to accommodate the extra disk needed for the new cache definition. We recommend configuring the cluster to use the [optimize autoscale](manage-cluster-horizontal-scaling.md) settings.

Now you can expect optimal performance during the investigation. After you're done, revert the caching policy to the original settings. If you have configured optimized autoscale for that cluster, the cluster will shrink to its original size.

## See also

* [Cache policy (hot and cold cache)](kusto/management/cachepolicy.md)
