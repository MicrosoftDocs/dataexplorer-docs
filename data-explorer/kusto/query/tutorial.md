---
title: 'Tutorial: Write Kusto queries'
description: This tutorial describes how to write queries in the Kusto Query Language to meet common query needs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/19/2022
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---

# Tutorial: Write Kusto queries

::: zone pivot="azuredataexplorer"

Welcome to this tutorial on the [Kusto Query Language (KQL)](index.md), the language used to write queries in Azure Data Explorer.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Get started with common operators
> * Find insights with aggregation functions
> * Join data from multiple tables
> * Define variables
> * Calculate percentages
> * Calculate correlation coefficients
> * Cluster geospacial data

To follow along, use the buttons above each example query to run them automatically. The examples in this tutorial use the `StormEvents` table, which is located in the [Sample database](https://help.kusto.windows.net/Samples) of the publicly available and free **help** cluster. If you want to experiment with your own data, [add your own cluster](../../web-query-data.md#add-clusters) to the Azure Data Explorer web UI.

## Prerequisites

* A Microsoft or Azure account to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)
* Familiarity with database structures like tables, columns, and rows

## Introduction to KQL queries

A [Kusto Query Language (KQL)](index.md) query is a read-only request to retrieve and process data in Azure Data Explorer. These queries consist of one or more query statements and return data in tabular or graphical format.

### Tabular expression statements

The most common type of query statement is a tabular expression statement. These statements are used to manipulate data in tables or tabular datasets. They consist of one or more operators, separated by a pipe (`|`), and process the data sequentially. Each operator begins with a tabular input and returns a tabular output.

The order of the operators is important, as the data flows from one operator to the next and is transformed at each step. Think of it like a funnel where the data starts as an entire table and is refined as it passes through each operator, until you're left with a final output at the end.

Read the following query, and then we'll go through it step-by-step.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKaCJG4HENZENKklVsLVVUHLz8Q/ydHFUAkol55fmlQAA2ZnM/XgAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "FLORIDA"
| count
```

|Count|
|--|
|28|

The query takes the following actions in order:

1. The `StormEvents` table is filtered by the `where` operator to include rows with `StartTime` values within the specified date range.
1. The filtered table is then further filtered by another `where` operator to include rows with a `State` value of "FLORIDA".
1. The final table is passed to the `count` operator, which returns a new table with a single column, `Count`, containing the number of rows in the table.

## Get started with common operators

Let's learn some common query operators using the `StormEvents` table. These operators are key to understanding KQL and will be used in many of your queries.

### count

Begin by using the [count](./countoperator.md) operator to find the number of storm records in the table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVqhRSM4vzSsBALU2eHsTAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents | count
```

|Count|
|--|
|59066|

### take

To get a sense of the data, use the [take](./takeoperator.md) operator to view a sample of records. This operator returns a specified number of arbitrary rows from the table, which can be useful for previewing the data and becoming familiar with it.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVqhRKEnMTlUwBQDEz2b8FAAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents | take 5
```

The following table shows only 6 of the 22 returned columns. To see the full output, run the query.

|StartTime|EndTime|EpisodeId|EventId|State|EventType|...|
|--|--|--|--|--|--|--|
|2007-09-20T21:57:00Z|2007-09-20T22:05:00Z|11078|60913|FLORIDA|Tornado|...|
|2007-12-20T07:50:00Z|2007-12-20T07:53:00Z|12554|68796|MISSISSIPPI|Thunderstorm Wind|...|
|2007-12-30T16:00:00Z|2007-12-30T16:05:00Z|11749|64588|GEORGIA|Thunderstorm Wind|...|
|2007-09-29T08:11:00Z|2007-09-29T08:11:00Z|11091|61032|ATLANTIC SOUTH|Waterspout|...|
|2007-09-18T20:00:00Z|2007-09-19T18:00:00Z|11074|60904|FLORIDA|Heavy Rain|...|

### project

Use the [project](./projectoperator.md) operator to simplify the view and select a specific subset of columns. Using `project` is often more efficient and easier to read than viewing all columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUShJzE5VMDQAMQuK8rNSk0sUgksSS1J1FMBqQioLgEyXxNzE9NSAovyC1KKSSgBtBl0/QgAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| take 10
| project State, EventType, DamageProperty
```

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

### distinct

It appears that there are multiple types of storms based on the results of the previous query. Use the [distinct](./distinctoperator.md) operator to list all of the unique storm types.

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

### where

The [where](./whereoperator.md) operator filters rows of data based on certain criteria. 

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

### sort

To view the top five floods in Texas that caused the most damage, use the [sort](./sortoperator.md) operator to arrange the rows in descending order based on the `DamageProperty` column. The default sort order is descending. To sort in ascending order, specify `asc`.

<!-- TODO: Update query link. -->
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12NPQsCMRBEe8H/MF2atJZXCMZauBS28bL4mWzYLCcBf7zkrhDsHszMm1FZkpspa91uPnjfSAijBiUMA4x35/1oEHLEUvKtrMHxxRxNn1QWxaXhEFK40km4kGhDpDr1WMOTsOtUhB80abeL+nsiC5fjCsuj/X3YP90XMW6LAacAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| sort by DamageProperty
| project StartTime, EndTime, State, EventType, DamageProperty
```

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|TEXAS|Flood|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|TEXAS|Flood|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|TEXAS|Flood|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|TEXAS|Flood|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|TEXAS|Flood|750000|

> [!NOTE]
> The order of operations is important. Try putting `take 5` before `sort`. You'll get different results.

### top

The [top](./topoperator.md) operator returns the first *n* rows sorted by the specified column.

The following query will return the top 5 Texas floods that caused the most damaged property.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVAPcY1wDFZXSMxLUQArCqksgEi45eTnp6iDtJTkFyiYKiRVKrgk5iampwYU5RekFpVUgqQKivKzUpNLQOYVlYRk5qbqKLjmpUAYYDt0EKbqoOkHAAycFF+ZAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty
| project StartTime, EndTime, State, EventType, DamageProperty
```

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|TEXAS|Flood|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|TEXAS|Flood|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|TEXAS|Flood|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|TEXAS|Flood|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|TEXAS|Flood|750000|

Use `project` to include a computed `Duration` column by calculating the difference between the `StartTime` and `EndTime` columns. Alternatively, the [extend](./extendoperator.md) operator could add computed columns to the end of a table. In this case, we're only interested in certain columns, so `project` is a better option.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAF2OvQ7CMAyEdyTewVuWMDJ2QGr5WQJSKzGHxoIiEkeuKVTi4WmooBKbfXeffaUQ%2b6LDIO189oLHBRnhs1d9RMgyUOsbkVNgg4NSrIzicVVud2ZT7Y1KnFCEJZx6yK23ZzwwRWTpwWFbJx%2bfggOf39lKQwEyKIKrGo%2bwSEdZ0pyCkemKtUyi%2fib1j9ZjDz311H9%2fBys2LTk0lhPT4RvwA3pn6AAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty desc
| project StartTime, EndTime, Duration = EndTime - StartTime, DamageProperty
```

|StartTime|EndTime|Duration|DamageProperty|
|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|1.01:30:00|5000000|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|12:00:00|1200000|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|05:00:00|1000000|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|08:00:00|750000|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|03:00:00|750000|

With the computed `Duration` column, it stands out that the flood that caused the most damage was also the longest flood.

## Find insights with aggregation functions

Aggregation functions allow you to group and combine data from multiple rows into a summary value. The summary value depends on the chosen function, for example a count, maximum, minimum, or average value.

In the following examples, we'll use the [summarize](./summarizeoperator.md) operator together with aggregation functions to find insights in the data, and the [render](./renderoperator.md) operator to visualize the results.

### count()

Use `summarize` with the [count](./count-aggfunction.md) aggregation function to find the number of events by state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIyS9JzAkGyRYr2Cok55fmlWhoKiRVKgSXJJakAgChqbNHNwAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize TotalStorms = count() by State
```

|State|TotalStorms|
|--|--|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|ILLINOIS|2022|
|MISSOURI|2016|
|GEORGIA|1983|
|MINNESOTA|1881|
|WISCONSIN|1850|
|NEBRASKA|1766|
|NEWYORK|1750|
|...|...|

Visualize the output in a bar chart using the [render](./renderoperator.md) operator.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIyS9JzAkGyRYr2Cok55fmlWhoKiRVKgSXJJakgtQWpealpBYpJCUWJWckFpUAAFJrtYhKAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize TotalStorms = count() by State
| render barchart
```

:::image type="content" source="images/tutorial/total-storms-by-state-bar-chart.png" alt-text="Screenshot of total storms by state bar chart created with the render operator.":::

### countif()

It's possible to use multiple aggregation functions in a single `summarize` operator to produce several computed columns.

Use the [countif()](./countif-aggfunction.md) function to add a column with the count of storms that caused damage. The function returns the count of rows where the predicate passed as an argument is `true`.

Use the `top` operator to identify states with the most crop damage from storms.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlXg5VIAgpD8ksScYJCaYgVbheT80rwSDU0diBxEODyzJMO5KL/AJTE3MT0VpigzTQMiAJIqVrBTMNCEaEqqBOpLLEkFWVaSX6BgChHBNAkACdZZQZkAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize 
    TotalStorms = count(),
    StormsWithCropDamage = countif(DamageCrops > 0)
    by State
| top 5 by StormsWithCropDamage
```

|State|TotalStorms|StormsWithCropDamage|
|--|--|--|--|
|IOWA|2337|359|
|NEBRASKA|1766|201|
|MISSISSIPPI|1218|105|
|NORTH CAROLINA|1721|82|
|MISSOURI|2016|78|

### min(), max(), and avg()

Learn more about types of storms that cause crop damage using the `min()`, `max()`, and `avg()` aggregation functions.

Filter out rows with no damaged crops, calculate the minimum, maximum, and average crop damage for each event type, and sort the result by the average damage.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVXBJzE1MT3Uuyi8oVrBTMABJFJfm5iYWZVal8nIpAIFvYgVIGqLQNjexQgNJj6aOAlRVZh6yqsw8rKocy9KRVCWWpaOogqhJqlQAOzKksiAV7Jz8ohKQIIpeANxkeM/MAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where DamageCrops > 0
| summarize
    MaxCropDamage=max(DamageCrops), 
    MinCropDamage=min(DamageCrops), 
    AvgCropDamage=avg(DamageCrops)
    by EventType
| sort by AvgCropDamage
```

|EventType|MaxCropDamage|MinCropDamage|AvgCropDamage|
|--|--|--|--|
|Frost/Freeze|568600000|3000|9106087.5954198465|
|Wildfire|21000000|10000|7268333.333333333|
|Drought|700000000|2000|6763977.8761061952|
|Flood|500000000|1000|4844925.23364486|
|Thunderstorm Wind|22000000|100|920328.36538461538|
|Hail|24000000|100|416890.56603773584|
|Flash Flood|5000000|300|266778.60962566844|
|High Wind|1000000|1000|209800|
|Cold/Wind Chill|500000|100000|200000|
|Heavy Rain|1150000|5000|171000|
|...|...|...|...|

### bin()

Instead of grouping rows by a specific column value, use the [bin()](./binfunction.md) function to divide the data into distinct ranges based on numeric or time values.

This example counts the number of storms that caused crop damage for each week in 2007. The `7d` argument represents a week, as the function requires a valid [timespan](scalar-data-types/timespan.md) value.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKWCKW2hqgkwqLs3NTSzKrEpVAJvunF+aV6Jgq5AMojU0FZIqFZIy8zTgNukoGKZoAgCRt8vYjQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize EventCount = count() by bin(StartTime, 7d)
```

|StartTime|EventCount|
|---|---|
|2007-01-01T00:00:00Z|16|
|2007-01-08T00:00:00Z|20|
|2007-01-29T00:00:00Z|8|
|2007-02-05T00:00:00Z|1|
|2007-02-12T00:00:00Z|3|
|2007-02-19T00:00:00Z|4|
|2007-02-26T00:00:00Z|3|
|2007-03-05T00:00:00Z|1|
|2007-03-19T00:00:00Z|2|
|2007-03-26T00:00:00Z|2|
|...|...|

Add `| render timechart` to the end of the query to visualize the results.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOQQ6CMBBF95ziL9tESIsLVroBT4AXKHQiXbSYYZBoPLzFhYmTSSZ5P5P3e5k5Xh6UZCne2CZiQi+O5RoiYSDZiBKUd0KSiaqNaUpj82pUFf65rcuj1RoF8rjk0bnobtTyfF9whsmGZY3RcXgRvtJ2XpPghHG/SmN4YghJ/Roc0Hid35iSJ8auGqecfQAkVosYtwAAAA==" target="_blank">Run the query</a>

:::image type="content" source="images/tutorial/crop-damage-by-week-time-chart.png" alt-text="Screenshot of the crop damage by week time chart rendered by the previous query.":::

> [!NOTE]
> `bin()` is similar to the `floor()` function in other programming languages. It reduces every value to the nearest multiple of the modulus that you supply and allows `summarize` to assign the rows to groups.

### sum()

The results of the [min(), max(), and avg() query](#min-max-and-avg) revealed that Freeze/Frost events tend to cause the most damage on average, but the [time chart from the bin() query](#bin) showed that most events that cause some level of crop damage occur during the summer months.

To further investigate this, modify the last query to use the [sum()](./sum-aggfunction.md) function instead of the `count()` function. This will allow us to see the total number of damaged crops, rather than just the number of events that caused some damage.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOwQrCMBBE74X+wxwTsCWth570on5B/YHULLaHpGWzWhQ/3gRBdNjTm2FnepnZn+4UJJbFC+tITOjFspwnTxhIVqIA5ayQJKJaY7rKNOk06hr/vGmrbaM1ygJJNjgcrbdXOvC8ROxhcke8eW95ehIy/gSwy1j9pDWGB4YpqO+YDTqn8wOm4IiRay9jMt/qYo/IxAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize CropDamage = sum(DamageCrops) by bin(StartTime, 7d)
| render timechart
```

:::image type="content" source="images/tutorial/sum-crop-damage-by-week.png" alt-text="Screenshot of time chart showing crop damage by week.":::

Now you can see a peak in crop damage in January, which probably was due to Freeze/Frost.

### dcount()

Approximate how many unique storm types there are by state using [dcount()](./dcount-aggfunction.md).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoLs3NTSzKrEpVCAbJhFQWpBYr2CqkJOeX5pVogBWCxDQVkiqBKhJLUsGa8otKIAIwLQAdj1AoVwAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents 
| summarize StormTypes = dcount(EventType) by State
| sort by StormTypes
```

|State|StormTypes|
|--|--|
|TEXAS|27|
|CALIFORNIA|26|
|PENNSYLVANIA|25|
|GEORGIA|24|
|ILLINOIS|23|
|...|...|

### make_set()

The [make_set()](./makeset-aggfunction.md) operator is a way to take a bunch of rows in a table and turn them into an array of unique values.

The following query uses `make_set()` to create an array of the event types that cause deaths in each state. The resulting table is then sorted by the number of storm types in each array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22NMQ7CMAxFdyTu4LGVGLgATGVgLhJjZeCLBEhSOS4oiMODC2Lq+vz8fqtJwuaOqHk+e9HDQUANWF1uvOCotKYlJfmxbTz9qfl5CIHFP0GthXalR957dV+bVhT4ii5Dq3HD7jUdysdmhQV6SRfrjWAxWRl3kqj9sQiX7oZ4VldNyfUbAcrl9NEAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where DeathsDirect > 0 or DeathsIndirect > 0
| summarize StormTypesWithDeaths = make_set(EventType) by State
| project State, StormTypesWithDeaths
| sort by array_length(StormTypesWithDeaths)
```

|State|StormTypesWithDeaths|
|--|--|
|CALIFORNIA|["Thunderstorm Wind","High Surf","Cold/Wind Chill","Strong Wind","Rip Current","Heat","Excessive Heat","Wildfire","Dust Storm","Astronomical Low Tide","Dense Fog","Winter Weather"]|
|TEXAS|["Flash Flood","Thunderstorm Wind","Tornado","Lightning","Flood","Ice Storm","Winter Weather","Rip Current","Excessive Heat","Dense Fog","Hurricane (Typhoon)","Cold/Wind Chill"]|
|OKLAHOMA|["Flash Flood","Tornado","Cold/Wind Chill","Winter Storm","Heavy Snow","Excessive Heat","Heat","Ice Storm","Winter Weather","Dense Fog"]|
|NEW YORK|["Flood","Lightning","Thunderstorm Wind","Flash Flood","Winter Weather","Ice Storm","Extreme Cold/Wind Chill","Winter Storm","Heavy Snow"]|
|KANSAS|["Thunderstorm Wind","Heavy Rain","Tornado","Flood","Flash Flood","Lightning","Heavy Snow","Winter Weather","Blizzard"]|
|...|...|

### case()

The [case()](./casefunction.md) function groups data into buckets based on specified conditions. The function returns the corresponding result expression for the first satisfied predicate, or the final else expression if none of the predicates are satisfied.

This example groups states based on the number of storm-related injuries their citizens sustained.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlXwzMsqLcpMLXbOL80rUbAFyWjAxFwyi1KTSzQVkioVgksSS1JBOlMrSlLzUuDanEqTs1NB+pITi1MVNHi5FPACVNvsFEwNdAhpUfJJLEpPVSKoDt1oQyKM9k1NySzNJd1sIowOzk3MySFsspJfvkIm1HQlfIo1wdGWX1QCjw2FxOJkAHJXMdXXAQAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize InjuriesCount = sum(InjuriesDirect) by State
| extend InjuriesBucket = case (
                              InjuriesCount > 50,
                              "Large",
                              InjuriesCount > 10,
                              "Medium",
                              InjuriesCount > 0,
                              "Small",
                              "No injuries"
                          )
| sort by State asc
```

|State|InjuriesCount|InjuriesBucket|
|--|--|--|
|ALABAMA|494|Large|
|ALASKA|0|No injuries|
|AMERICAN SAMOA|0|No injuries|
|ARIZONA|6|Small|
|ARKANSAS|54|Large|
|ATLANTIC NORTH|15|Medium|
|ATLANTIC SOUTH|2|Small|
|CALIFORNIA|221|Large|
|COLORADO|22|Medium|
|CONNECTICUT|1|Small|

Create a pie chart to visualize the proportion of states that experienced storms resulting in a large, medium, or small number of injuries.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WRvQ6CMBCAdxPe4cIEiYMOjjigDibqwhPUctEqLeZ6NWJ8eC3+JBgD2LG972vTL+OS9OKMhm0wuIF1WgtSV4SlOThSaGelMwyJP4nee3NFKDmGbQUZC0ZP4oXR5B8sdfKInpPCIkTBAFpX87YpTEbDLiRcCdph2Dn3rR73UK8xV07/7+6hzrQoim5zuClBvexh23D8I1v1/P20qusk0r8uqnM183iUHtWQ4KRQ7gXxHQoTE4gQAgAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize InjuriesCount = sum(InjuriesDirect) by State
| extend InjuriesBucket = case (
                              InjuriesCount > 50,
                              "Large",
                              InjuriesCount > 10,
                              "Medium",
                              InjuriesCount > 0,
                              "Small",
                              "No injuries"
                          )
| summarize InjuryBucketByState=count() by InjuriesBucket
| render piechart 
```

:::image type="content" source="images/tutorial/injuries-bucket-pie-chart.png" alt-text="Screenshot of Azure Data Explorer web UI pie chart rendered by the previous query.":::

## Join data from multiple tables

The [join](./joinoperator.md) operator is used to combine rows from tables based on matching values in specified columns and perform analysis on a combined data set.

Like `join`, the [lookup](lookupoperator.md) operator also combines rows from tables based on matching values in specified columns. However, there are several differences to consider, such as how each operator handles repeated columns, the types of lookups supported, performance considerations, and the size of the tables being joined.

### Cross-table joins

We have access to another table in the sample database called `PopulationData`. Use `take` to see what data this table contains.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwvILyjNSSzJzM9zSSxJVKhRKEnMTlUwNAAAWLY+MRgAAAA=" target="_blank">Run the query</a>

```kusto
PopulationData | take 10
```

|State|Population|
|--|--|
|ALABAMA|4918690|
|ALASKA|727951|
|ARIZONA|7399410|
|ARKANSAS|3025880|
|CALIFORNIA|39562900|
|COLORADO|5826180|
|CONNECTICUT|3559050|
|DELAWARE|982049|
|DISTRICT OF COLUMBIA|709951|
|FLORIDA|21711200|
|...|...|

The table contains a `State` column just like the one in the `StormEvents` table, and one more column showing the population of that state.

Join the `PopulationData` table with `StormEvents` on the `State` column to find the total property damage caused by storms per capita by state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOQQrCQAxF94J3yFJB8ASzsu4LPUHUIKlOMqYZodLDt2MRpeAy//NefuNq8fgk8W69GqDLMaLxi6A2TWTeVxjxShBKtZmPT7WFUw+No1NBW2WBG8slsAhZFn7kSaMp39FZpUJHUPkCybSls8/BbvGwJjtg4gkJyyn7H+l7s5qXJX8EI25L+sbiAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=innerunique PopulationData on State
| project State, PropertyDamagePerCapita = PropertyDamage / Population
| sort by PropertyDamagePerCapita
```

Add `| render columnchart` to the query to visualize the result.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOQQrCQAxF94J3yFJB8ARdWfeFniC2QVM7yZhmhIqHt2MRpeAy+Xk/r3a1cLyT+LBePWFIIaDxg6AyjWQ+lhjwTFDkaDMPn2gLpxFqR6eMdsoCV5a2YBGyJHxLU43G1KOzSomOoPIFomlHjc+L3eJhRXbAyBNSLFX2P6VvZzXPJn8K8omRtGTQaJ+CNBc0fwFjx28n+AAAAA==" target="_blank">Run the query</a>

:::image type="content" source="images/tutorial/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

### Join query results

Joins can be done based off of query results from the same table as well.

Say you want to create a list of states in which both lightning and avalanche events occurred. Use the join operator to merge the rows of two tables—one containing data on lightning events and the other containing data on avalanche events—based on the `State` column.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZR8MtMzSvIy89KVgAqy8jPzFLIz81JsM/PyUosUNLgUgCAYYYgCWAC7SY5liTmJeckZqUpgRZpgMj8PqD2xJFVBAWh8SmZxSWZecglECABlvNsfnAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where EventType == "Lightning"
| join kind=inner (
    StormEvents 
    | where EventType == "Avalanche"
    )
    on State  
| distinct State
```

|State|
|--|
|OREGON|
|UTAH|
|WYOMING|
|WASHINGTON|
|COLORADO|
|IDAHO|
|NEVADA|

## Define variables

[Let statements](letstatement.md) are used to define variables within a query. Defining variables can improve the readability, reusability, and exploratory potential of your queries.

### Readability

Defining variables can help clarify the purpose and function of different parts of a query.

In the following query, a let statement separates out the parts of the query expression in the previous `join` example. This separation highlights the overall purpose of the query, which is to find the distinct states where both lightning and avalanche events occurred.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WOsQ6DMBBDd77C4jeqDB26sZUfiOBErg1OlZyoKvHxRCAxtFM338l+dhRDp1MwKqe7pTwXOOzitgitYMU7SBbsZ/95CZxDe2baSxMr47r46DkE+YNxZirje0Oz4pGUeCpHp6Tkn4rE2uFNqnXUYsrBjscGj91by9QAAAA=" target="_blank">Run the query</a>

```kusto
let LightningStorms = StormEvents | where EventType == "Lightning";
let AvalancheStorms = StormEvents | where EventType == "Avalanche";
LightningStorms 
| join kind=inner AvalancheStorms on State
| distinct State
```

|State|
|--|
|OREGON|
|UTAH|
|WYOMING|
|WASHINGTON|
|COLORADO|
|IDAHO|
|NEVADA|

### Reusability

Defining variables allows you to reuse them multiple times within a query.

In the following query, a list of `WindStorms` is defined and used to filter the `StormEvents` table. To add another type of wind storm to the query, just add it to the list of `WindStorms`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12PwQqDQAxE735F8KTgH5QeC17sRaGHUkrQ4G6pScmuFqEfX7vais1tMm+G5E4eTpab0ot2DvbQjIydrZNzBNPElShjI3EGizY9N6Tug4dgnM1GIexE+AfmvaqtkekL5LY1m0TpVbhdVkuqQLVMsLJhfUl3UTjwMBB7F73gaUgJgqzGB4FlSNY3UhCdzSOqorcDgUF3RR432FT0ULlR7deq7C/4Bhq91F4hAQAA" target="_blank">Run the query</a>

```Kusto
let WindStorms = dynamic([
    "Tornado", 
    "Thunderstorm Wind",
    "Monsoon", 
    "Hurricane",
    "High Wind",
    "Strong Wind", 
    "Marine High Wind"
    ]);
StormEvents
| where EventType in (WindStorms) or EventNarrative has_any (WindStorms)
| project EpisodeId, EventType, EventNarrative
```

|EpisodeId|EventType|EventNarrative|
|--|--|--|
|829|Thunderstorm Wind|Sheriff reported a couple of trees down near Elijah Clark State Park.|
|...|...|...|
|10020|Drought|The southwest monsoon brought surges of moisture to western Colorado resulting in periodic outbreaks of showers and thunderstorms. This resulted in some improvement across extreme southwest Colorado where moderate drought lost its grip. However, abnormally dry conditions and water supply concerns persisted across the area due to long-term dryness and above normal temperatures.|
|...|...|...|
|10942|Flash Flood|Heavy rain associated with Hurricane Humberto caused flooded service roads along I-10 between Vidor and Orange.|
|...|...|...|

### Exploratory potential

Defining variables allows you to modify and experiment with different values in your query.

In the following example, the variables `MinDamage` and `EventLocation` are used to filter the `StormEvents` table. Explore different scenarios by changing the values of these variables and rerunning the query.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA11OzQqCQBC++xSDJ8VLl06ygViBYD9kL7DVooK7K+NobPTwrW7/c/v+pxEEm1otueSlAAbz2Xix11h+NQhFuT5zqrWymp8mebbeHbZZ4sdeQRrlZOm8O1wrgQIK4mRb2G/0LbuVFHXbQfREe4sEkoEF+zxiE10vJcf69kox1L26BHwog79g9N0bhnAybv5o2qlII42cMz0Abpac3PAAAAA=" target="_blank">Run the query</a>

```kusto
let MinDamage = 500000;
let EventLocation = "CALIFORNIA";
StormEvents
| where State == EventLocation
| where DamageCrops + DamageProperty >= MinDamage
| summarize Damage=round(avg(DamageProperty + DamageCrops)) by EventType
| sort by Damage
```

|EventType|Damage|
|--|--|
|Wildfire|97707143|
|Frost/Freeze|54662917|
|Debris Flow|48000000|
|High Wind|15000000|
|Thunderstorm Wind|4000000|
|Drought|2000000|
|Flash Flood|500000|
|Flood|500000|
|Dust Storm|500000|

## Calculate percentages

Calculating percentages is a useful tool for understanding and interpreting data. In this section, we'll explore two common scenarios for calculating percentages and provide step-by-step explanations.

### Calculate percentage based on two columns

To find the percentage of storm events that caused crop damage in each state, use the `count()` and `countif()` functions to count the total number of storms and the number of storms that caused crop damage in each state.

Then, use the [extend](extendoperator.md) operator to calculate the percentage of storms that caused crop damage in each state by dividing the number of storms with property damage by the total number of storms and multiplying by 100.

To ensure that you get a decimal result, use the [todouble()](todoublefunction.md) function to convert at least one of the count values, which are integers, to a double before performing the division.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPPQ+CQAyGdxL+Q8c7QyK666QDGwkmzgdXlYS7mlKMGH+8wEWns2Pfjz6thNgdH+ilT5M39INzhtsXQprANCcS01Wzpy98JUYQdtDQ4EXpLFiCem7lVjLdkWU8GGeuP2N7UWHxlWEPuQ7ZeoSldD6NT0FvoURuJppoXwjx1GqVErI01B2qfwAa1jH+FWzyXGew1cvDxBIw4iUfrI4MCiABAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize 
    TotalStormsInState = count(),
    StormsWithPropertyDamage = countif(DamageProperty > 0)
    by State
| extend PercentWithPropertyDamage = 
    round((todouble(StormsWithPropertyDamage) / TotalStormsInState * 100), 2)
| sort by StormsWithPropertyDamage
```

|State|TotalStorms|StormsWithCropDamage|PercentWithCropDamage|
|--|--|--|--|
|TEXAS|4701|1205|25.63|
|IOWA|2337|1062|45.44|
|OHIO|1233|730|59.21|
|GEORGIA|1983|666|33.59|
|VIRGINIA|1647|622|37.77|
|...|...|...|...|

> [!NOTE]
> When calculating percentages, convert at least one of the integer values in the division with [todouble() or toreal()](todoublefunction.md). This will ensure that you don't get truncated results due to integer division.

### Calculate percentage from table size

To compare the number of storms by event type to the total number of storms in the database, you'll need to first save the total number of storms in the database as a variable..

Since tabular expression statements return tabular results, use the [toscalar()](toscalarfunction.md) function to convert the tabular result of the `count()` function to a scalar value. Then, the numeric value can be used in the subsequent calculation.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOwQrCMBBE74X+wx4TKRrP4km8F+wPpHERJemWzUao+PG2UWg8zuPNMB4FOhLrL0IcIhxBKDrrLatMzk8cJMIbYgrB8v2F4CgNorQ+1FWh1FXpZHZaxHnxV4B++vJuGnHRR6YHOllhU/QaaJHdnOwN86srpd6jWg0Nu7/rG9gbszUfSEMd+dIAAAA=" target="_blank">Run the query</a>

```kusto
let TotalStorms = toscalar(StormEvents | summarize count());
StormEvents
| summarize EventCount = count() by EventType
| project EventType, EventCount, Percentage = todouble(EventCount) / TotalStorms * 100.0
```

|EventType|EventCount|Percentage|
|--|--|--|
|Thunderstorm Wind|13015|22.034673077574237|
|Hail|12711|21.519994582331627|
|Flash Flood|3688|6.2438627975485055|
|Drought|3616|6.1219652592015716|
|Winter Weather|3349|5.669928554498358|
|...|...|...|

## Calculate correlation coefficients

To determine if there is a relationship between the population of a state and the amount of damage caused by storms, use the [series_pearson_correlation](series-pearson-correlationfunction.md) function.

This query calculates the total amount of property damage caused by storms in each state and joins it with population data. The resulting columns are converted into series and the correlation coefficient is calculated.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31QQQ6CQAy8m/iHHiHxC57UuwkPIBWKKbot6RajxscrEgWVeGxnpjPTzNXC5kTicT67QWxDQOMrwda0IfPLGgPuCZYdlPTDC0phd4HM0amT1soCB5ZyySJksNWmPaKzyhodQWWgNqY1Ff7lsRhJ/mXJyJjiI1HAA+VHjp58EtLxpSn2G0w7Hzo7SQkrNaN+vVKqKi748ZWu+PNC3hBaVMmLgZdMBfs1T8edp23umV6O3ocBAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=inner PopulationData on State
| project PropertyDamage, Population
| summarize PropertyDamageSeries = make_list(PropertyDamage), PopulationSeries = make_list(Population)
| extend CorrelationCoefficient = series_pearson_correlation(PropertyDamageSeries, PopulationSeries)
| project CorrelationCoefficient
```

|CorrelationCoefficient|
|--|
|0.64199107528146893|

A coefficient of 0.6419 suggests that there is a connection between the state population and the property damage caused by storms.

## Perform geospacial clustering

Geospatial clustering is a way to organize and analyze data based on geographical location. KQL offers multiple methods for performing [geospatial clustering](geospatial-grid-systems.md), as well as tools for [geospacial visualizations](geospatial-visualizations.md).

In this section, we'll demonstrate how to use the [geo_point_to_s2cell](geo-point-to-s2cell-function.md) and [geo_s2cell_to_central_point](geo-s2cell-to-central-point-function.md) functions to group storms into clusters based on their geographical location.

### Cluster storm events by type

The following query filters for all storm events of the "Tornado" event type, projects the longitude and latitude for each event, and filters out any null values for these fields. It then groups the events into clusters based on their longitude and latitude using the [geo_point_to_s2cell](geo-point-to-s2cell-function.md) function, counts the number of events in each cluster, and projects the central point of the cluster. The resulting count is renamed as "Events" and the query renders a map to visualize the results.

```kusto
StormEvents
| where EventType == "Tornado"
| project BeginLon, BeginLat
| where isnotnull(BeginLat) and isnotnull(BeginLon)
| summarize count_summary=count() by hash = geo_point_to_s2cell(BeginLon, BeginLat, 4)
| project geo_s2cell_to_central_point(hash), count_summary
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="images/tutorial/tornado-geospacial-map.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospacial map of tornado storms.":::

### Cluster storm events in a specific region

To identify the distribution of storms within a specific region of interest, use a polygon to define the region and the geo_point_in_polygon function to filter for storm events that occur within it. The following query defines a polygon representing the southern California region and filters for storm events within this region, projecting the longitude and latitude for each event. It then groups the events into clusters using the geo_point_to_s2cell function, counts the number of events in each cluster, and projects the central point of the cluster. The resulting count is renamed as "Events" and the query renders a pie chart map.

```kusto
let southern_california = dynamic({
    "type": "Polygon",
    "coordinates": [[[-119.5, 34.5], [-115.5, 34.5], [-115.5, 32.5], [-119.5, 32.5], [-119.5, 34.5]]
    ]});
StormEvents
| where geo_point_in_polygon(BeginLon, BeginLat, southern_california)
| project BeginLon, BeginLat
| summarize count_summary = count() by hash = geo_point_to_s2cell(BeginLon, BeginLat, 8)
| project geo_s2cell_to_central_point(hash), count_summary
| extend Events = "count"
| render piechart with (kind = map)
```

:::image type="content" source="images/tutorial/southern-california-geospacial-mnap.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospacial map of southern california storms.":::

## Next steps

* Read more about the [Kusto Query Language](index.md)
* Learn how to perform [cross-database and cross-cluster queries](cross-cluster-or-database-queries.md)
* Get a comprehensive understanding by reading the [white paper](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-explorer/Azure_Data_Explorer_white_paper.pdf)
* Learn how to [ingest data](../../ingest-sample-data.md)

::: zone-end

::: zone pivot="azuremonitor"

The best way to learn about the Azure Data Explorer Query Language is to look at some basic queries to get a "feel" for the language. These queries are similar to queries in the Azure Data Explorer tutorial, but use data from common tables in an Azure Log Analytics workspace.

Run these queries by using Log Analytics in the Azure portal. Log Analytics is a tool you can use to write log queries. Use log data in Azure Monitor, and then evaluate log query results. If you aren't familiar with Log Analytics, complete the [Log Analytics tutorial](/azure/azure-monitor/log-query/log-analytics-tutorial).

All queries in this tutorial use the [Log Analytics demo environment](https://ms.portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade). You can use your own environment, but you might not have some of the tables that are used here. Because the data in the demo environment isn't static, the results of your queries might vary slightly from the results shown here.

## Count rows

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's collected by insights such as Azure Monitor for VMs and Azure Monitor for containers. To find out how large the table is, we'll pipe its content into an operator that counts rows.

A query is a data source (usually a table name), optionally  followed by one or more pairs of the pipe character and some tabular operator. In this case, all records from the `InsightsMetrics` table are returned and then sent to the [count operator](./countoperator.md). The `count` operator displays the results because the operator is the last command in the query.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
InsightsMetrics | count
```

Here's the output:

|Count|
|-----|
|1,263,191|

## Filter by Boolean expression: *where*

The [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity) table has entries from the Azure activity log, which provides insight into subscription-level or management group-level events occuring in Azure. Let's see only `Critical` entries during a specific week.

The [where](./whereoperator.md) operator is common in the Kusto Query Language. `where` filters a table to rows that match specific criteria. The following example uses multiple commands. First, the query retrieves all records for the table. Then, it filters the data for only records that are in the time range. Finally, it filters those results for only records that have a `Critical` level.

> [!NOTE]
> In addition to specifying a filter in your query by using the `TimeGenerated` column, you can specify the time range in Log Analytics. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope).

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
```

:::image type="content" source="images/tutorial/azure-monitor-where-results.png" lightbox="images/tutorial/azure-monitor-where-results.png" alt-text="Screenshot that shows the results of the where operator example.":::

## Select a subset of columns: *project*

Use [project](./projectoperator.md) to include only the columns you want. Building on the preceding example, let's limit the output to certain columns:

```kusto
AzureActivity
| where TimeGenerated > datetime(10-01-2020) and TimeGenerated < datetime(10-07-2020)
| where Level == 'Critical'
| project TimeGenerated, Level, OperationNameValue, ResourceGroup, _ResourceId
```

:::image type="content" source="images/tutorial/azure-monitor-project-results.png" lightbox="images/tutorial/azure-monitor-project-results.png" alt-text="Screenshot that shows the results of the project operator example.":::

## Show *n* rows: *take*

[NetworkMonitoring](/azure/azure-monitor/reference/tables/networkmonitoring) contains monitoring data for Azure virtual networks. Let's use the [take](./takeoperator.md) operator to look at 10 random sample rows in that table. The [take](./takeoperator.md) shows some rows from a table in no particular order:

```kusto
NetworkMonitoring
| take 10
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="images/tutorial/azure-monitor-take-results.png" lightbox="images/tutorial/azure-monitor-take-results.png" alt-text="Screenshot that shows the results of the take operator example.":::

## Order results: *sort*, *top*

Instead of random records, we can return the latest five records by first sorting by time:

```kusto
NetworkMonitoring
| sort by TimeGenerated desc
| take 5
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

You can get this exact behavior by instead using the [top](./topoperator.md) operator:

```kusto
NetworkMonitoring
| top 5 by TimeGenerated desc
| project TimeGenerated, Computer, SourceNetwork, DestinationNetwork, HighLatency, LowLatency
```

:::image type="content" source="images/tutorial/azure-monitor-top-results.png" lightbox="images/tutorial/azure-monitor-top-results.png" alt-text="Screenshot that shows the results of the top operator example.":::

## Compute derived columns: *extend*

The [extend](./projectoperator.md) operator is similar to [project](./projectoperator.md), but it adds to the set of columns instead of replacing them. You can use both operators to create a new column based on a computation on each row.

The [Perf](/azure/azure-monitor/reference/tables/perf) table has performance data that's collected from virtual machines that run the Log Analytics agent.

```kusto
Perf
| where ObjectName == "LogicalDisk" and CounterName == "Free Megabytes"
| project TimeGenerated, Computer, FreeMegabytes = CounterValue
| extend FreeGigabytes = FreeMegabytes / 1000
```

:::image type="content" source="images/tutorial/azure-monitor-extend-results.png" lightbox="images/tutorial/azure-monitor-extend-results.png" alt-text="Screenshot that shows the results of the extend operator example.":::

## Aggregate groups of rows: *summarize*

The [summarize](./summarizeoperator.md) operator groups together rows that have the same values in the `by` clause. Then, it uses an aggregation function like `count` to combine each group in a single row. A range of [aggregation functions](aggregation-functions.md) are available. You can use several aggregation functions in one `summarize` operator to produce several computed columns.

The [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent) table contains security events like logons and processes that started on monitored computers. You can count how many events of each level occurred on each computer. In this example, a row is produced for each computer and level combination. A column contains the count of events.

```kusto
SecurityEvent
| summarize count() by Computer, Level
```

:::image type="content" source="images/tutorial/azure-monitor-summarize-count-results.png" lightbox="images/tutorial/azure-monitor-summarize-count-results.png" alt-text="Screenshot that shows the results of the summarize count operator example.":::

## Summarize by scalar values

You can aggregate by scalar values like numbers and time values, but you should use the [bin()](./binfunction.md) function to group rows into distinct sets of data. For example, if you aggregate by `TimeGenerated`, you'll get a row for most time values. Use `bin()` to consolidate values per hour or day.

The [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table contains performance data that's organized according to insights from Azure Monitor for VMs and Azure Monitor for containers. The following query shows the hourly average processor utilization for multiple computers:

```kusto
InsightsMetrics
| where Computer startswith "DC"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
```

:::image type="content" source="images/tutorial/azure-monitor-summarize-avg-results.png" lightbox="images/tutorial/azure-monitor-summarize-avg-results.png" alt-text="Screenshot that shows the results of the avg operator example.":::

## Display a chart or table: *render*

The [render](./renderoperator.md?pivots=azuremonitor) operator specifies how the output of the query is rendered. Log Analytics renders output as a table by default. You can select different chart types after you run the query. The `render` operator is useful to include in queries in which a specific chart type usually is preferred.

The following example shows the hourly average processor utilization for a single computer. It renders the output as a timechart.

```kusto
InsightsMetrics
| where Computer == "DC00.NA.contosohotels.com"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

:::image type="content" source="images/tutorial/azure-monitor-render-results.png" lightbox="images/tutorial/azure-monitor-render-results.png" alt-text="Screenshot that shows the results of the render operator example.":::

## Work with multiple series

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

What if you need to retrieve data from two tables in a single query? You can use the [join](./joinoperator.md?pivots=azuremonitor) operator to combine rows from multiple tables in a single result set. Each table must have a column that has a matching value so that the join understands which rows to match.

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

## Assign a result to a variable: *let*

Use [let](./letstatement.md) to make queries easier to read and manage. You can use this operator to assign the results of a query to a variable that you can use later. By using the `let` statement, the query in the preceding example can be rewritten as:

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
