---
title: Query results cache - Azure Data Explorer
description: This article describes Query results cache functionality in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: amitof
ms.service: data-explorer
ms.topic: reference
ms.date: 06/16/2020
---
# Query results cache

Kusto includes a query results cache. You can choose to get cached results when issuing a query. You'll experience better query performance and lower resource consumption if your query's results can be returned by the cache. However, this performance comes at the expense of some "staleness" in the results.

## Use the cache

Set the `query_results_cache_max_age` option as part of the query to use the query results cache. You can set this option in the query text or as a client request property. For example:

```kusto
set query_results_cache_max_age = time(5m);
GithubEvent
| where CreatedAt > ago(180d)
| summarize arg_max(CreatedAt, Type) by Id
```

The option value is a `timespan` that indicates the maximum "age" of the results cache, measured from the query start time. Beyond the set timespan, the cache entry is obsolete and won't be used again. Setting a value of 0 is equivalent to not setting the option.

## Compatibility between queries

### Identical queries

The query results cache returns results only for queries that are considered "identical" to a previous cached query. Two queries are considered identical if all of the following conditions are met:

* The two queries have the same representation (as UTF-8 strings).
* The two queries are made to the same database.
* The two queries share the same [client request properties](../api/netfx/request-properties.md). The following properties are ignored for caching purposes:
   * [ClientRequestId](../api/netfx/request-properties.md#the-clientrequestid-x-ms-client-request-id-named-property)
   * [Application](../api/netfx/request-properties.md#the-application-x-ms-app-named-property)
   * [User](../api/netfx/request-properties.md#the-user-x-ms-user-named-property)

### Incompatible queries

The query results will not be cached if any of the following conditions is true:
 
* The query references a table that has the [RestrictedViewAccess](../management/restrictedviewaccesspolicy.md) policy enabled.
* The query references a table that has the [RowLevelSecurity](../management/rowlevelsecuritypolicy.md) policy enabled.
* The query uses any of the following functions:
    * [current_principal](current-principalfunction.md)
    * [current_principal_details](current-principal-detailsfunction.md)
    * [current_principal_is_member_of](current-principal-ismemberoffunction.md)
* The query accesses an [external table](schema-entities/externaltables.md) or an [external data](externaldata-operator.md).
* The query uses the [evaluate plugin](evaluateoperator.md) operator.

## No valid cache entry

If a cached result satisfying the time constraints couldn't be found, or there isn't a cached result from an "identical" query in the cache, the query will be executed and its results cached, as long as: 

* The query execution completes successfully, and
* The query results size doesn't exceed 16 MB.

## Results from the cache

How does the service indicate that the query results are being served from the cache?
When responding to a query, Kusto sends an additional [ExtendedProperties](../api/rest/response.md) response table that includes a `Key` column and a `Value` column.
Cached query results will have an additional row appended to that table:
* The row's `Key` column will contain the string `ServerCache`
* The row's `Value` column will contain a property bag with two fields:
   * `OriginalClientRequestId` - Specifies the original request's [ClientRequestId](../api/netfx/request-properties.md#the-clientrequestid-x-ms-client-request-id-named-property).
   * `OriginalStartedOn` - Specifies the original request's execution start time.

## Distribution

The cache is not shared by cluster nodes. Every node has a dedicated cache in its' own private storage. If two identical queries land on different nodes, the query will be executed and cached on both nodes. This process can happen if [weak consistency](../concepts/queryconsistency.md) is used.

## Management

The following management and observability commands are supported:

* [Show cache](../management/show-query-results-cache-command.md).
* [Clear cache](../management/clear-query-results-cache-command.md).

## Capacity

The cache capacity is currently fixed at 1 GB per cluster node.
The eviction policy is LRU.
