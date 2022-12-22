---
title: Write KQL queries for Azure Data Explorer
description: Learn how to perform basic and more advanced queries for Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: tutorial
ms.date: 12/19/2022
ms.localizationpriority: high
---

# Write KQL Queries for Azure Data Explorer

In this tutorial, you'll learn how to use the [Kusto Query Language (KQL)](./kusto/query/index.md) to perform queries in Azure Data Explorer.

We'll give an overview of KQL and then provide you with the essential concepts and tools needed for retrieving, manipulating, and visualizing data. You'll also learn how to join tables and define variables to make your queries more efficient and reusable.

By the end of this tutorial, you'll have the foundation you need in KQL to start uncovering valuable insights in your data.

## Prerequisites

- A Microsoft or Azure account to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)
- Familiarity with database structures like tables, columns, and rows

## Introduction to KQL queries

A KQL query is a read-only request to retrieve and process data in Azure Data Explorer. These queries consist of one or more query statements and return data in tabular or graphical format.

### Tabular expression statements

The most common type of query statement is a tabular expression statement. These statements are used to manipulate data in tables or tabular datasets. They consist of one or more operators, separated by a pipe (`|`), and process the data sequentially. Each operator begins with a tabular input and returns a tabular output.

The order of the operators is important, as the data flows from one operator to the next and is transformed at each step. Think of it like a funnel where the data starts as an entire table and is refined as it passes through each operator, until you're left with a final output at the end.

Read the following query, and then we'll go through it step by step.

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

1. The `StormEvents` table is filtered by the `where` operator to include rows with `StartTime` values within the specified date range.
1. The filtered table is then further filtered by another `where` operator to include rows with a `State` value of "FLORIDA".
1. The final table is passed to the `count` operator, which returns a new table with a single column, `Count`, containing the number of rows in the table.

## Get started with common operators

Let's learn some common query operators using the `StormEvents` table. These operators are key to understanding KQL and will be used in many of your queries.

### count

Let's begin by using the [count](kusto/query/countoperator.md) operator to find the number of storm records in our table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVqhRSM4vzSsBALU2eHsTAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents | count
```

|Count|
|--|
|59066|

### take

To get a sense of the data in our table, let's use the [take](kusto/query/takeoperator.md) operator to view a sample of records. This operator returns a specified number of random rows from the table, which can be useful for previewing the data and becoming familiar with it.

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

Let's use the [project](kusto/query/projectoperator.md) operator to simplify our view and select a specific subset of columns. Using `project` is often more efficient and easier to read than viewing all columns.

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

It appears that there are multiple types of storms based on the results of our previous query. Let's use the [distinct](kusto/query/distinctoperator.md) operator to list all of the unique storm types.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRSMksLsnMSy5RAIuEVBakAgD24XVdIAAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents | distinct EventType
```

There are 46 types of storms in our table.

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

The [where](kusto/query/whereoperator.md) operator filters rows of data based on certain criteria. Let's look for storm events in a specific `State` of a specific `EventType`.

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

To view the top five floods in Texas that caused the most damage, let's use the [sort](kusto/query/sortoperator.md) operator to arrange the rows in descending order based on the `DamageProperty` column and `take` to display only the top five rows.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12NPQsCMRBEe8H/MF2atJZXCMZauBS28bL4mWzYLCcBf7zkrhDsHszMm1FZkpspa91uPnjfSAijBiUMA4x35/1oEHLEUvKtrMHxxRxNn1QWxaXhEFK40km4kGhDpDr1WMOTsOtUhB80abeL+nsiC5fjCsuj/X3YP90XMW6LAacAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| sort by DamageProperty desc
| take 5
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

The [top](kusto/query/topoperator.md) operator returns the first *n* rows sorted by the specified column.

The following query will return the same results as the previous example in the `sort` section but with one less operator.

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

### extend

Use the [extend](kusto/query/extendoperator.md) operator to add computed columns to a table.

Let's extend the table showing the top five floods in Texas to include a `Duration` column by calculating the difference between the `StartTime` and `EndTime` columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAF2OvQ7CMAyEdyTewVuWMDJ2QGr5WQJSKzGHxoIiEkeuKVTi4WmooBKbfXeffaUQ%2b6LDIO189oLHBRnhs1d9RMgyUOsbkVNgg4NSrIzicVVud2ZT7Y1KnFCEJZx6yK23ZzwwRWTpwWFbJx%2bfggOf39lKQwEyKIKrGo%2bwSEdZ0pyCkemKtUyi%2fib1j9ZjDz311H9%2fBys2LTk0lhPT4RvwA3pn6AAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty desc
| extend Duration = EndTime - StartTime
| project StartTime, EndTime, Duration, DamageProperty
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

In the following examples, we'll use the [summarize](kusto/query/summarizeoperator.md) operator together with aggregation functions to find insights in our data, and the [render](kusto/query/renderoperator.md) operator to visualize the results.

### count()

Use `summarize` with the [count](kusto/query/count-aggfunction.md) aggregation function to find the number of events by state.

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

Then, use `render` to visualize the output.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIyS9JzAkGyRYr2Cok55fmlWhoKiRVKgSXJJakgtQWpealpBYpJCUWJWckFpUAAFJrtYhKAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize TotalStorms = count() by State
| render barchart
```

:::image type="content" source="media/write-queries/total-storms-by-state-bar-chart.png" alt-text="Screenshot of total storms by state bar chart created with the render operator. ":::

### countif()

It's possible to use multiple aggregation functions in a single `summarize` operator to produce several computed columns.

Let's add the [countif()](kusto/query/countif-aggfunction.md) function to our query to add a column showing the count of storms that caused damage. Then, we'll `extend` our table with a calculation between the `TotalStorms` and `StormsWithCropDamage` columns to find the percentage of storms that caused damage.

Finally, use the `top` operator to identify states with the most crop damage from storms.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22OwQrCMBBE74X+wxwTKVgFj3pR70IFz2m7aqFJSrIVFT/ehKAIdY+zM/OmYuv0/kaGfZ694EetleuehDxDuKNl1VfR47FGY0fDQhbpl+RTx9ets8NOaXWhj6k7iyTEl8cGpUyh+hFyiinC6M5kWhzINYE/KUoBF+paIdi2dqx7Ev+oEnN8DT+TJWZYlKUssJQRyHbAKk2YlrwBwRSpiQoBAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize 
    TotalStorms = count(),
    StormsWithCropDamage = countif(DamageCrops > 0)
    by State
| extend PercentWithCropDamage = 
    round((todouble(StormsWithCropDamage) / todouble(TotalStorms) * 100), 2)
| top 5 by StormsWithCropDamage
```

|State|TotalStorms|StormsWithCropDamage|PercentWithCropDamage|
|--|--|--|--|
|IOWA|2337|359|15.36|
|NEBRASKA|1766|201|11.38|
|MISSISSIPPI|1218|105|8.62|
|NORTH CAROLINA|1721|82|4.76|
|MISSOURI|2016|78|3.87|

> [!NOTE]
> The `todouble()` function is used to cast the integer values returned by the `count()` and `countif()` aggregation functions to doubles before performing division. Without the `todouble()` function, the division would be an integer division, resulting in a truncated result.

### min(), max(), and avg()

Let's learn more about types of storms that cause crop damage using the `min()`, `max()`, and `avg()` aggregation functions.

We'll filter out rows with no damaged crops, calculate the minimum, maximum, and average crop damage for each event type, and sort the result by the average damage.

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

Instead of grouping rows by a specific column value, we can use the [bin()](kusto/query/binfunction.md) function to divide the data into distinct ranges based on numeric or time values.

The following example finds the event count of storms that caused crop damage for each week in 2007.

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

:::image type="content" source="media/write-queries/crop-damage-by-week-time-chart.png" alt-text="Screenshot of the crop damage by week time chart rendered by the previous query.":::

> [!NOTE]
> `bin()` is similar to the `floor()` function in other programming languages. It reduces every value to the nearest multiple of the modulus that you supply and allows `summarize` to assign the rows to groups.

### sum()

The results of the previous queries revealed that Freeze/Frost events tend to cause the most damage on average, but the chart showed that most events that cause some level of crop damage occur during the summer months.

To further investigate this, modify the last query to use the [sum()](kusto/query/sum-aggfunction.md) function instead of the `count()` function. This will allow us to see the total amount of damaged crops, rather than just the number of events that caused some damage.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOwQrCMBBE74X+wxwTsCWth570on5B/YHULLaHpGWzWhQ/3gRBdNjTm2FnepnZn+4UJJbFC+tITOjFspwnTxhIVqIA5ayQJKJaY7rKNOk06hr/vGmrbaM1ygJJNjgcrbdXOvC8ROxhcke8eW95ehIy/gSwy1j9pDWGB4YpqO+YDTqn8wOm4IiRay9jMt/qYo/IxAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize CropDamage = sum(DamageCrops) by bin(StartTime, 7d)
| render timechart
```

:::image type="content" source="media/write-queries/sum-crop-damage-by-week.png" alt-text="Screenshot of time chart showing crop damage by week.":::

Now we can see a peak in crop damage in January, which probably was due to Freeze/Frost.

### dcount()

Check how many unique storm types there are by state using [dcount()](kusto/query/dcount-aggfunction.md).

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

It seems some states experience more types of storms than others. Could it be that an increase in storm types is correlated with an increase in damages or deaths?

Let's check.

The following query gets the distinct count of storm types and uses [sum()](kusto/query/sum-aggfunction.md) to calculate the damage per state. Then, it renders a scatter chart to visualize the data points.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NPQ7CMAxG90q9g8dG9AqdgB2pvYBJLX5E4shxKwX18CRkiTd/fv7erCzuupPX2HcHxM05lNeX+g7yzOW6pEARJlgtb16HP1wyM1ZoYcXPBR0+KFO5YajLTTiQaDJwatJzTqOpn/eUDahUzEH4TVYb5dg2F0TIryQQLaqS2CeK/gAUuA+1vwAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize
    StormTypes = dcount(EventType),
    TotalDamage = sum(DamageProperty) + sum(DamageCrops)
    by State
| project StormTypes, TotalDamage
| render scatterchart
```

:::image type="content" source="media/write-queries/damage-by-storm-type-count-scatter-chart.png" alt-text="Screenshot of scatter chart showing property damage by storm type count.":::

It doesn't seem there's a tight connection here.

What about deaths?

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NsQ6DMAxEdyT+wSOo/EI3OnSGH3ATS4CaBDlHJap+fBOyxNvdPd9NCOoeH/GIbfOjeDjHun6lbSjdlNP53CXSnawJh0d3wdnrhwLNAfwehbFkKjV0RYyrikFPt8p7elvc8vo60wRD8vSuYUtJtTnU1RlR8VaUomFA1Cys+ANUUMvywAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize
    StormTypes = dcount(EventType),
    TotalDeaths = sum(DeathsDirect) + sum(DeathsIndirect)
    by State
| project StormTypes, TotalDeaths
| render scatterchart
```

:::image type="content" source="media/write-queries/deaths-by-storm-type-scatter-chart-NOWHERE.png" alt-text="Screenshot of deaths by storm type count scatter chart.":::

Based on the chart, it seems that there may be a relationship worth exploring between the number of storm types and deaths.

### case()

The [case()](kusto/query/casefunction.md) function groups data into buckets based on specified conditions. The function returns the corresponding result expression for the first satisfied predicate, or the final else expression if none of the predicates are satisfied.

In this example, we group states based on the number of storm-related injuries their citizens sustained.

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

Let's create a pie chart to visualize the proportion of states that experienced storms resulting in a large, medium, or small number of injuries.

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

:::image type="content" source="media/write-queries/injuries-bucket-pie-chart.png" alt-text="Screenshot of Azure Data Explorer web UI pie chart rendered by the previous query.":::

## Join data

The [join](kusto/query/joinoperator.md) operator is used to combine rows from tables based on matching values in specified columns and perform analysis on a combined data set.

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

Let's join the `PopulationData` table with `StormEvents` on the `State` column to find the total property damage caused by storms per capita by state.

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

:::image type="content" source="media/write-queries/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

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

## Define variables with let statements

Let statements are used to define variables within a query. Defining variables can improve the readability, reusability, and exploratory potential of your queries.

### Readability

Defining variables can make it easier to understand the purpose and function of different parts of a query.

In the following query, a let statement separates out the parts of the query expression in the previous `join` example that filter the `StormEvents` table by `EventType`. This separation makes it easier to understand the overall purpose of the query, which is to find the distinct states where both lightning and avalanche events occurred.

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

In the following example, a list of `WindStorms` is defined and used to filter the `StormEvents` table. If you want to add another type of wind storm to the query, just add it to the list of `WindStorms` instead of modifying the query itself.

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

Defining variables allows you to easily modify and experiment with different values in your query.

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

## Next steps

- Read more about the [Kusto Query Language](./kusto/query/index.md)
- Learn how to perform [cross-database and cross-cluster queries](./kusto/query/cross-cluster-or-database-queries.md)
