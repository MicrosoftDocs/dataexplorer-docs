---
title: Tutorial - Azure Data Explorer
description: This article describes Tutorial in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/23/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Tutorial

::: zone pivot="azuredataexplorer"

The best way to learn about the Kusto query language is to look at some simple
queries to get the "feel" for the language using a [database with some sample data](https://help.kusto.windows.net/Samples). The queries demonstrated in this article should run on that database. The `StormEvents`
table in this sample database provides some information about storms that happened
in the U.S.

<!--
  TODO: Provide link to reference data we used originally in StormEvents
-->

<!--
  TODO: A few samples below reference non-existent tables, such as Events and Logs.
        We need to add these tables.
-->

## Count rows

Our example database has a table called `StormEvents`.
To find out how big it is, we'll pipe its content into an operator that simply counts the rows:

* *Syntax:* A query is a data source (usually a table name), optionally
  followed by one or more pairs of the pipe character and some tabular operator.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | count
```

Here's the result:

|Count|
|-----|
|59066|
    
[count operator](./countoperator.md).

## project: select a subset of columns

Use [project](./projectoperator.md) to pick out just the columns you
want. See example below that uses both [project](./projectoperator.md)
and [take](./takeoperator.md) operator.

## where: filtering by a Boolean expression

Let's see only the `flood`s in `California` during Feb-2007:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-01) and StartTime < datetime(2007-03-01)
| where EventType == 'Flood' and State == 'CALIFORNIA'
| project StartTime, EndTime , State , EventType , EpisodeNarrative
```

|StartTime|EndTime|State|EventType|EpisodeNarrative|
|---|---|---|---|---|
|2007-02-19 00:00:00.0000000|2007-02-19 08:00:00.0000000|CALIFORNIA|Flood|A frontal system moving across the Southern San Joaquin Valley brought brief periods of heavy rain to western Kern County in the early morning hours of the 19th. Minor flooding was reported across State Highway 166 near Taft.|

## take: show me n rows

Let's see some data - what's in a sample 5 rows?

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| take 5
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|Heavy Rain|FLORIDA|As much as 9 inches of rain fell in a 24-hour period across parts of coastal Volusia County.|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|Tornado|FLORIDA|A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|Waterspout|ATLANTIC SOUTH|A waterspout formed in the Atlantic southeast of Melbourne Beach and briefly moved toward shore.|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|Thunderstorm Wind|MISSISSIPPI|Numerous large trees were blown down with some down on power lines. Damage occurred in eastern Adams county.|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|Thunderstorm Wind|GEORGIA|The county dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated.|

But [take](./takeoperator.md) shows rows from the table in no particular order, so let's sort them.
* [limit](./takeoperator.md) is an alias 
for [take](./takeoperator.md) and will have the same effect.

## sort and top

* *Syntax:* Some operators have parameters introduced by keywords such as `by`.
* `desc` = descending order, `asc` = ascending.

Show me the first n rows, ordered by a particular column:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| top 5 by StartTime desc
| project  StartTime, EndTime, EventType, State, EventNarrative  
```

|StartTime|EndTime|EventType|State|EventNarrative|
|---|---|---|---|---|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 22:30:00.0000000|2007-12-31 23:59:00.0000000|Winter Storm|MICHIGAN|This heavy snow event continued into the early morning hours on New Year's Day.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|North to northeast winds gusting to around 58 mph were reported in the mountains of Ventura county.|
|2007-12-31 23:53:00.0000000|2007-12-31 23:53:00.0000000|High Wind|CALIFORNIA|The Warm Springs RAWS sensor reported northerly winds gusting to 58 mph.|

Same can be achieved by using [sort](./sortoperator.md) and 
then [take](./takeoperator.md) operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| sort by StartTime desc
| take 5
| project  StartTime, EndLat, EventType, EventNarrative
```

## extend: compute derived columns

Create a new column by computing a value in every row:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| limit 5
| extend Duration = EndTime - StartTime 
| project StartTime, EndTime, Duration, EventType, State
```

|StartTime|EndTime|Duration|EventType|State|
|---|---|---|---|---|
|2007-09-18 20:00:00.0000000|2007-09-19 18:00:00.0000000|22:00:00|Heavy Rain|FLORIDA|
|2007-09-20 21:57:00.0000000|2007-09-20 22:05:00.0000000|00:08:00|Tornado|FLORIDA|
|2007-09-29 08:11:00.0000000|2007-09-29 08:11:00.0000000|00:00:00|Waterspout|ATLANTIC SOUTH|
|2007-12-20 07:50:00.0000000|2007-12-20 07:53:00.0000000|00:03:00|Thunderstorm Wind|MISSISSIPPI|
|2007-12-30 16:00:00.0000000|2007-12-30 16:05:00.0000000|00:05:00|Thunderstorm Wind|GEORGIA|

It is possible to reuse column name and assign calculation result to the same column.
For example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print x=1
| extend x = x + 1, y = x
| extend x = x + 1
```

|x|y|
|---|---|
|3|1|

[Scalar expressions](./scalar-data-types/index.md) can include all the usual 
operators (`+`, `-`, `*`, `/`, `%`), and there's a range of useful functions.

## summarize: aggregate groups of rows

Count how many events come from each country:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count = count() by State
```

[summarize](./summarizeoperator.md) groups together rows that have 
the same values in the `by` clause, and then uses 
the aggregation function (such as `count`) to combine each group into a single row. So in this case, 
there's a row for each state, and a column for the count of rows in that state.

There's a range of [aggregation functions](./summarizeoperator.md#list-of-aggregation-functions),
and you can use several of
them in one summarize operator to produce several computed columns. 
For example, we could get the count of storms in each state and also a sum of the unique type of storms per state,  
then we could use [top](./topoperator.md) to get the most storm-affected states:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State
| top 5 by StormCount desc
```

|State|StormCount|TypeOfStorms|
|---|---|---|
|TEXAS|4701|27|
|KANSAS|3166|21|
|IOWA|2337|19|
|ILLINOIS|2022|23|
|MISSOURI|2016|20|

The result of a summarize has:

* each column named in `by`;
* a column for each computed expression;
* a row for each combination of `by` values.

## Summarize by scalar values

You can use scalar (numeric, time, or interval) values in the `by` clause, but you'll want to put the values into bins.  
The [bin()](./binfunction.md) function is useful for this:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

This reduces all the timestamps to intervals of 1 day:

|StartTime|event_count|
|---|---|
|2007-02-14 00:00:00.0000000|180|
|2007-02-15 00:00:00.0000000|66|
|2007-02-16 00:00:00.0000000|164|
|2007-02-17 00:00:00.0000000|103|
|2007-02-18 00:00:00.0000000|22|
|2007-02-19 00:00:00.0000000|52|
|2007-02-20 00:00:00.0000000|60|

The [bin()](./binfunction.md) is the same as
the [floor()](./floorfunction.md) function in many languages. It
simply reduces every value to the nearest multiple of the modulus that you supply, so
that [summarize](./summarizeoperator.md) can assign the rows to groups.

## Render: display a chart or table

Project two columns and use them as the x and y axis of a chart:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| summarize event_count=count(), mid = avg(BeginLat) by State 
| sort by mid
| where event_count > 1800
| project State, event_count
| render columnchart
```

:::image type="content" source="images/tutorial/event-counts-state.png" alt-text="Column chart of storm event counts by state":::

Although we removed `mid` in the project operation, we still need it if we want the chart to display the countries in that order.

Strictly speaking, 'render' is a feature of the client rather than part of the query language. Still, it's integrated into the language and is very useful for envisioning your results.


## Timecharts

Going back to numeric bins, let's display a time series:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="images/tutorial/time-series-start-bin.png" alt-text="Line chart events binned by time":::

## Multiple series

Use multiple values in a `summarize by` clause to create a separate row for each combination of values:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where StartTime > datetime(2007-06-04) and StartTime < datetime(2007-06-10) 
| where Source in ("Source","Public","Emergency Manager","Trained Spotter","Law Enforcement")
| summarize count() by bin(StartTime, 10h), Source
```

:::image type="content" source="images/tutorial/table-count-source.png" alt-text="Table count by source":::

Just add the render term to the above: `| render timechart`.

:::image type="content" source="images/tutorial/line-count-source.png" alt-text="Line chart count by source":::

Notice that `render timechart` uses the first column as the x-axis, and then displays the other columns as separate lines.

## Daily average cycle

How does activity vary over the average day?

Count events by the time modulo one day, binned into hours. Note that we use `floor` instead of bin:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour = floor(StartTime % 1d , 1h)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

:::image type="content" source="images/tutorial/time-count-hour.png" alt-text="Time chart count by hour":::

Currently, `render` doesn't label durations properly, but we could use `| render columnchart` instead:

:::image type="content" source="images/tutorial/column-count-hour.png" alt-text="Column chart count by hour":::

## Compare multiple daily series

How does activity vary over the time of day in different states?

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= floor( StartTime % 1d , 1h)
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render timechart
```

:::image type="content" source="images/tutorial/time-hour-state.png" alt-text="Time chart by hour and state":::

Divide by `1h` to turn the x-axis into hour number instead of a duration:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| extend hour= floor( StartTime % 1d , 1h)/ 1h
| where State in ("GULF OF MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render columnchart
```

:::image type="content" source="images/tutorial/column-hour-state.png" alt-text="Column chart by hour and state":::

## Join

How to find for two given EventTypes in what state both of them happened?

You can pull storm events with the first EventType and with the second EventType and then join the two sets on State.

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

:::image type="content" source="images/tutorial/join-events-la.png" alt-text="Join events lightning and avalanche":::

## User session example of join

This section does not use the `StormEvents` table.

Assume you have data that includes events marking the start and end of each user  session, with a unique ID for each session. 

How long does each user session last?

By using `extend` to provide an alias for the two timestamps, you can then compute the session duration.

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

:::image type="content" source="images/tutorial/user-session-extend.png" alt-text="User session extend":::

It's good practice to use `project` to select just the columns we need before performing the join.
In the same clauses, we rename the timestamp column.

## Plot a distribution

How many storms are there of different lengths?

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

:::image type="content" source="images/tutorial/event-count-duration.png" alt-text="Event count timechart by duration":::

Or use `| render columnchart`:

:::image type="content" source="images/tutorial/column-event-count-duration.png" alt-text="Column chart event count timechart by duration":::

## Percentiles

What ranges of durations cover different percentages of storms?

Use the above query, but replace `render` with:

```kusto
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

In this case, we provided no `by` clause, so the result is a single row:

:::image type="content" source="images/tutorial/summarize-percentiles-duration.png" alt-text="Table summarize percentiles by duration":::

From which we can see that:

* 5% of storms have a duration of less than 5m;
* 50% of storms last less than 1h 25m;
* 5% of storms last at least 2h 50m.

To get a separate breakdown for each state, we just have to bring the state column separately through both summarize operators:

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

:::image type="content" source="images/tutorial/summarize-percentiles-state.png" alt-text="Table summarize percentiles duration by state":::

## Let: Assign a result to a variable

Use [let](./letstatement.md) to separate out the parts of the query expression in the 'join' example above. The results are unchanged:

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
> In the Kusto Explorer client, don't put blank lines between the parts of this. Make sure to execute all of it.

## Combining data from several databases in a query

See [cross-database queries](./cross-cluster-or-database-queries.md) for detailed discussion

When you write a query of the style:

```kusto
Logs | where ...
```

The table named Logs has to be in your default database. If you want to access tables from another database use the following syntax:

```kusto
database("db").Table
```

So if you have databases named *Diagnostics* and *Telemetry* and want to correlate some of their data, you might write (assuming *Diagnostics* is your default database)

```kusto
Logs | join database("Telemetry").Metrics on Request MachineId | ...
```

or if your default database is *Telemetry*

```kusto
union Requests, database("Diagnostics").Logs | ...
```
    
All of the above assumed that both databases reside in the cluster you are currently connected to. Suppose that *Telemetry* database belonged to another cluster named *TelemetryCluster.kusto.windows.net* then to access it you'll need

```kusto
Logs | join cluster("TelemetryCluster").database("Telemetry").Metrics on Request MachineId | ...
```

> [!NOTE]
> when the cluster is specified the database is mandatory

::: zone-end

::: zone pivot="azuremonitor"

This tutorial shows you how to use Log Analytics to write, execute, and manage Azure Monitor log queries in the Azure portal. You can use Log Analytics queries to search for terms, identify trends, analyze patterns, and provide many other insights from your data. 

In this tutorial, you learn how to use Log Analytics to:

> [!div class="checklist"]
> * Understand the log data schema
> * Write and run simple queries, and modify the time range for queries
> * Filter, sort, and group query results
> * View, modify, and share visuals of query results
> * Save, load, export, and copy queries and results

For more information about log queries, see [Overview of log queries in Azure Monitor](log-query-overview.md).<br/>
For a detailed tutorial on writing log queries, see [Get started with log queries in Azure Monitor](get-started-queries.md).

## Open Log Analytics
To use Log Analytics, you need to be signed in to an Azure account. If you don't have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

To complete most of the steps in this tutorial, you can use [this demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), which includes plenty of sample data. With the demo environment, you won't be able to save queries or pin results to a dashboard.

You can also use your own environment, if you're using Azure Monitor to collect log data on at least one Azure resource. To open a Log Analytics workspace, in your Azure Monitor left navigation, select **Logs**. 

## Understand the schema
 
A *schema* is a collection of tables grouped under logical categories. The Demo schema has several categories from monitoring solutions. For example, the **LogManagement** category contains Windows and Syslog events, performance data, and agent heartbeats.

The schema tables appear on the **Tables** tab of the Log Analytics workspace. The tables contain columns, each with a data type shown by the icon next to the column name. For example, the **Event** table contains text columns like **Computer** and numerical columns like **EventCategory**.

![Schema](images/tutorial/schema.png)

## Write and run basic queries

Log Analytics opens with a new blank query in the **Query editor**.

![Log Analytics](images/tutorial/homepage.png)

### Write a query

Azure Monitor log queries use a version of the Kusto query language. Queries can begin with either a table name or a [search](/azure/kusto/query/searchoperator) command. 

The following query retrieves all records from the **Event** table:

```Kusto
Event
```

The pipe (|) character separates commands, so the output of the first command is the input of the next command. You can add any number of commands to a single query. The following query retrieves the records from the **Event** table, and then searches them for the term **error** in any property:

```Kusto
Event 
| search "error"
```

A single line break makes queries easier to read. More than one line break splits the query into separate queries.

Another way to write the same query is:

```Kusto
search in (Event) "error"
```

In the second example, the **search** command searches only records in the **Events** table for the term **error**.

By default, Log Analytics limits queries to a time range of the past 24 hours. To set a different time range, you can add an explicit **TimeGenerated** filter to the query, or use the **Time range** control.

### Use the Time range control
To use the **Time range** control, select it in the top bar, and then select a value from the dropdown list, or select **Custom** to create a custom time range.

![Time picker](images/tutorial/time-picker.png)

- Time range values are in UTC, which could be different than your local time zone.
- If the query explicitly sets a filter for **TimeGenerated**, the time picker control shows **Set in query**, and is disabled to prevent a conflict.

### Run a query
To run a query, place your cursor somewhere inside the query, and select **Run** in the top bar or press **Shift**+**Enter**. The query runs until it finds a blank line.

## Filter results
Log Analytics limits results to a maximum of 10,000 records. A general query like `Event` returns too many results to be useful. You can filter query results either through restricting the table elements in the query, or by explicitly adding a filter to the results. Filtering through the table elements returns a new result set, while an explicit filter applies to the existing result set.

### Filter by restricting table elements
To filter `Event` query results to **Error** events by restricting table elements in the query:

1. In the query results, select the dropdown arrow next to any record that has **Error** in the **EventLevelName** column. 
   
1. In the expanded details, hover over and select the **...** next to **EventLevelName**, and then select **Include "Error"**. 
   
   ![Add filter to query](images/tutorial/add-filter.png)
   
1. Notice that the query in the **Query editor** has now changed to:
   
   ```Kusto
   Event
   | where EventLevelName == "Error"
   ```
   
1. Select **Run** to run the new query.

### Filter by explicitly filtering results
To filter the `Event` query results to **Error** events by filtering the query results:

1. In the query results, select the **Filter** icon next to the column heading **EventLevelName**. 
   
1. In the first field of the pop-up window, select **Is equal to**, and in the next field, enter *error*. 
   
1. Select **Filter**.
   
   ![Filter](images/tutorial/filter.png)

## Sort, group, and select columns
To sort query results by a specific column, such as **TimeGenerated [UTC]**, select the column heading. Select the heading again to toggle between ascending and descending order.

![Sort column](images/tutorial/sort-column.png)

Another way to organize results is by groups. To group results by a specific column, drag the column header to the bar above the results table labeled **Drag a column header and drop it here to group by that column**. To create subgroups, drag other columns to the upper bar. You can rearrange the hierarchy and sorting of the groups and subgroups in the bar.

![Groups](images/tutorial/groups.png)

To hide or show columns in the results, select **Columns** above the table, and then select or deselect the columns you want from the dropdown list.

![Select columns](images/tutorial/select-columns.png)

## View and modify charts
You can also see query results in visual formats. Enter the following query as an example:

```Kusto
Event 
| where EventLevelName == "Error" 
| where TimeGenerated > ago(1d) 
| summarize count() by Source 
```

By default, results appear in a table. Select **Chart** above the table to see the results in a graphic view.

![Bar chart](images/tutorial/bar-chart.png)

The results appear in a stacked bar chart. Select other options like **Stacked Column** or **Pie** to show other views of the results.

![Pie chart](images/tutorial/pie-chart.png)

You can change properties of the view, such as x and y axes, or grouping and splitting preferences, manually from the control bar.

You can also set the preferred view in the query itself, using the [render](/azure/kusto/query/renderoperator) operator.

## Pin results to a dashboard

To pin a results table or chart from Log Analytics to a shared Azure dashboard, select **Pin to dashboard** on the top bar. 

![Pin to dashboard](images/tutorial/pin-dashboard.png)

In the **Pin to another dashboard** pane, select or create a shared dashboard to pin to, and select **Apply**. The table or chart appears on the selected Azure dashboard.

![Chart pinned to dashboard](images/tutorial/pin-dashboard2.png)

A table or chart that you pin to a shared dashboard has the following simplifications: 

- Data is limited to the past 14 days.
- A table shows only up to four columns and the top seven rows.
- Charts with many discrete categories automatically group less populated categories into a single **others** bin.

## Save, load, or export queries

Once you create a query, you can save or share the query or results with others. 

### Save queries

To save a query:

1. Select **Save** on the top bar.
   
1. In the **Save** dialog, give the query a **Name**, using the characters a–z, A–Z, 0-9, space, hyphen, underscore, period, parenthesis, or pipe. 
   
1. Select whether to save the query as a **Query** or a **Function**. Functions are queries that other queries can reference. 
   
   To save a query as a function, provide a **Function Alias**, which is a short name for other queries to use to call this query.
   
1. If you are in a Log Analytics workspace, provide a **Category** for **Query explorer** to use for the query. (Categories aren't available for Applications Insights queries)
   
1. Select **Save**.
   
   ![Save function](images/tutorial/save-function.png)

### Load queries
To load a saved query, select **Query explorer** at upper right. The **Query explorer** pane opens, listing all queries by category. Expand the categories or enter a query name in the search bar, then select a query to load it into the **Query editor**. You can mark a query as a **Favorite** by selecting the star next to the query name.

![Query explorer](images/tutorial/query-explorer.png)

### Export and share queries
To export a query, select **Export** on the top bar, and then select **Export to CSV - all columns**, **Export to CSV - displayed columns**, or **Export to Power BI (M query)** from the dropdown list.

The following video shows you how to integrate Log Analytics with Excel.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4Asme]

To share a link to a query, select **Copy link** on the top bar, and then select **Copy link to query**, **Copy query text**, or **Copy query results** to copy to the clipboard. You can send the query link to others who have access to the same workspace.


::: zone-end
