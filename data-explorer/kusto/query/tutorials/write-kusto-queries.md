---
title: 'Tutorial: Learn common Kusto Query Language operators'
description: This tutorial describes how to write queries using common operators in the Kusto Query Language to meet common query needs.
ms.topic: tutorial
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
ms.date: 01/18/2023
---

# Tutorial: Write Kusto queries

::: zone pivot="azuredataexplorer"

The [Kusto Query Language (KQL)](../index.md) is used to write queries in [Azure Data Explorer](https://dataexplorer.azure.com/), [Azure Monitor Log Analytics](https://azure.microsoft.com/products/monitor/#overview), and [Azure Sentinel](https://azure.microsoft.com/products/microsoft-sentinel/).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Count rows](#count-rows)
> * [See a sample of data](#see-a-sample-of-data)
> * [Select a subset of columns](#select-a-subset-of-columns)
> * [List unique values](#list-unique-values)
> * [Filter by condition](#filter-by-condition)
> * [Sort results](#sort-results)
> * [Get the top *n* rows](#get-the-top-n-rows)

The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To continue exploring with your own data, [create your own free cluster](../../../start-for-free-web-ui.md).

## Prerequisites

* A Microsoft account or Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

## Count rows

Begin by using the [count](../countoperator.md) operator to find the number of storm records in the `StormEvents` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUUjOL80rAQA76pZjFAAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents 
| count
```

**Output**

|Count|
|--|
|59066|

> [!NOTE]
> To learn more about the structure 

## See a sample of data

To get a sense of the data, use the [take](../takeoperator.md) operator to view a sample of records. This operator returns a specified number of arbitrary rows from the table, which can be useful for previewing the general data structure and contents.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUShJzE5VMAUAP49+9hUAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents 
| take 5
```

The following table shows only 6 of the 22 returned columns. To see the full output, run the query.

|StartTime|EndTime|EpisodeId|EventId|State|EventType|...|
|--|--|--|--|--|--|--|
|2007-09-20T21:57:00Z|2007-09-20T22:05:00Z|11078|60913|FLORIDA|Tornado|...|
|2007-12-20T07:50:00Z|2007-12-20T07:53:00Z|12554|68796|MISSISSIPPI|Thunderstorm Wind|...|
|2007-12-30T16:00:00Z|2007-12-30T16:05:00Z|11749|64588|GEORGIA|Thunderstorm Wind|...|
|2007-09-29T08:11:00Z|2007-09-29T08:11:00Z|11091|61032|ATLANTIC SOUTH|Waterspout|...|
|2007-09-18T20:00:00Z|2007-09-19T18:00:00Z|11074|60904|FLORIDA|Heavy Rain|...|

## Select a subset of columns

Use the [project](../projectoperator.md) operator to simplify the view and select a specific subset of columns. Using `project` is often more efficient and easier to read than viewing all columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUShJzE5VMDQAMQuK8rNSk0sUgksSS1J1FMBqQioLgEyXxNzE9NSAovyC1KKSSgBtBl0/QgAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| take 10
| project State, EventType, DamageProperty
```

**Output**

|State|EventType|DamageProperty|
|--|--|--|
|ATLANTIC SOUTH|Waterspout|0|
|FLORIDA|Heavy Rain|0|
|FLORIDA|Tornado|6200000|
|GEORGIA|Thunderstorm Wind|2000|
|MISSISSIPPI|Thunderstorm Wind|20000|
|MISSISSIPPI|Tornado|450000|
|MISSISSIPPI|Thunderstorm Wind|60000|
|MISSISSIPPI|Hail|0|
|AMERICAN SAMOA|Flash Flood|250000|
|KENTUCKY|Flood|1000|

## List unique values

It appears that there are multiple types of storms based on the results of the previous query. Use the [distinct](../distinctoperator.md) operator to list all of the unique storm types.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRSMksLsnMSy5RAIuEVBakAgD24XVdIAAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents | distinct EventType
```

There are 46 types of storms in the table.

|EventType|
|--|
|Thunderstorm Wind|
|Hail|
|Flash Flood|
|Drought|
|Winter Weather|
|Winter Storm|
|Heavy Snow|
|High Wind|
|Frost/Freeze|
|Flood|
|...|

## Filter by condition

The [where](../whereoperator.md) operator filters rows of data based on certain criteria.

The following query looks for storm events in a specific `State` of a specific `EventType`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVAPcY1wDFZXSMxLUQArCqksgEi45eTnp6iDtBQU5WelJpeANBWVhGTmpuoouOalQBhgg3QQWnUUXBJzE9NTA4ryC1KLSioBBDYIBX4AAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| project StartTime, EndTime, State, EventType, DamageProperty
```

There are 146 events that match these conditions. Here's a sample of 5 of them.

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-01-13T08:45:00Z|2007-01-13T10:30:00Z|TEXAS|Flood|0|
|2007-01-13T09:30:00Z|2007-01-13T21:00:00Z|TEXAS|Flood|0|
|2007-01-13T09:30:00Z|2007-01-13T21:00:00Z|TEXAS|Flood|0|
|2007-01-15T22:00:00Z|2007-01-16T22:00:00Z|TEXAS|Flood|20000|
|2007-03-12T02:30:00Z|2007-03-12T06:45:00Z|TEXAS|Flood|0|
|...|...|...|...|...|

## Sort results

To view the top five floods in Texas that caused the most damage, use the [sort](../sort-operator.md) operator to arrange the rows in descending order based on the `DamageProperty` column. The default sort order is descending. To sort in ascending order, specify `asc`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUA9xjXAMVldIzEtRAKsJqSyASLjl5OenqAN1FOcXlSgkVSq4JOYmpqcGFOUXpBaVVAIlCorys1KTS0CGFZWEZOam6ii45qVAGGALdBBG6qBpBwDYBhI8lQAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| sort by DamageProperty
| project StartTime, EndTime, State, EventType, DamageProperty
```

**Output**

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|TEXAS|Flood|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|TEXAS|Flood|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|TEXAS|Flood|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|TEXAS|Flood|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|TEXAS|Flood|750000|
|...|...|...|...|...|

## Get the top *n* rows

The [top](../topoperator.md) operator returns the first *n* rows sorted by the specified column.

The following query will return the five Texas floods that caused the most damaged property.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVAPcY1wDFZXSMxLUQArCqksgEi45eTnp6iDtJTkFyiYKiRVKrgk5iampwYU5RekFpVUgqQKivKzUpNLQOYVlYRk5qbqKLjmpUAYYDt0EKbqoOkHAAycFF+ZAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty
| project StartTime, EndTime, State, EventType, DamageProperty
```

**Output**

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|TEXAS|Flood|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|TEXAS|Flood|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|TEXAS|Flood|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|TEXAS|Flood|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|TEXAS|Flood|750000|

> [!NOTE]
> The order of the operators is important, since the data flows from one operator to the next and is transformed at each step. If you put `top` before `where` here, you'll get different results. To learn more, see [tabular expression statements](../tabularexpressionstatements.md).

The following query uses `project` to create a computed `Duration` column that calculates the difference between the `StartTime` and `EndTime`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAF2OvQ7CMAyEdyTewVuWMDJ2QGr5WQJSKzGHxoIiEkeuKVTi4WmooBKbfXeffaUQ%2b6LDIO189oLHBRnhs1d9RMgyUOsbkVNgg4NSrIzicVVud2ZT7Y1KnFCEJZx6yK23ZzwwRWTpwWFbJx%2bfggOf39lKQwEyKIKrGo%2bwSEdZ0pyCkemKtUyi%2fib1j9ZjDz311H9%2fBys2LTk0lhPT4RvwA3pn6AAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty desc
| project StartTime, EndTime, Duration = EndTime - StartTime, DamageProperty
```

**Output**

|StartTime|EndTime|Duration|DamageProperty|
|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|1.01:30:00|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|12:00:00|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|05:00:00|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|08:00:00|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|03:00:00|750000|

If you take a look at the computed `Duration` column, you may notice that the flood that caused the most damage was also the longest flood.

> [!TIP]
> The [extend](../extendoperator.md) operator could also add computed columns, although these columns are added to the end of a table. In the example scenario, we don't want to see all columns with an appended column, so using `project` is a better choice.

## Next steps

Now that you're familiar with the essentials of writing Kusto queries, move on to use aggregation functions to gain deeper insight into your data.

> [!div class="nextstepaction"]
> [Use aggregation functions](use-aggregation-functions.md)

::: zone-end

::: zone pivot="azuremonitor"

The best way to learn about the Azure Data Explorer Query Language is to look at some basic queries to get a "feel" for the language. These queries are similar to queries in the Azure Data Explorer tutorial, but use data from common tables in an Azure Log Analytics workspace.

Run these queries by using Log Analytics in the Azure portal. Log Analytics is a tool you can use to write log queries. Use log data in Azure Monitor, and then evaluate log query results. If you aren't familiar with Log Analytics, complete the [Log Analytics tutorial](/azure/azure-monitor/log-query/log-analytics-tutorial).

All queries in this tutorial use the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade). You can use your own environment, but you might not have some of the tables that are used here. Because the data in the demo environment isn't static, the results of your queries might vary slightly from the results shown here.

## Count rows

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's collected by insights such as Azure Monitor for VMs and Azure Monitor for containers. To find out how large the table is, we'll pipe its content into an operator that counts rows.

A query is a data source (usually a table name), optionally  followed by one or more pairs of the pipe character and some tabular operator. In this case, all records from the `InsightsMetrics` table are returned and then sent to the [count operator](../countoperator.md). The `count` operator displays the results because the operator is the last command in the query.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
InsightsMetrics | count
```

Here's the output:

|Count|
|-----|
|1,263,191|

## Filter by Boolean expression: *where*

The [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity) table has entries from the Azure activity log, which provides insight into subscription-level or management group-level events occurring in Azure. Let's see only `Critical` entries during a specific week.

The [where](../whereoperator.md) operator is common in the Kusto Query Language. `where` filters a table to rows that match specific criteria. The following example uses multiple commands. First, the query retrieves all records for the table. Then, it filters the data for only records that are in the time range. Finally, it filters those results for only records that have a `Critical` level.

> [!NOTE]
> In addition to specifying a filter in your query by using the `TimeGenerated` column, you can specify the time range in Log Analytics. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope).

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
```

:::image type="content" source="../images/tutorial/azure-monitor-where-results.png" lightbox="../images/tutorial/azure-monitor-where-results.png" alt-text="Screenshot that shows the results of the where operator example.":::

## Select a subset of columns: *project*

Use [project](../projectoperator.md) to include only the columns you want. Building on the preceding example, let's limit the output to certain columns:

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
| project TimeGenerated, Level, OperationNameValue, ResourceGroup, _ResourceId
```

:::image type="content" source="../images/tutorial/azure-monitor-project-results.png" lightbox="../images/tutorial/azure-monitor-project-results.png" alt-text="Screenshot that shows the results of the project operator example.":::

## Show *n* rows: *take*

[NetworkMonitoring](/azure/azure-monitor/reference/tables/networkmonitoring) contains monitoring data for Azure virtual networks. Let's use the [take](../takeoperator.md) operator to look at 10 random sample rows in that table. The [take](../takeoperator.md) shows some rows from a table in no particular order:

```kusto
NetworkMonitoring
| take 10
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="../images/tutorial/azure-monitor-take-results.png" lightbox="../images/tutorial/azure-monitor-take-results.png" alt-text="Screenshot that shows the results of the take operator example.":::

## Order results: *sort*, *top*

Instead of random records, we can return the latest five records by first sorting by time:

```kusto
NetworkMonitoring
| sort by TimeGenerated desc
| take 5
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

You can get this exact behavior by instead using the [top](../topoperator.md) operator:

```kusto
NetworkMonitoring
| top 5 by TimeGenerated desc
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="../images/tutorial/azure-monitor-top-results.png" lightbox="../images/tutorial/azure-monitor-top-results.png" alt-text="Screenshot that shows the results of the top operator example.":::

## Compute derived columns: *extend*

The [extend](../projectoperator.md) operator is similar to [project](../projectoperator.md), but it adds to the set of columns instead of replacing them. You can use both operators to create a new column based on a computation on each row.

The [Perf](/azure/azure-monitor/reference/tables/perf) table has performance data that's collected from virtual machines that run the Log Analytics agent.

```kusto
Perf
| where ObjectName == "LogicalDisk" and CounterName == "Free Megabytes"
| project TimeGenerated, Computer, FreeMegabytes = CounterValue
| extend FreeGigabytes = FreeMegabytes / 1000
```

:::image type="content" source="../images/tutorial/azure-monitor-extend-results.png" lightbox="../images/tutorial/azure-monitor-extend-results.png" alt-text="Screenshot that shows the results of the extend operator example.":::

## Aggregate groups of rows: *summarize*

The [summarize](../summarizeoperator.md) operator groups together rows that have the same values in the `by` clause. Then, it uses an aggregation function like `count` to combine each group in a single row. A range of [aggregation functions](../aggregation-functions.md) are available. You can use several aggregation functions in one `summarize` operator to produce several computed columns.

The [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent) table contains security events like logons and processes that started on monitored computers. You can count how many events of each level occurred on each computer. In this example, a row is produced for each computer and level combination. A column contains the count of events.

```kusto
SecurityEvent
| summarize count() by Computer, Level
```

:::image type="content" source="../images/tutorial/azure-monitor-summarize-count-results.png" lightbox="../images/tutorial/azure-monitor-summarize-count-results.png" alt-text="Screenshot that shows the results of the summarize count operator example.":::

## Summarize by scalar values

You can aggregate by scalar values like numbers and time values, but you should use the [bin()](../binfunction.md) function to group rows into distinct sets of data. For example, if you aggregate by `TimeGenerated`, you'll get a row for most time values. Use `bin()` to consolidate values per hour or day.

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's organized according to insights from Azure Monitor for VMs and Azure Monitor for containers. The following query shows the hourly average processor utilization for multiple computers:

```kusto
InsightsMetrics
| where Computer startswith "DC"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
```

:::image type="content" source="../images/tutorial/azure-monitor-summarize-avg-results.png" lightbox="../images/tutorial/azure-monitor-summarize-avg-results.png" alt-text="Screenshot that shows the results of the avg operator example.":::

## Display a chart or table: *render*

The [render](../renderoperator.md) operator specifies how the output of the query is rendered. Log Analytics renders output as a table by default. You can select different chart types after you run the query. The `render` operator is useful to include in queries in which a specific chart type usually is preferred.

The following example shows the hourly average processor utilization for a single computer. It renders the output as a timechart.

```kusto
InsightsMetrics
| where Computer == "DC00.NA.contosohotels.com"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

:::image type="content" source="../images/tutorial/azure-monitor-render-results.png" lightbox="../images/tutorial/azure-monitor-render-results.png" alt-text="Screenshot that shows the results of the render operator example.":::

## Work with multiple series

If you use multiple values in a `summarize by` clause, the chart displays a separate series for each set of values:

```kusto
InsightsMetrics
| where Computer startswith "DC"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

:::image type="content" source="../images/tutorial/azure-monitor-render-multiple-results.png" lightbox="../images/tutorial/azure-monitor-render-multiple-results.png" alt-text="Screenshot that shows the results of the render operator with multiple series example.":::

## Join data from two tables

What if you need to retrieve data from two tables in a single query? You can use the [join](../joinoperator.md) operator to combine rows from multiple tables in a single result set. Each table must have a column that has a matching value so that the join understands which rows to match.

[VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) is a table that Azure Monitor uses for VMs to store details about virtual machines that it monitors. [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) contains performance data that's collected from those virtual machines. One value collected in *InsightsMetrics* is available memory, but not the percentage memory that's available. To calculate the percentage, we need the physical memory for each virtual machine. That value is in `VMComputer`.

The following example query uses a join to perform this calculation. The [distinct](../distinctoperator.md) operator is used with `VMComputer` because details are regularly collected from each computer. As result, the table contains multiple rows for each computer. The two tables are joined using the `Computer` column. A row is created in the resulting set that includes columns from both tables for each row in `InsightsMetrics`, where the value in `Computer` has the same value in the `Computer` column in `VMComputer`.

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

:::image type="content" source="../images/tutorial/azure-monitor-join-results.png" lightbox="../images/tutorial/azure-monitor-join-results.png" alt-text="Screenshot that shows the results of the join operator example.":::

## Assign a result to a variable: *let*

Use [let](../letstatement.md) to make queries easier to read and manage. You can use this operator to assign the results of a query to a variable that you can use later. By using the `let` statement, the query in the preceding example can be rewritten as:

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

:::image type="content" source="../images/tutorial/azure-monitor-let-results.png" lightbox="../images/tutorial/azure-monitor-let-results.png" alt-text="Screenshot that shows the results of the let operator example.":::

## Next steps

* View code samples for the [Kusto Query Language](../samples.md).

::: zone-end
