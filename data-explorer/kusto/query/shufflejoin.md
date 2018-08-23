# Shuffle Join

Shuffle join is a semantic-preserving transformation for join that depending on the actual data can yield considerably better performance.

**Syntax**

Shuffle join strategy can be set by the query parameter `hint.strategy = shuffle`:

<!-- csl -->
```
T | where Event=="Start" | project ActivityId, Started=Timestamp
| join hint.strategy = shuffle (T | where Event=="End" | project ActivityId, Ended=Timestamp)
  on ActivityId
| extend Duration=Ended - Started
| summarize avg(Duration)
```

This strategy will share the load on all cluster nodes where each node will process one partition of the data.
It is useful to use the shuffle join strategy when the join key's cardinality is high causing the regular join strategy to hit query limits.

In addition, it is possible to choose the shuffle keys that will be used by the query parameter `hint.shufflekey = key` :

<!-- csl -->
```
customer
| join kind=leftouter 
(
    orders
	| where not(o-comment matches regex @'.*special.*requests.*')
    | summarize c=count() by o-custkey
	)
on $left.c-custkey == $right.o-custkey
| summarize hint.shufflekey = c-custkey c-count = sum(c) by c-custkey
| summarize custdist = count() by c-count
| order by custdist desc, c-count desc
```

It is useful when the key is used in more than one different operators that can be shuffled (like the summarize and the join operators above), so in the above case, both the join and summarize will be shuffled and the query will perform better than shuffling the join only.
Note that the shuffle keys can only be join keys in join and group by keys of the summarize.

**Examples**

The following example shows how shuffle join improves performance considerably:

The examples were sampled on a cluster with 10 nodes where the data is spread over all these nodes.

The left table has 15M records where the cardinality of the join key is ~14M, The right side of the join is with 150M records and the cardinality of the join key is 10M.

Running the regular strategy of the join, the query ends after ~28 seconds and the memory usage peak is 1.43GB :

<!-- csl-->
```
customer
| join
    orders
on $left.c-custkey == $right.o-custkey
| summarize sum(c-acctbal) by c-nationkey

```

While using shuffle join strategy, the query ends after ~4 seconds and the memory usage peak is 0.3GB :

<!-- csl-->
```
customer
| join
    hint.strategy = shuffle orders
on $left.c-custkey == $right.o-custkey
| summarize sum(c-acctbal) by c-nationkey

```

Trying the same queries on a larger dataset where left side of the join is 150M and the cardinality of the key is 148M, Right side of the join is 1.5B and the cardinality of the key is ~100M :

The query with the default join strategy hits kusto limits and timesout after 4 mins.

While using shuffle join strategy, the query ends after ~34 seconds and the memory usage peak is 1.23GB.

<!--###In shuffle query, the default partitions number is the cluster nodes number. This number can be overriden by using the syntax `hint.partitions = total-partitions` which will control the number of partitions.

This hint is useful when the cluster has a small number of cluster nodes where the default partitions number will be small too and the query still fails or takes long execution time.

** Examples **

The following example shows the improvement on a cluster which has 2 cluster nodes, the table has 60M records and the cardinality of the join key is 2M.

Running the query without the hint will use only 2 partitions (as cluster nodes number) and the following query will take ~1:10 mins :

<!-- csl -->
<!--###```
lineitem
| summarize dcount(l-comment), dcount(l-shipdate) by l-partkey
| join
    hint.shufflekey = l-partkey   part
on $left.l-partkey == $right.p-partkey
| consume

```

setting partitions number to 10, the query will end after 23 seconds: 

<!-- csl -->
<!--###```
lineitem
| summarize dcount(l-comment), dcount(l-shipdate) by l-partkey
| join
    hint.shufflekey = l-partkey  hint.partitions = 10    part
on $left.l-partkey == $right.p-partkey
| consume

```

Please note that setting many partitions may degrade performance and consume more cluster resources so it is recommended to choose the partitions number carefully (starting with the hint.strategy = shuffle and start increasing the partitions gradually).-->

