---
title:  'Tutorial: Learn common Kusto Query Language operators'
description: This tutorial describes how to write queries using common operators in the Kusto Query Language to meet common query needs.
ms.topic: tutorial
ms.date: 11/25/2024
---

# Tutorial: Learn common operators

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

[Kusto Query Language (KQL)](../index.md) is used to write queries in [Azure Data Explorer](https://dataexplorer.azure.com/), [Azure Monitor Log Analytics](https://azure.microsoft.com/products/monitor/#overview), [Azure Sentinel](https://azure.microsoft.com/products/microsoft-sentinel/), and more. This tutorial is an introduction to the essential KQL operators used to access and analyze your data.

For more specific guidance on how to query logs in Azure Monitor, see [Get started with log queries](/azure/azure-monitor/logs/get-started-queries).

> [!NOTE]
> Can't find what you're looking for? This article was recently split, as follows:
>
> - Learn common operators (this article)
> - [Use aggregation functions](use-aggregation-functions.md)
> - [Join data from multiple tables](join-data-from-multiple-tables.md)
> - [Create geospatial visualizations](create-geospatial-visualizations.md)

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * [Count rows](#count-rows)
> * [See a sample of data](#see-a-sample-of-data)
> * [Select a subset of columns](#select-a-subset-of-columns)
> * [List unique values](#list-unique-values)
> * [Filter by condition](#filter-by-condition)
> * [Filter by time range](#filter-by-date-and-time-range)
> * [Sort results](#sort-results)
> * [Get the top *n* rows](#get-the-top-n-rows)
> * [Create calculated columns](#create-calculated-columns)
> * [Map values from one set to another](#map-values-from-one-set-to-another)

::: moniker range="azure-data-explorer"
The examples in this tutorial use the `StormEvents` table, which is publicly available in the [**help** cluster](https://help.kusto.windows.net/Samples). To explore with your own data, [create your own free cluster](/azure/data-explorer/start-for-free-web-ui).
::: moniker-end

::: moniker range="microsoft-fabric"
The examples in this tutorial use the `StormEvents` table, which is publicly available in the **Weather analytics** [sample data](/fabric/real-time-intelligence/sample-gallery).
::: moniker-end

## Prerequisites

To run the following queries, you need a query environment with access to the sample data. You can use one of the following:
:::moniker range="azure-data-explorer"
* A Microsoft account or Microsoft Entra user identity to sign in to the [help cluster](https://dataexplorer.azure.com/clusters/help) 
::: moniker-end

:::moniker range="microsoft-fabric"
* A Microsoft account or Microsoft Entra user identity 
* A [Fabric workspace](/fabric/get-started/create-workspaces) with a Microsoft Fabric-enabled [capacity](/fabric/enterprise/licenses#capacity)
::: moniker-end

## Count rows

Begin by using the [count](../count-operator.md) operator to find the number of storm records in the `StormEvents` table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUUjOL80rAQA76pZjFAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents 
| count
```

**Output**

|Count|
|--|
|59066|

## See a sample of data

To get a sense of the data, use the [take](../take-operator.md) operator to view a sample of records. This operator returns a specified number of arbitrary rows from the table, which can be useful for previewing the general data structure and contents.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUShJzE5VMAUAP49+9hUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents 
| take 5
```

The following table shows only five of the 22 returned columns. To see the full output, run the query.

|StartTime|EndTime|EpisodeId|EventId|State|EventType|...|
|--|--|--|--|--|--|--|
|2007-09-20T21:57:00Z|2007-09-20T22:05:00Z|11078|60913|FLORIDA|Tornado|...|
|2007-12-20T07:50:00Z|2007-12-20T07:53:00Z|12554|68796|MISSISSIPPI|Thunderstorm Wind|...|
|2007-12-30T16:00:00Z|2007-12-30T16:05:00Z|11749|64588|GEORGIA|Thunderstorm Wind|...|
|2007-09-29T08:11:00Z|2007-09-29T08:11:00Z|11091|61032|ATLANTIC SOUTH|Waterspout|...|
|2007-09-18T20:00:00Z|2007-09-19T18:00:00Z|11074|60904|FLORIDA|Heavy Rain|...|

## Select a subset of columns

Use the [project](../project-operator.md) operator to simplify the view and select a specific subset of columns. Using `project` is often more efficient and easier to read than viewing all columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKEnMTlUwBTIKivKzUpNLFIJLEktSdRTACkIqC4BMl8TcxPTUgKL8gtSikkoA88jUEj8AAAA=" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents
| take 5
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

## List unique values

It appears that there are multiple types of storms based on the results of the previous query. Use the [distinct](../distinct-operator.md) operator to list all of the unique storm types.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUUjJLC7JzEsuUQALhVQWpAIAgfl1HyEAAAA=" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents 
| distinct EventType
```

There are 46 types of storms in the table. Here's a sample of 10 of them.

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

## Sort results

To view the top floods in Texas that caused the most damage, use the [sort](../sort-operator.md) operator to arrange the rows in descending order based on the `DamageProperty` column. The default sort order is descending. To sort in ascending order, specify `asc`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUA9xjXAMVldIzEtRAKsJqSyASLjl5OenqAN1FOcXlSgkVSq4JOYmpqcGFOUXpBaVVAIlCorys1KTS0CGFZWEZOam6ii45qVAGGALdBBG6qBpBwDYBhI8lQAAAA==" target="_blank">Run the query</a>
::: moniker-end

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

## Filter by condition

The [where](../where-operator.md) operator filters rows of data based on certain criteria.

The following query looks for storm events in a specific `State` of a specific `EventType`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUA9xjXAMVldIzEtRAKsJqSyASLjl5OenqAN1FBTlZ6Uml4D0FJWEZOam6ii45qVAGGBzdBA6dRRcEnMT01MDivILUotKKgFltqXufAAAAA==" target="_blank">Run the query</a>
::: moniker-end

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

## Filter by date and time range

Use the [between operator](../between-operator.md) to filter data based on a specific time range.

The following query finds all storm events between August 1, 2007 and August 30, 2007, along with their states, event types, start and end times. The results are then sorted in ascending order by start time.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WOwQqDQBBD7%2F2KObpQZaqUtt77BfoDqwbagrsyOyhCP76jh1Io5BDCI0mjUcb7jKDp8KblAQE16kXb5wjqoAsQKBu8Qi3JSuZLztecT8Rc73JUFPQHVExlVZ9vJuesepL4Qq9bueJI%2B2S7Tma%2Fc5aGYTOGpyhK3frzxaf%2BA3AsVtytAAAA" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents
| where StartTime between (datetime(2007-08-01 00:00:00) .. datetime(2007-08-30 23:59:59))
| project State, EventType, StartTime, EndTime
| sort by StartTime asc 
```

**Output**

| State | Eventype | StartTime | EndTime |
|--|--|--|--|
| GEORGIA | Excessive Heat | 2007-08-01 00:00:00 | 2007-08-27 23:59:00 |
| TENNESSEE | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| TENNESSEE | Drought | 2007-08-01 00:00:00 | 2007-08-3123:59:00 |
| SOUTH CAROLINA | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| TENNESSEE | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| GEORGIA | Excessive Heat | 2007-08-01 00:00:00 | 2007-08-27 23:59:00 |
| TENNESSEE | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| MINNESOTA | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| WISCONSIN | Drought | 2007-08-01 00:00:00 | 2007-08-31 23:59:00 |
| GEORGIA | Excessive Heat | 2007-08-01 00:00:00 | 2007-08-27 23:59:00 |
|...|...|...|...|

## Get the top *n* rows

The [top](../top-operator.md) operator returns the first *n* rows sorted by the specified column.

The following query returns the five Texas floods that caused the most damaged property.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUA9xjXAMVldIzEtRAKsJqSyASLjl5OenqAN1lOQXKJgqJFUquCTmJqanBhTlF6QWlVQCZQqK8rNSk0tAphWVhGTmpuoouOalQBhgG3QQZuqgaQcAOmqryJYAAAA=" target="_blank">Run the query</a>
::: moniker-end

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
> The order of the operators is important. If you put `top` before `where` here, you'll get different results. This is because the data is transformed by each operator in order. To learn more, see [tabular expression statements](../tabular-expression-statements.md).

## Create calculated columns

The [project](../project-operator.md) and [extend](../extend-operator.md) operators can both create calculated columns.

Use `project` to specify only the columns you want to view, and use `extend` to append the calculated column to the end of the table.

The following query creates a calculated `Duration` column with the difference between the `StartTime` and `EndTime`. Since we only want to view a few select columns, using `project` is the better choice in this case.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMsQoCMRBEe79iujRaWqYQLtZCUtjGy6InJhv29pSAH+/pIWg3zLx5Xlmyu1PRcfXE40JC8BqVYC1McMedN4gl4cOEVpdhf2NOZn4oV2xxauhijmc6CFcSbUg09vNcha/U61spGoZMa7iSltBNEnXgAvvtsPkF/40vqGFRKakAAAA=" target="_blank">Run the query</a>
::: moniker-end

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

Use `extend` to view the calculated `Duration` column along with all of the other columns. The `Duration` column is added as the last column.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWNuwoCMRBFe7/idqksLVMIG2shKWxHM+iCyYTZ8RHw481qd+Hcw4kmWsKTqy2bD143VkY0Mob3cCmc9tGBasbvk3r7g8NdJLthmDTscO6YqNCVjyqN1ToyL5eB+W085OmhZLNUeISa01wY2zWjtu4vDhiVhIQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```Kusto
StormEvents
| where State == 'TEXAS' and EventType == 'Flood'
| top 5 by DamageProperty desc
| extend Duration = EndTime - StartTime
```

**Output**

|StartTime|EndTime|...|Duration|
|--|--|--|--|
|2007-08-18T21:30:00Z|2007-08-19T23:00:00Z|...|1.01:30:00|
|2007-06-27T00:00:00Z|2007-06-27T12:00:00Z|...|12:00:00|
|2007-06-28T18:00:00Z|2007-06-28T23:00:00Z|...|05:00:00|
|2007-06-27T00:00:00Z|2007-06-27T08:00:00Z|...|08:00:00|
|2007-06-26T20:00:00Z|2007-06-26T23:00:00Z|...|03:00:00|

## Map values from one set to another

Static mapping is a useful technique for changing the presentation of your results. In KQL, one way to perform static mapping is by using a dynamic dictionary and accessors to map values from one set to another.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA23PvQrCQBAE4D5PMVylkCdQUkkEC0UIVmJxXpZ4kvthc4kc6rt7JBYqFtt9M8O2FNC5nhVtpffaNihQRyuNVrMMuKcDRGmIG7IqYiutbIgFFhD7/txqJfLJHIJudYhYOeOljZNgPchAIonnfJlVwbEpB7Khyx64XYgJ1TiOovi74vgT/E6kEs/uSipgbN3U+ZvnWLMmW7dxJ00Kf/94nNDpBfVsVEn9AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let sourceMapping = dynamic(
  {
    "Emergency Manager" : "Public",
    "Utility Company" : "Private"
  });
StormEvents
| where Source == "Emergency Manager" or Source == "Utility Company"
| project EventId, Source, FriendlyName = sourceMapping[Source]
```

**Output**

|EventId|Source|FriendlyName|
|---|---|---|
|68796|Emergency Manager|Public|
|...|...|...|
|72609|Utility Company|Private|
|...|...|...|

## Next step

Now that you're familiar with the essentials of writing Kusto queries, go on to the next tutorial and learn how to use aggregation functions to gain deeper insight into your data.

> [!div class="nextstepaction"]
> [Use aggregation functions](use-aggregation-functions.md)
