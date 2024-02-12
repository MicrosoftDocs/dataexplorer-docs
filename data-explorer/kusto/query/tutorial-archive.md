---
title: 'Tutorial: Kusto Queries Archive'
description: This archive tutorial describes how to utilize Kusto Query Language (KQL) effectively to perform common queries.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
---

# Tutorial: Learn Kusto Query Language

One effective way to learn about the Kusto Query Language is to begin with basic KQL queries. This tutorial will demonstrate queries on our [sample databases](https://help.kusto.windows.net/Samples), which are publicly available. We will specifically be using the `StormEvents` table, which contains data about storms that have occurred in the United States. However, you can [create your own free cluster](../../../start-for-free-web-ui.md) to practice KQL queries with your own data, if you prefer.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Count rows]
> * [Select a subset of columns: *Project operator*]
> * [Filter by Boolean expression: *Where*]
> * [Show *N* rows: *Take operator*]
> * [Order results: *Sort* and *top*]
> * [Compute derived columns: *Extend*]
> * [Aggregate groups of rows: *Summarize*]
> * [Summarize by scalar values]
> * [Display a chart or table: *Render*]
> * [Create timecharts]
> * [Utilize multiple series]
> * [Calculate daily average cycle]
> * [Compare multiple daily series]
> * [Join data types]
> * [User session example of *Join*]
> * [Plot a distribution]
> * [Determine percentiles]
> * [Calulate percentages of more refined data sets]
> * [Assign a result to a variable: *Let*]
> * [Combine data from several databases in a query]


## Count rows

We begin by finding out how large the `StormEvents` table is. To do this, pipe its content into an operator that counts the table rows in the table.

*Syntax note*: A query is a data source (usually a table name), optionally followed by one or more pairs of the pipe character and a tabular operator of some kind.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

**Output**

|Count|
|-----|
|59066|

For more information on count operators, see [count operator](./count-operator.md) or [count() (aggregation function)].

## Select a subset of columns: *Project operator*

Next, we use the [project operator](./project-operator.md) to select the desired columns. The following example uses both the [project](./project-operator.md)
and the [take](./take-operator.md) operators:

[Insert example here]

## Filter by Boolean expression: *Where*

Let's further refine the results. We'll use the following query to compile data on the `flood` events in `California` that occurred in February, 2007:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

This results in the following output:

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to western Kern County in the early morning hours of the 19th. Minor flooding was reported across State Highway 166 near Taft.|

## Show *N* rows: *Take operator*

Now we will create a random sample of five different storm events using the 'take' operator:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

**Output**

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|Heavy Rain|FLORIDA|As much as 9 inches of rain fell in a 24-hour period across parts of coastal Volusia County.|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic southeast of Melbourne Beach and briefly moved toward shore.|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|Thunderstorm Wind|MISSISSIPPI|Numerous large trees were blown down with some down on power lines. Damage occurred in eastern Adams county.|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|Thunderstorm Wind|GEORGIA|The county dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated.|

> [!NOTE]
> [Limit](./take-operator.md) is an alias for [take](./take-operator.md) and has the same function.

## Order results: *Sort* and *Top*

Because the [take operator](./take-operator.md) presents rows from the table in no particular order, we'll implement the 'sort' function.

* *Syntax note*: Some operators have parameters that are introduced by keywords like `by`. For more examples of this, refer to [Natalie's note: insert example]
* In the following example, `desc` organizes the data in descending order and `asc` in ascending order.

Let's organize the first *N* rows by a specific column:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

**Output**

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
[Natalie's note: Need more information about the benefits of this alternative query to add here.]

## Compute derived columns: *Extend*

We'll now create a new column by computing a value in each row:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| extend Duration = EndTime - StartTime 
| project StartTime, EndTime, Duration, EventType, State
```

**Output**

|StartTime|EndTime|Duration|EventType|State|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|22:00:00|Heavy Rain|FLORIDA|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|00:08:00|Tornado|FLORIDA|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|00:00:00|Waterspout|ATLANTIC SOUTH|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|00:03:00|Thunderstorm Wind|MISSISSIPPI|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|00:05:00|Thunderstorm Wind|GEORGIA|

You can reuse a column name and assign a calculation result to the same column.

Example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print x=1
| extend x = x + 1, y = x
| extend x = x + 1
```

**Output**

|x|y|
|---|---|
|3|1|
[Natalie's note: This example seems to be less fleshed out than the others. If possible, would be better to demonstrate this query with the same data set that we've been using]

[Scalar expressions](./scalar-data-types/index.md) can include all the usual operators (`+`, `-`, `*`, `/`, `%`). There are also a range of useful functions available, such as [Natalie's note: list three of the most relevant examples, then provide a link to the appropriate resource to learn more].

## Aggregate groups of rows: *Summarize*

We'll now use 'summarize' to calculate the number of events that occur in each state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

'Summarize' groups together rows that have the same values in the `by` clause, then uses an aggregation function (like `count`) to combine each group in a single row. In this example, there's a row for each event per state and a column for the amount of rows in that state.

To learn more about this operator, see [summarize operator](./summarize-operator.md).

A range of aggregations functions are available, as described in [aggregation functions](aggregation-functions.md), and several of these functions can be used in one `summarize` operator. Each will produce its own column with the computed data. For this example, we'll retrieve the number of storms per state, and the sum of unique types of storm per state. Then, we could use 'top' [top](./top-operator.md) to find the states with the largest amount of reported storm events:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State
| top 5 by StormCount desc
```

**Output**

|State|StormCount|TypeOfStorms|
|---|---|---|
|TEXAS|4701|27|
|KANSAS|3166|21|
|IOWA|2337|19|
|ILLINOIS|2022|23|
|MISSOURI|2016|20|

The above illustrates the structure of the results of a `summarize` operator, where each

* Column is named in `by`
* Combination of `by` values has a row
* Computed expression has a column

## Summarize by scalar values

Scalar (numeric, time, or interval) values can also be used in the `by` clause, but it's recommended to first organize the values into bins by using the 'bin' function. To illustrate, we'll perform a query that reduces all the timestamps to intervals of one day:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

**Output**

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.0000000|180|
|2007-02-15 00:00:00.0000000|66|
|2007-02-16 00:00:00.0000000|164|
|2007-02-17 00:00:00.0000000|103|
|2007-02-18 00:00:00.0000000|22|
|2007-02-19 00:00:00.0000000|52|
|2007-02-20 00:00:00.0000000|60|

'Bin' is the same as the 'floor()' function in many languages. It [Natalie's note: unclear which function the "it" referring to?] simply reduces every value to the nearest multiple of the modulus that you supply, so that 'summarize' can assign the rows to groups. [Natalie's note: ideal to add more detail on where the floor function would be a better fit]

More about this function can be found in  [bin()](./bin-function.md).

## Display a chart or table: *Render*

Let's now project two columns and use them as the x- and y-axes of a chart:

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

Although we removed `mid` in the `project` operation, it's still necessary in order to display the states in a particular order in the chart.

Strictly speaking, `render` is a feature of the client rather than part of the query language. However, because it is integrated into the language, it helps with envisioning your results. [Natalie's note: This either needs to be fleshed out a little more or removed]

## Create timecharts

Going back to numeric bins, this is one way to display a time series:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="media/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

## Utilize multiple series

Use multiple values in a `summarize by` clause to create a separate row for each combination of values:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

:::image type="content" source="media/tutorial/table-count-source.png" alt-text="Screenshot that shows a table count by source.":::

Using the preceding timechart example, simply add the term `render`: `| render timechart`.

:::image type="content" source="media/tutorial/line-count-source.png" alt-text="Screenshot that shows a line chart count by source.":::

Notice that `render timechart` assigns the the x-axis to the first column then displays the remaining columns as separate lines.

## Calculate daily average cycle

In cases where data fluctuates within a single day, events are calculated according to the 24 hour time modulo and are binned into hours.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour =bin(StartTime % 1d , 1h)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

:::image type="content" source="media/tutorial/time-count-hour.png" alt-text="Screenshot that shows a timechart count by hour.":::

Currently, `render` doesn't label durations properly, possibly because the storm events don't provide a refined enough data set. However, we could use `| render columnchart` instead:

:::image type="content" source="media/tutorial/column-count-hour.png" alt-text="Screenshot that shows a column chart count by hour.":::

## Compare multiple daily series

Now let's create a chart that allows us to see even more details about storm events in a single day. Here, we separate the reported storm events in a single day by state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin( StartTime % 1d , 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render timechart
```

:::image type="content" source="media/tutorial/time-hour-state.png" alt-text="Screenshot of a timechart by hour and state.":::

Divide by `1h` to turn the x-axis into an hour number instead of a duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin( StartTime % 1d , 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render columnchart
```

:::image type="content" source="media/tutorial/column-hour-state.png" alt-text="Screenshot that shows a column chart by hour and state.":::

## Join data types

Say that we'd like to find two specific event types, as well as the state where each of them occurred?

We'll pull storm events with the first `EventType` and the second `EventType`, then join the two sets on `State`:

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

## User session example of *Join*

For the sake of better illustrating the 'join' function, we will be using a different example, rather than the `StormEvents` table.

Assume there is data that includes events marking the start and end of each user session with a unique ID.

Let's calculate how long each user session lasts. Use `extend` to provide an alias for the two timestamps, and then compute the session duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
Events
| where eventName == "session_started"
| project start_time = timestamp, stop_time, country, session_id
| join ( Events
    | where eventName == "session_ended"
    | project stop_time = timestamp, session_id
    ) on session_id
| extend duration = stop_time - start_time
| project start_time, stop_time, country, duration
| take 10
```

:::image type="content" source="media/tutorial/user-session-extend.png" alt-text="Screenshot of a table of results for user session extend.":::

We recommend using `project` to select just the relevant columns before performing the join. In the same clause, rename the `timestamp` column.

## Plot a distribution

Returning to the `StormEvents` table, let's find how many storms are there of different lengths:

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

Alternatively, we can use `| render columnchart`:

:::image type="content" source="media/tutorial/column-event-count-duration.png" alt-text="Screenshot of a column chart for event count timechart by duration.":::

## Determine Percentiles

Now let's find the ranges of durations in different percentages of storms. To get this information, use the preceding query from [Plot a distribution](#plot-a-distribution), but replace `render` with:

```kusto
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

In this case, we didn't use a `by` clause, so the output is a single row:

:::image type="content" source="media/tutorial/summarize-percentiles-duration.png" lightbox="media/tutorial/summarize-percentiles-duration.png" alt-text="Screenshot of a table of results for summarize percentiles by duration.":::

We can see from the output that:

* 5% of storms have a duration of less than 5 minutes.
* 50% of storms lasted less than 1 hour and 25 minutes.
* 95% of storms lasted less than 2 hours and 50 minutes.

To get a separate breakdown for each state, use the `state` column separately with both `summarize` operators:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend  duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize event_count = count()
    by bin(duration, 5m), State
| sort by duration asc
| summarize percentiles(duration, 5, 20, 50, 80, 95) by State
```

:::image type="content" source="media/tutorial/summarize-percentiles-state.png" alt-text="Table summarize percentiles duration by state.":::

## Calulate percentages of more refined data sets

We can also use the StormEvents table to calculate the percentage of direct injuries from all injuries reported due to the storms.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where (InjuriesDirect > 0) and (InjuriesIndirect > 0) 
| extend Percentage = (  100 * InjuriesDirect / (InjuriesDirect + InjuriesIndirect) )
| project StartTime, InjuriesDirect, InjuriesIndirect, Percentage
```

The query removes zero count entries:

|StartTime|InjuriesDirect|InjuriesIndirect|Percentage
|---|---|---|---|
|2007-05-01T16:50:00Z|1|1|50|
|2007-08-10T21:25:00Z|7|2|77|
|2007-08-23T12:05:00Z|7|22|24|
|2007-08-23T14:20:00Z|3|2|60|
|2007-09-10T13:45:00Z|4|1|80|
|2007-12-06T08:30:00Z|3|3|50|
|2007-12-08T12:00:00Z|1|1|50|

## Assign a result to a variable: *Let*

`Let` is used to separate out the parts of the query expression in the preceding `Join` example. The end-results are unchanged:

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
Learn more about this in [let statement](./let-statement.md)

> [!TIP]
> In Kusto Explorer: to execute the entire query, don't add blank lines between different statements of the query. Instead, statements must be separated by a semicolon.

## Combine data from several databases in a query

In the following query, the `logs` table must be in your default database:

```kusto
Logs | where ...
```

To access a table in a different database, use the following syntax:

```kusto
database("db").Table
```

For example, if you have databases named `Diagnostics` and `Telemetry` and you want to correlate some of the data in the two tables, you might use the following query (assuming `Diagnostics` is your default database):

```kusto
Logs | join database("Telemetry").Metrics on Request MachineId | ...
```

Use this query if your default database is `Telemetry`:

```kusto
union Requests, database("Diagnostics").Logs | ...
```

The preceding two queries assume that both databases are in the cluster you're currently connected to. If the `Telemetry` database was in a cluster named *TelemetryCluster.kusto.windows.net*, access it using this query:

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

> [!NOTE]
> When the cluster is specified, the database is mandatory.

For more information about combining data from several databases in a query, see [cross-database queries](cross-cluster-or-database-queries.md).

## Related content

* View code samples for the [Kusto Query Language](samples.md?pivots=azuredataexplorer).
[Natalie's note: If this tutorial is part of a progression within the topic of KQL, then provide the next steps in the user's journey]
