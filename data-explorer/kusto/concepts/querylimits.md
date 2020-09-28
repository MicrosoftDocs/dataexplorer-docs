---
title: Query limits - Azure Data Explorer
description: This article describes Query limits in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 03/12/2020
---
# Query limits

Kusto is an ad-hoc query engine that hosts large data sets and
attempts to satisfy queries by holding all relevant data in-memory.
There's an inherent risk that queries will monopolize the service
resources without bounds. Kusto provides a number of built-in protections
in the form of default query limits. If you're considering removing these limits, first determine whether you actually gain any value by doing so.

## Limit on query concurrency

**Query concurrency** is a limit that a cluster imposes on a number of queries running at the same time. 

* The default value of the query concurrency limit depends on the Azure Data Explorer cluster SKU and size(number of cores and nodes in a cluster), it is calculated as: `Cores-Per-Node x 10`.
  * For example, for a cluster that's set-up on D14v2 SKU, where each machine has 16 vCores, the default Query Concurrency limit is `16 cores x 10 = 160`. 
  * `Cores-Per-Node x 10` is just a default value that could vary depending on the cluster SKU/size, complexity of queries, data volumes and the way data is distributed. Majority of the scenarios could achieve way beyond the default value but considering every workload is different, the best way is to test to come up with the accurate number.
For example, 50 very complex queries may not run well concurrently, whereas 500 simple queries may run easily concurrently.
  * The default value can be changed by creating a support ticket. In the future, this control will be made as self-served experience so the creation of support ticket will not be required.
  * Azure Data Explorer allows *All Databases admin* role to limit the amount of concurrent queries the cluster is executing at the same time by defining query throttling policy. Throttling queries is a defense mechanism to protect cluster from too many queries running concurrently leading to inaccessibility or performance degradation. The policy can be changed at run-time and takes place immediately after the alter policy command completes.


## Limit on result set size (result truncation)

**Result truncation** is a limit set by default on the
result set returned by the query. Kusto limits the number of records
returned to the client to **500,000**, and the overall data size for those
records to **64 MB**. When either of these limits is exceeded, the
query fails with a "partial query failure". Exceeding overall data size
will generate an exception with the message:

```
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal data size limit 67108864 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

Exceeding the number of records will fail with an exception that says:

```
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal record count limit 500000 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

There are a number of strategies for dealing with this error.

* Reduce the result set size by modifying the query to only return interesting data. This strategy is useful when the initial failing query is too "wide". For example, the query doesn't project away data columns that aren't needed.
* Reduce the result set size by shifting post-query processing, such as aggregations, into the query itself. The strategy is useful in scenarios where the output of the query is fed to another processing system, and that then does additional aggregations.
* Switch from queries to using [data export](../management/data-export/index.md) when you want to export large sets of data from the service.
* Instruct the service to suppress this query limit using `set` statements listed below or flags in [client request properties](../api/netfx/request-properties.md).

Methods for reducing the result set size produced by the query include:

* Use the [summarize operator](../query/summarizeoperator.md) group and aggregate over
   similar records in the query output. Potentially sample some columns by using the [any aggregation function](../query/any-aggfunction.md).
* Use a [take operator](../query/takeoperator.md) to sample the query output.
* Use the [substring function](../query/substringfunction.md) to trim wide free-text columns.
* Use the [project operator](../query/projectoperator.md) to drop any uninteresting column from the result set.

You can disable result truncation by using the `notruncation` request option.
We recommend that some form of limitation is still put in place.

For example:

```kusto
set notruncation;
MyTable | take 1000000
```

It's also possible to have more refined control over result truncation
by setting the value of `truncationmaxsize` (maximum data size in bytes,
defaults to 64 MB) and `truncationmaxrecords` (maximum number of records,
defaults to 500,000). For example, the following query sets result truncation
to happen at either 1,105 records or 1MB, whichever is exceeded.

```kusto
set truncationmaxsize=1048576;
set truncationmaxrecords=1105;
MyTable | where User=="UserId1"
```

Removing the result truncation limit means that you intend to move bulk data out of Kusto.

You can remove the result truncation limit either for export purposes by using the `.export` command or for later aggregation. If you choose later aggregation, consider aggregating by using Kusto.

Kusto provides a number of client libraries that can handle "infinitely large" results by streaming them to the caller. 
Use one of these libraries, and configure it to streaming mode. 
For example, use the .NET Framework client (Microsoft.Azure.Kusto.Data) and either set the streaming property of the connection string to *true*, or use the *ExecuteQueryV2Async()* call that always streams results.

Result truncation is applied by default, not just to the
result stream returned to the client. It's also applied by default to
any subquery that one cluster issues to another cluster
in a cross-cluster query, with similar effects.

## Limit on memory per iterator

**Max memory per result set iterator** is another limit used by Kusto
to protect against "runaway" queries. This limit, represented by the
request option `maxmemoryconsumptionperiterator`, sets an upper bound
on the amount of memory that a single query plan result set iterator
can hold. This limit applies to the specific iterators that aren't streaming by nature, such as `join`.) Here are a few error messages that will return when this situation happens:

```
The ClusterBy operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete E_RUNAWAY_QUERY.

The DemultiplexedResultSetCache operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The ExecuteAndCache operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The HashJoin operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The Sort operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The Summarize operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The TopNestedAggregator operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).

The TopNested operator has exceeded the memory budget during evaluation. Results may be incorrect or incomplete (E_RUNAWAY_QUERY).
```

By default, this value is set to 5 GB. You may increase this value by up to half the physical memory of the machine:

```kusto
set maxmemoryconsumptionperiterator=68719476736;
MyTable | ...
```

In many cases, exceeding this limit can be avoided by sampling the data set. The two queries below show how to do the sampling. The first, is a statistical sampling, that uses a random number generator). The second, is deterministic sampling, done by hashing some column from the data set, usually some ID.

```kusto
T | where rand() < 0.1 | ...

T | where hash(UserId, 10) == 1 | ...
```

## Limit on memory per node

**Max memory per query per node** is another limit used to protect against "runaway" queries. This limit, represented by the request option `max_memory_consumption_per_query_per_node`, sets an upper bound
on the amount of memory that can be used on a single node for a specific query.

```kusto
set max_memory_consumption_per_query_per_node=68719476736;
MyTable | ...
```

## Limit on accumulated string sets

In various query operations, Kusto needs to "gather" string values and buffer
them internally before it starts to produce results. These accumulated string
sets are limited in size and in how many items they can hold. Additionally, each
individual string shouldn't exceed a certain limit.
Exceeding one of these limits will result in one of the following errors:

```
Runaway query (E_RUNAWAY_QUERY). (message: 'Accumulated string array getting too large and exceeds the limit of ...GB (see https://aka.ms/kustoquerylimits)')

Runaway query (E_RUNAWAY_QUERY). (message: 'Accumulated string array getting too large and exceeds the maximum count of ..GB items (see http://aka.ms/kustoquerylimits)')
```

There's currently no switch to increase the maximum string set size.
As a workaround, rephrase the query to reduce the amount of data that
has to be buffered. You can project away unneeded columns before
they're used by operators such as join and summarize. Or, you can use the [shuffle query](../query/shufflequery.md) strategy.

## Limit execution timeout

**Server timeout** is a service-side timeout that is applied to all requests.
Timeout on running requests (queries and control commands) is enforced at multiple
points in the Kusto:

* client library (if used)
* service endpoint that accepts the request
* service engine that processes the request

By default, timeout is set to four minutes for queries, and 10 minutes for
control commands. This value can be increased if needed (capped at one hour).

* If you query using Kusto.Explorer, use **Tools** &gt; **Options*** &gt;
  **Connections** &gt; **Query Server Timeout**.
* Programmatically, set the `servertimeout` client request property, a value of type `System.TimeSpan`, up to an hour.

**Notes about timeouts**

* On the client side, the timeout is applied from the request being created
   until the time that the response starts arriving to the client. The time it
   takes to read the payload back at the client isn't treated as part of the
   timeout. It depends on how quickly the caller pulls the data from
   the stream.
* Also on the client side, the actual timeout value used is slightly higher
   than the server timeout value requested by the user. This difference, is to allow for network latencies.
* To automatically use the maximum allowed request timeout, set the client request property `norequesttimeout` to `true`.

<!--
  Request timeout can also be set using a set statement, but we don't mention
  it here since it shouldn't be used in production scenarios.
-->

## Limit on query CPU resource usage

Kusto lets you run queries and use as much CPU resources as the cluster has. 
It attempts to do a fair round-robin between queries if more than one is running. This method yields the best performance for ad-hoc queries.
At other times, you may want to limit the CPU resources used for a particular
query. If you run a "background job", for example, the system might tolerate higher
latencies to give concurrent ad-hoc queries high priority.

Kusto supports specifying two [client request properties](../api/netfx/request-properties.md) when running a query. The properties are  *query_fanout_threads_percent* and *query_fanout_nodes_percent*.
Both properties are integers that default to the maximum value (100), but may be reduced for a specific query to some other value. 

The first, *query_fanout_threads_percent*, controls the fanout factor for thread use. When it's 100%, the cluster will assign all CPUs on each node. For example, 16 CPUs on a cluster deployed on Azure D14 nodes. When it's 50%, then half of the CPUs will be used, and so on. The numbers are rounded up to a whole CPU, so it's safe to set it to 0. The second, *query_fanout_nodes_percent*, controls how many of the query nodes in the cluster to use per subquery distribution operation. It functions in a similar manner.

## Limit on query complexity

During query execution, the query text is transformed into a tree of relational operators representing the query.
If the tree depth exceeds an internal threshold of several thousand levels, the query is considered too complex for processing, and will fail with an error code. The failure indicates that the relational operators tree exceeds its limits.
Limits are exceeded because of queries with long lists of binary operators that are chained together. For example:

```kusto
T 
| where Column == "value1" or 
        Column == "value2" or 
        .... or
        Column == "valueN"
```

For this specific case, rewrite the query using the [`in()`](../query/inoperator.md) operator.

```kusto
T 
| where Column in ("value1", "value2".... "valueN")
```
