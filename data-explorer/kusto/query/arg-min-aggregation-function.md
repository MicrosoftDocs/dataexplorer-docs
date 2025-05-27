---
title:  arg_min() (aggregation function)
description: Learn how to use the arg_min() aggregation function to find a row in a table that minimizes the input expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# arg_min() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Finds a row in the table that minimizes the specified expression. It returns all columns of the input table or specified columns.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

> **Deprecated aliases:** argmin()

## Syntax

`arg_min` `(`*ExprToMinimize*`,` *\** | *ExprToReturn*  [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ExprToMinimize*| `string` |  :heavy_check_mark: | The expression for which the minimum value is determined. |
| *ExprToReturn* | `string` |  :heavy_check_mark: | The expression determines which columns' values are returned, from the row that has the minimum value for *ExprToMinimize*.  Use a wildcard `*` to return all columns. |
  
## Null handling

When *ExprToMinimize* is null for all rows in a table, one row in the table is picked. Otherwise, rows where *ExprToMinimize* is null are ignored.

## Returns

Returns a row in the table that minimizes *ExprToMinimize*, and the values of columns specified in *ExprToReturn*. Use or `*` to return the entire row.

> [!TIP]
> To see the minimal value only, use the [min() function](min-aggregation-function.md).

## Examples

The following example finds the maximum latitude of a storm event in each state.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoLs3NTSzKrEpVSCxKj8/NzNNwSk3PzPNJLNFRgLDykxNLMvPzNBWSKhWCSxJLUgG8tM4mQwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| summarize arg_min(BeginLat, BeginLocation) by State
```

**Output**

The results table shown includes only the first 10 rows.

| State          | BeginLat | BeginLocation |
| -------------- | -------- | ------------- |
| AMERICAN SAMOA | -14.3    | PAGO PAGO     |
| CALIFORNIA     | 32.5709  | NESTOR        |
| MINNESOTA      | 43.5     | BIGELOW       |
| WASHINGTON     | 45.58    | WASHOUGAL     |
| GEORGIA        | 30.67    | FARGO         |
| ILLINOIS       | 37       | CAIRO         |
| FLORIDA        | 24.6611  | SUGARLOAF KEY |
| KENTUCKY       | 36.5     | HAZEL         |
| TEXAS          | 25.92    | BROWNSVILLE   |
| OHIO           | 38.42    | SOUTH PT      |
| ... | ... | ... |

Find the first time an event with a direct death happened in each state, showing all of the columns.

The query first filters the events to only include those where there was at least one direct death. Then the query returns the entire row with the lowest value for StartTime.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVXBJTSzJKHbJLEpNLlGwUzAAyRSX5uYmFmVWpSokFqXH52bmaQSXJBaVhGTmpuooaGkqJFUqAAVKUgHnoTY6UQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_min(StartTime, *) by State
```

**Output**

The results table shown includes only the first 10 rows and first 3 columns.

| State      | StartTime            | EndTime              | ... |
| ---------- | -------------------- | -------------------- | --- |
| INDIANA    | 2007-01-01T00:00:00Z | 2007-01-22T18:49:00Z | ... |
| FLORIDA    | 2007-01-03T10:55:00Z | 2007-01-03T10:55:00Z | ... |
| NEVADA     | 2007-01-04T09:00:00Z | 2007-01-05T14:00:00Z | ... |
| LOUISIANA  | 2007-01-04T15:45:00Z | 2007-01-04T15:52:00Z | ... |
| WASHINGTON | 2007-01-09T17:00:00Z | 2007-01-09T18:00:00Z | ... |
| CALIFORNIA | 2007-01-11T22:00:00Z | 2007-01-24T10:00:00Z | ... |
| OKLAHOMA   | 2007-01-12T00:00:00Z | 2007-01-18T23:59:00Z | ... |
| MISSOURI   | 2007-01-13T03:00:00Z | 2007-01-13T08:30:00Z | ... |
| TEXAS      | 2007-01-13T10:30:00Z | 2007-01-13T14:30:00Z | ... |
| ARKANSAS   | 2007-01-14T03:00:00Z | 2007-01-14T03:00:00Z | ... |
| ... | ... | ... | ... |

The following example demonstrates null handling.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31QPQvCQAzdC/0PoVMrt+jYzQp2FQdBRORKQzlIcyW9UhR/vKlYFEHzhny9F5LUNigqwnQrgws59EEcNwY2nry80wNK7zzn4DhkcIojUEvWXUeYGEj2WKtbmu96KYisgapSHoiymVFYVkyUIxL58T/n55gdWpkIhfiRPzeYG7NypY1zHN2hH9rWirshWGkureP0dZqBRQbVFZ5/eADFBqWOFwEAAA==" target="_blank">Run the query</a>
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
| summarize arg_min(Version, *) by Fruit
```

**Output**

| Fruit | Version | Color |
|--|--|--|
| Apple | 1 | Red |
| Banana |  | Yellow |
| Pear | 1 | Brown |

## Comparison to min()

The arg_min() function differs from the [min() function](min-aggregation-function.md). The arg_min() function allows you to return additional columns along with the minimum value, and [min()](min-aggregation-function.md) only returns the minimum value itself.

### Examples

The following example uses arg_min() to find the last time an event with a direct death happened in each state, showing all the columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKiQWpcfnZuZpBJckFpWEZOam6ihoaQIA4GzUy0YAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize arg_min(StartTime, *)
```

The results table returns all the columns for the row containing the lowest value in the expression specified.

| StartTime | EndTime |	EpisodeId | EventId | State | EventType | ... |
|--|--|--|--|
| 2007-01-01T00:00:00Z | 2007-01-22T18:49:00Z | 2408 | 11929 | INDIANA | Flood | ... |

The following example uses the min() function to find the last time an event with a direct death happened in each state, but only returns the minimum value of StartTime.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVcElNLMkodsksSk0uUbBTMABKFJfm5iYWZValKuRm5mkElyQWlYRk5qZqAgCNhnP%2FPwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where DeathsDirect > 0
| summarize min(StartTime)
```

The results table returns the lowest value in the specific column only.

| min_StartTime |
| --- |
| 2007-01-01T00:00:00Z |

## Related content

* [min function](min-aggregation-function.md)
* [max function](max-aggregation-function.md)
* [avg function](avg-aggregation-function.md)
* [percentile function](percentiles-aggregation-function.md)
* [min-of function](min-of-function.md)
