---
title:  arg_max() (aggregation function)
description: Learn how to use the arg_max() aggregation function to find a row in a table that maximizes the input expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# arg_max() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds a row in the table that maximizes the specified expression. It returns all columns of the input table or specified columns.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

> **Deprecated aliases:** argmax()

## Syntax

`arg_max` `(`*ExprToMaximize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ExprToMaximize* | `string` |  :heavy_check_mark: | The expression for which the maximum value is determined. |
| *ExprToReturn* | `string` |  :heavy_check_mark: | The expression determines which columns' values are returned, from the row that has the maximum value for *ExprToMaximize*.  Use a wildcard `*` to return all columns. |

## Returns

Returns a row in the table that maximizes the specified expression *ExprToMaximize*, and the values of columns specified in *ExprToReturn*.

> [!TIP]
> To see the maximal value only, use the [max() function](max-aggregation-function.md).

## Examples

### General examples

The following example finds the maximum latitude of a storm event in each state.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVILEqPz02s0HBKTc/M80ks0VGAsPKTE0sy8/M0FZIqFYJLEktSATqyPZtCAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| summarize arg_max(BeginLat, BeginLocation) by State
```

**Output**

The results table displays only the first 10 rows.

| State                | BeginLat | BeginLocation        |
| -------------------- | -------- | -------------------- |
| MISSISSIPPI          | 34.97    | BARTON               |
| VERMONT              | 45       | NORTH TROY           |
| AMERICAN SAMOA       | -14.2    | OFU                  |
| HAWAII               | 22.2113  | PRINCEVILLE          |
| MINNESOTA            | 49.35    | ARNESEN              |
| RHODE ISLAND         | 42       | WOONSOCKET           |
| INDIANA              | 41.73    | FREMONT              |
| WEST VIRGINIA        | 40.62    | CHESTER              |
| SOUTH CAROLINA       | 35.18    | LANDRUM              |
| TEXAS                | 36.4607  | DARROUZETT           |
| ...             | ...    | ...            |

The following example finds the last time an event with a direct death happened in each state, showing all the columns.

The query first filters the events to include only those events where there was at least one direct death. Then the query returns the entire row with the most recent `StartTime`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnJlZoBJckFpWEZOam6ihoaSokVSoABUpSAQPollZPAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_max(StartTime, *) by State
```

**Output**

The results table displays only the first 10 rows and first three columns.

| State | StartTime | EndTime | ... |
|--|--|--|--|
| GUAM | 2007-01-27T11:15:00Z | 2007-01-27T11:30:00Z | ... |
| MASSACHUSETTS | 2007-02-03T22:00:00Z | 2007-02-04T10:00:00Z | ... |
| AMERICAN SAMOA | 2007-02-17T13:00:00Z | 2007-02-18T11:00:00Z | ... |
| IDAHO | 2007-02-17T13:00:00Z | 2007-02-17T15:00:00Z | ... |
| DELAWARE | 2007-02-25T13:00:00Z | 2007-02-26T01:00:00Z | ... |
| WYOMING | 2007-03-10T17:00:00Z | 2007-03-10T17:00:00Z | ... |
| NEW MEXICO | 2007-03-23T18:42:00Z | 2007-03-23T19:06:00Z | ... |
| INDIANA | 2007-05-15T14:14:00Z | 2007-05-15T14:14:00Z | ... |
| MONTANA | 2007-05-18T14:20:00Z | 2007-05-18T14:20:00Z | ... |
| LAKE MICHIGAN | 2007-06-07T13:00:00Z | 2007-06-07T13:00:00Z | ... |
| ... | ... | ... | ... |

The following example demonstrates null handling.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/new-free-database?query=H4sIAAAAAAAAA31PwQrCMAy97ytCT530osfdnKBX8SCIiHQsjEKWjrRjKH68nWwoguYdkry8l5DaxoSKUG+ld7GAEMVxY2Djycu7PaIE57kAxzGHcwYp1LrrCJUBdcA6paX5oneCyKlIHs09UT4JSssJo+KERH74K/m1ZI9WxnkpfuCP6zM/+1Ymu2QPCH3bWnF3BCvNtXWsp5cMLHKobvD6/wlU5dHuDwEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Fruit: string, Color: string, Version: int) [
    "Apple", "Red", 1,
    "Apple", "Green", int(null),
    "Banana", "Yellow", int(null),
    "Banana", "Green", int(null),
    "Pear", "Brown", 1,
    "Pear", "Green", 2,
]
| summarize arg_max(Version, *) by Fruit
```

**Output**

| Fruit | Version | Color |
|--|--|--|
| Apple | 1 | Red |
| Banana |  | Yellow |
| Pear | 2 | Green |

### Examples comparing arg_max() and max()

The arg_max() function differs from the [max() function](max-aggregation-function.md). The arg_max() function allows you to return other columns along with the maximum value, and [max()](max-aggregation-function.md) only returns the maximum value itself.

The following example uses arg_max() to find the last time an event with a direct death happened in each state, showing all the columns.
The query first filters the events to only include events where there was at least one direct death. Then the query returns the entire row with the most recent (maximum) StartTime.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnJlZoBJckFpWEZOam6ihoaQIAErhf3kYAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_max(StartTime, *)
```

The results table returns all the columns for the row containing the highest value in the expression specified.

| StartTime | EndTime |	EpisodeId | EventId | State | EventType | ... |
|--|--|--|--|
| 2007-12-31T15:00:00Z | 2007-12-31T15:00:00 | 	12688 | 69700 | UTAH | Avalanche | ... |

The following example uses the max() function to find the last time an event with a direct death happened in each state, but only returns the maximum value of StartTime.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKuQmVmgElyQWlYRk5qZqAgD8HVVGPwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize max(StartTime)
```

The results table returns the maximum value of StartTime, without returning other columns for this record.

| max_StartTime |
| --- |
| 2007-12-31T15:00:00Z |

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [arg_min function](arg-min-aggregation-function.md)
* [max function](max-aggregation-function.md)
* [avg function](avg-aggregation-function.md)
* [percentile function](percentiles-aggregation-function.md)
