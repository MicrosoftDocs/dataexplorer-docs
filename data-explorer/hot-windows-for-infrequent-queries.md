---
title: Using hot windows for infrequent queries over long retained data
description: In this article, you learn how to efficiently query long retained data in Azure Data Explorer.
author: vplauzon
ms.author: vplauzon
ms.reviewer: 'avnera'
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/09/2021
---

# Using hot windows for infrequent queries over long retained data

Azure Data Explorer stores its data in reliable long-term storage and caches a portion of it on the cluster engine nodes. [Cache policy](/azure/data-explorer/kusto/management/cachepolicy) governs which data is cached and it is advised to cache the data that is used most frequently to achieve the best performance while minimizing cost.

By default, the cache policy applies to the latest ingested data by specifying the last number of days to be cached. The cached data is said to be **hot** while the rest of the data is said to be **cold**.  

What happens when we query cold data and what are the most efficient way to do it?

## Querying cold data

When we query cold data, Azure Data Explorer needs to load the relevant cold data after applying the applicable filters into the compute nodes disks and process the query.  This loading step requires accessing the storage tier which has much higher latency than local disk. The impact on the query duration depends on the data size that needs to be pulled from storage and could be significant.

When the query is limited to a small time window, often called "Point-in-time" queries, the amount of data that needs to be retrieved from the storage tier can usually be relatively small and the query will likely complete very fast. An example of this scenario would be forensic analysis that query telemetry on a given day in the past.

Subsequent queries on the same data may perform similarly to queries that run on the hot cache because there is a specific portion of the disk that is allocated for caching the cold data that was used in queries.  

For other scenarios such as scanning large amount of data, the performance of queries may not be sufficient, and this is where hot windows can help. 

## Hot Windows

For the scenario where the data size in the cold is large and the relevant data can be from any time in the past, hot windows is the ideal solution. Hot windows are defined in the caching policy and spans any time span in the past. The caching policy can be easily altered to add/remove these windows and it usually takes up to an hour to fully update the cluster disk cache based on the updated caching policy definition.
   
For example, consider a security solution where the queries usually examine the last 14 days of data while the data is kept for three years. An investigation that spans a specific couple of months last year can **add** *hot windows* for these months using [.alter policy caching command](/azure/data-explorer/kusto/management/cachepolicy#alter-the-cache-policy):

```kusto
.alter table MyTable policy caching 
        hot = 14d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)      ...
```
After changing the caching policy, the cluster will automatically cache the relevant data on its disks, thus it is important to ensure that the cluster is scaled to accommodate the extra disk needed for the new cache definition. For this it is highly recommended to configure the cluster to use the [optimize autoscale]( manage-cluster-horizontal-scaling.md) settings. 

Now the user can expect optimal performance for the duration of the investigation, when its done, the caching policy can be altered to the original setting and assuming that optimized autoscale is configured for that cluster, the cluster will shrink to its original size.

### Summary

Hot windows provide an effective tool to ensure that cold data can be utilized with minimal effort. They remove the need to invest effort in defining export process to the data lake and creating external tables or using other tools for this scenario.

