---
title: 'Tutorial: Use aggregation functions in Kusto Query Language'
description: This tutorial describes how to use aggregation functions in the Kusto Query Language.
ms.topic: tutorial
ms.date: 01/18/2023
---

# Tutorial: Use aggregation functions

[Aggregation functions](../aggregation-functions.md) allow you to group and combine data from multiple rows into a summary value. The summary value depends on the chosen function, for example a count, maximum, or average value.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Use the summarize operator](#use-the-summarize-operator)
> * [Visualize query results](#visualize-query-results)
> * [Conditionally count rows](#conditionally-count-rows)
> * [Group data into bins](#group-data-into-bins)
> * [Calculate the min, max, avg, and sum](#calculate-the-min-max-avg-and-sum)
> * [Extract unique values](#extract-unique-values)
> * [Bucket data by condition](#bucket-data-by-condition)

The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To explore with your own data, [create your own free cluster](../../../start-for-free-web-ui.md).

## Prerequisites

* A Microsoft account or Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

## Use the summarize operator

The [summarize](../summarizeoperator.md) operator is essential to performing aggregations over your data. The `summarize` operator groups together rows based on the `by` clause and then uses the provided aggregation function to combine each group in a single row.

Find the number of events by state using `summarize` with the [count](../count-aggfunction.md) aggregation function.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVQjJL0nMCQZJFivYKiTnl+aVaGgqJFUqBJcklqQCABs8Zoc2AAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize TotalStorms = count() by State
```

**Output**

|State|TotalStorms|
|--|--|
|TEXAS|4701|
|KANSAS|3166|
|IOWA|2337|
|ILLINOIS|2022|
|MISSOURI|2016|
|...|...|

## Visualize query results

Visualizing query results in a chart or graph can help you identify patterns, trends, and outliers in your data. You can do this with the [render](../renderoperator.md) operator.

Throughout the tutorial, you'll see examples of how to use `render` to display your results. For now, let's use `render` to see the results from the previous query in a bar chart.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVQjJL0nMCQZJFivYKiTnl+aVaGgqJFUqBJcklqQClRal5qWkFikkJRYlZyQWlQAACVd/oUgAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize TotalStorms = count() by State
| render barchart
```

:::image type="content" source="../images/tutorial/total-storms-by-state-bar-chart.png" alt-text="Screenshot of total storms by state bar chart created with the render operator.":::

## Conditionally count rows

When analyzing your data, you may want to count rows based on a specific condition to understand how many rows meet the given criteria.

The following query uses the [countif()](../countif-aggfunction.md) function to count of storms that caused damage. The query then uses the `top` operator to filter the results and display the states with the highest amount of crop damage caused by storms.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVQgGiReHZ5ZkOBflF7gk5iampyrYKiTnl+aVZKZpQARAUsUKdgoGmgpJlUAtiSWpQENK8gsUTCECmGYAAFosNm9wAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize StormsWithCropDamage = countif(DamageCrops > 0) by State
| top 5 by StormsWithCropDamage
```

**Output**

|State|StormsWithCropDamage|
|--|--|
|IOWA|359|
|NEBRASKA|201|
|MISSISSIPPI|105|
|NORTH CAROLINA|82|
|MISSOURI|78|

## Group data into bins

To aggregate by scalar values, such as a numeric or time values, you'll first want to group the data into bins using the [bin()](../binfunction.md) function. Using `bin()` can help you understand how values are distributed within a certain range and make comparisons between different periods.

The following query counts the number of storms that caused crop damage for each week in 2007. The `7d` argument represents a week, as the function requires a valid [timespan](../scalar-data-types/timespan.md) value.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOQQrCMBRE9z3FLBOwJamLrnRTPUG9wI/5aBZJJfm1KB7e6EJwGBh4mzeTzDke75ykNC+sV86MSSjLKUSGY1mZE5QnYalE9cYMrbG1Gl2Hf277dmu1RoMaSh4HinThMc+3gj1MNZQlRsrhyfhKx3lJgh3On1Ua7gEXkvo92GDw+g3gGT6rpAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize EventCount = count() by bin(StartTime, 7d)
```

**Output**

|StartTime|EventCount|
|---|---|
|2007-01-01T00:00:00Z|16|
|2007-01-08T00:00:00Z|20|
|2007-01-29T00:00:00Z|8|
|2007-02-05T00:00:00Z|1|
|2007-02-12T00:00:00Z|3|
|...|...|

Add `| render timechart` to the end of the query to visualize the results.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOQQ6CMBBF95ziL9tESIsLVroBT4AXKHQiXbSYYZBoPLzFhYmTSSZ5P5P3e5k5Xh6UZCne2CZiQi+O5RoiYSDZiBKUd0KSiaqNaUpj82pUFf65rcuj1RoF8rjk0bnobtTyfF9whsmGZY3RcXgRvtJ2XpPghHG/SmN4YghJ/Roc0Hid35iSJ8auGqecfQAkVosYtwAAAA==" target="_blank">Run the query</a>

:::image type="content" source="../images/tutorial/crop-damage-by-week-time-chart.png" alt-text="Screenshot of the crop damage by week time chart rendered by the previous query.":::

> [!NOTE]
> `bin()` is similar to the `floor()` function in other programming languages. It reduces every value to the nearest multiple of the modulus that you supply and allows `summarize` to assign the rows to groups.

## Calculate the min, max, avg, and sum

This section will show how to perform common calculations that are useful for getting an overview of the data and identifying patterns and trends.

### min, max, and avg

To learn more about types of storms that cause crop damage, calculate the minimum, maximum, and average crop damage for each event type, and then sort the result by the average damage.

Note that you can use multiple aggregation functions in a single `summarize` operator to produce several computed columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcEnMTUxPdS7KLyhWsFMwAIoXl+bmJhZlVqVyKQCBb2IFSBKizDY3sUIDSYemjgJEUWYesqLMPGyKHMvSkRQllqWjKAIrSapUADsvpLIgFeSS/KISkBiKTgAZ5ED9xQAAAA==" target="_blank">Run the query</a>

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

**Output**

|EventType|MaxCropDamage|MinCropDamage|AvgCropDamage|
|--|--|--|--|
|Frost/Freeze|568600000|3000|9106087.5954198465|
|Wildfire|21000000|10000|7268333.333333333|
|Drought|700000000|2000|6763977.8761061952|
|Flood|500000000|1000|4844925.23364486|
|Thunderstorm Wind|22000000|100|920328.36538461538|
|...|...|...|...|

### sum()

The results of the previous query indicate that Freeze/Frost events resulted in the most crop damage on average. However, the [bin() query](#group-data-into-bins) showed that events with crop damage mostly took place in the summer months.

The `bin()` query only counted events that caused some damage. Modify that query to use the [sum()](../sum-aggfunction.md) function instead of the `count()` function, and you can check the total number of damaged crops by event date.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOsQ7CMBBD936Fx0SiVVqGTrBQvqD8QEpONENSdDmoQHw8iZAQnDw9+2SPsnA43ilKql5YZ2LCKJbl5ANhIlmJIpSzQpKJ6ozpa9NmaTQN/nnb1dtWa1TIZ6PDYIO90IGXa8IeJjekWwiW/ZNQ6MfHrmD1E9aYHph8VN8pG/RO53+m6IhROs9z9t7w8FzwwAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize CropDamage = sum(DamageCrops) by bin(StartTime, 7d)
| render timechart
```

:::image type="content" source="../images/tutorial/sum-crop-damage-by-week.png" alt-text="Screenshot of time chart showing crop damage by week.":::

Now you can see a peak in crop damage in January, which probably was due to Freeze/Frost.

> [!TIP]
> Use [minif()](../minif-aggfunction.md), [maxif()](../maxif-aggfunction.md), [avgif()](../avgif-aggfunction.md), and [sumif()](../sumif-aggfunction.md) to perform conditional aggregations, like we did when in the [perform a conditional count](#perform-a-conditional-count) section.

## Extract unique values

This section shows how to count or create a set of unique values. The following functions can be useful for understanding the distribution of unique values in a dataset, identifying outliers, or creating a distinct list of values for further analysis.

### dcount()

Approximate how many unique storm types there are by state using [dcount()](../dcount-aggfunction.md).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlUIBkmEVBakFivYKqQk55fmlWiA1YHENBWSKoEqEktSQXryi0ogfJgOADtJmYVVAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents 
| summarize StormTypes = dcount(EventType) by State
| sort by StormTypes
```

**Output**

|State|StormTypes|
|--|--|
|TEXAS|27|
|CALIFORNIA|26|
|PENNSYLVANIA|25|
|GEORGIA|24|
|ILLINOIS|23|
|...|...|

## make_set()

Use [make_set()](../makeset-aggfunction.md) to turn a selection of rows in a table into an array of unique values.

The following query uses `make_set()` to create an array of the event types that cause deaths in each state. The resulting table is then sorted by the number of storm types in each array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22NsQ7CMAxEd77CYysx8AMwlYG5SIyVoScSIEnluKCgfjxJQUwdfX73rtUgbv+E17ia6GUgoAasJjZWcFHa0YaC/LKD7/9pxuPoHIt9g9qiOaYB8WTVfGHakuM7ugit5oXyr+mcMs2K3B8k3IptvteLkrISREuLRTh1D/irmmqJrT/1zAofzQAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| where DeathsDirect > 0 or DeathsIndirect > 0
| summarize StormTypesWithDeaths = make_set(EventType) by State
| project State, StormTypesWithDeaths
| sort by array_length(StormTypesWithDeaths)
```

**Output**

|State|StormTypesWithDeaths|
|--|--|
|CALIFORNIA|["Thunderstorm Wind","High Surf","Cold/Wind Chill","Strong Wind","Rip Current","Heat","Excessive Heat","Wildfire","Dust Storm","Astronomical Low Tide","Dense Fog","Winter Weather"]|
|TEXAS|["Flash Flood","Thunderstorm Wind","Tornado","Lightning","Flood","Ice Storm","Winter Weather","Rip Current","Excessive Heat","Dense Fog","Hurricane (Typhoon)","Cold/Wind Chill"]|
|OKLAHOMA|["Flash Flood","Tornado","Cold/Wind Chill","Winter Storm","Heavy Snow","Excessive Heat","Heat","Ice Storm","Winter Weather","Dense Fog"]|
|NEW YORK|["Flood","Lightning","Thunderstorm Wind","Flash Flood","Winter Weather","Ice Storm","Extreme Cold/Wind Chill","Winter Storm","Heavy Snow"]|
|KANSAS|["Thunderstorm Wind","Heavy Rain","Tornado","Flood","Flash Flood","Lightning","Heavy Snow","Winter Weather","Blizzard"]|
|...|...|

## Bucket data by condition

The [case()](../casefunction.md) function groups data into buckets based on specified conditions. The function returns the corresponding result expression for the first satisfied predicate, or the final else expression if none of the predicates are satisfied.

This example groups states based on the number of storm-related injuries their citizens sustained.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WRPQsCMQyG9/sVodMdOOjgqIMfg6Au/QWxF6R6bSFNRcUfrwU90OGKGZP3eTK8WgK79YW8xOoBMTmHbO8EG39KbCkuQ/ICs3ypP7uVZTLSwOEGWlDoBdJVyLc9tUjmTBkzGAnqCgbn+9ccpuNRgVBb5COpUuxXPCmLd9Ta5P42l8XaYdcVvWofwL7daiDb5LICS98BYDRPIbtEBswBAAA=" target="_blank">Run the query</a>

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

**Output**

|State|InjuriesCount|InjuriesBucket|
|--|--|--|
|ALABAMA|494|Large|
|ALASKA|0|No injuries|
|AMERICAN SAMOA|0|No injuries|
|ARIZONA|6|Small|
|ARKANSAS|54|Large|
|ATLANTIC NORTH|15|Medium|
|...|...|...|

Create a pie chart to visualize the proportion of states that experienced storms resulting in a large, medium, or small number of injuries.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WRvQ7CIBCA9z7FhalNHHRwrEPVwURd+gRIL4oWao7DWOPD29afpJqUyAj3fRC+nCsyywtadtEdnDdGkr4hrOzRk0Y3r7xlSNuT+L230ISKE9jVkLNkbEC8MtriQ2VenbDFlHQIcQSDq3/XDKbjUYAQa0l7FKGxb/EkLN5gob352xwW50aWZdArthXol1sMzCa/sernp2d11yRV7cviLlK/SkNS0woJzhrVQRI/AE1xwckEAgAA" target="_blank">Run the query</a>

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

:::image type="content" source="../images/tutorial/injuries-bucket-pie-chart.png" alt-text="Screenshot of Azure Data Explorer web UI pie chart rendered by the previous query.":::

## Next steps

Now that you're familiar with common query operators and aggregation functions, go on to the next tutorial to practice common data analysis methods.

> [!div class="nextstepaction"]
> [Practice data analysis methods](practice-data-analysis-methods.md)
