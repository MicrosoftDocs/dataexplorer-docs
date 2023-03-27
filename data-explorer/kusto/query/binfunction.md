---
title: bin() - Azure Data Explorer
description: Learn how to use the bin() function to round values down to an integer multiple of a given bin size. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2023
adobe-target: true
---
# bin()

Rounds values down to an integer multiple of a given bin size.

Used frequently in combination with [`summarize by ...`](./summarizeoperator.md).
If you have a scattered set of values, they'll be grouped into a smaller set of specific values.

> The `bin()` and `floor()` functions are equivalent

## Syntax

`bin(`*value*`,`*roundTo*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* |  int, long, real, [timespan](scalar-data-types/timespan.md), or datetime | &check; | The value to round down. |
| *roundTo* |  int, long, real, or [timespan](scalar-data-types/timespan.md) | &check; | The "bin size" that divides *value*. |

## Returns

The nearest multiple of *roundTo* below *value*. Null values, a null bin size, or a negative bin size will result in null.

## Examples

Expression | Result
---|---
`bin(4.5, 1)` | `4.0`
`bin(time(16d), 7d)` | `14d`
`bin(datetime(1970-05-11 13:45:07), 1d)`|  `datetime(1970-05-11)`

The following expression calculates a histogram of durations,
with a bucket size of 1 second:

```kusto
T | summarize Hits=count() by bin(Duration, 1s)
```

## Add null bins to table

When there are rows for bins with no corresponding row in the table, you can "pad" the table with those bins.

```kusto
let StartTime=ago(12h);
let StopTime=now()
T
| where Timestamp > StartTime and Timestamp <= StopTime
| summarize Count=count() by bin(Timestamp, 5m)
| where ...
| union ( // 1
  range x from 1 to 1 step 1 // 2
  | mv-expand Timestamp=range(StartTime, StopTime, 5m) to typeof(datetime) // 3
  | extend Count=0 // 4
  )
| summarize Count=sum(Count) by bin(Timestamp, 5m) // 5
```

Here's a step-by-step explanation of the preceding query:

1. Use the `union` operator to add more rows to a table. Those rows are produced by the `union` expression.
1. The `range` operator produces a table that has a single row and column. The table isn't used for anything other than for `mv-expand` to work on.
1. The `mv-expand` operator over the `range` function creates as many rows as there are five-minute bins between `StartTime` and `EndTime`.
1. Use a `Count` of `0`.
1. The `summarize` operator groups together bins from the original (left, or outer) argument to `union`. The operator also bins from the inner argument to it (the null bin rows). This process ensures that the output has one row per bin whose value is either zero or the original count.