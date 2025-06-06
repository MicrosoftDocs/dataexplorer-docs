---
title:  top-hitters operator
description: Learn how to use the top-hitters operator  to return an approximation for the most popular distinct values in the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/06/2025
---
# top-hitters operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns an approximation for the most popular distinct values, or the values
with the largest sum, in the input.

> [!NOTE]
> `top-hitters` uses an approximation algorithm optimized for performance
> when the input data is large.
> The approximation is based on the [Count-Min-Sketch](https://en.wikipedia.org/wiki/Count%E2%80%93min_sketch) algorithm.  

## Syntax

*T* `|` `top-hitters` *NumberOfValues* `of` *ValueExpression* [ `by` *SummingExpression* ]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The input tabular expression.|
| *NumberOfValues* | int, long, or real |  :heavy_check_mark: | The number of distinct values of *ValueExpression*.|
| *ValueExpression* | `string` |  :heavy_check_mark: | An expression over the input table *T* whose distinct values are returned.|
| *SummingExpression* | `string` | | If specified, a numeric expression over the input table *T* whose sum per distinct value of *ValueExpression* establishes which values to emit. If not specified, the count of each distinct value of *ValueExpression*  is used instead.|

> [!NOTE]
> * When you include *SummingExpression* in the syntax, the query is equivalent to:
> 
>   `T | summarize S = sum(SummingExpression) by ValueExpression | top NumberOfValues by S desc`
>
> * When you don't include *SummingExpression* in the syntax, the query is equivalent to:
> 
>   `T | summarize C = count() by ValueExpression | top NumberOfValues by C desc`

## Examples

The examples in this section show how to use the syntax to help you get started.

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]


### Get top 2 events by totals ###

This example summarizes storm event data by calculating the total number of events for each event type. The query then selects the top two event types with the highest total number of events.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKC7NzU0syqxKVQjJL0nMAYt7pijYgiQ0oDxNhaRKBTA7pLIgFaipJL9AwQgkiKInJbU4GQAdfFzEXQAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end
 
```kusto
StormEvents
| summarize TotalEventId = sum(EventId) by EventType
| top 2 by TotalEventId desc
```

**Output**

| EventType | TotalEventId |
|---|---|
| Thunderstorm Wind | 562,509,013 |
| Hail | 474,690,007 |

### Get most frequent items

This example shows how to find the top-5 types of storms.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKMkv0M3ILClJLSpWMFXIT1MAy4RUFqQCAFP10SMoAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| top-hitters 5 of EventType 
```

**Output**

| EventType | approximate_count_EventType |
|---|---|
| Thunderstorm Wind | 13015 |
| Hail | 12711 |
| Flash Flood | 3688 |
| Drought | 3616 |
| Winter Weather | 3349 |

### Get top hitters based on column value

This example shows how to find the States with the most *Thunderstorm Wind* events.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVAHNDKgtSFWxtFZRCMkrzUlKLikEKFcIz81KUgApL8gt0MzJLSoDiCoYGCvlpCsEliSWpAPMxVM5OAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where EventType == "Thunderstorm Wind"
| top-hitters 10 of State 
```

**Output**

| State | approximate_sum_State |
|---|---|
| TEXAS | 830 |
| GEORGIA | 609 |
| MICHIGAN | 602 |
| IOWA | 585 |
| PENNSYLVANIA | 549 |
| ILLINOIS | 533 |
| NEW YORK | 502 |
| VIRGINIA | 482 |
| KANSAS | 476 |
| OHIO | 455 |
