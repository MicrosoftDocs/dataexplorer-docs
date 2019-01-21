---
title: partition operator - Azure Data Explorer | Microsoft Docs
description: This article describes partition operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 01/11/2019
---
# partition operator

Partitions subquery using specific column. 

```kusto
T | partition by Col1 ( top 10 by MaxValue )
```

**Syntax**

*T* `| partition` [*PartitionParameters*] `by` *Column* `(` *Subquery* `)`

**Arguments**

* *T*: Tabular source of the `partition` operator

* *Column:* Name of the column that will be used for source partitioning. See [Notes](#Notes) for existing limitation on amount of key values used for partitioning.

* *Subquery*: Query that will be applied on each of the source partitions. 

* *PartitionParameters*: Zero or more (space-separated) parameters in the form of: 
  *Name* `=` *Value* that control the behavior
  of the row-match operation and execution plan. The following parameters are supported: 

|Name|Values|Description|
|-------------------|---------------|----------|
|`hint.materialized`|`true`,`false`|If set to `true` will materialize the source of the `partition` operator (default: `false`)|

**Returns**

Returns a union of subquery results after it was run on every partition of the source data.

**Notes**

* At this stage `partition` operator: supports up-to 64 distinct values of the key column. The query will yield an error if this number is exceeded.

**Example: top-nested case**

At some cases - it is more performant and easier to write query using `partition` operator rather using [`top-nested` operator](topnestedoperator.md)
The next example runs a sub-query calculating `summarize` and `top` for-each of States starting with `W`: (WYOMING, WASHINGTON, WEST VIRGINIA, WISCONSIN)

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

**Example: query non-overlapping data partitions**

Sometimes it is useful (perf-wise) to run complex subquery over non-overlapping data partitions (map-reduce style). You can achieve this using `partition` operator. The example below shows how to make manual distribution of aggregation over 10 partitions.

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


Same technique can be applied with much more complex subqueries. Sometimes it is convenient to wrap subquery into a function call and use `invoke` operator as subquery.

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