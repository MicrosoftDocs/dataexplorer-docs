---
title: 'Tutorial: Kusto Query Language query overview'
description: This archive tutorial describes how to use queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
---

# Tutorial: Kusto Query Language query overview

Kusto Query Language (KQL) is used to write queries in Azure Data Explorer, Azure Monitor Log Analytics, Azure Sentinel, and more. A query consists of a data source (usually a table name), followed by a function, also known as an operator. This tutorial is an introduction to the common KQL operators used to access, analyze and view your data.

The best way to learn about the KQL is to look at some basic queries to get a sense of the language. In this tutorial we will be using data from the [StormEvents table](https://help.kusto.windows.net/Samples) . The `StormEvents` table in the samples database provides some information about storm events that have taken place in the United States.

In this tutorial, you'll learn how to:

1. [Count rows](#count-rows-count)
2. [Show *n* rows](#show-n-rows-take)
3. [Select a subset of columns](#select-a-subset-of-columns-project)
4. [Filter by condition](#filter-by-condition-where)
5. [Order results](#order-results-top-sort)
6. [Create computed columns](#create-computed-columns-extend)
7. [Aggregate groups of rows](#aggregate-groups-of-rows-summarize)
8. [Summarize by scalar values](#summarize-by-scalar-values-bin)
9. [Display a chart](#display-a-chart-render)
10. [Display timecharts](#display-timecharts)
11. [Aggregate multiple series](#aggregate-multiple-series)
12. [Plot a distribution](#plot-a-distribution)
13. [Join data type](#join-data-types-join)
14. [Calculate percentiles](#calculate-percentiles-percentile)
15. [Calculate percentages](#calculate-percentages-percentage)
16. [Assign a result to a variable](#assign-a-result-to-a-variable-let)
17. [Combine data from multiple tables](#combine-data-from-multiple-tables-join)
18. [Combine data from multiple databases](#combine-data-from-multiple-databases-union)


## Count rows: *count*

In order to find out how many records there are in the `StormEvents` table, we will use the [count](../count-operator.md) operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Output:

|Count|
|-----|
|59066|


## Show *n* rows: *take*

To limit the number of records returned, use the [take](../take-operator.md) operator. This operator returns a specified number of random rows from the table, to give a general sense of the data it contains.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
```

Output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|Heavy Rain|FLORIDA|As much as 9 inches of rain fell in a 24-hour period across parts of coastal Volusia County.|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic southeast of Melbourne Beach and briefly moved toward shore.|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|Thunderstorm Wind|MISSISSIPPI|Numerous large trees were blown down with some down on power lines. Damage occurred in eastern Adams county.|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|Thunderstorm Wind|GEORGIA|The county dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated.|

The [limit](./take-operator.md) operator has the same effect as the [take](./take-operator.md) operator.

## Select a subset of columns: *project*

Use `project` to select select specific columns you want to view. The following example uses both the [project](./project-operator.md)
and the [take](./take-operator.md) operators.
  
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

## Filter by condition: *where*

The [where](../where-operator.md) operator filters rows of data based on certain criteria. Let's see only floo events, which took place in California in Feb-2007:
  
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```  

Output:
There is only one record which fits these criteria.

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to western Kern County in the early morning hours of the 19th. Minor flooding was reported across State Highway 166 near Taft.|

## Order results: *top*, *sort*

The [top](../top-operator.md) or [sort](../sort-operator.md) operators allow you to order the data according to a specified parameter. These operators are introduced by keywords like `by`. In the example, `desc` will order results in descending order. Use `asc` to order results in ascending order.

The [top](../top-operator.md) operator will show the first *n* rows, sorted by a specific column:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|North to northeast winds gusting to around 58 mph were reported in the mountains of Ventura county.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|The Warm Springs RAWS sensor reported northerly winds gusting to 58 mph.|

You can also use the [sort](./sort-operator.md) operator, and then the [take](./take-operator.md) operator to see a random set of ordered records.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndTime, EventType, EventNarrative
```

## Create computed columns: *extend*

The [extend](../extend-operator.md) operator creates calculated columns. Use `extend` to create an additional column with the calculated values for each row.

The following query creates a `Duration` column, calculated as the difference between the `StartTime` and `EndTime`. Use `project` to stipulate the columns you want to view.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| extend Duration = EndTime - StartTime 
| project StartTime, EndTime, Duration, EventType, State
```

Output:

|StartTime|EndTime|Duration|EventType|State|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|22:00:00|Heavy Rain|FLORIDA|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|00:08:00|Tornado|FLORIDA|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|00:00:00|Waterspout|ATLANTIC SOUTH|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|00:03:00|Thunderstorm Wind|MISSISSIPPI|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|00:05:00|Thunderstorm Wind|GEORGIA|

It is also possible to reuse a column name and assign a calculation result to the same column.

## Aggregate groups of rows: *summarize*

[Aggregation functions](../aggregation-functions.md) enable the goruping and combining of data from multiple rows into a summary value. The summary value depends on the chosen function, for example a count, maximum, or average value.

The [summarize](./summarize-operator.md) operator groups together rows that have the same values in the `by` clause, and then uses a function (for example, `count`) to combine each group in a single row. In this example, the output will show a row for each state, and a column giving the number of storm events per state.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

A range of [aggregation functions](aggregation-functions.md) is available. You can use several aggregation functions in one [summarize](./summarize-operator.md) operator to produce several computed columns. For example, we could query the number of storms per state, and the number of unique types of storms per state. Then, we could use `top` to get the most storm-affected states:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State
| top 5 by StormCount desc
```

Output:

|State|StormCount|TypeOfStorms|
|---|---|---|
|TEXAS|4701|27|
|KANSAS|3166|21|
|IOWA|2337|19|
|ILLINOIS|2022|23|
|MISSOURI|2016|20|

In the output table of query containing `summarize`, we see the following:

* Each computed expression has a column.
* Each combination of `by` values has a row.

### Summarize by scalar values: *bin*

To aggregate by numeric, time or interval values, data needs to be grouped into bins using the [bin()](../bin-function.md) function. Using `bin()` gives an understanding of how values are distributed within a certain range and make comparisons between different periods.

The following query counts the number of storms for each day in the week 14-21 February 2007. The function requires a valid [timespan](../scalar-data-types/timespan.md) value, so we use the `1d` query to reduce all the timestamps to intervals of one day.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

Output:

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.0000000|180|
|2007-02-15 00:00:00.0000000|66|
|2007-02-16 00:00:00.0000000|164|
|2007-02-17 00:00:00.0000000|103|
|2007-02-18 00:00:00.0000000|22|
|2007-02-19 00:00:00.0000000|52|
|2007-02-20 00:00:00.0000000|60|

The [bin()](./bin-function.md) operator functions similarly to the floor() function in many programming languages. It rounds every numerical value down to the nearest multiple of the modulus that is stated, so that `summarize` can aggregate the data.

<a name="displaychartortable"></a>

## Display a chart: *render*

Displaying results visually in a chart or graph can help identify patterns, trends, and outliers in your data. This is done using the [render](../render-operator.md) operator.

The following sections of this tutorial will show various examples of how `render` can be used to display results. Let's show the following example in a column chart. Use `project` to select two columns for the x-axis and the y-axis of a chart.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize event_count=count(), mid = avg(BeginLat) by State 
| sort by mid
| where event_count > 1800
| project State, event_count
| render columnchart
```

Output:

:::image type="content" source="media/tutorial/event-counts-state.png" alt-text="Screenshot that shows a column chart of storm event counts by state.":::

Although we removed `mid` in the `project` operation, we still need it if we want the chart to display the states sorted by `mid`.

Strictly speaking, `render` is a feature of the client rather than part of the query language. It is however still integrated into the language as it is useful for graphically displaying results.

## Display timecharts

Another visualisation we can use is a `timechart`, which displays a time series:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

Output:

:::image type="content" source="media/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

## Aggregate multiple series

Using multiple values in a `summarize by` clause, we can create a separate row for each combination. The following example summarizes the number of occurances per source:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

Output:

:::image type="content" source="media/tutorial/table-count-source.png" alt-text="Screenshot that shows a table count by source.":::

By adding the `render` function to the preceding example (`| render timechart`), we can display this in a timechart:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
| render timechart
```

Output:

:::image type="content" source="media/tutorial/line-count-source.png" alt-text="Screenshot that shows a line chart count by source.":::

Note that `render timechart` uses the first column as the x-axis, with the data in the second column displayed as separate lines.

## Plot a distribution

Let's see how many storms are there of different durations, and plot it in a timechart.

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

Output:

:::image type="content" source="media/tutorial/event-count-duration.png" alt-text="Screenshot of timechart results for event count by duration.":::

Or, you can use `| render columnchart`:

:::image type="content" source="media/tutorial/column-event-count-duration.png" alt-text="Screenshot of a column chart for event count timechart by duration.":::

## Daily distribution of events

The following example looks at how activity varies over the day. This is done by calculating the number of storm events per hour (counting events by the time modulus of 1 day (`% 1d`), in hourly breakdowns), and then grouping storm events by the hour of the day in the calculated `hour` column. In the rendered timechart, the x-axis represents time (in hours) and the y-axis represents the count of storm events that started during that hour.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour =bin(StartTime % 1d, 1d)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

Output:

:::image type="content" source="media/tutorial/time-count-hour.png" alt-text="Screenshot that shows a timechart count by hour.":::

We could also use `| render columnchart` as an alternative display:

Output:

:::image type="content" source="media/tutorial/column-count-hour.png" alt-text="Screenshot that shows a column chart count by hour.":::

## Daily distribution of events by state

Expanding on the previous example, the following example also shows the distribution of storm activity over time, in different states. 

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin(StartTime % 1d, 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| sort by hour asc
| render timechart
```

Output:

:::image type="content" source="media/tutorial/time-hour-state.png" alt-text="Screenshot of a timechart by hour and state.":::

We can also turn the x-axis into a numerical representation of the hour, by dividing by 1h:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin(StartTime % 1d, 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render columnchart
```

Output:

:::image type="content" source="media/tutorial/column-hour-state.png" alt-text="Screenshot that shows a column chart by hour and state.":::

## Join data types: *join*

Let's look for two specific event types, and in which state each of them happened.

The following example finds states where both lightning events and avalanche events have occurred, and returns a list of distinct states meeting this criteria.

You can pull storm events with the first `EventType` and the second `EventType`, and then join the two sets on `State`:

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
Output:

:::image type="content" source="media/tutorial/join-events-lightning-avalanche.png" alt-text="Screenshot that shows joining the events lightning and avalanche.":::

## User session example of *join*

This section doesn't use the `StormEvents` table. 

Let's look at a sample table called `Events`. It gives data including events which mark the start and end of user sessions, where each session has a unique ID. 

Let's calculate the duration of each user session, using `extend` to provide an alias for the two timestamps.

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

Output:

:::image type="content" source="media/tutorial/user-session-extend.png" alt-text="Screenshot of a table of results for user session extend.":::

It's a good practice to use `project` to select just the relevant columns before you perform the join, and i this case renaming the `timestamp` column in the same clause.

## Calculate percentiles: *percentile*

Let's look at the ranges of durations we find in different percentages of storms, using the preceding query from  [Plot a distribution](#plot-a-distribution).

To get this information, use the preceding query from [Plot a distribution](#plot-a-distribution), but replace `render` with:

```kusto
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

The query will look like this:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend  duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize event_count = count()
    by bin(duration, 5m)
| sort by duration asc
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

Output:

In this case, the output is a single row:

:::image type="content" source="media/tutorial/summarize-percentiles-duration.png" lightbox="media/tutorial/summarize-percentiles-duration.png" alt-text="Screenshot of a table of results for summarize percentiles by duration.":::

We can see from the output that:

* 5% of storms have a duration of less than 5 minutes.
* 50% of storms lasted less than 1 hour and 25 minutes.
* 95% of storms lasted less than 2 hours and 50 minutes.

To get a breakdown per state, use the `state` column separately with both [summarize](./summarize-operator.md) operators:

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

Output:

:::image type="content" source="media/tutorial/summarize-percentiles-state.png" alt-text="Table summarize percentiles duration by state.":::

## Calcuate percentages: *percentage*

Using the `StormEvents` table, we can calculate the number of direct injuries as a percentage of all (total) injuries. 

In summary, this query filters storm events where both direct and indirect injuries are reported (zero count entries are rmeoved). It then calculates the percentage of injuries that are direct, and presents the results against the start time of the storm event.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where (InjuriesDirect > 0) and (InjuriesIndirect > 0) 
| extend Percentage = (  100 * InjuriesDirect / (InjuriesDirect + InjuriesIndirect) )
| project StartTime, InjuriesDirect, InjuriesIndirect, Percentage
```

Output:

|StartTime|InjuriesDirect|InjuriesIndirect|Percentage
|---|---|---|---|
|2007-05-01T16:50:00Z|1|1|50|
|2007-08-10T21:25:00Z|7|2|77|
|2007-08-23T12:05:00Z|7|22|24|
|2007-08-23T14:20:00Z|3|2|60|
|2007-09-10T13:45:00Z|4|1|80|
|2007-12-06T08:30:00Z|3|3|50|
|2007-12-08T12:00:00Z|1|1|50|

## Assign a result to a variable: *let*

Use [let](./let-statement.md) to separate out the parts of the query expression in the preceding example in [Join data type](#join-data-type-join). The results are unchanged:

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

Output:

{insert output table}

> [!TIP]
> To execute the entire query, do not add blank lines between parts of the query. Any two statements must be separated by a semicolon.

## Combine data from multiple tables: *join*

Joining data from multiple tables within a database allows us to combine information from different sources and create new relationships between data points. The [join](../join-operator.md) operator is used to combine data across tables.

There are two tables in the [Samples database](https://dataexplorer.azure.com/clusters/help/databases/Samples) related to storm events. One is called `StormEvents` and the other is called `PopulationData`. In this section, you'll join the tables to perform data analysis that wouldn't be possible with one table alone.

Both tables contain a `State` column. The `StormEvents` table has many more columns, and the `PopulationData` has only one other column that contains the population of the given state.

We can join the `PopulationData` table with `StormEvents` on the common `State` column, to find the total property damage caused by storms per capita, by state:

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=innerunique PopulationData on State
| project State, PropertyDamagePerCapita = PropertyDamage / Population
| sort by PropertyDamagePerCapita
```

Output:

{insert output table}

Add `| render columnchart` to the query to visualize the result.

{insert output chart}

:::image type="content" source="../media/kql-tutorials/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

> [!TIP]
> There are many types of joins that you can perform with the `join` operator. See a [list of join flavors](../join-operator.md#returns).

## Combine data from multiple databases: *union*

Combining data from several databases typically involves using the `union` operator, which combines the results of two or more queries into a single result set.

In this example, the `Logs` table must be in your default database:

```kusto
Logs | where ...
```

To access a table in a different database, use the following syntax:

```kusto
database("db").Table
```

For example, let's say you have databases named `Diagnostics` (the query assumes this is the default database) and `Telemetry`, and you want to correlate some of the data in the two tables. Y could do this using the following query:

```kusto
Logs | join database("Telemetry").Metrics on Request MachineId | ...
```

If `Telemetry` is your default database, your query would look like this:

```kusto
union Requests, database("Diagnostics").Logs | ...
```

The preceding two queries assume that both databases are in the cluster you're currently connected to. If the `Telemetry` database was in a cluster named *TelemetryCluster.kusto.windows.net*, to access it, use this query:

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

For more information about combining data from several databases in a query, see [cross-database queries](cross-cluster-or-database-queries.md).

## Related content

* View the [KQL Quick Reference Guide](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/kql-quick-reference)
* View [code samples](samples.md?pivots=azuredataexplorer) for the Kusto Query Language.

