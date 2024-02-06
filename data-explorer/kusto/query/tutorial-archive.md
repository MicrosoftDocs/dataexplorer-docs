---
title: 'Tutorial: Kusto queries archive'
description: This archive tutorial describes how to use queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
---

# Tutorial: Mastering Essential Kusto Query Language Operators

The best way to learn about the Kusto Query Language is to look at some basic queries to get a "feel" for how it works. In this tutorial, we will explore common Kusto operators using the Data Exoplorer [example database](https://help.kusto.windows.net/Samples). We will use the `StormEvents` dataset, which provides information about storms that occured in the US.

## Count rows

Use the [count](./count-operator.md) operator to determine the size of the StormEvents table.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Here's the output:

|Count|
|-----|
|59066|

## Select a Subset of Columns

Use the [project](./project-operator.md) operator to select specific columns. This example focuses on StartTime, EndTime, State, EventType, and EpisodeNarrative.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

## Filter by Boolean Expression

Retrieve flood events in California in Feb-2007 using the [where](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/where-operator) operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

Here's the output:

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to western Kern County in the early morning hours of the 19th. Minor flooding was reported across State Highway 166 near Taft.|

## Show *n* Rows

Utilize the [take](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/take-operator) operator to display a random sample of five rows.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Here's the output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|Heavy Rain|FLORIDA|As much as 9 inches of rain fell in a 24-hour period across parts of coastal Volusia County.|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic southeast of Melbourne Beach and briefly moved toward shore.|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|Thunderstorm Wind|MISSISSIPPI|Numerous large trees were blown down with some down on power lines. Damage occurred in eastern Adams county.|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|Thunderstorm Wind|GEORGIA|The county dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated.|

## Order Results: 

Sort and display the top 5 rows based on `StartTime` in descending order using the [top](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/top-operator) and [sort](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/sort-operator) operators.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Here's the output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|North to northeast winds gusting to around 58 mph were reported in the mountains of Ventura county.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|The Warm Springs RAWS sensor reported northerly winds gusting to 58 mph.|

You can achieve the same result by using [sort](./sort-operator.md), and then [take](./take-operator.md):

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndTime, EventType, EventNarrative
```

## Compute Derived Columns

Extend your analysis by creating new columns, like `Duration`, using the [extend](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/extend-operator) operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| extend Duration = EndTime - StartTime 
| project StartTime, EndTime, Duration, EventType, State
```

Here's the output:

|StartTime|EndTime|Duration|EventType|State|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|22:00:00|Heavy Rain|FLORIDA|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|00:08:00|Tornado|FLORIDA|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|00:00:00|Waterspout|ATLANTIC SOUTH|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|00:03:00|Thunderstorm Wind|MISSISSIPPI|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|00:05:00|Thunderstorm Wind|GEORGIA|


## Aggregate Groups of Rows

Summarize and count events per state with the [summarize](./summarize-operator.md) operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

For more information, see [aggregation functions](aggregation-functions.md).

## Summarize by Scalar Values

You can use scalar (numeric, time, or interval) values in the `by` clause by putting the values into bins, using the [bin()](./bin-function.md) function.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

Here's the output:

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.0000000|180|
|2007-02-15 00:00:00.0000000|66|
|2007-02-16 00:00:00.0000000|164|
|2007-02-17 00:00:00.0000000|103|
|2007-02-18 00:00:00.0000000|22|
|2007-02-19 00:00:00.0000000|52|
|2007-02-20 00:00:00.0000000|60|

<a name="displaychartortable"></a>

## Display a Chart or Table

You can use [render](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/render-operator?pivots=azuredataexplorer) to project two columns and use them as the x-axis and the y-axis of a chart.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize event_count=count(), mid = avg(BeginLat) by State 
| sort by mid
| where event_count > 1800
| project State, event_count
| render columnchart
```

:::image type="content" source="media/tutorial/event-counts-state.png" alt-text="Screenshot that shows a column chart of storm event counts by state.":::

While we excluded mid from the project operation, it's still required for maintaining the order of states in the chart.

## Display a Timechart

Use the [timechart](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/visualization-timechart?pivots=azuredataexplorer) feature visualize event counts over time with a line chart.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="media/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

## Join Data Types

Find states where both lightning and avalanche events occurred using the [join](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/join-operator?pivots=azuredataexplorer) operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where EventType == "Lightning"
| join (
    StormEvents 
    | where EventType == "Avalanche"
) on State  
| distinct State
```

:::image type="content" source="media/tutorial/join-events-lightning-avalanche.png" alt-text="Screenshot that shows joining the events lightning and avalanche.":::

## Plot a Distribution

Visualize event counts based on event duration.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend  duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize event_count = count()
    by bin(duration, 5m)
| sort by duration asc
| render timechart
```

:::image type="content" source="media/tutorial/event-count-duration.png" alt-text="Screenshot of timechart results for event count by duration.":::

Or, you can use `| render columnchart`:

:::image type="content" source="media/tutorial/column-event-count-duration.png" alt-text="Screenshot of a column chart for event count timechart by duration.":::

## Assign a Result to a Variable: 

Use [let](./let-statement.md) to separate out the parts of the query expression in the preceding `join` example. The results are unchanged:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let LightningStorms = 
    StormEvents
    | where EventType == "Lightning";
let AvalancheStorms = 
    StormEvents
    | where EventType == "Avalanche";
LightningStorms 
| join (AvalancheStorms) on State
| distinct State
```

> [!TIP]
> In Kusto Explorer, don't add blank lines between parts of the query.
> Any two statements must be separated by a semicolon.

## Related Content

* Learn how to [join data from multiple tables](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/tutorials/join-data-from-multiple-tables).
