---
title: partition operator - Azure Data Explorer
description: This article describes partition operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/06/2021
---
# partition operator 

The partition operator partitions the records of its input table into multiple subtables according to values in a key column, runs a subquery on each subtable, and produces a single output table that is the union of the results of all subqueries.

The partition operator supports several strategies, or modes, of subquery operation: 

* Native - use with an implicit data source with thousands of key partition values.
* Shuffle - use with an implicit source with millions of key partition values.
* Legacy - use with an implicit or explicit source for 64 or less key partition values.

**Native mode**

This subquery is a tabular transformation that doesn't specify a tabular source. The source is implicit and is assigned according to the subtable partitions. It should be applied when the number of distinct values of the partition key is not large, roughly in the thousand. Use `hint.strategy=native` for this mode. There is no restriction on the number of partitions.

**Shuffle mode**

This subquery is a tabular transformation that doesn't specify a tabular source. The source is implicit and will be assigned according to the subtable partitions. The mode applies when the number of distinct values of the partition key is large, in the millions. Use `hint.strategy=shuffle` for this mode. There is no restriction on the number of partitions. For more information about shuffle mode and performance, see [shuffle](shufflequery.md).

**Native and shuffle mode operators**

The difference between `hint.strategy=native` and `hint.strategy=shuffle` is mainly to allow the caller to indicate the cardinality and execution mode of the sub-query, and can affect the execution time. There is no other semantic difference
between the two.

For `native` and `shuffle` mode, the source of the sub-query is implicit, and cannot be referenced by the sub-query. This mode supports a limited set of operators: `project`, `sort`, `summarize`, `take`, `top`, `order`, `mv-expand`, `mv-apply`, `make-series`, `limit`, `extend`, `distinct`, `count`, `project-away`, `project-keep`, `project-rename`, `project-reorder`, `parse`, `parse-where`, `reduce`, `sample`, `sample-distinct`, `scan`, `search`, `serialize`, `top-nested`, `top-hitters` and `where`.

Operators like `join`, `union`, `external_data`, `plugins`, or any other operator that involves table source that is not the subtable partitions, are not allowed.

**Legacy mode**

Legacy subqueries can use the following sources:

* Implicit - The source is a tabular transformation that doesn't specify a tabular source. The source is implicit and will be assigned according to the subtable partitions. This applies when there are 64 or less key values. 

* Explicit - The subquery must include a tabular source explicitly. Only the key column of the input table is available in the subquery, and referenced by using its name in the `toscalar()` function.

For both implicit and explicit sources, the subquery type is used for legacy purposes only, and indicated by the use of `hint.strategy=legacy`, or by not including any mode indication. 

Any additional reference to the source is taken to mean the entire input table, for example, by using the [as operator](asoperator.md) and calling up the value again.

> [!NOTE]
> The legacy partition operator is currently limited by the number of partitions.
> The operator will yield an error if the partition column (*Column*) has more than 64 distinct values.

**All modes**

For native, shuffle and legacy subqueries, the result must be a single tabular result. Multiple tabular results and the use of the `fork` operator are not supported. A subquery cannot include additional statements, for example, it can't have a `let` statement.

## Syntax

*T* `|` `partition` [`hint.strategy=` *Mode*] [*PartitionParameters*] `by` *Column* `(` *TransformationSubQuery* `)`

*T* `|` `partition` [*PartitionParameters*] `by` *Column* `{` *ContextFreeSubQuery* `}`

## Arguments

* *T*: The tabular source whose data is to be processed by the operator.
* *Mode*: The partition mode, `native`, `shuffle` or `legacy`. `native` mode is used with an implicit source with thousands of key partition values. `shuffle` mode is used with an implicit source with millions of key partition values. `native` mode is used with an explicit or implicit source with 64 or less key partition values. 
* *Column*: The name of a column in *T* whose values determine how the input table   is to be partitioned. See **Notes** below.
* *TransformationSubQuery*: A tabular transformation expression, whose source is implicitly the subtables produced by partitioning the records of *T*, each subtable being homogenous on the value of *Column*.
* *ContextFreeSubQuery*: A tabular expression that includes its own tabular source, such as a table reference. The expression can reference a single column from *T*, being the key column *Column* using the syntax `toscalar(`*Column*`)`.
* *PartitionParameters*: Zero or more (space-separated) parameters in the form of: <br>
  *Name* `=` *Value* that control the behavior of the operator. The following parameters are supported:

  |Name               |Values         |Description|Native/Shuffle/Legacy Mode|
  |-------------------|---------------|-----------|----------|
  |`hint.strategy`|`legacy`, `shuffle`, `native`|Defines the execution mode of the partition operator.|Native, Shuffle, Legacy|
  |`hint.shufflekey`|the partition key|Runs the partition operator in shuffle mode where the shuffle key is the specified partition key.|Shuffle|
  |`hint.materialized`|`true`,`false` |If set to `true`, will materialize the source of the `partition` operator. The default value is `false`. |Legacy|
  |`hint.concurrency`|*Number*|Hints the system how many partitions to run in parallel. The default value is 16.|Legacy|
  |`hint.spread`|*Number*|Hints the system how to distribute the partitions among cluster nodes. For example, if there are N partitions and the spread hint is set to P, then the N partitions will be processed by P different cluster nodes equally in parallel/sequentially depending on the concurrency hint. The default value is 1.|Legacy|

## Returns

The operator returns a union of the results of the individual subqueries.

## Examples

### Native mode

Use `hint.strategy=native` for this mode. See the following example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where State startswith 'W'
| partition hint.strategy=native by InjuriesDirect (summarize Events=count(), Injuries=sum(InjuriesDirect) by State);
```

**Output** 

|State|Events|Injuries|
|---|---|---|
|WISCONSIN|4|4|
|WYOMING|5|5|
|WEST VIRGINIA|1|1|
|WASHINGTON|2|2|
|WEST VIRGINIA|756|0|
|WYOMING|390|0|
|WASHINGTON|256|0|
|WISCONSIN|1845|0|
|WYOMING|1|4|
|WASHINGTON|1|5|
|WISCONSIN|1|2|
|WASHINGTON|1|2|
|WASHINGTON|1|10|

### Shuffle mode

Use `hint.strategy=shuffle` for this mode. See the following example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| partition hint.strategy=shuffle by EpisodeId
(
    top 3 by DamageProperty
    | project EpisodeId, State, DamageProperty
)
| count
```

**Output** 

|Count|
|---|
|22345|

### Legacy mode with implicit source

This subquery type is used for legacy purposes only, and indicated by the use of `hint.strategy=legacy`  or by not including any mode indication. See the following example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where State contains "West"
| partition hint.strategy=legacy by InjuriesIndirect (summarize Events=count(), Damage=sum(DeathsDirect) by State);
```

**Output** 

|State|Events|Damage|
|---|---|---|
|WEST VIRGINIA|1|10000|
|WEST VIRGINIA|756|4342000|

### Legacy mode with explicit source

This mode is for legacy purposes only, and indicated by the use of `hint.strategy=legacy` or by not including a mode indication at all. See the following example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 2 step 1
| partition hint.strategy=legacy by x { StormEvents | where x == InjuriesIndirect}
| count 
```

**Output** 

|Count|
|---|
|113|

### Top-nested case

In some cases, it is more performant and easier to write a query using the `partition` operator than using the [`top-nested` operator](topnestedoperator.md). The following example runs a subquery calculating `summarize` and `top` for each of States starting with `W`: (WYOMING, WASHINGTON, WEST VIRGINIA, WISCONSIN)

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where State startswith 'W'
| partition by State 
(
    summarize Events=count(), Injuries=sum(InjuriesDirect) by EventType, State
    | top 3 by Events 
) 
```

**Output** 

|EventType|State|Events|Injuries|
|---|---|---|---|
|Hail|WYOMING|108|0|
|High Wind|WYOMING|81|5|
|Winter Storm|WYOMING|72|0|
|Heavy Snow|WASHINGTON|82|0|
|High Wind|WASHINGTON|58|13|
|Wildfire|WASHINGTON|29|0|
|Thunderstorm Wind|WEST VIRGINIA|180|1|
|Hail|WEST VIRGINIA|103|0|
|Winter Weather|WEST VIRGINIA|88|0|
|Thunderstorm Wind|WISCONSIN|416|1|
|Winter Storm|WISCONSIN|310|0|
|Hail|WISCONSIN|303|1|

### Query non-overlapping data partitions

It can be useful performance-wise to run a complex subquery over non-overlapping data partitions in a map/reduce style. The following example shows how to create a manual distribution of aggregation over 10 partitions.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend p = hash(EventId, 10)
| partition by p
(
    summarize Count=count() by Source 
)
| summarize Count=sum(Count) by Source
| top 5 by Count
```

**Output**

|Source|Count|
|---|---|
|Trained Spotter|12770|
|Law Enforcement|8570|
|Public|6157|
|Emergency Manager|4900|
|COOP Observer|3039|

### Query-time partitioning

The following example shows how query can be partitioned into N=10 partitions, where each partition calculates its own Count, and all later summarized into TotalCount.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let N = 10;                 // Number of query-partitions
range p from 0 to N-1 step 1  // 
| partition by p            // Run the sub-query partitioned 
{
    StormEvents 
    | where hash(EventId, N) == toscalar(p) // Use toscalar() to fetch partition key value
    | summarize Count = count()
}
| summarize TotalCount=sum(Count) 
```

**Output**

|TotalCount|
|---|
|59066|

### Partition-reference

The following example shows how to use the [as operator](asoperator.md) to give a "name" to each data partition and then reuse that name within the subquery:

```kusto
T
| partition by Dim
(
    as Partition
    | extend MetricPct = Metric * 100.0 / toscalar(Partition | summarize sum(Metric))
)
```

### Complex subquery hidden by a function call

The same technique can be applied with much more complex subqueries. To simplify the syntax, you can wrap the subquery in a function call:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let partition_function = (T:(Source:string)) 
{
    T
    | summarize Count=count() by Source
};
StormEvents
| extend p = hash(EventId, 10)
| partition by p
(
    invoke partition_function()
)
| summarize Count=sum(Count) by Source
| top 5 by Count
```

**Output**

|Source|Count|
|---|---|
|Trained Spotter|12770|
|Law Enforcement|8570|
|Public|6157|
|Emergency Manager|4900|
|COOP Observer|3039|
