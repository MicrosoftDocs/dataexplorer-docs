---
title:  range operator
description: Learn how to use the range operator to generate a single-column table of values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/07/2025
---
# range operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Generates a single-column table of values.

> [!NOTE]
> This operator doesn't take a tabular input.

## Syntax

`range` *columnName* `from` *start* `to` *stop* `step` *step*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*columnName*| `string` | :heavy_check_mark:| The name of the single column in the output table.|
|*start*|int, long, real, datetime, or timespan| :heavy_check_mark:| The smallest value in the output.|
|*stop*|int, long, real, datetime, or timespan| :heavy_check_mark:| The highest value being generated in the output or a bound on the highest value if *step* steps over this value.|
|*step*|int, long, real, datetime, or timespan| :heavy_check_mark:| The difference between two consecutive values.|

> [!NOTE]
> The values can't reference the columns of any table. If you want to compute the range based on an input table, use the [range](range-function.md) function potentially with the [mv-expand](mv-expand-operator.md) operator.

## Returns

A table with a single column called *columnName*,
whose values are *start*, *start* `+` *step*, ... up to and until *stop*.

## Examples

### Range over the past seven days

The following example creates a table with entries for the current time stamp extended over the past seven days, once a day.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVfBJLC4JT03NVkgrys9VSEzP1zBP0VQoyVfIyy/X0FQoLkktUDBMAQDbz6iXLAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range LastWeek from ago(7d) to now() step 1d
```

**Output**

|LastWeek|
|---|
|2015-12-05 09:10:04.627|
|2015-12-06 09:10:04.627|
|...|
|2015-12-12 09:10:04.627|

### Combine different stop times

The following example shows how to extend ranges to use multiple stop times by using the `union` operator.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEISsxLTzVUsFUoAjEUQjJzUxXSivJzFVISS1JLgDwNIwMjE10DQyDSVCjJxyJuqqlQXJJaoGCYYs2VAzPSiCgjzbAbaWiAZGRpXmZ%2BHtSdOlDDuWoU8otSUosUkioh5icWJwMApY0GNM4AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Range1 = range Time from datetime(2024-01-01) to datetime(2024-01-05) step 1d;
let Range2 = range Time from datetime(2024-01-06) to datetime(2024-01-10) step 1d;
union Range1, Range2
| order by Time asc

```

**Output**

| Time |
|--|
| 2024-01-04 00:00:00.0000000 |
| 2024-01-05 00:00:00.0000000 |
| 2024-01-06 00:00:00.0000000 |
| 2024-01-07 00:00:00.0000000 |
| 2024-01-08 00:00:00.0000000 |
| 2024-01-09 00:00:00.0000000 |
| 2024-01-10 00:00:00.0000000 |

### Range using parameters

The following example shows how to use the `range` operator with parameters, which are then extended and consumed as a table.  

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21QQU7DMBC8+xV7TKSGJCKAIOICHLhUSBQe4OINjUjWlrNRGyh/Zx1a4UpYlizvzNgz0yED21dqdy9tj3ALieEboxlZrimoL1AgS6aQwXGelNdXRVaUstMUcigHUN+16uSt5bS0xJsVa8/y2hBO2/RhlpDdJmlaQ57/wraBGZiFK0Z3N4mkOrs4rzYza3TOekYD4dPBaRpmKpHQLquiKAILnu0W7u1IDE573SP79hPNwU1I1bUUknlN73g0+GhHD423/aljtjC7FOPoDp7UHnDHSCbWthR19ldgElHSBTxIYU/UhVjrlmJwURrBg+SAx76y/9iqjuPswXqDHtbTiVIPbwKx/kBp6Qf2xjgc3AEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let toUnixTime = (dt:datetime) 
{ 
    (dt - datetime(1970-01-01)) / 1s 
};
let MyMonthStart = startofmonth(now()); //Start of month
let StepBy = 4.534h; //Supported timespans
let nn = 64000; // Row Count parametrized
let MyTimeline = range MyMonthHour from MyMonthStart to now() step StepBy
| extend MyMonthHourinUnixTime = toUnixTime(MyMonthHour), DateOnly = bin(MyMonthHour,1d), TimeOnly = MyMonthHour - bin(MyMonthHour,1d)
; MyTimeline | order by MyMonthHour asc | take nn
```

**Output**

| MyMonthHour | MyMonthHourinUnixTime | DateOnly     | TimeOnly                    |
|--------------|------------------------|---------------|------------------------------|
| 2023-02-01  | 00:00:00.0000000      | 1675209600   | 2023-02-01 00:00:00.0000000 |
| 2023-02-01  | 04:32:02.4000000      | 1675225922.4 | 2023-02-01 00:00:00.0000000 |
| 2023-02-01  | 09:04:04.8000000      | 1675242244.8 | 2023-02-01 00:00:00.0000000 |
| 2023-02-01  | 13:36:07.2000000      | 1675258567.2 | 2023-02-01 00:00:00.0000000 |
| ...         | ...                   | ...          | ...                         |

### Incremented steps

The following example creates a table with a single column called `Steps`
whose type is `long` and results in values from one to eight incremented by three.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVQguSS0oVkgrys9VMFQoyVewUCgGiigYAwBtHYQiHgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range Steps from 1 to 8 step 3

| Steps |
|-------|
| 1     |
| 4     |
| 7     |

### Traces over a time range

The following example shows how the `range` operator can be used to create a dimension table that is used to introduce zeros where the source data has no values. It takes timestamps from the last four hours and counts traces for each one minute interval. When there are no traces for a specific interval, the count is zero.

```kusto
range TIMESTAMP from ago(4h) to now() step 1m
| join kind=fullouter
  (Traces
      | where TIMESTAMP > ago(4h)
      | summarize Count=count() by bin(TIMESTAMP, 1m)
  ) on TIMESTAMP
| project Count=iff(isnull(Count), 0, Count), TIMESTAMP
| render timechart  
```
