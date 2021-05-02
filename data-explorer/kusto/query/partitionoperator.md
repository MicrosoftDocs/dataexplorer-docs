---
title: partition operator - Azure Data Explorer
description: This article describes partition operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 05/02/2021
---
# partition operator

The partition operator partitions the records of its input table into multiple sub-tables
according to the values of some column, executes a sub-query over each
sub-table, and produces a single output table that is the union of the results
of all sub-queries.

The partition operator supports two modes of operation: 

* The sub-query is a tabular transformation that doesn't specify a tabular source. The source is implicit and will be
assigned according to the sub-table partitions. 

  ```kusto
  Grades | partition by StudentId (top 2 by Grade)
  ```

* The sub-query must include a tabular source explicitly. Only the key column of the input table is available
in the sub-query, and referenced by using its name in the `toscalar()` function.

  ```kusto
  range x from 1 to 2 step 1 | partition by x {U | extend y=toscalar(x)}
  ```

> [!NOTE]
> In either of the two cases, the sub-query must produce a single tabular result. Multiple tabular results and the use of the `fork` operator are not supported. The sub-query also can't include additional statements, for example, it can't have a `let` statement.

## Syntax

*T* `|` `partition` [*PartitionParameters*] `by` *Column* `(` *TransformationSubQuery* `)`

*T* `|` `partition` [*PartitionParameters*] `by` *Column* `{` *ContextFreeSubQuery* `}`

## Arguments

* *T*: The tabular source whose data is to be processed by the operator.
* *Column*: The name of a column in *T* whose values determine how the input table
  is to be partitioned. See **Notes** below.
* *TransformationSubQuery*: A tabular transformation expression, whose source
  is implicitly the sub-tables produced by partitioning the records of *T*,
  each sub-table being homogenous on the value of *Column*.
* *ContextFreeSubQuery*: A tabular expression which includes its own tabular source, such as a table reference. The expression can reference a single column from *T*, being the key column *Column* using the syntax `toscalar(`*Column*`)`.
* *PartitionParameters*: Zero or more (space-separated) parameters in the form of: <br>
  *Name* `=` *Value* that control the behavior of the operator. The following parameters are supported:

  |Name               |Values         |Description|
  |-------------------|---------------|-----------|
  |`hint.materialized`|`true`,`false` |If set to `true` will materialize the source of the `partition` operator. The default value is `false`.|
  |`hint.concurrency`|*Number*|Hints the system how many partitions to run in parallel. The default value is 16.|
  |`hint.spread`|*Number*|Hints the system how to distribute the partitions among cluster nodes. For example, if there are N partitions and the spread hint is set to P, then the N partitions will be processed by P different cluster nodes equally in parallel/sequentially depending on the concurrency hint. The default value is 1.|

## Returns

The operator returns a union of the results of the individual sub-queries.

> [!NOTE]
> The partition operator is currently limited by the number of partitions.
> Up to 64 distinct partitions may be created.
> The operator will yield an error if the partition column (*Column*) has more than 64 distinct values.

> [!NOTE]
> If the sub-query references the input table explicitly, all references other than the implicit reference will be for the whole table, not just the sub-table. For example, by using the [as operator](asoperator.md) and calling up the value again.

## Example: top-nested case

In some cases, it is more performant and easier to write a query using the `partition` operator than using the [`top-nested` operator](topnestedoperator.md)
The following example runs a sub-query calculating `summarize` and `top` for-each of States starting with `W`: (WYOMING, WASHINGTON, WEST VIRGINIA, WISCONSIN)

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
StormEvents
| where State startswith 'W'
| partition by State 
(
    summarize Events=count(), Injuries=sum(InjuriesDirect) by EventType, State
    | top 3 by Events 
) 

```

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

## Example: query non-overlapping data partitions

It can be useful performance-wise to run a complex sub-query over non-overlapping data partitions in a map/reduce style. The following example shows how to create a manual distribution of aggregation over 10 partitions.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
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

|Source|Count|
|---|---|
|Trained Spotter|12770|
|Law Enforcement|8570|
|Public|6157|
|Emergency Manager|4900|
|COOP Observer|3039|

## Example: query-time partitioning

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

|TotalCount|
|---|
|59066|

## Example: partition-reference

The following example shows how to use the [as operator](asoperator.md) to give a "name" to each data partition and then reuse that name within the sub-query:

```kusto
T
| partition by Dim
(
    as Partition
    | extend MetricPct = Metric * 100.0 / toscalar(Partition | summarize sum(Metric))
)
```

## Example: complex sub-query hidden by a function call

The same technique can be applied with much more complex subqueries. To simplify the syntax, you can wrap the sub-query in a function call:

<!-- csl: https://help.kusto.windows.net:443/Samples -->
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

|Source|Count|
|---|---|
|Trained Spotter|12770|
|Law Enforcement|8570|
|Public|6157|
|Emergency Manager|4900|
|COOP Observer|3039|
