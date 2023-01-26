---
title: sample-distinct operator - Azure Data Explorer
description: Learn how to use the sample-distinct operator to return a column that contains up to the specified number of distinct values of the requested columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/18/2023
---
# sample-distinct operator

Returns a single column that contains up to the specified number of distinct values of the requested column.

The default (and currently only) flavor of the operator tries to return an answer as quickly as possible (rather than trying to make a fair sample)

## Syntax

*T* `| sample-distinct` *NumberOfValues* `of` *ColumnName*

## Arguments

* *NumberOfValues*: The number distinct values of *T* to return. You can specify any numeric expression.

> [!TIP]
> You can sample a population by putting `sample-distinct` in a let statement and later filter it using the `in` operator (see example).
> If you want the top values rather than just a sample, you can use the [top-hitters](tophittersoperator.md) operator.
> If you want to sample data rows (rather than values of a specific column), refer to the [sample operator](sampleoperator.md)

## Examples  

Get 10 distinct values from a population

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | sample-distinct 10 of EpisodeId

```

Sample a population and do further computation without exceeding the query limits in the summarize

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let sampleEpisodes = StormEvents | sample-distinct 10 of EpisodeId;
StormEvents 
| where EpisodeId in (sampleEpisodes) 
| summarize totalInjuries=sum(InjuriesDirect) by EpisodeId
```
