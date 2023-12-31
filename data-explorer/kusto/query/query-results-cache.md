---
title:  Query results cache
description: Learn how to use the query results cache functionality to get cached results.
ms.reviewer: amitof
ms.topic: reference
ms.date: 01/12/2023
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
* The two queries share the same [client request properties](../api/netfx/client-request-properties.md). The following properties are ignored for caching purposes:
  * [ClientRequestId](../api/netfx/request-properties.md#clientrequestid-x-ms-client-request-id)
  * [Application](../api/netfx/request-properties.md#application-x-ms-app)
  * [User](../api/netfx/request-properties.md#user-x-ms-user)

### Incompatible queries

The query results won't be cached if any of the following conditions is true:

* The query references a table that has the [RestrictedViewAccess](../management/restricted-view-access-policy.md) policy enabled.
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
When responding to a query, Kusto sends another [ExtendedProperties](../api/rest/response.md) response table that includes a `Key` column and a `Value` column.
Cached query results will have another row appended to that table:

* The row's `Key` column will contain the string `ServerCache`
* The row's `Value` column will contain a property bag with two fields:
  * `OriginalClientRequestId` - Specifies the original request's [ClientRequestId](../api/netfx/request-properties.md#clientrequestid-x-ms-client-request-id).
  * `OriginalStartedOn` - Specifies the original request's execution start time.

## Distribution

The cache isn't shared by cluster nodes. Every node has a dedicated cache in its own private storage. If two identical queries land on different nodes, the query will be executed and cached on both nodes. This process can happen if [weak consistency](../concepts/queryconsistency.md) is used. By setting query consistency to `affinitizedweakconsistency`, you can have weakly consistency queries that are identical land on the same query head, and thus increase the cache hit rate.

## Management

The following management and observability commands are supported:

* [Show query results cache](../management/show-query-results-cache-command.md): Returns statistics related to the query results cache.
* [Clear query results cache](../management/clear-query-results-cache-command.md): Clears query results cache.
* Refresh query cache entry: a specific query cache entry can be refreshed using `query_results_cache_force_refresh` (OptionQueryResultsCacheForceRefresh)[client request property](../api/netfx/request-properties.md). When set to `true`, this command will force query results cache to be refreshed also when an existing cache is present. This process is useful in scenarios that require queries results to be available for querying. This property must be used in combination with 'query_results_cache_max_age', and sent via ClientRequestProperties object. The property can't be part of a 'set' statement.

## Capacity

The cache capacity is currently fixed at 1 GB per cluster node.
The eviction policy is LRU.

## Shard level query results cache

The query results cache is effective when the exact same query is run multiple times in rapid succession and can tolerate returning slightly old data. However, some scenarios, like a live dashboard, require the most up-to-date results.

For example, a query that runs every 10 seconds and spans the last 1 hour can benefit from caching intermediate query results at the storage (shard) level.

The shard level query results cache is automatically enabled when the `Query results cache` is in use. Because it shares the same cache as `Query results cache`, the same capacity and eviction policies apply.

### Syntax

`set` `query_results_cache_per_shard`; *Query*

> [!NOTE]
> This option can be set in the query text or as a [client request property](../api/netfx/request-properties.md).

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Example

```kusto
set query_results_cache_per_shard;
GithubEvent
| where CreatedAt > ago(180d)
| summarize arg_max(CreatedAt, Type) by Id
```
