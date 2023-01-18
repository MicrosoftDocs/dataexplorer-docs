---
title: 'Tutorial: Use aggregation functions in Kusto Query Language'
description: This tutorial describes how to use aggregation functions in the Kusto Query Language.
ms.topic: tutorial
ms.date: 01/18/2023
---

# Tutorial: Use aggregation functions

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Find insights with aggregation functions](#find-insights-with-aggregation-functions)

The examples in the tutorial all use the `StormEvents` table, which is publicly available in the [Samples database](https://help.kusto.windows.net/Samples) of the **help** cluster. To continue exploring with your own data, [create your own free cluster](../../start-for-free-web-ui.md).

## Prerequisites

* A Microsoft account or Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

## Find insights with aggregation functions

[Aggregation functions](aggregation-functions.md) allow you to group and combine data from multiple rows into a summary value. The summary value depends on the chosen function, for example a count, maximum, minimum, or average value.

In the following examples, we'll use the [summarize](./summarizeoperator.md) operator together with aggregation functions to find insights in the data. Then we'll use the [render](./renderoperator.md) operator to visualize the results.

### count()

Use `summarize` with the [count](./count-aggfunction.md) aggregation function to find the number of events by state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIyS9JzAkGyRYr2Cok55fmlWhoKiRVKgSXJJakAgChqbNHNwAAAA==" target="_blank">Run the query</a>

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

Use multiple aggregation functions in a single `summarize` operator to produce several computed columns.

The following example uses the [countif()](./countif-aggfunction.md) function to add a column with the count of storms that caused damage. The function returns the count of rows where the predicate passed as an argument is `true`. Then the `top` operator further filters to show states with the most crop damage from storms.

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

**Output**

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

**Output**

|EventType|MaxCropDamage|MinCropDamage|AvgCropDamage|
|--|--|--|--|
|Frost/Freeze|568600000|3000|9106087.5954198465|
|Wildfire|21000000|10000|7268333.333333333|
|Drought|700000000|2000|6763977.8761061952|
|Flood|500000000|1000|4844925.23364486|
|Thunderstorm Wind|22000000|100|920328.36538461538|
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

:::image type="content" source="images/tutorial/crop-damage-by-week-time-chart.png" alt-text="Screenshot of the crop damage by week time chart rendered by the previous query.":::

> [!NOTE]
> `bin()` is similar to the `floor()` function in other programming languages. It reduces every value to the nearest multiple of the modulus that you supply and allows `summarize` to assign the rows to groups.

### sum()

The results of the [min(), max(), and avg() query](#min-max-and-avg) revealed that Freeze/Frost events tend to cause the most damage on average, but the [time chart from the bin() query](#bin) showed that most events that cause some level of crop damage occur during the summer months.

To check the total number of damaged crops, rather than just the number of events that caused some damage, modify the last query to use the [sum()](./sum-aggfunction.md) function instead of the `count()` function.

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

**Output**

|State|StormTypes|
|--|--|
|TEXAS|27|
|CALIFORNIA|26|
|PENNSYLVANIA|25|
|GEORGIA|24|
|ILLINOIS|23|
|...|...|

### make_set()

The [make_set()](./makeset-aggfunction.md) operator is a way to take a selection of rows in a table and turn them into an array of unique values.

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

**Output**

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

## Next steps

Now that you're familiar with aggregation functions, move on to learn how to perform common operations, like joins, and calculations, like percentages and averages.

> [!div class="nextstepaction"]
> [Perform common calculations](tutorial-perform-common-calculations.md)
