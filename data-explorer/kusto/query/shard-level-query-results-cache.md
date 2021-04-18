# Shard level query results caching

Kusto can cache query results on per-shard level and has ability to reuse these results for queries with overlapping calculations over these shards.
This cache is useful for operational dashboards scenarios where same query is executed in a scheduled manner, each time shifting time according to the current time.
for example - running dashboard over last hour and moving timespan forward each 10 seconds.

> [!Note]
> In order to use this feature, the cluster should be running with V3 engine mode.

## Syntax

Set the query_per_shard_query_cache_enabled option as part of the query to use the shard level results cache. You can set this option in the query text or as a client request property. For example:

```kusto
set query_per_shard_query_cache_enabled;
GithubEvent
| where CreatedAt > ago(180d)
| summarize arg_max(CreatedAt, Type) by Id
```

The feature is also enabled automatically when the [Query Results Cache](query-results-cache.md) is in use.
The cache capacity is currently fixed at 1 GB and is shared with the [Query Results Cache](query-results-cache.md) per cluster node. 
The eviction policy is LRU.
