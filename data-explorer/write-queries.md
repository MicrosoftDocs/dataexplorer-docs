---
title: Write queries for Azure Data Explorer
description: Learn how to perform basic and more advanced queries for Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: tutorial
ms.date: 12/19/2022
ms.localizationpriority: high
---

# Write queries for Azure Data Explorer

In this tutorial, you'll learn how to perform queries in Azure Data Explorer using the [Kusto Query Language](./kusto/query/index.md). We'll explore the essentials of writing queries, including how to retrieve data, filter, aggregate, and visualize your data.

## Prerequisites

- A Microsoft account or an Azure Active Directory user identity to access the [help cluster](https://dataexplorer.azure.com/clusters/help).
- Familiarity with database structures like tables, columns, and rows.

## Connect to the data

MAKE SURE THEY'RE IN CONTEXT OF SAMPLES DB.

## Kusto Query Language overview

The Kusto Query Language (KQL) is used to write queries and retrieve data in Azure Data Explorer. A KQL query consists of one or more query statements separated by a semicolon and returns data in tabular or graphical format.

There are three types of query statements: tabular expression statements, let statements, and set statements. In this tutorial, we'll mainly focus on tabular expression statements but will also briefly cover let statements, which allow us to use variables in queries.

### Tabular expression statements

A tabular expression statement is a type of query that manipulates data in tables or tabular datasets. It consists of one or more operators, which are separated by a pipe (`|`) and process the data sequentially. Each operator starts with a tabular input and returns a tabular output.

The order of the operators is important, as the data flows from one operator to the next and is transformed at each step. Think of it like a funnel where the data starts as an entire table and is refined as it passes through each operator, until you're left with a final output at the end.

#### Example

The following steps are performed in this example query.

1. The `StormEvents` table is filtered to select rows with `StartTime` values within the specified date range.
1. The filtered table is further narrowed down to include only rows with a `State` value of "FLORIDA".
1. The final table is passed to the `count` operator, which returns a new table containing the count of rows.

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

> [!NOTE]
> [limit](kusto/query/limitoperator.md) is an alias for [take](kusto/query/takeoperator.md) and has the same effect.

### project

Let's use the [project](kusto/query/projectoperator.md) operator to simplify our view and select a specific subset of columns. This is often more efficient and easier to read than viewing all columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwNACyCorys1KTSxSCSxJLUnUUwCpCKgtSAXs3VfgwAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| take 10
| project State, EventType
```

|State|EventType|
|--|--|--|
|ATLANTIC SOUTH| Waterspout|
|FLORIDA| Heavy Rain|
|FLORIDA| Tornado|
|GEORGIA| Thunderstorm Wind|
|MISSISSIPPI| Thunderstorm Wind|
|MISSISSIPPI| Tornado|
|MISSISSIPPI| Thunderstorm Wind|
|MISSISSIPPI| Hail|
|AMERICAN SAMOA| Flash Flood|
|KENTUCKY| Flood|

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

The [where](kusto/query/whereoperator.md) operator filters rows of data based on certain criteria. Let's try it and look for storm events in a specific `State` of a specific `EventType`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVbC1VVAPcY1wDFZXSMxLUQArCqksgEi45eTnp6iDtBQU5WelJpeANBWVhGTmpuoouOalQBhgg3QQWnUUXBJzE9NTA4ryC1KLSioBBDYIBX4AAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| project StartTime, EndTime, State, EventType, DamageProperty
```

There are 146 events that match these conditions. The following table shows a sample of 5 of them.

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-01-13T08:45:00Z| 2007-01-13T10:30:00Z| TEXAS| Flood| 0|
|2007-01-13T09:30:00Z| 2007-01-13T21:00:00Z| TEXAS| Flood| 0|
|2007-01-13T09:30:00Z| 2007-01-13T21:00:00Z| TEXAS| Flood| 0|
|2007-01-15T22:00:00Z| 2007-01-16T22:00:00Z| TEXAS| Flood| 20000|
|2007-03-12T02:30:00Z| 2007-03-12T06:45:00Z| TEXAS| Flood| 0|
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
|2007-08-18T21:30:00Z| 2007-08-19T23:00:00Z| TEXAS| Flood| 5000000|
|2007-06-27T00:00:00Z| 2007-06-27T12:00:00Z| TEXAS| Flood| 1200000|
|2007-06-28T18:00:00Z| 2007-06-28T23:00:00Z| TEXAS| Flood| 1000000|
|2007-06-27T00:00:00Z| 2007-06-27T08:00:00Z| TEXAS| Flood| 750000|
|2007-06-26T20:00:00Z| 2007-06-26T23:00:00Z| TEXAS| Flood| 750000|

> [!NOTE]
> The order of operations is important. Try putting `take 5` before `sort by`. You'll get different results.

### top

The [top](kusto/query/topoperator.md) operator returns the first *n* rows sorted by the specified column.

The following query will return the same results as the example in the sort section but with one less operator.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12NPQsCMRBEe8H/MF2atJZXCMZaSArbeFn8wGTD3qIE7scfuSsEu4E388YrS3YfKjrtdzO+DxKC16iEYYAJ7nr0BrEkrKXQ6gbOb+Zk+kS54oBbwynmeKeLcCXRhkTT2HkVftGoXSoanpksXElbWI/sT23/JAtx66DdngAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty desc
| project StartTime, EndTime, State, EventType, DamageProperty
```

|StartTime|EndTime|State|EventType|DamageProperty|
|--|--|--|--|--|
|2007-08-18T21:30:00Z| 2007-08-19T23:00:00Z| TEXAS| Flood| 5000000|
|2007-06-27T00:00:00Z| 2007-06-27T12:00:00Z| TEXAS| Flood| 1200000|
|2007-06-28T18:00:00Z| 2007-06-28T23:00:00Z| TEXAS| Flood| 1000000|
|2007-06-27T00:00:00Z| 2007-06-27T08:00:00Z| TEXAS| Flood| 750000|
|2007-06-26T20:00:00Z| 2007-06-26T23:00:00Z| TEXAS| Flood| 750000|

### extend

Use the [extend](kusto/query/extendoperator.md) operator to add computed columns to a table. This operator allows you to use standard operators such as +, -, *, /, and %, and various functions in the expression for the computed column.

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

With the computed `Duration` column, it's easy to see that the flood that caused the most damage was also the longest flood.

|StartTime| EndTime| Duration| DamageProperty|
|--|--|--|--|
|2007-08-18T21:30:00Z| 2007-08-19T23:00:00Z| 1.01:30:00| 5000000|
|2007-06-27T00:00:00Z| 2007-06-27T12:00:00Z| 12:00:00| 1200000|
|2007-06-28T18:00:00Z| 2007-06-28T23:00:00Z| 05:00:00| 1000000|
|2007-06-27T00:00:00Z| 2007-06-27T08:00:00Z| 08:00:00| 750000|
|2007-06-26T20:00:00Z| 2007-06-26T23:00:00Z| 03:00:00| 750000|

### render

The [render](kusto/query/renderoperator.md) operator helps you visualize query results by displaying them as graphical output. For example, you can display results as a `barchart`, `timechart`, `columnchart`, `piechart`, `scatterchart`, and more.

We'll use `render` to better understand and interpret our results as we progress through the following sections.

## Find insights with aggregation functions

This section will show how to use aggregation functions to identify patterns and trends in our data. These functions allow us to group and combine values from multiple rows into a single summary value. The summary value type depends on the chosen function, for example a count, maximum, minimum, or average value.

Aggregation functions are especially useful for discovering valuable insights when working with large amounts of individual events, like storm events, and comparing them across groups.

### summarize

The [summarize](kusto/query/summarizeoperator.md) operator groups rows based on the values in the **by** clause and applies an aggregation function to combine each group into a single row. In the following examples, we'll use `summarize` in combination with various aggregation functions.

### count()

Combine `summarize` with the [count](kusto/query/count-aggfunction.md) aggregation function to find the number of events by state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUAiznnl+aVKNgqJINoDU2FpEqF4JLEklQAtZY60TYAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize EventCount = count() by State
```

|State|EventCount|
|--|--|
|TEXAS| 4701|
|KANSAS| 3166|
|IOWA| 2337|
|ILLINOIS| 2022|
|MISSOURI| 2016|
|GEORGIA| 1983|
|MINNESOTA| 1881|
|WISCONSIN| 1850|
|NEBRASKA| 1766|
|NEW YORK| 1750|
|...|...|

Let's use `render` to visualize the output.

```Kusto
StormEvents
| summarize EventCount = count() by State
| render barchart
```

:::image type="content" source="media/write-queries/count-by-state-bar-chart.png" alt-text="Screenshot of event count by state bar chart created with the render operator. ":::

### countif(), dcount() and dcountif()

Multiple aggregation functions can be used in a single summarize operator to produce several computed columns.

The following query uses the [countif()](kusto/query/countif-aggfunction.md), [dcount()](kusto/query/dcount-aggfunction.md), and [dcountif()](kusto/query/dcountif-aggfunction.md) aggregation functions to find by state:

1. The number of storms that caused crop damage
1. The unique number of storm types
1. The unique number of storm types that caused crop damage

The query then uses the `top` operator to identify the states with the most crop damage from storms.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVeBSAIJgkGRxeGZJhnNRfoFLYm5ieqqCrUJyfmleSWaaBkQAJFWsYKdgoKmD0BRSWZBaDFSaAlarAbYAJIahBsPwFJjpcD06CugWgc1IqgQak1iSCnR2SX6BgilEANPBAO37ssfiAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize 
    StormsWithCropDamage = countif(DamageCrops > 0),
    StormTypes = dcount(EventType),
    StormTypesWithCropDamage = dcountif(EventType, DamageCrops > 0)
    by State
| top 5 by StormsWithCropDamage
```

|State|StormsWithCropDamage|StormTypes|StormTypesWithCropDamage|
|--|--|--|--|
|IOWA| 359| 19| 6|
|NEBRASKA| 201| 16| 7|
|MISSISSIPPI| 105| 13| 4|
|NORTH CAROLINA| 82| 23| 5|
|MISSOURI| 78 |20| 5|

## min(), max(), and avg()

Learn more about the storm types that caused crop damage using the min(), max(), and avg() aggregation functions.

In the following query, we'll filter out rows with no damaged crops, calculate the minimum, maximum, and average crop damage for each event type, and sort the result by the average damage.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcEnMTUxPdS7KLyhWsFMwAIoXl+bmJhZlVqVyKQCBb2IFRIltbmKFBpJqTR0FiILMPJiCzDxsChzL0qEKEsvSURSApZMqFcBOCqksSAXZnl9UAhKD6wIA7R/hf7UAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where DamageCrops > 0
| summarize
    MaxDamage=max(DamageCrops), 
    MinDamage=min(DamageCrops), 
    AvgDamage=avg(DamageCrops)
    by EventType
| sort by AvgDamage
```

EventType MaxDamage MinDamage AvgDamage
|--|--|--|--|
|Frost/Freeze| 568600000| 3000| 9106087.5954198465|
|Wildfire| 21000000| 10000| 7268333.333333333|
|Drought| 700000000| 2000| 6763977.8761061952|
|Flood| 500000000| 1000| 4844925.23364486|
|Thunderstorm Wind| 22000000| 100| 920328.36538461538|
|Hail| 24000000| 100| 416890.56603773584|
|Flash Flood| 5000000| 300| 266778.60962566844|
|High Wind| 1000000| 1000| 209800|
|Cold/Wind Chill| 500000| 100000| 200000|
|Heavy Rain| 1150000| 5000| 171000|

### bin()

Instead of grouping rows by a specific column value, we can use the [bin()](kusto/query/binfunction.md) function to divide the data into distinct sets based on numeric or time values.

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
|2007-01-01T00:00:00Z| 16|
|2007-01-08T00:00:00Z| 20|
|2007-01-29T00:00:00Z| 8|
|2007-02-05T00:00:00Z| 1|
|2007-02-12T00:00:00Z| 3|
|2007-02-19T00:00:00Z| 4|
|2007-02-26T00:00:00Z| 3|
|2007-03-05T00:00:00Z| 1|
|2007-03-19T00:00:00Z| 2|
|2007-03-26T00:00:00Z| 2|
|...|...|

Let's render these results in a `timechart`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOQQ6CMBBF95ziL9tESIsLVroBT4AXKHQiXbSYYZBoPLzFhYmTSSZ5P5P3e5k5Xh6UZCne2CZiQi+O5RoiYSDZiBKUd0KSiaqNaUpj82pUFf65rcuj1RoF8rjk0bnobtTyfF9whsmGZY3RcXgRvtJ2XpPghHG/SmN4YghJ/Roc0Hid35iSJ8auGqecfQAkVosYtwAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize EventCount = count() by bin(StartTime, 7d)
| render timechart
```

:::image type="content" source="media/write-queries/crop-damage-by-week-time-chart.png" alt-text="Screenshot of the crop damage by week time chart rendered by the previous query.":::

> [!NOTE]
> `bin()` is similar to the `floor()` function in other programming languages. It reduces every value to the nearest multiple of the modulus that you supply and allows `summarize` to assign the rows to groups.

### case()

The [case()](kusto/query/casefunction.md) function groups data into buckets based on specified conditions. The function returns the corresponding result expression for the first satisfied predicate, or the final else expression if none of the predicates are satisfied. In this example, we group states based on the number of storm-related injuries their citizens sustained.

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
|ALABAMA| 494| Large|
|ALASKA| 0| No injuries|
|AMERICAN SAMOA| 0| No injuries|
|ARIZONA| 6| Small|
|ARKANSAS| 54| Large|
|ATLANTIC NORTH| 15| Medium|
|ATLANTIC SOUTH| 2| Small|
|CALIFORNIA| 221| Large|
|COLORADO| 22| Medium|
|CONNECTICUT| 1| Small|

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

:::image type="content" source="media/write-queries/render-pie-chart.png" alt-text="Screenshot of Azure Data Explorer web UI pie chart rendered by the previous query.":::

## Joins

The [join](kusto/query/joinoperator.md) operator is used to combine rows from tables based on matching values in specified columns. This allows you to merge data from different sources and perform analysis on the combined data set.

For example, let's say you want to create a list of states in which both lightning and avalanche events occurred. Use the join operator to merge the rows of two tables—one containing data on lightning events and the other containing data on avalanche events—based on the `State` column.

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

> [!NOTE]
>
> - Use `where` and `project` to reduce the number of rows and columns in the input tables before performing the join.
> - Use the smaller table as the left table in the join.
> - Make sure that the columns being used for the join have the same name and data type, and use `project` to rename a column if needed.

## Define variables with let statements

Let statements are used to define variables within a query. Defining variables with let statements is helpful to increase code readability, reusability, and for experimentation with different values. Look at the following examples.

### Readability

Here we use a let statement to separate out the parts of the query expression in the previous `join` example. The results are unchanged.

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

The following query defines a list of `WindStorms` to use multiple times in the tabular statement.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OQQuCQBCF7/6KwZOC/yA6Bl3sotAhIgZ3cDdyRmY3Q+jHZ6skNrf33vce86AAZ8emCqKdhz2YkbFzTXZJYLq0FmU0khawaPtkQ+q/eCymxRyUwl6Ef+DRtXYDVEGF28VaoBLVMcHKRvua75L4z2EgDj55w8uSEkRZjz2BY8jWr3MQncMTqmJwA4FFf0MeN9g01KvcqQnrVPFX/ACqRzMEEAEAAA==" target="_blank">Run the query</a>

```Kusto
let WindStorms = dynamic([
    "Tornado", 
    "Thunderstorm Wind",
    "Monsoon", 
    "High Wind",
    "Strong Wind", 
    "Marine High Wind"
    ]);
StormEvents
| where EventType in (WindStorms) or EventNarrative has_any (WindStorms)
```

|EventType|EventNarrative|
|--|--|
|Tornado| A tornado touched down in the Town of Eustis at the northern end of West Crooked Lake. The tornado quickly intensified to EF1 strength as it moved north northwest through Eustis. The track was just under two miles long and had a maximum width of 300 yards.  The tornado destroyed 7 homes. Twenty seven homes received major damage and 81 homes reported minor damage. There were no serious injuries and property damage was set at $6.2 million.|
|Thunderstorm Wind| The county dispatch reported several trees were blown down along Quincey Batten Loop near State Road 206. The cost of tree removal was estimated.|
|Thunderstorm Wind| Numerous large trees were blown down with some down on power lines. Damage occurred in eastern Adams county.|
|..|..|

### Experiment with different values

Defining a variable allows you to easily experiment with different boundary values by changing the variable and rerunning the query. Try changing the `MinDamage` value or the `EventLocation` value in the following query and see what happens.

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
