---
title:  Query limits
description: This article describes Query limits.
ms.reviewer: zivc
ms.topic: reference
ms.date: 03/30/2026
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Query limits

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Kusto is an ad-hoc query engine that hosts large datasets and tries to satisfy queries by holding all relevant data in memory. There's an inherent risk that queries monopolize the service resources without bounds. Kusto provides several built-in protections in the form of default query limits. If you're considering removing these limits, first determine whether you actually gain any value by doing so.

## Limit on request concurrency

**Request concurrency** is a limit on several requests running at the same time.

* The default value of the limit depends on the SKU the database is running on, and is calculated as: `Cores-Per-Node x 10`.
  * For example, for a database that's set up on D14v2 SKU, where each machine has 16 vCores, the default limit is `16 cores x10 = 160`.
* You can change the default value by configuring the [request rate limit policy](../management/request-rate-limit-policy.md) of the `default` workload group.
  * Various factors affect the actual number of requests that can run concurrently on a database. The most dominant factors are database SKU, database's available resources, and usage patterns. Configure the policy based on load tests performed on production-like usage patterns.

::: moniker range="azure-data-explorer"
 For more information, see [Optimize for high concurrency with Azure Data Explorer](/azure/data-explorer/high-concurrency).
::: moniker-end

## Limit on result set size (result truncation)

**Result truncation** is a default limit on the
result set returned by the query. Kusto limits the number of records
returned to the client to **500,000**, and the overall data size for those
records to **64 MB**. When either of these limits is exceeded, the
query fails with a "partial query failure". Exceeding the overall data size
generates an exception with the following message:

```txt
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal data size limit 67108864 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

Exceeding the number of records fails with an exception that says:

```txt
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal record count limit 500000 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

You can use several strategies to resolve this error.

* Reduce the result set size by modifying the query to only return interesting data. This strategy is useful when the initial failing query is too "wide". For example, the query doesn't project away data columns that aren't needed.
* Reduce the result set size by shifting post-query processing, such as aggregations, into the query itself. This strategy is useful in scenarios where the output of the query is fed to another processing system, and that system then does other aggregations.
* Switch from queries to using [data export](../management/data-export/index.md) when you want to export large sets of data from the service.
* Instruct the service to suppress this query limit by using the `set` statements listed in the following section or flags in [client request properties](../api/netfx/client-request-properties.md).

Methods for reducing the result set size produced by the query include:

* Use the [summarize operator](../query/summarize-operator.md) to group and aggregate over
   similar records in the query output. Potentially sample some columns by using the [take_any aggregation function](../query/take-any-aggregation-function.md).
* Use a [take operator](../query/take-operator.md) to sample the query output.
* Use the [substring function](../query/substring-function.md) to trim wide free-text columns.
* Use the [project operator](../query/project-operator.md) to drop any uninteresting column from the result set.

You can disable result truncation by using the `notruncation` request option.
We recommend that some form of limitation is still put in place.

For example:

```kusto
set notruncation;
MyTable | take 1000000
```

You can also have more refined control over result truncation
by setting the value of `truncationmaxsize` (maximum data size in bytes,
defaults to 64 MB) and `truncationmaxrecords` (maximum number of records,
defaults to 500,000). For example, the following querysets result truncation
to happen at either 1,105 records or 1 MB, whichever is exceeded.

```kusto
set truncationmaxsize=1048576;
set truncationmaxrecords=1105;
MyTable | where User=="UserId1"
```

Removing the result truncation limit means that you intend to move bulk data out of Kusto.

You can remove the result truncation limit either for export purposes by using the `.export` command or for later aggregation. If you choose later aggregation, consider aggregating by using Kusto.

Kusto provides many client libraries that can handle "infinitely large" results by streaming them to the caller.
Use one of these libraries, and configure it to streaming mode.
For example, use the .NET Framework client (Microsoft.Azure.Kusto.Data) and either set the streaming property of the connection string to *true*, or use the *ExecuteQueryV2Async()* call that always streams results. For an example of how to use *ExecuteQueryV2Async()*, see the [HelloKustoV2](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/HelloKustoV2) application.

You might also find the C# streaming ingestion sample application helpful.

Result truncation is applied by default, not just to the result stream returned to the client.
:::moniker range="azure-data-explorer"
It's also applied by default to any subquery that one cluster issues to another cluster in a cross-cluster query, with similar effects.
::: moniker-end

:::moniker range="microsoft-fabric"
It's also applied by default to any subquery that one Eventhouse issues to another Eventhouse in a cross-Eventhouse query, with similar effects.
::: moniker-end

### Setting multiple result truncation properties

The following rules apply when you use `set` statements or specify flags in [client request properties](../api/netfx/client-request-properties.md).

* If you set `notruncation` but also set `truncationmaxsize`, `truncationmaxrecords`, or `query_take_max_records`, the service ignores `notruncation`.
* If you set `truncationmaxsize`, `truncationmaxrecords`, or `query_take_max_records` more than once, the service uses the *lower* value for each property.

## Limit on memory consumed by query operators

You can configure the **Max memory consumption per iterator** limit to control the amount of memory that each query operator consumes, per node. Some query operators, such as `join` and `summarize`, hold significant data in memory. By increasing the default value of the request option `maxmemoryconsumptionperiterator`, you can run queries that require more memory per operator.

The maximum supported value for this request option is 32,212,254,720 (30 GB). If you set `maxmemoryconsumptionperiterator` multiple times, such as in both client request properties and by using a `set` statement, the lower value applies.

When the query reaches the configured memory per operator limit, a partial query failure message displays and includes the text `E_RUNAWAY_QUERY`.

For example:

`The ClusterBy operator has exceeded the memory budget during evaluation. Results might be incorrect or incomplete (E_RUNAWAY_QUERY).`

`The HashJoin operator has exceeded the memory budget during evaluation. Results might be incorrect or incomplete (E_RUNAWAY_QUERY).`

`The Sort operator has exceeded the memory budget during evaluation. Results might be incorrect or incomplete (E_RUNAWAY_QUERY).`

For example, this querysets the max memory consumption per iterator to 15 GB:

<!-- csl -->
```kusto
set maxmemoryconsumptionperiterator=16106127360;
MyTable | summarize count() by Use
```

Another limit that might trigger an `E_RUNAWAY_QUERY` partial query failure is the max accumulated size of
strings held by a single operator. The request option described earlier can't override this limit.

`Runaway query (E_RUNAWAY_QUERY). Aggregation over string column exceeded the memory budget of 8GB during evaluation.`

When this limit is exceeded, most likely the relevant query operator is a `join`, `summarize`, or `make-series`.

To work around the limit, modify the query to use the [shuffle query](../query/shuffle-query.md) strategy. This change is also likely to improve the performance of the query.

In all cases of `E_RUNAWAY_QUERY`, another option (beyond increasing the limit by setting the request option and changing the
query to use a shuffle strategy) is to switch to sampling. Sampling reduces the amount of data processed by the query, and therefore reduces the memory pressure on query operators.

These two queries show how to do the sampling. The first query is a statistical sampling, using a random number generator. The second query is deterministic sampling, done by hashing some column from the dataset, usually some ID.

<!-- csl -->
```kusto
T | where rand() < 0.1 | ...

T | where hash(UserId, 10) == 1 | ...
```

For more information about using mechanisms such as `hint.shufflekey` for both `summarize` and `join`, see [Best practices for Kusto Query Language queries](../query/best-practices.md).

## Limit on memory per node

**Max memory per query per node** is another limit that protects against runaway queries. The request option `max_memory_consumption_per_query_per_node` sets an upper bound
on the amount of memory that a single node can use for a specific query.

```kusto
set max_memory_consumption_per_query_per_node=68719476736;
MyTable | ...
```

If you set `max_memory_consumption_per_query_per_node` multiple times, such as in both client request properties and a `set` statement, the lower value applies.

If the query uses `summarize`, `join`, or `make-series` operators, you can use the [shuffle query](../query/shuffle-query.md) strategy to reduce memory pressure on a single machine.

## Limit execution timeout

**Server timeout** is a service-side timeout that the service applies to all requests.
Kusto enforces timeout on running requests (queries and management commands) at multiple
points:

* client library (if used)
* service endpoint that accepts the request
* service engine that processes the request

By default, the timeout is set to four minutes for queries, and 10 minutes for
management commands. You can increase this value if needed, up to one hour.

* Various client tools support changing the timeout as part of their global
  or per-connection settings. For example, in Kusto.Explorer, use **Tools** &gt; **Options** &gt;
  **Connections** &gt; **Query Server Timeout**.
* Programmatically, SDKs support setting the timeout through the `servertimeout`
  property. For example, in .NET SDK, set this property through a [client request property](../api/rest/request-properties.md),
  by setting a value of type `System.TimeSpan`.

### Notes about timeouts

* On the client side, the timeout is applied from the request being created
   until the time that the response starts arriving to the client. The time it
   takes to read the payload back at the client isn't treated as part of the
   timeout. It depends on how quickly the caller pulls the data from
   the stream.
* Also on the client side, the actual timeout value used is slightly higher
   than the server timeout value requested by the user. This difference, is to allow for network latencies.
* To automatically use the maximum allowed request timeout, set the client request property `norequesttimeout` to `true`.

:::moniker range="azure-data-explorer"
> [!NOTE]
> See [set timeout limits](/azure/data-explorer/set-timeout-limits) for a step-by-step guide on how to set timeouts in the Azure Data Explorer web UI, Kusto.Explorer, Kusto.Cli, Power BI, and when using an SDK.
::: moniker-end

## Limit on query CPU resource usage

Kusto runs queries and uses all the available CPU resources that the database has.
It attempts to do a fair round-robin between queries if more than one query is running. This method yields the best performance for query-defined functions.
At other times, you might want to limit the CPU resources used for a particular
query. If you run a background job, for example, the system might tolerate higher
latencies to give concurrent inline queries high priority.

Kusto supports specifying two [request properties](../api/rest/request-properties.md) when running a query.
The properties are *query_fanout_threads_percent* and *query_fanout_nodes_percent*.
Both properties are integers that default to the maximum value (100), but you can reduce them for a specific query.

The first property, *query_fanout_threads_percent*, controls the fanout factor for thread use.
When you set this property to 100%, the query uses all CPUs on each node. For example, 16 CPUs deployed on Azure D14 nodes.
When you set this property to 50%, the query uses half of the CPUs, and so on.
The numbers are rounded up to a whole CPU, so it's safe to set the property value to 0.

The second property, *query_fanout_nodes_percent*, controls how many of the query nodes to use per subquery distribution operation.
It functions in a similar manner.

If you set `query_fanout_nodes_percent` or `query_fanout_threads_percent` multiple times, for example, in both client request properties and by using a `set` statement, the lower value for each property applies.

## Limit on query complexity

During query execution, the query text is transformed into a tree of relational operators representing the query.
If the tree depth exceeds an internal threshold, the query is too complex for processing, and fails with an error code. The failure indicates that the relational operators tree exceeds its limits.

### Query complexity exceeded

The query is too complex for the engine to compile. This complexity usually occurs when query plan construction consumes too many resources. Common causes include:

* Large unions across many tables, such as using `union *` on a large database.
* Deeply nested subqueries.
* Many levels of `let` statements that reference each other.

### Query plan size or complexity exceeds set limits

The query generates a query plan that's too large to process. Common causes include:

* The left side of a broadcast join produces too much data.
* The results returned by `toscalar()` are too large.
* The results inside an `in()` expression are too large. For example, an `in (subquery)` where the subquery returns too many values.

The following examples show common query patterns that can cause the query to exceed these limits and fail:

* A long list of binary operators that are chained together. For example:

```kusto
T
| where Column == "value1" or
        Column == "value2" or
        .... or
        Column == "valueN"
```

For this specific case, rewrite the query by using the [`in()`](../query/in-operator.md) operator.

```kusto
T
| where Column in ("value1", "value2".... "valueN")
```

* A query that uses a union operator and runs too wide schema analysis. This problem happens because the default flavor of union returns an "outer" union schema. This schema means that the output includes all columns of the underlying table.

Review the query and reduce the number of columns the query uses.

## Related content

:::moniker range="azure-data-explorer"
* [Optimize for high concurrency with Azure Data Explorer](/azure/data-explorer/high-concurrency)
::: moniker-end
* [Query best practices](../query/best-practices.md)
