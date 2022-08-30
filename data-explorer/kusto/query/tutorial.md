---
title: 'Tutorial: Kusto queries'
description: This tutorial describes how to use queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---

# Tutorial: Use Kusto queries

::: zone pivot="azuredataexplorer"

The best way to learn about the Kusto Query Language is to look at some basic queries to get a feel for the language. Follow along in this tutorial by running the example queries on this [database with sample data](https://help.kusto.windows.net/Samples). We will mostly use the `StormEvents` table, which provides information about past storms in the United States.

## Learn common operators

A Kusto query consists of a data source (usually a table name) followed by one or more pairs of the pipe character (`|`) and some tabular operator. This section reviews some of the common [query operators](queries.md).

### count 

[count](./countoperator.md): returns the number of rows in the table.

Let's use the [count](./countoperator.md) operator to check the size of the `StormEvents` table:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Here's the output:

|Count|
|-----|
|59066|

### project

[project](./projectoperator.md): selects a subset of columns.

Use the [project](./projectoperator.md) operator to pick the columns you want to include in the query result. See the following example, which uses both the [project](./projectoperator.md)
and the [take](./takeoperator.md) operators.

### take 

[take](./takeoperator.md): shows *n* rows.

Let's see some data. Here is what's in a random sample of five rows:

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

But [take](./takeoperator.md) shows rows from the table in no particular order, so let's sort them.

> [!NOTE]
> [limit](./takeoperator.md) is an alias for [take](./takeoperator.md) and has the same effect.

### top

[top](./topoperator.md): shows *n* rows ordered by given column.

Indicate the column to base the ordering on with the `by` keyword. Then, specify whether to order in ascending order (`asc`) or descending order (`desc`).

Show the first *n* rows, ordered by the StartTime column:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Here's the output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|North to northeast winds gusting to around 58 mph were reported in the mountains of Ventura county.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|The Warm Springs RAWS sensor reported northerly winds gusting to 58 mph.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|

### sort

[sort](./sortoperator.md): orders results by the given column.

Achieve the same result as above by using [sort](./sortoperator.md) followed by [take](./takeoperator.md):

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative
```

### where

[where](./whereoperator.md): filters by Boolean expression.

Let's see only `flood` events in `California` in Feb-2007:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime >= datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

Here's the output:

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to western Kern County in the early morning hours of the 19th. Minor flooding was reported across State Highway 166 near Taft.|


### extend

[extend](./extendoperator.md): computes derived columns.

Create a new column by computing a value in every row:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| limit 5
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

It's possible to reuse a column name and assign a calculation result to the same column.

Example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print x=1
| extend x = x + 1, y = x
| extend x = x + 1
```

Here's the output:

|x|y|
|---|---|
|3|1|

[Scalar expressions](./scalar-data-types/index.md) can include all the usual operators (`+`, `-`, `*`, `/`, `%`), and a range of useful functions are available.

### summarize

[summarize](./summarizeoperator.md): produces a table that aggregates the content of the input table.

Count the number of events that occur in each state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

[summarize](./summarizeoperator.md) groups together rows that have the same values in the `by` clause, and then it uses an aggregation function (for example, `count`) to combine each group in a single row. 
In this case, there's a row for each state and a column for the count of rows in that state.

A range of [aggregation functions](aggregation-functions.md) are available. Use several aggregation functions in one `summarize` operator to produce several computed columns. For example, get the count of storms per state and the sum of unique types of storm per state. Then, use [top](./topoperator.md) to get the most storm-affected states:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State
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

### render

[render](./renderoperator.md): displays various types of charts and tables.

Strictly speaking, `render` is a feature of the client rather than part of the query language. Still, it's integrated into the language, and it's useful for envisioning your results.

Project two columns and use them as the x-axis and the y-axis of a chart:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize event_count=count(), mid = avg(BeginLat) by State 
| sort by mid
| where event_count > 1800
| project State, event_count
| render columnchart
```

:::image type="content" source="images/tutorial/event-counts-state.png" alt-text="Screenshot that shows a column chart of storm event counts by state.":::

We did not include `mid` in the `project` operation. This way the `mid` data is not visually represented in the chart, yet we still display the states in order based on their `mid` values.

## Aggregate by scalar values

When aggregating by scalar values, like numbers and time values, use the [bin()](./binfunction.md) function to group rows into distinct sets of data.

### bin()

[bin()](./binfunction.md): rounds values down to an integer multiple of a given bin size.

The following query determines the storm event count per day.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

The query reduces all the timestamps to intervals of one day:

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.0000000|180|
|2007-02-15 00:00:00.0000000|66|
|2007-02-16 00:00:00.0000000|164|
|2007-02-17 00:00:00.0000000|103|
|2007-02-18 00:00:00.0000000|22|
|2007-02-19 00:00:00.0000000|52|
|2007-02-20 00:00:00.0000000|60|

The [bin()](./binfunction.md) function is the same as the [floor()](./floorfunction.md) function in many languages. It simply reduces every value to the nearest multiple of the modulus that you supply. This allows [summarize](./summarizeoperator.md) to assign the rows to groups.

<a name="displaychartortable"></a>

## Visualize time series data

This section uses our knowledge of [summarize](#summarize), [render](#render), and bin()](#bin())  to display various types of time series.

Let's start with a simple timechart of event count by StartTime:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="images/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

### Multiple series

Use multiple values in a `summarize by` clause to create a separate row for each combination of values:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

:::image type="content" source="images/tutorial/table-count-source.png" alt-text="Screenshot that shows a table count by source.":::

Just add the `render` term to the preceding example: `| render timechart`.

:::image type="content" source="images/tutorial/line-count-source.png" alt-text="Screenshot that shows a line chart count by source.":::

Notice that `render timechart` uses the first column as the x-axis, and then displays the other columns as separate lines.

### Daily average cycle

Let's explore how activity varies over the average day.

Count events by the time modulo one day, binned into hours. Here, we use `floor` instead of `bin`:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour = floor(StartTime % 1d , 1h)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

:::image type="content" source="images/tutorial/time-count-hour.png" alt-text="Screenshot that shows a timechart count by hour.":::

Currently, `render` doesn't label durations properly, but we could use `| render columnchart` instead:

:::image type="content" source="images/tutorial/column-count-hour.png" alt-text="Screenshot that shows a column chart count by hour.":::

### Compare multiple daily series

The following query shows how storm activity varies over the time of day in different states.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= floor( StartTime % 1d , 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render timechart
```

:::image type="content" source="images/tutorial/time-hour-state.png" alt-text="Screenshot of a timechart by hour and state.":::

Divide by `1h` to turn the x-axis into an hour number instead of a duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= floor( StartTime % 1d , 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render columnchart
```

:::image type="content" source="images/tutorial/column-hour-state.png" alt-text="Screenshot that shows a column chart by hour and state.":::

### Plot a distribution

The following query calculates how many storms there are of different lengths.

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

:::image type="content" source="images/tutorial/event-count-duration.png" alt-text="Screenshot of timechart results for event count by duration.":::

Or, use `| render columnchart`:

:::image type="content" source="images/tutorial/column-event-count-duration.png" alt-text="Screenshot of a column chart for event count timechart by duration.":::

### Percentiles

Let's check what ranges of durations we find in different percentages of storms.

To get this information, use the preceding query from [Plot a distribution](#plot-a-distribution), but replace `render` with:

```kusto
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

In this case, we didn't use a `by` clause, so the output is a single row:

:::image type="content" source="images/tutorial/summarize-percentiles-duration.png" lightbox="images/tutorial/summarize-percentiles-duration.png" alt-text="Screenshot of a table of results for summarize percentiles by duration.":::

The output shows that:

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

:::image type="content" source="images/tutorial/summarize-percentiles-state.png" alt-text="Table summarize percentiles duration by state.":::

### Percentages

Using the StormEvents table, calculate the percentage of direct injuries from all injuries:

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

## Join data from two tables

This section covers how to join data across tables.

[join](joinoperator.md): merges the rows of two tables by matching values of the specified column(s) from each table.

#### Example: find states with two specific storm events

Find two specific event types and in which state each of them happened by pulling storm events with the first `EventType` and the second `EventType`, and then join the two sets on `State`:

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

:::image type="content" source="images/tutorial/join-events-lightning-avalanche.png" alt-text="Screenshot that shows joining the events lightning and avalanche.":::

#### Example: calculate user session length

This example doesn't use the `StormEvents` table.

Assume you have data that includes events which mark the start and end of each user session with a unique ID.

How would you find out how long each user session lasts?

Use `extend` to provide an alias for the two timestamps, and then compute the session duration:

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

:::image type="content" source="images/tutorial/user-session-extend.png" alt-text="Screenshot of a table of results for user session extend.":::

>[!TIP]
> It's a good practice to use `project` to select just the relevant columns before you perform the join. In the above example, we also rename the `timestamp` column in the same clause.

## Assign a result to a variable

Use [let](./letstatement.md) to make queries easier to read and manage.

[let](./letstatement.md): sets a variable name equal to an expression or a function.

Let's separate out the parts of the query expression in the first `join` example with `let`. The results are unchanged:

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
> In Kusto Explorer, to execute the entire query, don't add blank lines between parts of the query.
> Any two statements must be separated by a semicolon.

## Query across databases

To access a table in a different database, use the following syntax:

```kusto
database("<database name>").<table name>
```

The following examples require the `Logs` table to be in your default database.

Now, let's say we want to correlate data in two databases named `Diagnostics` and `Telemetry`.

If `Diagnostics` is your default database, use the following query:

```kusto
Logs | join database("Telemetry").Metrics on Request MachineId | ...
```

If `Telemetry` is your default database, use the following query:

```kusto
union Requests, database("Diagnostics").Logs | ...
```

The preceding two queries assume that both databases are in the cluster you're currently connected to.

If the database is in a remote cluster, access it using the following syntax:

```kusto
cluster("<cluster name>").database("<database name>").<table name>
```

For instance, if the `Telemetry` database was in a cluster named *TelemetryCluster.kusto.windows.net*, to access it, use this query:

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

> [!NOTE]
> When the cluster is specified, the database is mandatory.

For more information about combining data from several databases in a query, see [cross-database queries](cross-cluster-or-database-queries.md).

## Next steps

* View code samples for the [Kusto Query Language](samples.md?pivots=azuredataexplorer).

::: zone-end

::: zone pivot="azuremonitor"

The best way to learn about the Azure Data Explorer Query Language is to look at some basic queries to get a "feel" for the language. These queries are similar to queries in the Azure Data Explorer tutorial, but use data from common tables in an Azure Log Analytics workspace.

Run these queries by using Log Analytics in the Azure portal. Log Analytics is a tool you can use to write log queries. Use log data in Azure Monitor, and then evaluate log query results. If you aren't familiar with Log Analytics, complete the [Log Analytics tutorial](/azure/azure-monitor/log-query/log-analytics-tutorial).

>[!NOTE]
> Because the data in the demo environment isn't static, the results of your queries might vary slightly from the results shown here.

## Learn common operators 

A Kusto query consists of a data source (usually a table name) followed by one or more pairs of the pipe character (`|`) and some tabular operator. This section reviews some of the common [query operators](queries.md).

### count

[count](./countoperator.md): returns the number of rows in the table.

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's collected by insights such as Azure Monitor for VMs and Azure Monitor for containers.

Let's use the [count](./countoperator.md) operator to check the size of the `InsightsMetrics` table:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
InsightsMetrics | count
```

Here's the output:

|Count|
|-----|
|1,263,191|

## where

[where](./whereoperator.md): filters by Boolean expression.

The [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity) table has entries from the Azure activity log, which provides insight into subscription-level or management group-level events occuring in Azure. 

Let's see only `Critical` entries during a specific week:

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
```

> [!TIP]
> In addition to specifying a filter in your query by using the `TimeGenerated` column, you can specify the time range in Log Analytics. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope).

The above example uses multiple commands. First, the query retrieves all records for the table. Then, it filters the data for only records that are in the time range. Finally, it filters those results for only records that have a `Critical` level.

:::image type="content" source="images/tutorial/azure-monitor-where-results.png" lightbox="images/tutorial/azure-monitor-where-results.png" alt-text="Screenshot that shows the results of the where operator example.":::

## project

[project](./projectoperator.md): selects a subset of columns.

Use the [project](./projectoperator.md) operator to pick the columns you want to include in the query result. Building on the preceding example, let's limit the output to certain columns:

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
| project TimeGenerated, Level, OperationNameValue, ResourceGroup, _ResourceId
```

:::image type="content" source="images/tutorial/azure-monitor-project-results.png" lightbox="images/tutorial/azure-monitor-project-results.png" alt-text="Screenshot that shows the results of the project operator example.":::

## take

[take](./takeoperator.md): shows *n* rows.

The [NetworkMonitoring](/azure/azure-monitor/reference/tables/networkmonitoring) table contains monitoring data for Azure virtual networks.  

Let's use the [take](./takeoperator.md) operator to look at 10 random sample rows in that table. 

```kusto
NetworkMonitoring
| take 10
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="images/tutorial/azure-monitor-take-results.png" lightbox="images/tutorial/azure-monitor-take-results.png" alt-text="Screenshot that shows the results of the take operator example.":::

But [take](./takeoperator.md) shows rows from the table in no particular order, so let's sort them.

### sort

[sort](./sortoperator.md): orders results by the given column.

Instead of random records, let's return the latest five records by first sorting by time:

```kusto
NetworkMonitoring
| sort by TimeGenerated desc
| take 5
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

### top 

Achieve the same result as the previous `sort` example by using the [top](./topoperator.md) operator:

```kusto
NetworkMonitoring
| top 5 by TimeGenerated desc
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="images/tutorial/azure-monitor-top-results.png" lightbox="images/tutorial/azure-monitor-top-results.png" alt-text="Screenshot that shows the results of the top operator example.":::

### extend

[extend](./extendoperator.md): computes derived columns.

The [extend](./projectoperator.md) operator is similar to [project](./projectoperator.md), but it adds to the set of columns instead of replacing them. Use both operators to create a new column based on a computation on each row.

The [Perf](/azure/azure-monitor/reference/tables/perf) table has performance data that's collected from virtual machines that run the Log Analytics agent.

```kusto
Perf
| where ObjectName == "LogicalDisk" and CounterName == "Free Megabytes"
| project TimeGenerated, Computer, FreeMegabytes = CounterValue
| extend FreeGigabytes = FreeMegabytes / 1000
```

:::image type="content" source="images/tutorial/azure-monitor-extend-results.png" lightbox="images/tutorial/azure-monitor-extend-results.png" alt-text="Screenshot that shows the results of the extend operator example.":::

### summarize

[summarize](./summarizeoperator.md): produces a table that aggregates the content of the input table.

The [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent) table contains security events like logons and processes that started on monitored computers. Count how many events of each level occurred on each computer: 

```kusto
SecurityEvent
| summarize count() by Computer, Level
```

The [summarize](./summarizeoperator.md) operator groups together rows that have the same values in the `by` clause. Then, it uses an aggregation function like `count` to combine each group in a single row. A range of [aggregation functions](aggregation-functions.md) are available. Use several aggregation functions in one `summarize` operator to produce several computed columns.

:::image type="content" source="images/tutorial/azure-monitor-summarize-count-results.png" lightbox="images/tutorial/azure-monitor-summarize-count-results.png" alt-text="Screenshot that shows the results of the summarize count operator example.":::

## Aggregate by scalar values

When aggregating by scalar values, like numbers and time values, use the [bin()](./binfunction.md) function to group rows into distinct sets of data. 

Otherwise, if you aggregate by `TimeGenerated`, you'll get a row for most time values. The `bin()` function consolidates values per hour or day.

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's organized according to insights from Azure Monitor for VMs and Azure Monitor for containers. 

Show the hourly average processor utilization for multiple computers:

```kusto
InsightsMetrics
| where Computer startswith "DC"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
```

:::image type="content" source="images/tutorial/azure-monitor-summarize-avg-results.png" lightbox="images/tutorial/azure-monitor-summarize-avg-results.png" alt-text="Screenshot that shows the results of the avg operator example.":::

## Visualize time series data

The [render](./renderoperator.md?pivots=azuremonitor) operator specifies how the output of the query is rendered. Log Analytics renders output as a table by default. Select different chart types after you run the query. The `render` operator is useful to include in queries in which a specific chart type usually is preferred.

The following example shows the hourly average processor utilization for a single computer. It renders the output as a timechart.

```kusto
InsightsMetrics
| where Computer == "DC00.NA.contosohotels.com"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

:::image type="content" source="images/tutorial/azure-monitor-render-results.png" lightbox="images/tutorial/azure-monitor-render-results.png" alt-text="Screenshot that shows the results of the render operator example.":::

### Multiple series

If you use multiple values in a `summarize by` clause, the chart displays a separate series for each set of values:

```kusto
InsightsMetrics
| where Computer startswith "DC"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

:::image type="content" source="images/tutorial/azure-monitor-render-multiple-results.png" lightbox="images/tutorial/azure-monitor-render-multiple-results.png" alt-text="Screenshot that shows the results of the render operator with multiple series example.":::

## Join data from two tables

To combine rows from multiple tables in a single result set, use the [join](./joinoperator.md?pivots=azuremonitor) operator. Each table must have a column that has a matching value so that the join understands which rows to match.

[VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) is a table that Azure Monitor uses for VMs to store details about virtual machines that it monitors. [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) contains performance data that's collected from those virtual machines. One value collected in *InsightsMetrics* is available memory, but not the percentage memory that's available. To calculate the percentage, we need the physical memory for each virtual machine. That value is in `VMComputer`.

The following example query uses a join to perform this calculation. The [distinct](./distinctoperator.md) operator is used with `VMComputer` because details are regularly collected from each computer. As result, the table contains multiple rows for each computer. The two tables are joined using the `Computer` column. A row is created in the resulting set that includes columns from both tables for each row in `InsightsMetrics`, where the value in `Computer` has the same value in the `Computer` column in `VMComputer`.

```kusto
VMComputer
| distinct Computer, PhysicalMemoryMB
| join kind=inner (
    InsightsMetrics
    | where Namespace == "Memory" and Name == "AvailableMB"
    | project TimeGenerated, Computer, AvailableMemoryMB = Val
) on Computer
| project TimeGenerated, Computer, PercentMemory = AvailableMemoryMB / PhysicalMemoryMB * 100
```

:::image type="content" source="images/tutorial/azure-monitor-join-results.png" lightbox="images/tutorial/azure-monitor-join-results.png" alt-text="Screenshot that shows the results of the join operator example.":::

## Assign a result to a variable

Use [let](./letstatement.md) to make queries easier to read and manage. The [let](./letstatement.md) statement assigns the results of a query to a variable that can be used later. 

Let's rewrite the query in the preceding example with [let](./letstatement.md):

```kusto
let PhysicalComputer = VMComputer
    | distinct Computer, PhysicalMemoryMB;
let AvailableMemory = InsightsMetrics
    | where Namespace == "Memory" and Name == "AvailableMB"
    | project TimeGenerated, Computer, AvailableMemoryMB = Val;
PhysicalComputer
| join kind=inner (AvailableMemory) on Computer
| project TimeGenerated, Computer, PercentMemory = AvailableMemoryMB / PhysicalMemoryMB * 100
```

:::image type="content" source="images/tutorial/azure-monitor-let-results.png" lightbox="images/tutorial/azure-monitor-let-results.png" alt-text="Screenshot that shows the results of the let operator example.":::

## Next steps

* View code samples for the [Kusto Query Language](samples.md?pivots=azuremonitor).

::: zone-end
