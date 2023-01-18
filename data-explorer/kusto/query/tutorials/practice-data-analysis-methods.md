---
title: 'Tutorial: Learn common methods for data analysis'
description: This tutorial explores common use cases for the Kusto Query Language.
ms.topic: tutorial
ms.date: 01/18/2023
---

# Tutorial: Practice data analysis methods

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Join data from multiple tables](#join-data-from-multiple-tables)
> * [Calculate percentages](#calculate-percentages)
> * [Calculate correlation coefficients](#calculate-correlation-coefficients)
> * [Perform geospatial clustering](#perform-geospatial-clustering)

The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To explore with your own data, [create your own free cluster](../../../start-for-free-web-ui.md).

## Prerequisites

* A Microsoft account or Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

## Join data from multiple tables

Joining data from multiple tables can provide a more complete understanding of your data. The [join](../joinoperator.md) operator is used to combine rows from different tables based on matching values in specified columns, which allows for analysis on the combined dataset.

Like `join`, the [lookup](../lookupoperator.md) operator also combines rows from tables based on matching values in specified columns. However, there are several differences to consider, such as how each operator handles repeated columns, the types of lookups supported, performance considerations, and the size of the tables being joined.

### Cross-table joins

There's another table in the [Samples database](https://dataexplorer.azure.com/clusters/help/databases/Samples) called `PopulationData`. Use `take` to see what data this table contains.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwvILyjNSSzJzM9zSSxJVOCqUShJzE5VMAUAJEMCyxgAAAA=" target="_blank">Run the query</a>

```kusto
PopulationData 
| take 5
```

**Output**

|State|Population|
|--|--|
|ALABAMA|4918690|
|ALASKA|727951|
|ARIZONA|7399410|
|ARKANSAS|3025880|
|CALIFORNIA|39562900|

The table contains a `State` column just like the one in the `StormEvents` table, and one more column showing the population of that state.

Join the `PopulationData` table with `StormEvents` on the `State` column to find the total property damage caused by storms per capita by state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOQQrCQAxF954iSwXBE8yqdV/oCaIGSXWSMc0IFQ/fGYoiBZefn/fzeleLxyeJj5s3jDlGNH4RdKaJzKcWI14JQq22S/hUOzhN0Ds6FXJQFrixXAKLkGXhRy4rmvIdnVVadASV730yHejsS96v3nVkDSYuRFiLHH42q7CaV40//AyUi5Na3gAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=innerunique PopulationData on State
| project State, PropertyDamagePerCapita = PropertyDamage / Population
| sort by PropertyDamagePerCapita
```

Add `| render columnchart` to the query to visualize the result.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOwQrCQAxE735FjgqCX9CT9V7oF8Q2aGo3WdOsUPHj3aUoUvA4zLyZaV0tnB4kPm1eMKUQ0PhJ0JhGMp9rDHghqIq1XcTH2sF5htbRKZODssCNpa9YhCwJ31Nu0ZhGdFap0RFUvvloOlDni96v5hqyI0bORLU+cvjpLIfVvNz4w+eEkfRk0OmYgnRXNH8DzTGGOPMAAAA=" target="_blank">Run the query</a>

:::image type="content" source="../images/tutorial/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

### Join query results

Joins can also be done based off of query results from the same table.

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

**Output**

|State|
|--|
|OREGON|
|UTAH|
|WYOMING|
|WASHINGTON|
|COLORADO|
|IDAHO|
|NEVADA|

## Calculate percentages

Calculating percentages can help you understand the distribution and proportion of different values within your data. This section covers two common methods for calculating percentages with the Kusto Query Language (KQL).

### Calculate percentage based on two columns

Use `count()` and `countif()` to find the percentage of storm events that caused crop damage in each state. First, count the total number of storms in each state. Then, count the number of storms that caused crop damage in each state.

Then, use [extend](../extendoperator.md) to calculate the percentage between the two columns by dividing the number of storms with property damage by the total number of storms and multiplying by 100.

To ensure that you get a decimal result, use the [todouble()](../todoublefunction.md) function to convert at least one of the integer count values to a double before performing the division.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPsQ7CMAxE936FxwRVorDDBANbpSIxp62BSk1cOS6iiI8nTQVT8GjfvTtXQmyPD3Tiszf40VrD3QshgzBnEtNXs8KfXCVGEHbQ0OhE6TwqluOlk3vJNCDLdDDW3H667qqWxfcMeyh0tNYTRGSIxaega6FEbkKRJC1aOCBbpYRaGuse1b90DetU9xVsikLnsNXzq8SydEgzPoPkmgkZAQAA" target="_blank">Run the query</a>

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

**Output**

|State|TotalStorms|StormsWithCropDamage|PercentWithCropDamage|
|--|--|--|--|
|TEXAS|4701|1205|25.63|
|IOWA|2337|1062|45.44|
|OHIO|1233|730|59.21|
|GEORGIA|1983|666|33.59|
|VIRGINIA|1647|622|37.77|
|...|...|...|...|

> [!NOTE]
> When calculating percentages, convert at least one of the integer values in the division with [todouble() or toreal()](../todoublefunction.md). This will ensure that you don't get truncated results due to integer division.

### Calculate percentage based on table size

To compare the number of storms by event type to the total number of storms in the database, first save the total number of storms in the database as a variable. [Let statements](../letstatement.md) are used to define variables within a query.

Since [tabular expression statements](../tabularexpressionstatements.md) return tabular results, use the [toscalar()](../toscalarfunction.md) function to convert the tabular result of the `count()` function to a scalar value. Then, the numeric value can be used in the percentage calculation.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XOwQrCMAyA4fueIsdWhtazeBLvgnuBrgZR2mWkqTDZw69WYfWYny8hHgU6EuuvQhwiHEEoOustq1LOLxwkwgwxhWD58UZwlAZRWh+aSjS1KOn0Yfnej0M/fXs3jZj1yPREJ2trq7UWLsguT/aO5aUbpd6jWoWG3d/fG9gbszULDOumf88AAAA=" target="_blank">Run the query</a>

```kusto
let TotalStorms = toscalar(StormEvents | summarize count());
StormEvents
| summarize EventCount = count() by EventType
| project EventType, EventCount, Percentage = todouble(EventCount) / TotalStorms * 100.0
```

**Output**

|EventType|EventCount|Percentage|
|--|--|--|
|Thunderstorm Wind|13015|22.034673077574237|
|Hail|12711|21.519994582331627|
|Flash Flood|3688|6.2438627975485055|
|Drought|3616|6.1219652592015716|
|Winter Weather|3349|5.669928554498358|
|...|...|...|

## Calculate correlation coefficients

To determine if there's a relationship between the population of a state and the amount of damage caused by storms, use the [series_pearson_correlation](../series-pearson-correlationfunction.md) function.

The following query calculates the total amount of property damage caused by storms in each state and joins it with population data. The resulting columns are converted into series and the correlation coefficient is calculated.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31QQQ6CQAy8+4oeIfELnNQ7CQ8gFYqpsC3pVqPGxwsaFZV4bGemM9PC1cLmSOJxcYV4CAGNLwS5aU/m5zUG3BFkI5Q8hieUwvYMhaPToNwrC7QsdcYiZJBrf+jQWWWNjqDyYvame6r8y2E5UfwJUpAxxSFOwJbKjqMnn4R0emiO/QLTwYZOTlLDSs3osV0pNQ1XPDxkLH0/UPaEFlXK6s1L5nL9eqeTwvMuN5KkodCBAQAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=inner PopulationData on State
| project PropertyDamage, Population
| summarize PropertyDamageSeries = make_list(PropertyDamage), PopulationSeries = make_list(Population)
| extend CorrelationCoefficient = series_pearson_correlation(PropertyDamageSeries, PopulationSeries)
| project CorrelationCoefficient
```

**Output**

|CorrelationCoefficient|
|--|
|0.64199107528146893|

A coefficient of 0.6419 suggests that there's a weak connection between the state population and the property damage caused by storms.

## Perform geospatial clustering

Geospatial clustering is a way to organize and analyze data based on geographical location. KQL offers multiple methods for performing [geospatial clustering](../geospatial-grid-systems.md), as well as tools for [geospatial visualizations](../geospatial-visualizations.md).

### Cluster storm events by type

The following query filters for all storm events of the "Tornado" event type. It then groups the events into clusters based on their longitude and latitude using the [geo_point_to_s2cell](../geo-point-to-s2cell-function.md) function, counts the number of events in each cluster, and projects the central point of the cluster. The resulting count is renamed as "Events" and the query renders a map to visualize the clusters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2VQsU7DQAzd+QorU07KhFhvqdSNje7RcbV6B4l98jktQXw8TtJCEZuf/d7zs1+UZdyfkbQ+fMEloSCs8DAXBO+hObBQOHJj4yL8hlFhh6dMz0zdtQr6o82VWGkahvY2chDo+K/P5ExTp3EMkj8RIk+k/YZnv6LWwesMKdQEHk7IfeFsHOW+Pka8c/qN0cGTu8u5iDbuoop2lYRhs2kXX9f93WtS/FC0uNtHbG+zEpbjxfooUDLGFEThkjVB+56N7WEMxX0DtXW+QEsBAAA=" target="_blank">Run the query</a>

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

:::image type="content" source="../images/tutorial/tornado-geospacial-map.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospatial map of tornado storms.":::

### Cluster storm events in a specific region

To look within a specific region of interest, use a polygon to define the region and the [geo_point_in_polygon](../geo-point-in-polygon-function.md) function to filter for events that occur within that region.

The following query defines a polygon representing the southern California region and filters for storm events within this region. It then groups the events into clusters using the [geo_point_to_s2cell](../geo-point-to-s2cell-function.md) function, counts the number of events in each cluster, and projects the central point of the cluster. The resulting count is renamed as "Events" and the query renders a map to visualize the clusters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21QTU+EQAy98yuaOUGCm+wqiavZi4k3DyYeCSHj0IVRmJKZ4oof/90CiR+ROfW17/W9TosMgQZu0LvS6NYeyTur4QDV6HRnTfwegTzFY4/qCtQ9tWNNTqVL2xD5yjrNGGSa5/nZdrvfZCmcX2yyIoUJZ6t49433q3jiF7NJ8ZlcRw9Mvrt9Qcch+oCT5EWokcqerOPSOinmYPEN1tbdkUthqTSnaxcmsqX39ISG4b9EhmHoOu3tG4KhQSwWPMrPzDhO4HGERodGOj9BmMqwM9i2qzkuf7tOooU7qYxc5nW7rImnvUn611mk+MroKli+QXzVTFAy8dJHD71F02jPcLLcQPxshX2ATvfJF6/vcb7pAQAA" target="_blank">Run the query</a>

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

:::image type="content" source="../images/tutorial/southern-california-geospacial-mnap.png" alt-text="Screenshot of Azure Data Explorer web UI showing a geospatial map of southern California storms.":::

## Next steps

* Read more about the [Kusto Query Language](../index.md)
* Learn how to perform [cross-database and cross-cluster queries](../cross-cluster-or-database-queries.md)
* Learn how to [ingest data](../../../ingest-sample-data.md)
* Get a comprehensive understanding by reading the [white paper](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-explorer/Azure_Data_Explorer_white_paper.pdf)
