---
Title: 'Tutorial: Kusto Queries Archive'
Description: This archive tutorial describes how to use queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/01/2021
---

# Tutorial: Using Kusto Queries Archive


 The best way to learn about the Kusto Query Language (KQL) is by looking at some basic queries to get a feel for the language itself. We recommend using a database with some sample data, like [Azura Data Explorer](https://help.kusto.windows.net/Samples). The queries that are demonstrated in this tutorial should run on that database. 
Let's get started!

 The best way to learn about the Kusto Query Language (KQL) is by looking at some basic queries to get a feel for the language itself. We recommend using a database with some sample data, like [Azura Data Explorer](https://help.kusto.windows.net/Samples). The queries that are demonstrated in this tutorial should run on that database. 

Here is an example: The `StormEvents` table in the sample database provides information about storms which occured in the United States.

## Count Rows

As stated, our example database has a table called `StormEvents`. We want to find out how large the table is. So, we'll pipe its content into an operator that counts the rows in the table.

*Syntax Note*: A query is a _data source_, usually a table name, optionally followed by one or more pairs of the _pipe character_ and some _tabular operator_.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Here's the output:

|Count|
|-----|
|59066|

For more information, see [count operator](./count-operator.md).

## Select a Subset of Columns: *`project`*

Use [project](./project-operator.md) to pick out only the columns you want. See the following example, which uses both the [project](./project-operator.md)
and the [take](./take-operator.md) operators.

## Filter by Boolean Expression: *`where`*

Let's see only `flood` events in `California` in February of 2007:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

Here's the Output:

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00Z|2007-02-19 08:00:00Z|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to Western Kern County in the early morning hours of February 19th. Minor flooding was reported across State Highway 166 near Taft, CA.|

## Showing *n* Rows: *`take`*

Let's take a look at some data. What's in a random sample of five rows?

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Here's the Output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-09-18 20:00:00Z|2007-09-19 18:00:00.00Z|Heavy Rain|FLORIDA|As much as 9 inches of rain fell in a 24-hour period across parts of coastal Volusia County.|
|2007-09-20 21:57:00Z|2007-09-20 22:05:00.00Z|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00Z|2007-09-29 08:11:00.00Z|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic Ocean, southeast of Melbourne Beach, FL, and briefly moved toward shore.|
|2007-12-20 07:50:00Z|2007-12-20 07:53:00.00Z|Thunderstorm Wind|MISSISSIPPI|Numerous large trees were blown down, some onto power lines. Damage occurred in Eastern Adams county.|
|2007-12-30 16:00:00Z|2007-12-30 16:05:00.00Z|Thunderstorm Wind|GEORGIA|Coffee County Dispatch reported several trees were blown down along Quincey Batten Loop, near State Road 206.|

However, [take](./take-operator.md) shows rows from the table in no particular order, so let's sort them. ([limit](./take-operator.md) is an alias for [take](./take-operator.md) and has the same effect.)

## Organizing Results in Ascending/Descending Order: *`sort`*, *`top`*

* *Syntax note*: Some operators have parameters that are introduced by keywords like `by`.
* In the following example, `desc` orders results in _descending_ order and `asc` orders results in _ascending_ order.

Let's show the first *n* rows, ordered by a specific column:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

Here's the Output:

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-12-31 22:30:00.00Z|2007-12-31 23:59:00.00Z|Winter Storm|MICHIGAN|Heavy snow event which continued into the early morning hours on New Year's Day.|
|2007-12-31 23:53:00.00Z|2007-12-31 23:53:00.00Z|High Wind|CALIFORNIA|North to Northeast winds reported by the Warm Springs, CA Remote Automated Weather Station (RAWS) Sensor around 58 mph in the mountains of Ventura County.|

Note that you can achieve the same result by using  either [sort](./sort-operator.md), and then [take](./take-operator.md):

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndTime, EventType, EventNarrative
```

## Computing Derived Columns: *`extend`*

Create a new column by computing a value in every row:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| extend Duration = EndTime - StartTime 
| project StartTime, EndTime, Duration, EventType, State
```

Here's the Output:

|StartTime|EndTime|Duration|EventType|State|
|---|---|---|---|---|
|2007-09-18 20:00:00.00Z|2007-09-19 18:00:00.00Z|22:00:00|Heavy Rain|FLORIDA|
|2007-09-20 21:57:00.00Z|2007-09-20 22:05:00.00Z|00:08:00|Tornado|FLORIDA|
|2007-09-29 08:11:00.00Z|2007-09-29 08:11:00.00Z|00:00:00|Waterspout|ATLANTIC SOUTH|
|2007-12-20 07:50:00.00Z|2007-12-20 07:53:00.00Z|00:03:00|Thunderstorm Wind|MISSISSIPPI|
|2007-12-30 16:00:00.00Z|2007-12-30 16:05:00.00Z|00:05:00|Thunderstorm Wind|GEORGIA|

It's possible to _reuse_ a column name and assign a calculation result to the same column.

Example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print x=1
| extend x = x + 1, y = x
| extend x = x + 1
```

Here's the Output:

|x|y|
|---|---|
|3|1|

[Scalar Expressions](./scalar-data-types/index.md) can include all the usual operators (`+`, `-`, `*`, `/`, `%`), as well as a range of useful, available functions.

## Aggregating Groups of Rows: *`summarize`*

Here, we can count the number of events occurring in each state:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

[Summarize](./summarize-operator.md) groups together rows that have the same values in the `by` clause, and then uses an aggregation function (for example, `count`) to _combine_ each group in a _single row_. In this case, there's a row for each state and a column for the count of rows in that state.

A range of [aggregation functions](aggregation-functions.md) are available. You can use several aggregation functions in one `summarize` operator to produce several computed columns. For example, we could get the count of storms per state, and the sum of unique types of storm per state. Then, we could use [top](./top-operator.md) to get the most storm-affected states. We can make a list of the five US states heaviest hit by storms, and how many storms each state suffered. 

[!NOTE]
It is 'desc' in the 'by' clause, in descending order. 


<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State
| top 5 by StormCount desc
```

Here's the Output:

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

## Summarizing by Scalar Values

You can use **_scalar_** (numeric, time, or interval) values in the `by` clause, but you'll want to put the values into _bins_ by using the [bin()](./bin-function.md) function:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

The query reduces all the timestamps to intervals of one day:

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.00Z|180|
|2007-02-15 00:00:00.00Z|66|
|2007-02-16 00:00:00.00Z|164|
|2007-02-17 00:00:00.00Z|103|
|2007-02-18 00:00:00.00Z|22|
|2007-02-19 00:00:00.00Z|52|
|2007-02-20 00:00:00.00Z|60|

The [bin()](./bin-function.md) is the same as the floor() function in many languages. It simply reduces every value to the nearest multiple of the modulus that you supply, so that [summarize](./summarize-operator.md) can assign the rows to groups.

<a name="displaychartortable"></a>

## Displaying a Chart or Table: *`render`*

You can project two columns and use them as the _X-axis_ and the _Y-axis_ of a chart:

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

Although we removed `mid` in the `project` operation, we still need it if we want the chart to display the states in that order.

Strictly speaking, `render` is a feature of the client, rather than part of the query language. Still, it's integrated into the language, and it's useful for envisioning your results.

## Timecharts

Going back to _numeric bins_, let's display a **Time Series**:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="media/tutorial/time-series-start-bin.png" alt-text="Screenshot of a line chart of events binned by time.":::

## Multiple Series

Use _multiple values_ in a `summarize by` clause to create a _separate row_ for each combination of values:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

:::image type="content" source="media/tutorial/table-count-source.png" alt-text="Screenshot that shows a table count by source.":::

Now, add the `render` term to the preceding example: `| render timechart`.

:::image type="content" source="media/tutorial/line-count-source.png" alt-text="Screenshot that shows a line chart count by source.":::

[!NOTE]
`Render timechart` uses the first column as the _X-axis_, and then displays the other columns as _separate lines_.

## Daily Average Cycle

You can also track how activity varies over an average day.

Here, we count events by a time module of one day, binned into hours.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour =bin(StartTime % 1d , 1h)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

:::image type="content" source="media/tutorial/time-count-hour.png" alt-text="Screenshot that shows a timechart count by hour.":::

[!NOTE]
Currently, `render` **_doesn't label durations properly_**, but we could use `| render columnchart` instead:

:::image type="content" source="media/tutorial/column-count-hour.png" alt-text="Screenshot that shows a column chart count by hour.":::

## Compare Multiple Daily Series

You can **also** track how activity varies over the time of day in multiple different states.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin( StartTime % 1d , 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render timechart
```

:::image type="content" source="media/tutorial/time-hour-state.png" alt-text="Screenshot of a timechart by hour and state.":::

Now, divide by `1h` to turn the X-axis into an _hour number_ instead of a duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= bin( StartTime % 1d , 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render columnchart
```

:::image type="content" source="media/tutorial/column-hour-state.png" alt-text="Screenshot that shows a column chart by hour and state.":::

## Joining Data Types

You can find two different specific event types and in which state each of them happened.

Let's pull storm events with the first `EventType` and the second `EventType`, and then join the two sets on `State`:

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

## User Session Example of *`join`*

<ins>This section doesn't use the `StormEvents` table</ins>.

Instead, assume you have data that includes events marking the start and end of each user session with a unique ID.

Let's find out how long each user session lasts.

You can use `extend` to provide an alias for the two timestamps, and then compute the session duration:

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

> [!TIP]  
> It's good practice to use `project` to select just the relevant columns before you perform the join. In the same clause, just rename the `timestamp` column.  

## Plotting a Distribution

Returning to the `StormEvents` table, how many storms are there of different lengths?

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

## Percentiles

What ranges of durations do we find in different percentages of storms?

To get this information, use the preceding query from [Plot a distribution](#plot-a-distribution), but replace `render` with:

```kusto
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

In this case, we didn't use a `by` clause, so the output is a single row:

:::image type="content" source="media/tutorial/summarize-percentiles-duration.png" lightbox="media/tutorial/summarize-percentiles-duration.png" alt-text="Screenshot of a table of results for summarize percentiles by duration.":::

We can see from the output that:

* 5% of storms have a duration of less than 5 minutes.
* 50% of storms lasted less than 1 hour and 25 minutes.
* 95% of storms lasted less than 2 hours and 50 minutes.

> [!TIP]  
> To get a separate breakdown for each state, use the `state` column separately with both `summarize` operators:  

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

## Percentages

Using the StormEvents table, we can also calculate the percentage of _direct_ injuries from _all_ injuries.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where (InjuriesDirect > 0) and (InjuriesIndirect > 0) 
| extend Percentage = (  100 * InjuriesDirect / (InjuriesDirect + InjuriesIndirect) )
| project StartTime, InjuriesDirect, InjuriesIndirect, Percentage
```

The query removes "zero count" entries:

|StartTime|InjuriesDirect|InjuriesIndirect|Percentage
|---|---|---|---|
|2007-05-01T16:50:00Z|1|1|50|
|2007-08-10T21:25:00Z|7|2|77|
|2007-08-23T12:05:00Z|7|22|24|
|2007-08-23T14:20:00Z|3|2|60|
|2007-09-10T13:45:00Z|4|1|80|
|2007-12-06T08:30:00Z|3|3|50|
|2007-12-08T12:00:00Z|1|1|50|

## Assigning a Result to a Variable: *`let`*

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
> In **Kusto Explorer**, to execute the entire query, _don't_ add blank lines between parts of the query.
> Also, any two individual statements _must_ be separated by a semicolon (;).

## Combining Data from Several Databases in a Query

In the following query, the `Logs` table must be in your default database:

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

The preceding two queries assume that both databases are in the cluster you're currently connected to. If the `Telemetry` database was in a cluster named *TelemetryCluster.kusto.windows.net*, access it using _this_ query:

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

> [!NOTE]
> When the cluster is _specified_, the database is _mandatory_.

For more information about combining data from several databases in a query, see [cross-database queries](cross-cluster-or-database-queries.md).

## Additional Functions: 

## Subtracting a Given Timespan from UTC (Coordinated Universal Time) *`ago`*

You can calculate exact time intervals between events (Timestamps) and the UTC. Use `ago` in a table with the requisite time interval: m-minute, h-hour, d-day, etc. 

```kusto
T | where Timestamp > ago(1h)
```

This is will give you all rows where event _T_ occured within the last hour.

> [!NOTE]  
> If you use ago() multiple times in a single query statement, the current UTC time being referenced is the same across all uses.  

## Related Content

* View code samples for the [Kusto Query Language](samples.md?pivots=azuredataexplorer)!
