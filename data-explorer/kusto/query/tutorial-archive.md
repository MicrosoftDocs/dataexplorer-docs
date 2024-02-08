---
title: 'Tutorial: Kusto Queries Archive'
description: This archive tutorial describes how to use queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
---

# Tutorial: Use Kusto queries archive

This article provides a tutorial to help you learn about the [Kusto Query Language](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/).

Refer to this [sample database](https://help.kusto.windows.net/Samples) for the queries that are demonstrated below.

*Syntax note*: A query is a data source (usually a table name), optionally followed by one or more pairs of the pipe character and some tabular operator. Learn more about common [syntax conventions](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/syntax-conventions).

## Count rows

The sample database has a table called `StormEvents`, which provides information about storms that happened in the United States.
To find out how large the table is, you'll pipe its content into a [count operator](./count-operator.md) that counts the rows in the table.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Here's the output:

|Count|
|-----|
|59066|

## Select a subset of columns: *project*

Use [project](./project-operator.md) to choose the columns you want to display. 

```kusto
StormEvents
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

## Filter by Boolean expression: *where*

Use [where](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/where-operator) to filter a table to a subset of rows.  

Example:
Show `flood` events in `California` in Feb-2007:

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
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to Western Kern County. Minor flooding was reported across State Highway 166 near Taft.|

## Show *n* rows: *take*

Use [take](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/take-operator) or [limit](./take-operator.md) operators to return up to a specified number of rows, in no particular order.

Example: 
Show a random sample of five rows:

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
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards. The tornado destroyed seven homes, while 27 received major damage, and 81 reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic southeast of Melbourne Beach and briefly moved toward shore.|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|Thunderstorm Wind|MISSISSIPPI|Damage occurred in Eastern Adams county where many large trees were blown down and some fell on power lines.|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|Thunderstorm Wind|GEORGIA|The County dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated around $___.|

## Order results: *sort*, *top*

To view the first *n* rows, ordered by a specific column, use [top](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/top-operator) . 

* *Syntax note*: Some operators have parameters that are introduced by keywords like `by`.
* In the following example, `desc` orders results in descending order and `asc` orders results in ascending order.

Example: 
Show the first five rows, ordered by descending StartTime:

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

You can achieve the same result by using [sort](./sort-operator.md) and then [take](./take-operator.md):

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndTime, EventType, EventNarrative
```

## Compute derived columns: *extend*

Create a new column and append it to the result set using [extend](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/extend-operator).

Let's look at an example where you add a column to view the Duration of the StormEvents, using [scalar expressions](./scalar-data-types/index.md).
:

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

## Aggregate groups of rows: *summarize*

The [summarize](./summarize-operator.md) operator groups together rows that have the same values in the `by` clause. 

It uses an [aggregation function](aggregation-functions.md) (for example, `[count](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/count-operator)') to combine each group in a single row. 

To count the number of events that occurred in each state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize Event_Count = count() by State
```

Use several aggregation functions in one `summarize` operator to produce several computed columns. 

For example, you can find the top five most storm-affected states, including the storm count and the sum of unique types of storms per state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = count(EventType) by State
| top 5 by StormCount desc
```

Here's the output:

|State|StormCount|TypeOfStorms|
|---|---|---|
|TEXAS|4701|27|
|KANSAS|3166|21|
|IOWA|2337|19|
|ILLINOIS|2022|23|
|MISSOURI|2016|20|

In the results of a `summarize` operator:

* Each column is named in `by`.
* Each computed expression has a column.
* Each combination of `by` values has a row.

## Summarize by scalar values

To use scalar (numeric, time, or interval) values in the `by` clause,  you'll want to use the [bin()](./bin-function.md) function:

*Syntax note*: Bin() is the same as the floor() function in many languages. It simply reduces every value to the nearest multiple that you supply, so that [summarize](./summarize-operator.md) can assign the rows to groups.

The below query reduces all timestamps to intervals of one day:

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

## Display a chart or table: *render*

Use the [render operator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/render-operator?pivots=azuredataexplorer) to visualize your data. 

Generally, it's a feature of the client rather than part of the query language, but is still useful for envisioning your results.

Project two columns and use them as the x-axis and the y-axis of a chart:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize Event_Count = count(), Mid = avg(BeginLat) by State 
| sort by Mid
| where Event_Count > 1800
| project State, Event_Count
| render columnchart
```
Although we removed `mid` in the `project` operation, we still need it if we want the chart to display the states in that order.

:::image type="content" source="media/tutorial/event-counts-state.png" alt-text="Screenshot that shows a column chart of storm event counts by state.":::

## Timecharts

To display a time series, use the [bin()](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/bin-function) and [timechart](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/visualization-timechart?pivots=azuredataexplorer) functions:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize Event_Count = count() by bin (StartTime, 1d)
| render timechart
```

:::image type="content" source="media/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

## Multiple series

Use multiple values in a `summarize by` clause to create a separate row for each combination of values:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > DateTime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

:::image type="content" source="media/tutorial/table-count-source.png" alt-text="Screenshot that shows a table count by source.":::

Add `| render timechart` to the previous query to visualize the data. 

:::image type="content" source="media/tutorial/line-count-source.png" alt-text="Screenshot that shows a line chart count by source.":::

Notice that `| render timechart` uses the first column as the x-axis and displays the other columns as separate lines.

## Daily average cycle

To find how StormEvent activity varies over the average day, you'll count events by the time module of one day, binned into hours.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour = bin (StartTime % 1d , 1h)
| summarize Event_Count = count() by hour
| sort by hour asc
| render timechart
```

:::image type="content" source="media/tutorial/time-count-hour.png" alt-text="Screenshot that shows a timechart count by hour.":::

The `render timechart` didn't label durations properly, so you can use `| render columnchart` instead:

:::image type="content" source="media/tutorial/column-count-hour.png" alt-text="Screenshot that shows a column chart count by hour.":::

## Compare multiple daily series

Find how activity varies over the time of day in different states, using the query below:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour = bin (StartTime % 1d , 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize Event_Count = count() by hour, State
| render timechart
```

:::image type="content" source="media/tutorial/time-hour-state.png" alt-text="Screenshot of a timechart by hour and state.":::

To turn the x-axis into an hour number instead of a duration, divide the bin by `1h`:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour = bin (StartTime % 1d , 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize Event_Count = count() by hour, State
| render columnchart
```

:::image type="content" source="media/tutorial/column-hour-state.png" alt-text="Screenshot that shows a column chart by hour and state.":::

## Plot a distribution

You may want to find how many storms are there of different lengths. 

Use [extend](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/extend-operator) to define the storm duration, summarize the count by binning the time intervals, and render a timechart:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend  Duration = EndTime - StartTime
| where Duration > 0s
| where Duration < 3h
| summarize Event_Count = count()
    by bin (Duration, 5m)
| sort by Duration asc
| render timechart
```

:::image type="content" source="media/tutorial/event-count-duration.png" alt-text="Screenshot of timechart results for event count by duration.":::

You can also use `| render columnchart`:

:::image type="content" source="media/tutorial/column-event-count-duration.png" alt-text="Screenshot of a column chart for event count timechart by duration.":::

## Percentiles

[Percentiles](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/percentiles-aggregation-function) can help you find the range of durations in different percentages of storms.

Copy the preceding query from [Plot a distribution](#plot-a-distribution), but replace `render` with:

```kusto
StormEvents
| extend  Duration = EndTime - StartTime
| where Duration > 0s
| where Duration < 3h
| summarize Event_Count = count()
    by bin (Duration, 5m)
| sort by Duration asc
| summarize percentiles (Duration, 5, 20, 50, 80, 95)
```

Since we didn't use a `by` clause, the output is a single row:

:::image type="content" source="media/tutorial/summarize-percentiles-duration.png" lightbox="media/tutorial/summarize-percentiles-duration.png" alt-text="Screenshot of a table of results for summarize percentiles by duration.":::

This shows that:

* 5% of storms lasted less than 5 minutes.
* 20% of storms lasted less than 35 minutes.
* 50% of storms lasted less than 1 hour and 25 minutes.
* 80% of storms lasted less than 2 hours and 20 minutes.
* 95% of storms lasted less than 2 hours and 50 minutes.

To breakdown the results by state, add the `state` to both `summarize` operators:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend  Duration = EndTime - StartTime
| where Duration > 0s
| where Duration < 3h
| summarize Event_Count = count()
    by bin (Duration, 5m), State
| sort by Duration asc
| summarize percentiles (Duration, 5, 20, 50, 80, 95) by State
```

:::image type="content" source="media/tutorial/summarize-percentiles-state.png" alt-text="Table summarize percentiles duration by state.":::

## Percentages

Storms result in injuries, both direct and indirect. 

To calculate the percentage of direct injuries from all injuries, use this query:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where (InjuriesDirect > 0) and (InjuriesIndirect > 0) 
| extend Percentage = (100 * InjuriesDirect / (InjuriesDirect + InjuriesIndirect))
| project StartTime, InjuriesDirect, InjuriesIndirect, Percentage
```

Here's the output. 

|StartTime|InjuriesDirect|InjuriesIndirect|Percentage
|---|---|---|---|
|2007-05-01T16:50:00Z|1|1|50|
|2007-08-10T21:25:00Z|7|2|77|
|2007-08-23T12:05:00Z|7|22|24|
|2007-08-23T14:20:00Z|3|2|60|
|2007-09-10T13:45:00Z|4|1|80|
|2007-12-06T08:30:00Z|3|3|50|
|2007-12-08T12:00:00Z|1|1|50|

*Note*: The query removes zero count entries.

## Join data types

To find two specific event types and the states in which each of them occurred, use a [join](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/join-operator?pivots=azuredataexplorer) operator. 

List the first `EventType`, second `EventType`, and then join the two sets on `State`:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where EventType = "Lightning"
| join (
    StormEvents 
    | where EventType = "Avalanche"
) on State  
| distinct State
```

Here's the output:

:::image type="content" source="media/tutorial/join-events-lightning-avalanche.png" alt-text="Screenshot that shows joining the events lightning and avalanche.":::

### User session example of *join*

This section doesn't use the `StormEvents` table.

Assume you have data that includes events which mark the start and end of each user session with a unique ID.
You may want to find out how long each user session lasts. 

First,  use `project` to select just the relevant columns before you perform the 'join'. 
In the same clause, rename the `timestamp` column.

Use `extend` to provide an alias for the two timestamps, and then compute the session duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
Events
| where EventName = "Session_Started"
| project Start_Time = Timestamp, Stop_Time, Country, Session_ID
| join (Events
    | where EventName = "Session_Ended"
    | project Stop_Time = Timestamp, Country, Session_ID
    ) on Session_ID
| extend Duration = Stop_Time - Start_Time
| project Start_Time, Stop_Time, Country, Duration
| take 10
```
Here's the output: 

:::image type="content" source="media/tutorial/user-session-extend.png" alt-text="Screenshot of a table of results for user session extend.":::

### Assign a result to a variable: *let*

Use [let](./let-statement.md) to separate out the parts of the query expression in the preceding `join` example. The results are unchanged:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let LightningStorms = 
    StormEvents
    | where EventType = "Lightning";
let AvalancheStorms = 
    StormEvents
    | where EventType = "Avalanche";
LightningStorms 
| join (AvalancheStorms) on State
| distinct State
```

> [!TIP]
> To execute the entire query, don't add blank lines between parts of the query.
> Let statements must be followed by a semicolon.

## Combine data from several databases in a query

This section doesn't use the 'StormEvents' table. It details ways to combine data from serveral databases in a query.

In the following query, the `Logs` table must be in your default database:

```kusto
Logs | where ...
```

To access a table in a different database, use the following syntax:

```kusto
database("db").Table
```

For example, if you have databases named `Diagnostics` and `Telemetry` and you want to correlate some of the data in the two tables, you can use the following query (assuming `Diagnostics` is your default database):

```kusto
Logs | join database("Telemetry").Metrics on Request MachineId | ...
```

If your default database is `Telemetry`, use this following [union](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/union-operator?pivots=azuredataexplorer) syntax :

```kusto
union Requests, database("Diagnostics").Logs | ...
```

The preceding two queries assume that both databases are in the cluster you're currently connected to. If the `Telemetry` database was in a cluster named *TelemetryCluster.kusto.windows.net*, to access it, use this query:

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

> [!NOTE]
> When the cluster is specified, the database is mandatory.

For more information about combining data from several databases in a query, see [cross-database queries](cross-cluster-or-database-queries.md).

## Related content

* View code samples for the [Kusto Query Language](samples.md?pivots=azuredataexplorer).
