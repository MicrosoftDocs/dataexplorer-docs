---
title: range operator - Azure Data Explorer
description: Learn how to use the range operator to generate a single-column table of values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# range operator

Generates a single-column table of values.

Notice that it doesn't have a pipeline input. 

## Syntax

`range` *columnName* `from` *start* `to` *stop* `step` *step*

## Arguments

* *columnName*: The name of the single column in the output table.
* *start*: The smallest value in the output.
* *stop*: The highest value being generated in the output (or a bound
on the highest value, if *step* steps over this value).
* *step*: The difference between two consecutive values.

The arguments must be numeric, date or timespan values. They can't reference the columns of any table. (If you want to compute the range based on an input table, use the range function, maybe with the mv-expand operator.)

## Returns

A table with a single column called *columnName*,
whose values are *start*, *start* `+` *step*, ... up to and until *stop*.

## Example  

A table of midnight at the past seven days. The bin (floor) function reduces each time to the start of the day.

<!-- csl: https://help.kusto.windows.net/Samples -->
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


This example is to demonstrate the ability to parameterize, extend and consume as a table.  
<!-- csl: https://help.kusto.windows.net/Samples -->
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
|MyMonthHour|	MyMonthHourinUnixTime	|DateOnly|	TimeOnly
|---|---|---|---
|2023-02-01 |00:00:00.0000000	|1675209600	|2023-02-01 00:00:00.0000000	| 00:00:00
|2023-02-01 |04:32:02.4000000	|1675225922.4	|2023-02-01 00:00:00.0000000	|04:32:02.4000000
|2023-02-01 |09:04:04.8000000	|1675242244.8	|2023-02-01 00:00:00.0000000	|09:04:04.8000000
|2023-02-01 |13:36:07.2000000	|1675258567.2	|2023-02-01 00:00:00.0000000	|13:36:07.2000000
|...|...|...|...

A table with a single column called `Steps`
whose type is `long` and whose values are `1`, `4`, and `7`.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range Steps from 1 to 8 step 3
```

The next example shows how the `range` operator can be used to create a small, ad-hoc, dimension table that is then used to introduce zeros where the source data has no values.

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
