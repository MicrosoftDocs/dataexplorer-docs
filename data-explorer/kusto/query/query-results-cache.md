---
title: Query results cache - Azure Data Explorer
description: This article describes Query results cache functionality in Azure Data Explorer.
services: data-explorer
author: amitof
ms.author: amitof
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Query results cache

Kusto includes a query results cache. When issuing a query, the caller can indicate its willingness to get cached results. For queries whose results can be returned by the cache, the caller will experience better query performance and lower resource consumption at the expense of some "staleness" in the results.

## Indicating willingness to use the cache

To indicate willingness to use the query results cache, set the `query_results_cache_max_age` option as part of the query. You can set this option either in the query text or as a client request property. For example:

```kusto
set query_results_cache_max_age = time(5m);
GithubEvent
| where CreatedAt > ago(180d)
| summarize arg_max(CreatedAt, Type) by Id
```

The option value is a `timespan` that indicates the maximum "age" of the results cache, measured from the query start time. Beyond the set timespan, the cache entry is obsolete and won't be used again. Setting a value of 0 is equivalent to not setting the option.

## How compatibility between queries is determined

The query_results_cache returns results only for queries that are considered "identical" to a previous query whose results were cached. Two queries are considered identical if all of the following conditions are met:

* The two queries have the same representation (as UTF-8 strings).

* The two queries are made to the same database.

* The two queries share the same [client request properties](../api/netfx/request-properties.md), with the exclusion of the following properties (which are ignored for caching purposes):
   * [ClientRequestId](../api/netfx/request-properties.md#the-clientrequestid-x-ms-client-request-id-named-property)
   * [Application](../api/netfx/request-properties.md#the-application-x-ms-app-named-property)
   * [User](../api/netfx/request-properties.md#the-user-x-ms-user-named-property)

## If the query results cache can't find a valid cache entry

If a cached result satisfying the time constraints could not be found, or there is not a cached result from an "identical" query in the cache, the query will be executed and its results cached, as long as: 

* The query execution completes successfully, and
* The query results size doesn't exceed 16 MB.

## How the service indicates that the query results are being served from the cache

## Distribution

The cache is not shared by cluster nodes. Every node has a dedicated cache in its' own private storage. If two identical queries land on different nodes (for example, because [weak consistency](../concepts/queryconsistency.md) is used), the query will be executed and cached on both nodes.

## Management

The following management and observability commands are supported:

* [Show cache](../management/show-query-results-cache-command.md).
* [Clear cache](../management/clear-query-results-cache-command.md).

## Capacity

The cache capacity is currently fixed at 1 GB per cluster node.
The eviction policy is LRU.
