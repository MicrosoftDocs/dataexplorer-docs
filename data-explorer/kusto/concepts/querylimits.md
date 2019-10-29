---
title: Query limits - Azure Data Explorer | Microsoft Docs
description: This article describes Query limits in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/13/2019
---
# Query limits

Because Kusto is an ad-hoc query engine that hosts large data sets and
attempts to satisfy queries by holding all relevant data in-memory,
there is an inherent risk that queries will monopolize the service
resources without bounds. Kusto provides a number of built-in protections
in the form of default query limits.

## Limit on result set size (result truncation)

**Result truncation** is a limit set by default on the
result set returned by the query. Kusto limits the number of records
returned to the client to **500,000**, and the overall memory for those
records to **64 MB**. When either of these limits is exceeded, the
query fails with a "partial query failure"; exceeding overall memory
will generate an exception with the message:

```
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal data size limit 67108864 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

Exceeding the number of records will fail with an exception that says:

```
The Kusto DataEngine has failed to execute a query: 'Query result set has exceeded the internal record count limit 500000 (E_QUERY_RESULT_SET_TOO_LARGE).'
```

There are a number of strategies for dealing with this error:

1. Reducing the result set size by modifying the query to not
   return uninteresting data. This is commonly useful when
   the initial (failing) query is too "wide" (e.g. does not
   project away data columns that are no needed.)
2. Reducing the result set size by shifting post-query processing
   (such as aggregations) into the query itself. This is useful
   in scenario where the output of the query is fed to another
   processing system which then performs additional aggregations. 
3. Switching from queries to using [data export](../management/data-export/index.md).
   This is appropriate when one does want to export large sets
   of data from the service.
4. Instruct the service to suppress this query limit.

Common methods for reducing the result set size produced by the
query are:

1. Using the [summarize operator](../query/summarizeoperator.md) group and aggregate over
   similar records in the query output, potentially sampling some
   columns using the [any aggregation function](../query/any-aggfunction.md).
2. Using a [take operator](../query/takeoperator.md) to sample the query output.
3. Using the [substring function](../query/substringfunction.md) to trim wide free-text columns.
4. Using the [project operator](../query/projectoperator.md) to drop any uninteresting column
   from the result set.

One can disable result truncation by using the `notruncation` request
option. It is strongly recommended that in this case some form of
limitation is still put in place. For example:

```kusto
set notruncation;
MyTable | take 1000000
```

It is also possible to have a more refined control over result truncation
by setting the value of `truncationmaxsize` (maximum data size in bytes,
defaults to 64 MB) and `truncationmaxrecords` (maximum number of records,
defaults to 500,000). For example, the following query sets result truncation
to happen at either 1,105 records or 1MB, whichever is exceeded:

```kusto
set truncationmaxsize=1048576;
set truncationmaxrecords=1105;
MyTable | where User=="Ploni"
```

The Kusto client libraries currently assume the existence of this
limit. While one can increase the limit without bounds, eventually
one will hit client limits which are currently not configurable. 
One possible workaround is to program directly against the REST API
contract and implement a streaming parser for the Kusto query
results. Please let the Kusto team know if you run into this issue
so we could prioritize a streaming client appropriately.

Also note that result truncation is applied by default not just to the
result stream returned to the client; it is also applied by default to
any sub-query that one Kusto cluster issues to another Kusto cluster
in a cross-cluster query, with similar effects.

## Limit on memory per iterator

**Max memory per result set iterator** is another limit used by Kusto
to protect against "runaway" queries. This limit (represented by the
request option `maxmemoryconsumptionperiterator`) sets an upper bound
on the amount of memory that a single query plan result set iterator
can hold. (This limit applies to the specific iterators which are
not streaming by nature, such as `join`.) Here are a few error messages
that will be returned when this happens:

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

By default, this value is set to 5 GB. One may increase this
value up to half the physical memory of the machine:

```kusto
set maxmemoryconsumptionperiterator=68719476736;
MyTable | ...
```

Users who consider removing these limits should ask themselves if
they actually gain any value by doing so. In particular, removing the
result truncation limit means one intends to move bulk data out of
Kusto -- either for export purposes (in which case one is urged to
use the `.export` command instead), or for doing later aggregation
(in which case one should consider aggregating using Kusto).
Please let the Kusto team know if you have a business scenario that
cannot be met by either of these suggested solutions.  

In many cases, exceeding this limit can be avoided by sampling the
data set to 10%. The two queries below show how one might perform this
sampling; the first is statistical sampling (using a random number
generator), while the second is deterministic sampling (by hashing
some column from the data set, usually some ID):

```kusto
T | where rand() < 0.1 | ...

T | where hash(UserId, 10) == 1 | ...
```

## Limit on memory per node

**Max memory per query per node** is another limit used by Kusto
to protect against "runaway" queries. This limit (represented by the
request option `max_memory_consumption_per_query_per_node`) sets an upper bound
on the amount of memory that can be allocated on a single node for a specific query. 


```kusto
set max_memory_consumption_per_query_per_node=68719476736;
MyTable | ...
```

## Limit on accumulated string sets

In various query operations, Kusto needs to "gather" string values and buffer
them internally before it can start producing results. These accumulated string
sets are limited in size. Exceeding this size will result in the following error:

```
Runaway query (E_RUNAWAY_QUERY). (message: 'Accumulated string array getting too large (see https://aka.ms/kustoquerylimits)
```

There is currently no switch one can use to increase the maximum string set size.
As a workaround, one can rephrase the query to reduce the amount of data that
has to be buffered. For example, but projecting-away unneeded columns before
they "enter" operators such as join and summarize. Or, for example, by using [shuffle summarize](../query/shufflesummarize.md) or [shuffle join](../query/shufflejoin.md) strategies.

## Limit on request execution time (timeout)

**Server timeout** is a service-side timeout that is applied to all requests.
Timeout on running requests (queries and control commands) is enforced at multiple
points:

* In the Kusto client library (if one is used).
* In the Kusto service endpoint that accepts the request.
* In the Kusto service engine that processes the request.

By default, timeout is set to 4 minutes for queries and 10 minutes for
control commands. This value can be increased if needed (capped
at 1 hour):

* If you are querying using Kusto.Explorer, use **Tools** &gt; **Options*** &gt;
  **Connections** &gt; **Query Server Timeout**.
* Programmatically, set the `servertimeout`
  client request property (a value of type `System.TimeSpan`, up to an hour).

Notes about timeouts:

1. On the client side, the timeout is applied from the request being created
   until the time that the response starts arriving to the client. The time it
   takes to read the payload back at the client is not treated as part of the
   timeout (because it depends on how quickly the caller pulls the data from
   the stream).
2. Also on the client side, the actual timeout value used is slightly higher
   than the server timeout value requested by the user. This is to allow for
   network latencies.
3. On the service side, not all query operators honor the timeout value.
   We are gradually adding that support.
4. To have Kusto automatically use the maximum allowed request timeout, one can
   set the client request property `norequesttimeout` to `true`.

<!--
  Request timeout can also be set using a set statement, but we don't mention
  it here as it should not be used in production scenarios.
-->

## Limit on query CPU resource usage

By default, Kusto allows running queries to use as much CPU resources as the
cluster has, attempting to do a fair round-robin between queries if more than
one is running. In many cases, this yields the best performance for ad-hoc queries.
In other cases, one might want to limit the CPU resources allocated for a particular
query. For example, if one is running a "background job" one might tolerate higher
latencies in order to give concurrent ad-hoc queries high priority.

Kusto support specifying two [client request properties](../api/netfx/request-properties.md)
when running a query, **query_fanout_threads_percent** and **query_fanout_nodes_percent**.
Both are integers that default to the maximum value (100), but may be reduced for a
specific query to some value. The first controls the fanout factor for thread usage;
when it is 100% the cluster will assign all CPUs on each node (e.g., on a cluster
deployed on Azure D14 nodes, 16 CPUs) to the query, when it is 50% than half of the CPUs
will be used, etc. (The numbers are rounded up to a whole CPU, so it is safe to set it
to 0.) The second controls how many nodes in the cluster to utilize per sub-query distribution
operation, and functions in a similar manner.

## Limit on query complexity

During query execution, the query text is transformed into a tree of relational operators representing the query.
In case the tree depth exceeds an internal threshold (several thousands of levels), the query is considered too complex for processing and will fail with an error code indicating the relational operators tree exceeds limits.
In most cases, this is caused by a query which contains a long list of binary operators chained together, for example:

```kusto
T 
| where Column == "value1" or 
        Column == "value2" or 
        .... or
        Column == "valueN"
```

For this specific case - it is recommended to re-write the query using [`in()`](../query/inoperator.md) operator. 

```kusto
T 
| where Column in ("value1", "value2".... "valueN")
```

