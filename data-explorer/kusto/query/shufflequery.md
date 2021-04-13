---
title: Shuffle query - Azure Data Explorer
description: This article describes Shuffle query in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# Shuffle query

Shuffle query is a semantic-preserving transformation for a set of operators that support shuffle strategy. Depending on the actual data, this query can yield considerably better performance.

Operators that support shuffling in Kusto are [join](joinoperator.md), [summarize](summarizeoperator.md), and [make-series](make-seriesoperator.md).

Set shuffle query strategy using the query parameter `hint.strategy = shuffle` or `hint.shufflekey = <key>`.

## Syntax

```kusto
T | where Event=="Start" | project ActivityId, Started=Timestamp
| join hint.strategy = shuffle (T | where Event=="End" | project ActivityId, Ended=Timestamp)
  on ActivityId
| extend Duration=Ended - Started
| summarize avg(Duration)
```

```kusto
T
| summarize hint.strategy = shuffle count(), avg(price) by supplier
```

```kusto
T
| make-series hint.shufflekey = Fruit PriceAvg=avg(Price) default=0  on Purchase from datetime(2016-09-10) to datetime(2016-09-13) step 1d by Supplier, Fruit
```

This strategy will share the load on all cluster nodes, where each node will process one partition of the data.
It is useful to use the shuffle query strategy when the key (`join` key, `summarize` key, or `make-series` key) has a high cardinality and the regular query strategy hits query limits.

**Difference between hint.strategy=shuffle and hint.shufflekey = key**

`hint.strategy=shuffle` means that the shuffled operator will be shuffled by all the keys.
For example, in this query:

```kusto
T | where Event=="Start" | project ActivityId, Started=Timestamp
| join hint.strategy = shuffle (T | where Event=="End" | project ActivityId, Ended=Timestamp)
  on ActivityId, ProcessId
| extend Duration=Ended - Started
| summarize avg(Duration)
```

The hash function that shuffles the data will use both keys ActivityId and ProcessId.

The query above is equivalent to:

```kusto
T | where Event=="Start" | project ActivityId, Started=Timestamp
| join hint.shufflekey = ActivityId hint.shufflekey = ProcessId (T | where Event=="End" | project ActivityId, Ended=Timestamp)
  on ActivityId, ProcessId
| extend Duration=Ended - Started
| summarize avg(Duration)
```

If the compound key is too unique, but each key is not unique enough, use this `hint` to shuffle the data by all the keys of the shuffled operator.

In some cases, the `hint.strategy=shuffle` will be ignored, and the query won't run in shuffle strategy. Example scenarios are: 
* The `join` has another shuffle-able operator (`join`, `summarize`, or `make-series`) on the left side or the right side.
* The `summarize` appears after other shuffle-able operator (`join`, `summarize`, or `make-series`) in the query.

for example:

```kusto
T
| where Event=="Start"
| project ActivityId, Started=Timestamp, numeric_column
| summarize count(), numeric_column = any(numeric_column) by ActivityId
| join
    hint.strategy = shuffle (T
    | where Event=="End"
    | project ActivityId, Ended=Timestamp, numeric_column
)
on ActivityId, numeric_column
| extend Duration=Ended - Started
| summarize avg(Duration)
```

In this query, the join has summarize on its left side, so using `hint.strategy=shuffle` will not apply shuffle strategy to the query.
To overcome this issue and run in shuffle strategy, choose the key which is common among summarize and join. In this case, this key is `ActivityId`. Use the hint `hint.shufflekey` to specify the shuffle key on the join to `hint.shufflekey = ActivityId`:

```kusto
T
| where Event=="Start"
| project ActivityId, Started=Timestamp, numeric_column
| summarize count(), numeric_column = any(numeric_column) by ActivityId
| join
    hint.shufflekey = ActivityId (T
    | where Event=="End"
    | project ActivityId, Ended=Timestamp, numeric_column
)
on ActivityId, numeric_column
| extend Duration=Ended - Started
| summarize avg(Duration)
```

|ActivityId|NumericColumn|hash_by_key|
|---|---|---|
|activity1|2|56|
|activity1|1|65|

In shuffle query, the default partitions number is the cluster nodes number. This number can be overridden by using the syntax `hint.num_partitions = total_partitions`, which will control the number of partitions.

This hint is useful when the cluster has a small number of cluster nodes where the default partitions number will be small too and the query still fails or takes long execution time.

> [!Note]
> Having many partitions may consume more cluster resources and degrade performance. Instead, choose the partition number carefully by starting with the hint.strategy = shuffle and start increasing the partitions gradually.

## Examples

The following example shows how shuffle `summarize` improves performance considerably.

The source table has 150M records and the cardinality of the group by key is 10M, which is spread over 10 cluster nodes.

Running the regular `summarize` strategy, the query ends after 1:08 and the memory usage peak is ~3 GB:

```kusto
orders
| summarize arg_max(o_orderdate, o_totalprice) by o_custkey 
| where o_totalprice < 1000
| count
```

|Count|
|---|
|1086|

While using shuffle `summarize` strategy, the query ends after ~7 seconds and the memory usage peak is 0.43 GB:

```kusto
orders
| summarize hint.strategy = shuffle arg_max(o_orderdate, o_totalprice) by o_custkey 
| where o_totalprice < 1000
| count
```

|Count|
|---|
|1086|

The following example shows the improvement on a cluster that has two cluster nodes, the table has 60M records, and the cardinality of the group by key is 2M.

Running the query without `hint.num_partitions` will use only two partitions (as cluster nodes number) and the following query will take ~1:10 mins:

```kusto
lineitem	
| summarize hint.strategy = shuffle dcount(l_comment), dcount(l_shipdate) by l_partkey 
| consume
```

setting partitions number to 10, the query will end after 23 seconds: 

```kusto
lineitem	
| summarize hint.strategy = shuffle hint.num_partitions = 10 dcount(l_comment), dcount(l_shipdate) by l_partkey 
| consume
```

The following example shows how shuffle `join` improves performance considerably.

The examples were sampled on a cluster with 10 nodes where the data is spread over all these nodes.

The left table has 15M records where the cardinality of the `join` key is ~14M. The right side of the `join` is with 150M records and the cardinality of the `join` key is 10M.
Running the regular strategy of the `join`, the query ends after ~28 seconds and the memory usage peak is 1.43 GB:

```kusto
customer
| join
    orders
on $left.c_custkey == $right.o_custkey
| summarize sum(c_acctbal) by c_nationkey
```

While using shuffle `join` strategy, the query ends after ~4 seconds and the memory usage peak is 0.3 GB:

```kusto
customer
| join
    hint.strategy = shuffle orders
on $left.c_custkey == $right.o_custkey
| summarize sum(c_acctbal) by c_nationkey
```

Trying the same queries on a larger dataset where left side of the `join` is 150M and the cardinality of the key is 148M. The right side of the `join` is 1.5B, and the cardinality of the key is ~100M.

The query with the default `join` strategy hits Kusto limits and times-out after 4 mins.
While using shuffle `join` strategy, the query ends after ~34 seconds and the memory usage peak is 1.23 GB.


The following example shows the improvement on a cluster that has two cluster nodes, the table has 60M records, and the cardinality of the `join` key is 2M.
Running the query without `hint.num_partitions` will use only two partitions (as cluster nodes number) and the following query will take ~1:10 mins:

```kusto
lineitem
| summarize dcount(l_comment), dcount(l_shipdate) by l_partkey
| join
    hint.shufflekey = l_partkey   part
on $left.l_partkey == $right.p_partkey
| consume
```

setting partitions number to 10, the query will end after 23 seconds: 

```kusto
lineitem
| summarize dcount(l_comment), dcount(l_shipdate) by l_partkey
| join
    hint.shufflekey = l_partkey  hint.num_partitions = 10    part
on $left.l_partkey == $right.p_partkey
| consume
```
