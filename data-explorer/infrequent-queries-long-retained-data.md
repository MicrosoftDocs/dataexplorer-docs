---
title: Infrequent queries over long retained data in Azure Data Explorer
description: In this article, you learn how to efficiently query long retained data in Azure Data Explorer.
author: vplauzon
ms.author: vplauzon
ms.reviewer: '???'
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/09/2021
---

# Infrequent queries over long retained data in Azure Data Explorer

Azure Data Explorer stores ingested data in reliable long-term storage and caches a portion of it on its processing nodes.  This provides low-latency access for queries on the cached data.

[Cache policy](/azure/data-explorer/kusto/management/cachepolicy) governs which data is cached on processing nodes.  This allows frequent queries to run with low-latency while keeping the cost under control by not caching the entire data.

By default, the cache policy is configured to cache the latest ingested data only.

The cached data is said to be **hot** while the uncached data is said to be **cold**.  Caching is done at the [extent](/azure/data-explorer/kusto/management/extents-overview) level.

What happens when we query cold data and what are the most efficient way to do it?

## Querying old data

When we query cold data, Azure Data Explorer needs to load the cold extents into hot cache (i.e. on processing nodes) and then go through that data.  This loading step requires accessing cold storage which has higher latency than hot cache.  Depending on the amount of extents, this could be significantly slower than an hot cache query.

## Point-in-time queries

An important case to differentiate is the Point-in-time query scenario.  This is when we do a query with a filter on a [datetime](/azure/data-explorer/kusto/query/scalar-data-types/datetime) column limiting the query to one or *few* cold extents.  An example of this scenario would be to query telemetry on a given day in the past (e.g. forensic analysis).

The query execution will require loading one or a few extents which will impact the performance but may well be acceptable in terms of user experience.  A query that would be sub-seconds in hot cache might take a few seconds to execute for instance.

The data now being loaded in cache, subsequent queries on the same extents (i.e. similar time filter) will be performed against hot cache with low latency performance.  This should be the case until the cache is invalidated.

For that scenario, querying old data might therefore yield acceptable performance without changing any cache configuration.

## Hot Windows

Wider time ranges wouldn't be considered a point-in-time query.

For example, a log table could cache the last two weeks of data for frequent queries but an incident investigation might require to analyze correlation over a given 3 months period (e.g. a year ago).

For such investigation scenario, an efficient solution would be to define *hot windows* for the cache.  Indeed the [.alter policy caching command](/azure/data-explorer/kusto/management/cachepolicy#alter-the-cache-policy) defines a time window in the past for the hot cache, but also allow (optionally) to define hot windows:

```kusto
.alter <entity_type> <database_or_table_or_materialized-view_name> policy caching 
      hot = <timespan> 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
      ...
```

In our example, we could define the hot cache as 2 weeks and an hot window as the specified 3 months.  Queries done with time filters within that hot window would hit the hot cache with low latency.

Hot windows are therefore a good mechanism to extend the cache of a table / database and enable efficient queries onto specific time windows in long retained data.

### Time to take effect

???
Do we want to get into the expected time for the cache policy to be "effective", i.e. the expected time extents would be loaded in hot cache?
???