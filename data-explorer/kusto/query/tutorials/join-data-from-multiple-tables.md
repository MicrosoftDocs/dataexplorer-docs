---
title:  'Tutorial: Join Data from Multiple Tables'
description: This tutorial shows how to join data from multiple tables using the Kusto Query Language.
ms.topic: tutorial
ms.date: 09/15/2025
monikerRange: "microsoft-fabric || azure-data-explorer || microsoft-sentinel || azure-monitor"
---

# Tutorial: join data from multiple tables

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Joining data from multiple tables lets you analyze data across sources and create relationships between data points. In the [Kusto Query Language (KQL)](../index.md), use the [join](../join-operator.md) and [lookup](../lookup-operator.md) operators to combine data across tables.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * [Use the join operator](#use-the-join-operator)
> * [Use the lookup operator](#use-the-lookup-operator)
> * [Join query-generated tables](#join-query-generated-tables)

::: moniker range="azure-data-explorer"
The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To explore with your own data, [create your own free cluster](/azure/data-explorer/start-for-free-web-ui).
::: moniker-end

::: moniker range="microsoft-fabric"
The examples in this tutorial use the `StormEvents` table, which is publicly available in the **Weather analytics** [sample data](/fabric/real-time-intelligence/sample-gallery).
::: moniker-end

## Prerequisites

Run the queries in a query environment that has access to the sample data. Use one of the following:
:::moniker range="azure-data-explorer"
* Microsoft account or Microsoft Entra user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help)
::: moniker-end

:::moniker range="microsoft-fabric"
* A Microsoft account or Microsoft Entra user identity 
* [Fabric workspace](/fabric/get-started/create-workspaces) with a Microsoft Fabric-enabled [capacity](/fabric/enterprise/licenses#capacity)
::: moniker-end

## Use the join operator

The [Samples database](https://dataexplorer.azure.com/clusters/help/databases/Samples) has two related storm event tables: `StormEvents` and `PopulationData`. In this section, you join them to analyze data that's not possible with one table alone.

### Understand the data

Use the [take](../take-operator.md) operator to see what data each table contains.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUShJzE5VMAUAP49+9hUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents 
| take 5
```

The following table shows only six of the 22 returned columns.

|StartTime|EndTime|EpisodeId|EventId|State|EventType|...|
|--|--|--|--|--|--|--|
|2007-09-20T21:57:00Z|2007-09-20T22:05:00Z|11078|60913|FLORIDA|Tornado|...|
|2007-12-20T07:50:00Z|2007-12-20T07:53:00Z|12554|68796|MISSISSIPPI|Thunderstorm Wind|...|
|2007-12-30T16:00:00Z|2007-12-30T16:05:00Z|11749|64588|GEORGIA|Thunderstorm Wind|...|
|2007-09-29T08:11:00Z|2007-09-29T08:11:00Z|11091|61032|ATLANTIC SOUTH|Waterspout|...|
|2007-09-18T20:00:00Z|2007-09-19T18:00:00Z|11074|60904|FLORIDA|Heavy Rain|...|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwvILyjNSSzJzM9zSSxJVOCqUShJzE5VMAUAJEMCyxgAAAA=" target="_blank">Run the query</a>
::: moniker-end

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

Both tables have a `State` column. `StormEvents` has many more columns, and `PopulationData` has one other column with the state's population.

### Join the tables

Join `PopulationData` with `StormEvents` on `State` to calculate total property damage per capita by state.  

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOQQrCQAxF954iSwXBE8yqdV/oCaIGSXWSMc0IFQ/fGYoiBZefn/fzeleLxyeJj5s3jDlGNH4RdKaJzKcWI14JQq22S/hUOzhN0Ds6FXJQFrixXAKLkGXhRy4rmvIdnVVadASV730yHejsS96v3nVkDSYuRFiLHH42q7CaV40//AyUi5Na3gAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize PropertyDamage = sum(DamageProperty) by State
| join kind=innerunique PopulationData on State
| project State, PropertyDamagePerCapita = PropertyDamage / Population
| sort by PropertyDamagePerCapita
```

Add `| render columnchart` to the query to visualize the result.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WOwQrCQAxE735FjgqCX9CT9V7oF8Q2aGo3WdOsUPHj3aUoUvA4zLyZaV0tnB4kPm1eMKUQ0PhJ0JhGMp9rDHghqIq1XcTH2sF5htbRKZODssCNpa9YhCwJ31Nu0ZhGdFap0RFUvvloOlDni96v5hqyI0bORLU+cvjpLIfVvNz4w+eEkfRk0OmYgnRXNH8DzTGGOPMAAAA=" target="_blank">Run the query</a>
::: moniker-end

:::image type="content" source="../media/kql-tutorials/damage-per-capita-chart.png" alt-text="Screenshot of column chart showing property damage per capita by state.":::

If the columns have different names (for example, `StormEvents` has `State` and `PopulationData` has `StateName`), specify the join as:

```kusto
StormEvents
| join kind=innerunique PopulationData on $left.State == $right.StateName  
```

`$left` refers to the left (outer) table in the join: `StormEvents`. `$right` refers to the right (inner) table: `PopulationData`.  

> [!TIP]
> Use the `join` operator for many join types. See the [list of join flavors](../join-operator.md#returns).

## Use the lookup operator

The [lookup](../lookup-operator.md) operator optimizes queries that enrich a fact table with data from a dimension table. It extends the fact table with values from the dimension table. By default, the system assumes the left table is the larger fact table and the right table is the smaller dimension table. This default is the opposite of the `join` operator's assumption.  

The help cluster includes a database named `ContosoSales` with sales data. The following query uses `lookup` to merge the `SalesFact` and `Products` tables to return total sales by product category.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAwtOzEktdktMLuGqUcjJz88uLVAIKMpPKU0uKVbIz4OxvVMrgfLFpbm5iUWZVakKIfkliTnBIK0KtgrJ+aV5JRqaCkmVMOXOiSWp6flFlX6JualAfflFKalFIGkkbSmpxckAoEL9GXwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
SalesFact
| lookup Products on ProductKey
| summarize TotalSales = count() by ProductCategoryName
| order by TotalSales desc
```

**Output**

|ProductCategoryName|TotalSales|
|--|--|
|Games and Toys|966782|
|TV and Video|715024|
|Cameras and camcorders|323003|
|Computers|313487|
|Home Appliances|237508|
|Audio|192671|
|Cell phones|50342|
|Music, Movies and Audio Books|33376|

> [!NOTE]
> The `lookup` operator supports only two join flavors: `leftouter` and `inner`.

## Join query-generated tables

Join results from the same table.

Suppose you want a list of states that have both lightning and avalanche events. Use the join operator to merge rows from two queries that return distinct states for each event type on the `State` column.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZR8MtMzSvIy89KVgApSMotLMvOSSxSCSxJLUoECWfmZeQrZmXkptpl5ealFChpcCkAQjDBVASyA3WjHssScxLzkjFQlqCI040GCmmAyPw9uY0FRflYqTAkAZG8iCb8AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where EventType == "Lightning"
| distinct State
| join kind=inner (
    StormEvents 
    | where EventType == "Avalanche"
    | distinct State
    )
    on State
| project State
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

## Related content
* Learn about different kinds of [join operator](../join-operator.md).
* Perform [cross-database and cross-cluster queries](../cross-cluster-or-database-queries.md).
* Follow the [Create geospatial visualizations](create-geospatial-visualizations.md) tutorial.
