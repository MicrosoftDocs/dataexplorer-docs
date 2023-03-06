---
title: 'Tutorial: Join data from multiple tables'
description: This tutorial shows how to join data from multiple tables using the Kusto Query Language.
ms.topic: tutorial
ms.date: 03/06/2023
---

# Tutorial: Join data from multiple tables

Joining data from multiple tables allows for a more comprehensive analysis by combining information from different sources and creating new relationships between data points. In the [Kusto Query Language (KQL)](../index.md), the [join](../joinoperator.md) and [lookup](../lookupoperator.md) operators are used to combine data across tables.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Use the join operator](#use-the-join-operator)
> * [Use the lookup operator](#use-the-lookup-operator)
> * [Join query-generated tables](#join-query-generated-tables)

The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To explore with your own data, [create your own free cluster](../../../start-for-free-web-ui.md).

## Prerequisites

* A Microsoft account or Azure Active Directory user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)

## Use the join operator

There are two tables in the [Samples database](https://dataexplorer.azure.com/clusters/help/databases/Samples) related to storm events. One is called `StormEvents` and the other is called `PopulationData`. In this section, you'll join the tables to perform data analysis that wouldn't be possible with one table alone.

### Understand the data

Use the [take](../takeoperator.md) operator to see what data each table contains.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUShJzE5VMAUAP49+9hUAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents 
| take 5
```

The following table shows only 6 of the 22 returned columns.

|StartTime|EndTime|EpisodeId|EventId|State|EventType|...|
|--|--|--|--|--|--|--|
|2007-09-20T21:57:00Z|2007-09-20T22:05:00Z|11078|60913|FLORIDA|Tornado|...|
|2007-12-20T07:50:00Z|2007-12-20T07:53:00Z|12554|68796|MISSISSIPPI|Thunderstorm Wind|...|
|2007-12-30T16:00:00Z|2007-12-30T16:05:00Z|11749|64588|GEORGIA|Thunderstorm Wind|...|
|2007-09-29T08:11:00Z|2007-09-29T08:11:00Z|11091|61032|ATLANTIC SOUTH|Waterspout|...|
|2007-09-18T20:00:00Z|2007-09-19T18:00:00Z|11074|60904|FLORIDA|Heavy Rain|...|

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

Both tables contains a `State` column. The `StormEvents` table has many more columns, and the `PopulationData` has only one other column that contains the population of the given state.

### Join the tables

Join the `PopulationData` table with `StormEvents` on the common `State` column to find the total property damage caused by storms per capita by state.

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

:::image type="content" source="../images/kql-tutorials/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

> [!TIP]
> There are many types of joins that you can perform with the `join` operator. See a [list of join flavors](../joinoperator.md#join-flavors).

## Use the lookup operator

The [lookup](../lookupoperator.md) operator is a special implementation of a `join` operator that optimizes the performance of queries where a fact table is enriched with data from a dimension table. It extends the fact table with values that are looked up in a dimension table. For best performance, the system by default assumes that the left table is the larger (fact) table, and the right table is the smaller (dimension) table. This is exactly opposite to the assumption that's used by the `join` operator.

The following query is an example of using `lookup` to merge the `StormEvents` and `PopulationData` tables. It filters for storms that caused injuries and shows the state population and injury count from the event.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WOQQrCMBRE94J3mKViF71AXdVFd0J7gWi/mDbmh58fpeDhJYoVdTvDezOtslx2V/Ial4s7bmcSQuOHJJZibYWOii1KsMxp4/s5z4xjHlPAaH1fOTopJyXBas8hOaOWfW3UrMEerRqljAThIRuew90UqHh1BT5UgY7VuPcqqt9bm79HWR1ZFIfpG34AQYNrmeYAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where InjuriesDirect > 0 or InjuriesIndirect > 0
| lookup kind=leftouter (PopulationData) on State
| project EventType, State, Population, TotalInjuries = InjuriesDirect + InjuriesIndirect
| sort by TotalInjuries
```

**Output**

|EventType |State |Population |TotalInjuries|
|--|--|--|--|
Excessive Heat| MISSOURI| 6153230| 519|
Excessive Heat| MISSOURI| 6153230| 422|
Excessive Heat| OKLAHOMA| 3973710| 200|
Heat| TENNESSEE| 6886720| 187|
Winter Weather| TEXAS| 29363100| 137|
|...|...|...|...|

> [!NOTE]
> The `lookup` operator only supports two join flavors: `leftouter` and `inner`.

## Join query-generated tables

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

## Next steps

* Learn how to perform [cross-database and cross-cluster queries](../cross-cluster-or-database-queries.md)
* Follow the [perform geospatial clustering](perform-geospatial-clustering.md) tutorial
* Get a comprehensive understanding by reading the [white paper](https://azure.microsoft.com/mediahandler/files/resourcefiles/azure-data-explorer/Azure_Data_Explorer_white_paper.pdf)
