---
title: Write queries for Azure Data Explorer
description: Learn how to perform basic and more advanced queries for Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: tutorial
ms.date: 12/19/2022
ms.localizationpriority: high
---

# Write queries for Azure Data Explorer

In this tutorial, you'll learn how to perform queries in Azure Data Explorer using the [Kusto Query Language](./kusto/query/index.md). We'll explore the basics of writing queries, including how to retrieve data, filter, aggregate and visualize your data.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity to access the [help cluster](https://dataexplorer.azure.com/clusters/help).
* Familiarity with database structures like tables, columns, and rows.

## Get started

MAKE SURE THEY'RE IN CONTEXT OF SAMPLES DB.

## Kusto Query Language overview

The Kusto Query Language (KQL) is used to write queries and retrieve data in Azure Data Explorer. A KQL query consists of one or more query statements separated by a semicolon and returns data in tabular or graphical format. The two most common types of query statements are tabular expression statements and let statements.

### Tabular expression statements

A tabular expression statement is a type of query that manipulates data in tables or tabular datasets. It consists of one or more operators, which are separated by a pipe (`|`) and process the data sequentially. Each operator starts with a tabular input and returns a tabular output.

The order of the operators is important, as the data flows from one operator to the next and is transformed at each step. Think of it like a funnel, where the data starts as an entire table and is refined as it passes through each operator, until you're left with a final output at the end.

#### Example

The following steps are performed in this example query:

1. The `StormEvents` table is filtered to select rows with `StartTime` values within the specified date range.
1. The filtered table is further narrowed down to include only rows with a `State` value of "FLORIDA".
1. The final table is passed to the `count` operator, which returns a new table containing the count of rows.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksKgnJzE1VSEotKU9NzVPQSEksSS0BimgYGRiY6xoa6hoYairo6SmgiRuBxDVRTCpJVbC1VVBy8/EP8nRxVALJJeeX5pUAAG+X/jp7AAAA" target="_blank">Run the query</a>

```Kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "FLORIDA"
| count
```

|Count|
|--|
|28|

### Let statements

Let statements define variables that can be used within a query.

#### Example

The following query defines a list of `WindStorms` to use twice in the tabular statement.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMsQoCMRBE+/uKIdUd+AdiaWujYCEiy2UhC2ZXNvGOgPjt6lmI3TzmzVy54iga99U8F2wQm1KWsT+FdHeXkZTDCiGbFjP9xLepFC2ch3W3zLYTay3dA3NiZyx4aDeG6BP9732A+bfdkTtVmRiJyoW0/WkvdINpapQAAAA=" target="_blank">Run the query</a>

```Kusto
let WindStorms = dynamic(["hurricane", "monsoon", "tornado"]);
StormEvents
| where EventType in~ (WindStorms) or EventNarrative has_any (WindStorms)
```

## Learn common operators

Let's learn some common query operators using the `StormEvents` table. These operators are key to understanding KQL and will be used in many of your queries.

### count

Let's start by using the [count](kusto/query/countoperator.md) operator to check the size of the `StormEvents` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVqhRSM4vzSsBALU2eHsTAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents | count
```

|Count|
|--|
|59066|

### take

Now, use the [take](kusto/query/takeoperator.md) operator to view a sample of the data. Keep in mind that the rows returned are random and aren't guaranteed unless the source data is sorted.

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

Use the [project](kusto/query/projectoperator.md) operator to select a specific subset of columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUShJzE5VMAWxCorys1KTSxSCSxJLUnUUwEpCKguATJfE3MT01ICi/ILUopJKAG0+9oFBAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| take 5
| project State, EventType, DamageProperty
```

|State|EventType|DamageProperty|
|--|--|--|
|ATLANTIC SOUTH| Waterspout| 0|
|FLORIDA| Heavy Rain| 0|
|FLORIDA| Tornado| 6200000|
|GEORGIA| Thunderstorm Wind| 2000|
|MISSISSIPPI| Thunderstorm Wind| 20000|

### where

To filter the data based on certain criteria, use the [where](kusto/query/whereoperator.md) operator. For example, the following query will only return rows where the `EventType` and `State` columns meet certain conditions.

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

Use the [sort](kusto/query/sortoperator.md) operator to arrange the rows in ascending or descending order based on one or more columns. The default is descending order.

To view the top five floods in Texas that caused the most damage, let's use `sort` to arrange the rows in descending order based on the `DamageProperty` column and `take` to display only the top five rows.

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

### summarize

The [summarize](kusto/query/summarizeoperator.md) operator groups rows based on the values in the **by** clause and applies an aggregation function, such as count, to combine each group into a single row.

For example, the following query returns the count of events by state.

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

Use multiple aggregation functions in a single summarize operator to produce several computed columns.

For example, the following query returns the count of storms in each state and the unique number of storm types per state, then uses top to get the most storm-affected states.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUAiznnl+aVKNgqJINoDU0dhZDKglT/tGCQpmKgeApEAqwWJKWpkFSpEFySWJIKMqwkv0DBFCSCZFZKanEyALnxdKV0AAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize EventCount = count(), TypeOfStorms = dcount(EventType) by State
| top 5 by EventCount desc
```

|State|EventCount|TypeOfStorms|
|--|--|--|
|TEXAS| 4701| 27|
|KANSAS| 3166| 21|
|IOWA| 2337| 19|
|ILLINOIS| 2022| 23|
|MISSOURI| 2016| 20|

The result of a summarize operation has columns for each value in the by clause, a column for each computed expression, and a row for each combination of by values.

### render

The [render](kusto/query/renderoperator.md) operator allows you to display query results as graphical output. The web application supports the following options for graphical output: `barchart`, `columnchart`, `piechart`, `timechart`, and `linechart`.

Let's create a column chart showing the states that experienced over 50 storms in November 2007.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12PwQqCUBBF90H/MEuFlKcQrWoTfYH9wPN5QaP3XoxjUvTxObZQ2szi3sO5TCWR/eWJIP1286GxBYMqsSzXzoNqyAgEShorkClJSmMOWVFkpkgpz+kvLzVP1dQP3lvu3qDZfo5DkKPTm6RUv3RDsEwuEJ1ob2ZDZFFyVdneafPgeIOTn2O3ArRkhAZMLt4HH1w7ffIF6O9O1uQAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| summarize EventCount=count() by State
| where EventCount > 50
| sort by EventCount asc
| project State, EventCount
| render columnchart
```

:::image type="content" source="media/write-queries/render-column-chart.png" alt-text="Screenshot of the Azure Data Explorer web UI column chart created by the previous render query.":::

Let's create a time chart showing the storm count by day in November 2007.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSguzc1NLMqsSlVIBYnFJ%2beX5pXYgkkNTYWkSoWkzDyN4JLEopKQzNxUHQXDFE2QtqLUvJTUIoUSoFhyBlASAAyXWQJWAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

:::image type="content" source="media/write-queries/render-time-chart.png" alt-text="Screenshot of the Azure Data Explorer web UI time chart created by the previous render query.":::

Let's use a time chart to compare the daily series of several selected states.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWOywqDMBBF94X+wyVQUHDjB7iQ1mKhIDQuurU6RcEkMI590Y9vkm5mBu5hztXi2FQPsrJsN1/QS8gOqN3KKHCfneMEWjqWdjKEHfIBGfIxDfBzJKaQCmGySFRbXUutMqjjubmcDmU4/aobFfllNabj6UOIwr1brRR9mEmK2ztas/+/gLNvQgzx4n70DX6/4TkLqwAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| extend Hour = floor( StartTime % 1d , 1h)
| where State in ("TEXAS", "FLORIDA", "CALIFORNIA")
| summarize EventCount=count() by Hour, State
| render timechart
```

:::image type="content" source="media/write-queries/render-multi-time-chart.png" alt-text="Screenshot of Azure Data Explorer web UI time chart from the previous query.":::

> [!NOTE]
> The render operator is a client-side feature that is integrated into the language for ease of use. It's not a part of the engine.

## Scalar operators

This section covers some of the most important scalar operators.

### bin()

[**bin()**](./kusto/query/binfunction.md): Rounds values down to an integer multiple of a given bin size.

The following query calculates the count with a bucket size of one day.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVWwU0hJLEktATI1jAwMzHUNjHQNTTQVEvNSkBTZYCoyMtQEGVdcmpubWJRZlaqQCrIiPjm%2fNK9EwVYBTGtoKiRVKiRl5mnAjdJRMEzRBABIhjnmkwAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime < datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

### case()

[**case()**](./kusto/query/casefunction.md): Evaluates a list of predicates, and returns the first result expression whose predicate is satisfied, or the final **else** expression. You can use this operator to categorize or group data:

The following query returns a new column `deaths_bucket` and groups the deaths by number.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAGWOwQrCQAxE74X%2bQ9hTCwX14FFBaK9e%2bgGS7gZdbFrYZEXFj7dbqgfNbfJmhml1DNzcaFDJsxdIZMbgnwSOUC8Cu%2fQq6lnUPpDVEroHtIpKKUB3pcEt7lMX7ZV0ClkUgiLPYLqlaQ%2fbdQWmx3AmU%2f2gTUJMzkf%2bYwkJY99%2fiDmuDqac545Bv3MAxb4Bic1Oy88AAAA%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize deaths = sum(DeathsDirect) by State
| extend deaths_bucket = case (
    deaths > 50, "large",
    deaths > 10, "medium",
    deaths > 0, "small",
    "N/A")
| sort by State asc
```

### extract()

[**extract()**](./kusto/query/extractfunction.md): Gets a match for a regular expression from a text string.

The following query extracts specific attribute values from a trace.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAE2OwQrCMBBE74X%2bw9BTojHYagSVHJRevXkrHqJdpVBbSVew4McbFYungeXtvKmJsetzxw4WZQh2x5og9t6daIWOfdVcJIpkY1OFrc0U8rt3XLWNTbOZnhultU4UfoD5A4zRmVkovInDOo6%2bojh6gh5MTTmQwR0uQckiGb5FMZ0s9WEsQ3uo%2fixSccT9jdqz8ORqKTECV1cSaSdfq2k6L8oAAAA%3d" target="_blank">Run the query</a>

```Kusto
let MyData = datatable (Trace: string) ["A=1, B=2, Duration=123.45,...", "A=1, B=5, Duration=55.256, ..."];
MyData
| extend Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s)
```

This query uses a **let** statement, which binds a name (in this case `MyData`) to an expression. For the rest of the scope, in which the **let** statement appears (global scope or in a function body scope), the name can be used to refer to its bound value.

### parse_json()

[**parse_json()**](./kusto/query/parsejsonfunction.md): Interprets a string as a JSON value, and returns the value as dynamic. It's superior to using the **extractjson()** function when you need to extract more than one element of a compound JSON object.

The following query extracts the JSON elements from an array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAHWPQQuCQBCF74L%2fYdmLBSJ6EGKjU17r1E0kJh1C2XZlHc0w%2f3ur1s1O896bB%2fONRGKnVwIE7MAKOwhuEtnmYiBHwRoypbpvXSf1Bl60BqjUiot04B3IFrmIol0Q%2bpPLdauIi3iyj9KWojCcNfRWx7NuqEiw48KaMRu9bO86y3HXeTPsCVXBzvg8amlpajANXqtGq4VmO5VqoyvM6dsKfkhpmAUzkf9nM9OtLi3reg79ar788AEVX8GkOAEAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
let MyData = datatable (Trace: string)
['{"duration":[{"value":118.0,"valcount":5.0,"min":100.0,"max":150.0,"stdDev":0.0}]}'];
MyData
| extend NewCol = parse_json(Trace)
| project NewCol.duration[0].value, NewCol.duration[0].valcount, NewCol.duration[0].min, NewCol.duration[0].max, NewCol.duration[0].stdDev
```

The following query extracts the JSON elements.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAE2OwQqCQBCG74LvsOzFBBE9CLHRKa916hYRkw6RbLuyO5pRvXvrGtZpvn9m4P8kEts%2bSiBga1a7QXCWyBZ7AxUKZslc1SVmh%2bjJe5AdcpHnyzRLxlTpThEXxRhvV%2bVOWeYZBseFZ0t1iT0XLryj4yoMprIweDEcCFXNdnjfaOnaWzAWT43VamqPx6fW6AYr%2bn6l3iH5S95hXjiLH8Mw82TxAQvJEB%2fsAAAA" target="_blank">Run the query</a>

```Kusto
let MyData = datatable (Trace: string) ['{"value":118.0,"valcount":5.0,"min":100.0,"max":150.0,"stdDev":0.0}'];
MyData
| extend NewCol = parse_json(Trace)
| project NewCol.value, NewCol.valcount, NewCol.min, NewCol.max, NewCol.stdDev
```

The following query extracts the JSON elements with a dynamic data type.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAD2NMQvCMBBG90D%2bw5GphVLSoSARt65ubuJwJjdU0lZiWlrU%2f25MotO9x8H7LHk4bh16hAOYcDxeLUFxcqhJgdlGHHpdcnbOWDzFgnYmoZpmV8tK6GkePTmh2q8N%2fRg%2bUkbGNXAb%2beFNR4tQQd7lZc9ZGuXsBXc33Uh7iJN1jFdZcvunIf5HXCvOEqf2BwXmDCnKAAAA" target="_blank">Run the query</a>

```Kusto
let MyData = datatable (Trace: dynamic)
[dynamic({"value":118.0,"counter":5.0,"min":100.0,"max":150.0,"stdDev":0.0})];
MyData
| project Trace.value, Trace.counter, Trace.min, Trace.max, Trace.stdDev
```

### ago()

[**ago()**](./kusto/query/agofunction.md): Subtracts the given timespan from the current UTC clock time.

The following query returns data for the last 12 hours.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOQQ6CQAxF9yTc4S8hQcmQuNSNR4ALTKQyJDAlnSIuPLwzJGrctM3v+7+t684R7qMEhW6MafQUMJAnsUoIdl4mQm/VVrC+h0Z6shFOINZAIc/qOql24KIEL8nIAuWYohC6sfQB9yjtPtPA8SrhmGeLjF7RjTO1Gu+cIdYPVHjeisOpLyukKTbjYml5piuvXknwIU1lGlPm2Qvzg55L+u+b9udIyOZI6LfHZf/YNK58Ay2HrbAEAQAA" target="_blank">Run the query</a>

```Kusto
//The first two lines generate sample data, and the last line uses
//the ago() operator to get records for last 12 hours.
print TimeStamp= range(now(-5d), now(), 1h), SomeCounter = range(1,121)
| mv-expand TimeStamp, SomeCounter
| where TimeStamp > ago(12h)
```

### startofweek()

[**startofweek()**](./kusto/query/startofweekfunction.md): Returns the start of the week containing the date, shifted by an offset, if provided

The following query returns the start of the week with different offsets.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEACtKzEtPVchPSytOLVFIK8rPVdA1VCjJVzBUKC5JLVAw5OWqUSgoys9KTS5RKE9NzQ4uSSwqUbAFygLp%2fDSQkEZefrmGpg7UEE0dCA0AdE3lv1kAAAA%3d" target="_blank">Run the query</a>

```Kusto
range offset from -1 to 1 step 1
| project weekStart = startofweek(now(), offset),offset
```

This query uses the **range** operator, which generates a single-column
table of values. See also: [**startofday()**](./kusto/query/startofdayfunction.md), [**startofweek()**](./kusto/query/startofweekfunction.md), [**startofyear()**](./kusto/query/startofyearfunction.md)), [**startofmonth()**](./kusto/query/startofmonthfunction.md), [**endofday()**](./kusto/query/endofdayfunction.md), [**endofweek()**](./kusto/query/endofweekfunction.md), [**endofmonth()**](./kusto/query/endofmonthfunction.md), and [**endofyear()**](./kusto/query/endofyearfunction.md).

### between()

[**between()**](./kusto/query/betweenoperator.md):
Matches the input that is inside the inclusive range.

The following query filters the data by a given date range.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrApGRuaaCnp4ChrixgaYmyKTk%2fNK8EgBluyagXgAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where StartTime between (datetime(2007-07-27) .. datetime(2007-07-30))
| count
```

The following query filters the data by a given date range, with the slight variation of three days (`3d`) from the start date.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrApGRuaaCnp6CcYomSF9yfmleCQCGAqjRTAAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| where StartTime between (datetime(2007-07-27) .. 3d)
| count
```

## Tabular operators

Kusto has many tabular operators, some of which are covered in other sections of this article. Here we'll focus on **parse**.

### parse

[**parse**](./kusto/query/parseoperator.md): Evaluates a string expression and parses its value into one or more calculated columns. There are three ways to parse: simple (the default), regex, and relaxed.

The following query parses a trace and extracts the relevant values, using a default of simple parsing. The expression (referred to as StringConstant) is a regular string value and the match is strict: extended columns must match the required types.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAN2UTU%2fDMAyG75X6H6xcxlCkpRlsUNQjN6gQ2wnEoevMFsiaKk2HJvHjabqvlI91l11QLrH12vETW5Zo4H411kmKEME0MdWZSISz2yVmpvaHhdEim3V979n3OrU%2fhFgZ8boaSZHiI0pMiipEY6FKnWKcLDB6EDlKkeEoneO0lKgpGGUSWYcUER9SKOw1LhcT1BHvU5AqfR%2bLKpbxXjDscRYMgF2FFyxkwRMFvX7ngCLXuBSqLO5%2bT9S%2ftrJuh54OI7g8iMFaMdhxGOy0GJz9i25w%2fjdG0IoRHNWNNe1ph2pwEKNlqI7HsEPley83vrfZCL73CXmiq%2fr32wA%2bhJnDOZAGEQHXBNIEIq4VSpXNbAIXkbjAO8UOmuz4bWoXlrhWWO0vqyA2%2bAcw2f7B1rORd60calat3jA1TRbq1A6NxsC%2bLdCoCuj3p74AKTs4pmcFAAA%3d" target="_blank">Run the query</a>

```Kusto
let MyTrace = datatable (EventTrace:string)
[
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00, releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016 08:39:00)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)"
];
MyTrace
| parse EventTrace with * "resourceName=" resourceName ", totalSlices=" totalSlices:long * "sliceNumber=" sliceNumber:long * "lockTime=" lockTime ", releaseTime=" releaseTime:date "," * "previousLockTime=" previouLockTime:date ")" *
| project resourceName ,totalSlices , sliceNumber , lockTime , releaseTime , previouLockTime
```

The following query parses a trace and extracts the relevant values, using `kind = regex`. The StringConstant can be a regular expression.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAN2UQU%2fCQBCF7036HyZ7gWKRbVHQmgY9eNPGCCcoh9KOsLK0ZLtFMf54l6LQBgUuXEyTTbP7pt3vvclwlPC47IkgRHAhCqR6Rhyher%2fAWOb7TioFi8eGrg10rZLvO%2bAlkr0su5yF%2bIwcg1SVCEyTTIToBTN0n9gcOYuxG04wyjgKE2QiA56XpK7dNiFdvXrZbITCtZsm8CSc9piqpXbDajdsarWAXjkX1KFW3wSx%2fs8exVzggiVZ%2bvD7h5rXK5lRMU%2bHYV3uxaAHMehxGPS0GDb9F2nY9t8Y1kEM66g01rSnbarWXowDTXU8xqqpdG14o2vfE0HXPmEeCHX%2fKYsjNR8EjvEdtqMB3picAKme1zrGIKh%2f3NX7w5pLoEgLt6SM56c1PzpTq6oqYpIitMOTeAxAlKb6c3Wjs3GBbAzJJUV8UjQjP91BJztuOGryKbHvGwQgxxbJK4ayTFKKBbahQCkA2DX7C29veJJmBQAA" target="_blank">Run the query</a>

```Kusto
let MyTrace = datatable (EventTrace:string)
[
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00, releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016 08:39:00)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)"
];
MyTrace
| parse kind = regex EventTrace with "(.*?)[a-zA-Z]*=" resourceName @", totalSlices=\s*\d+\s*.*?sliceNumber=" sliceNumber:long  ".*?(previous)?lockTime=" lockTime ".*?releaseTime=" releaseTime ".*?previousLockTime=" previousLockTime:date "\\)"
| project resourceName , sliceNumber , lockTime , releaseTime , previousLockTime
```

The following query parses a trace and extracts the relevant values, using `kind = relaxed`. The StringConstant is a regular string value and the match is relaxed: extended columns can partially match the required types.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAN2US0%2fCQBDH7036HSZ7wZpN2BYFrenRGzZG4KLxUNoRVpYu2W5REj%2b83fKw9QE1kYvppTOZx%2f%2b3MxmBGm5WQxXFCAEkkS6%2bsUA4uV5iqku%2fn2nF04ljWw%2b21Sr9PoRS86fVQPAY71BglBUpCjOZqxjDaI7BLV%2bg4CkO4ikmuUBFQUsdiTIlC7wehcz8hvl8jCrwOhSEjGdDXuQyr%2b322h5zu8Au%2fDPmM%2feeglr32ROxULjkMs%2f63xfqXJowp0WPh%2bGe78VgBzFYMwx2XAyP%2fYtpeN7PGO5BDLfRNNa0x12q7l6MA0vVHMMslW09XtnW5iLY1hssIlXon%2fE0CYom0SsmQP6IMxz1%2b7%2b7AnXQdX6TNXMIvHA9hVMgNYEEqiaQuj5StXwh04kpUNVLqup3ETsCsoMxpavSSdXyi7NrIohJ%2foJDtoRbzybcMeFQjkjJZ4x1nYVWtEPtleHjjaGmCujnVu%2fWU75tHgYAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
let MyTrace = datatable (EventTrace:string)
[
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00, releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016 08:39:00)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01, releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016 08:39:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:01)",
"Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00, releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)"
];
MyTrace
| parse kind=relaxed "Event: NotifySliceRelease (resourceName=PipelineScheduler, totalSlices=NULL, sliceNumber=23, lockTime=02/17/2016 08:40:01, releaseTime=NULL, previousLockTime=02/17/2016 08:39:01)" with * "resourceName=" resourceName ", totalSlices=" totalSlices:long * "sliceNumber=" sliceNumber:long * "lockTime=" lockTime ", releaseTime=" releaseTime:date "," * "previousLockTime=" previousLockTime:date ")" *
| project resourceName ,totalSlices , sliceNumber , lockTime , releaseTime , previousLockTime
```

## Time series analysis

### make-series

[**make-series**](./kusto/query/make-seriesoperator.md): aggregates together groups of rows like [summarize](./kusto/query/summarizeoperator.md), but generates a (time) series vector per each combination of by values.

The following query returns a set of time series for the count of storm events per day. The query covers a three-month period for each state, filling missing bins with the constant 0:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUchNzE7VLU4tykwtVsizTc4vzSvR0FRISU1LLM0psTVQyM9TCC5JLCoJycxNVcjMUyhKzEtP1UhJLEktAYpoGBkYmOsaGAKRpo4CmqixrjFI1DBFUyGpEmRKSSoAazsM0n0AAAA%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| make-series n=count() default=0 on StartTime in range(datetime(2007-01-01), datetime(2007-03-31), 1d) by State
```

Once you create a set of (time) series, you can apply series functions to detect anomalous shapes, seasonal patterns, and a lot more.

The following query extracts the top three states that had the most events in specific day:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAF2OsQoCMRBEe8F%2f2DIBAzmvsLrSLzj7EC%2brBs3mSPbkBD%2feLDYibPVmZmdGziUdn0hct5s3JH9HU7FErEDDlBdipSHgxS8PHixkgpF94VNMCJGgeLqiCp6RG1F7aw%2fGdu30Dv5ob3qhXdBwfskXRmnElZECfDtdbbgq0qJwnqEX76%2fmyCW%2ftkV1Ek9pWSwgNdOt7foAJIuybs8AAAA%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| make-series n=count() default=0 on StartTime in range(datetime(2007-01-01), datetime(2007-03-31), 1d) by State
| extend series_stats(n)
| top 3 by series_stats_n_max desc
| render timechart
```

For more information, review the full list of [series functions](./kusto/query/scalarfunctions.md#series-processing-functions).

## Advanced aggregations

We covered basic aggregations, like **count** and **summarize**, earlier in this article. This section introduces more advanced options.

### top-nested

[**top-nested**](./kusto/query/topnestedoperator.md): Produces hierarchical top results, where each level is a drill-down based on previous level values.

This operator is useful for dashboard visualization scenarios, or when it's necessary to answer a question like the following: "Find the top-N values of K1 (using some aggregation); for each of them, find what are the top-M values of K2 (using another aggregation); ..."

The following query returns a hierarchical table with `State` at the
top level, followed by `Sources`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjJL9DNSy0uSU1RMFLIT1MILkksSVVIqlQoLs3VcEpNz8zzSSzR1OHlQlJoDFaYX1qUTEilIUila16KT35yYklmfh6GcgDrXwk5jgAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| top-nested 2 of State by sum(BeginLat),
top-nested 3 of Source by sum(BeginLat),
top-nested 1 of EndLocation by sum(BeginLat)
```

### pivot() plugin

[**pivot() plugin**](./kusto/query/pivotplugin.md): Rotates a table by turning the unique values from one column in the input table into multiple columns in the output table. The operator performs aggregations where they're required on any remaining column values in the final output.

The following query applies a filter and pivots the rows into columns.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSgoys9KTS5RCC5JLEnVUQBLhFQWpILkyjNSi1IhMgrFJYlFJcXlmSUZCkqOPkoIabgOhYzEYgWl8My8FLBsalliTilIZ0FmWX6JBtgUTQDlv21NfQAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| project State, EventType
| where State startswith "AL"
| where EventType has "Wind"
| evaluate pivot(State)
```

### dcount()

[**dcount()**](./kusto/query/dcount-aggfunction.md): Returns an estimate of the number of distinct values of an expression in the group. Use [**count()**](./kusto/query/countoperator.md) to count all values.

The following query counts distinct `Source` by `State`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSguzc1NLMqsSlUIzi8tSk4tVrBVSEnOL80r0YAIaCokVSoElySWpAIAFKgSBDoAAAA%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize Sources = dcount(Source) by State
```

### dcountif()

[**dcountif()**](./kusto/query/dcountif-aggfunction.md): Returns an estimate of the number of distinct values of the expression for rows for which the predicate evaluates to true.

The following query counts the distinct values of `Source` where `DamageProperty < 5000`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVqhRKEnMTlUwNDDg5apRKC7NzU0syqxKVQjOLy1KTi1WsFVISc4vzSvJTNOACOkouCTmJqanBhTlF6QWlVQq2CiYGhgYaCokVSoElySWpAIAuk%2fTX14AAAA%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| take 100
| summarize Sources = dcountif(Source, DamageProperty < 5000) by State
```

### dcount_hll()

[**dcount_hll()**](./kusto/query/dcount-hllfunction.md):
Calculates the **dcount** from HyperLogLog results (generated by [**hll**](./kusto/query/hll-aggfunction.md) or [**hll_merge**](./kusto/query/hll-merge-aggfunction.md).

The following query uses the HLL algorithm to generate the count.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSguzc1NLMqsSlXIyMkJSi1WsAUxNFwScxPTUwOK8gtSi0oqNRWSKhWSMvM0gksSi0pCMnNTdQwNcjUx9PumFqWnpkCMiM8FcTQgpoKVFhTlZ6UmlyikJOeX5pXEg6yB69EEAKm9wyCXAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize hllRes = hll(DamageProperty) by bin(StartTime,10m)
| summarize hllMerged = hll_merge(hllRes)
| project dcount_hll(hllMerged)
```

### arg_max()

[**arg_max()**](./kusto/query/arg-max-aggfunction.md):
Finds a row in the group that maximizes an expression, and returns the value of another expression (or * to return the entire row).

The following query returns the time of the last flood report in each state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjPSC1KVQDzQyoLUhVsbRWU3HLy81OUQLLFpbm5iUWZVakKiUXp8bmJFRrBJYlFJSGZuak6ClqaCkmVCkCBklSQ2oKi%2fKzU5BKIgI4CkkLXvBQoA2YNAHO1S0OFAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| where EventType == "Flood"
| summarize arg_max(StartTime, *) by State
| project State, StartTime, EndTime, EventType
```

### make_set()

[**make_set()**](./kusto/query/makeset-aggfunction.md): Returns a dynamic (JSON) array of the set of distinct values that an expression takes in the group.

The following query returns all the times when a flood was reported by each state and creates an array from the set of distinct values.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAFWLQQ6CQBAE7yb8ocNJE76wR3mA8IEFOxF1mM3siIHweAVPHqsq1bianCeOnovDiveNRuzczokIAWX9VL2WW80vkWjDQuzuwqTmGQESH8z0Y%2bPRvB2EJ3QzvuTcvmR6Z%2b8%2fUf3NH6ZkMFeAAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| where EventType == "Flood"
| summarize FloodReports = make_set(StartTime) by State
| project State, FloodReports
```

### mv-expand

[**mv-expand**](./kusto/query/mvexpandoperator.md):
Expands multi-value collection(s) from a dynamic-typed column so that each value in the collection gets a separate row. All the other columns in an expanded row are duplicated. It's the opposite of make_list.

The following query generates sample data by creating a set and then using it to demonstrate the **mv-expand** capabilities.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAFWOQQ6CQAxF9yTcoWGliTcws1MPIFygyk9EKTPpVBTj4Z2BjSz%2f738v7WF06r1vD2xcp%2bCoNq9yHDFYLIsvvW5Q0JybKYCco2omqnyNTxHW7oPFckbwajFZhB%2bIsE1trNZ0gi1dpuRmQ%2baC%2bjuuthS7Fbwvi%2f%2bP8lpGvAMP7Wr3A6BceSu7AAAA" target="_blank">Run the query</a>

```Kusto
let FloodDataSet = StormEvents
| where EventType == "Flood"
| summarize FloodReports = make_set(StartTime) by State
| project State, FloodReports;
FloodDataSet
| mv-expand FloodReports
```

### percentiles()

[**percentiles()**](./kusto/query/percentiles-aggfunction.md): Returns an estimate for the specified [**nearest-rank percentile**](./kusto/query/percentiles-aggfunction.md) of the population defined by an expression. The accuracy depends on the density of population in the region of the percentile. Can be used only in the context of aggregation inside [**summarize**](./kusto/query/summarizeoperator.md).

The following query calculates percentiles for storm duration.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUUitKEnNS1FIKS1KLMnMz1OwVXDNSwnJzE1V0FUILkksKgGxQQrLM1KLUhHq7BQMirEI2ygYZ4CEi0tzcxOLMqtSFQpSi5KBlmXmpBZrwJTpKJjqKBgZACkgtgBiS1NNAEC7XiaYAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| extend duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

The following query calculates percentiles for storm duration by state and normalizes the data by five-minute bins (`5m`).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAG1NSwrCMBTcC95hli1EKEpBQd31BHUvafOgAZNI8uIPD28SEBVcDDMM8%2bnZedNdyHKYz56gG5NVUNFL1s5ih86qgzaEBXqWnrPOwetEnj65PZrwx95iNWU7RGOk1w8C5avj6KLlNF64qjHcMWhbvXsCralFPmT6rZ%2fJj2lAnyh8pwWWTaKEdcKmLYul%2fgLODFs%2b4AAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| extend duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize event_count = count() by bin(duration, 5m), State
| summarize percentiles(duration, 5, 20, 50, 80, 95) by State
```

### Cross Dataset

This section covers elements that enable you to create more complex queries, join data across tables, and query across databases and clusters.

### let

[**let**](./kusto/query/letstatement.md): Improves modularity and reuse. The **let** statement allows you to break a potentially complex expression into multiple parts, each bound to a name, and compose those parts together. A **let** statement can also be used to create user-defined functions and views (expressions over tables whose results look like a new table). Expressions bound by a **let** statement can be of scalar type, of tabular type, or user-defined function (lambdas).

The following example creates a tabular type variable and uses it in a subsequent expression.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAMtJLVHwyUzPKMnLzEsPLskvyi1WsOXlArNcy1LzSop5uWoUyjNSi1IVwPyQyoJUBVtbBSW4LiVrXq4coDGOZYk5iXnJGakkGQPXBTIGzSUgPVn5mXkKGmhmayrk5ykElySWpIKUpGQWl2TmJZdARACul3kY0gAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
let LightningStorms =
StormEvents
| where EventType == "Lightning";
let AvalancheStorms =
StormEvents
| where EventType == "Avalanche";
LightningStorms
| join (AvalancheStorms) on State
| distinct State
```

### join

[**join**](./kusto/query/joinoperator.md): Merge the rows of two tables to form a new table by matching values of the specified column(s) from each table. Kusto supports a full range of join types: **fullouter**, **inner**, **innerunique**, **leftanti**, **leftantisemi**, **leftouter**, **leftsemi**, **rightanti**, **rightantisemi**, **rightouter**, **rightsemi**.

The following example joins two tables with an inner join.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIULBVSEksAcKknFQN79RKq+KSosy8dB2FsMSc0lRDq5z8vHRNXq5oXi4FIFBPVNcx1IGyk9R1jJDYxjB2srqOCS9XrDUvVw7Qhkj8Nhih2wA0ydAAySgjZI4xnJMCtMQAYkuEQo1CVn5mnkJ2Zl6KbWZeXmoR0Nb8PAWgZQAFPLdO5AAAAA==" target="_blank">Run the query</a>

```Kusto
let X = datatable(Key:string, Value1:long)
[
    'a',1,
    'b',2,
    'b',3,
    'c',4
];
let Y = datatable(Key:string, Value2:long)
[
    'b',10,
    'c',20,
    'c',30,
    'd',40
];
X
| join kind=inner Y on Key
```

> [!TIP]
> Use **where** and **project** operators to reduce the numbers of rows and columns in the input tables, before the join. If one table is always smaller than the other, use it as the left (piped) side of the join. The columns for the join match must have the same name. Use the **project** operator if necessary to rename a column in one of the tables.

### serialize

[**serialize**](./kusto/query/serializeoperator.md): Serializes the row set so you can use functions that require serialized data, like **row_number()**.

The following query succeeds because the data is serialized.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSguzc1NLMqsSlVIzi%2fNK9HQVEiqVAguSSxJBcumFmUm5gBlQZzUipLUvBSFovzy%2bLzS3KTUIgVbJI6GJgB4pV4NWgAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize count() by State
| serialize
| extend row_number = row_number()
```

The row set is also considered as serialized if it's a result of: **sort**, **top**, or **range** operators, optionally followed by **project**, **project-away**, **extend**, **where**, **parse**, **mv-expand**, or **take** operators.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSguzc1NLMqsSlVIzi%2fNK9HQVEiqVAguSSxJBcvmF5XABRQSi5NBgqkVJal5KQpF%2beXxeaW5SalFCrZIHA1NAEGimf5iAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize count() by State
| sort by State asc
| extend row_number = row_number()
```

### Cross-database and cross-cluster queries

[Cross-database and cross-cluster queries](./kusto/query/cross-cluster-or-database-queries.md): You can query a database on the same cluster by referring it as `database("MyDatabase").MyTable`. You can query a database on a remote cluster by referring to it as `cluster("MyCluster").database("MyDatabase").MyTable`.

The following query is called from one cluster and queries data from `MyCluster` cluster. To run this query, use your own cluster name and database name.

```Kusto
cluster("MyCluster").database("Wiki").PageViews
| where Views < 2000
| take 1000;
```

### User Analytics

This section includes elements and queries that demonstrate how easy it is to perform analysis of user behaviors in Kusto.

### activity_counts_metrics plugin

[**activity_counts_metrics plugin**](./kusto/query/activity-counts-metrics-plugin.md): Calculates useful activity metrics (total count values, distinct count values, distinct count of new values, and aggregated distinct count). Metrics are calculated for each time window, then they are compared, and aggregated to and with all previous time windows.

The following query analyzes user adoption by calculating daily activity counts.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAJXSPQvCMBAG4L3Q%2f5CtFlLoFyiVDn4M6mqdREpsggTaKs1VEfzxXm0LDiEimcJz3CW8VwogClgDKWcgQFZiEvrB1PNnnh%2b4c9sqsUDUXMPxyA9Z8%2bsjDfhwz0hKsBzPuRSTgxLNlicKGllfKMmwBw6sbsnY0bWto205C4cS3Rso2tpgO4MtDbbSWvixzGD6eb1ttBYZev42%2fbzI8L%2fe9n9b3NkJQ8xs60XEnZUt1hBWgLxLeObFta1B5ZXAKAs1BPuVKO03iXb7gp36tXDfExVB%2f2ICAAA%3d" target="_blank">Run the query</a>

```Kusto
let start=datetime(2017-08-01);
let end=datetime(2017-08-04);
let window=1d;
let T = datatable(UserId:string, Timestamp:datetime)
[
'A', datetime(2017-08-01),
'D', datetime(2017-08-01),
'J', datetime(2017-08-01),
'B', datetime(2017-08-01),
'C', datetime(2017-08-02),
'T', datetime(2017-08-02),
'J', datetime(2017-08-02),
'H', datetime(2017-08-03),
'T', datetime(2017-08-03),
'T', datetime(2017-08-03),
'J', datetime(2017-08-03),
'B', datetime(2017-08-03),
'S', datetime(2017-08-03),
'S', datetime(2017-08-04),
];
T
| evaluate activity_counts_metrics(UserId, Timestamp, start, end,
window)
```

### activity_engagement plugin

[**activity_engagement plugin**](./kusto/query/activity-engagement-plugin.md): Calculates activity engagement ratio based on ID column over a sliding timeline window. **activity_engagement plugin** can be used for calculating DAU, WAU, and MAU (daily, weekly, and monthly active users).

The following query returns the ratio of total distinct users using an application daily compared to total distinct users using the application weekly, on a moving seven-day window.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAG1RQWrDMBC8G%2fyHvUVOHGy1lByKD6GBviDkUIoR1tpVsS0jr0MCeXxXiigpVAiBVjOzM6uigHcc0SlCcGrUdgCtSIFtYZnRgWrInA0ZnNOkR4J6JuUIKo9CMgOKp1LutqXknb1GDI76P8RzQHCXDqHW6gqt43ZRkeydNxNOIHWa3AAv5Ctei2xvx06IQNtGTlZInT0AHQN9BpFt5EO59kHmKvQVUUivX8q1y3L4c9%2fIks%2bt5LoMwsMZLxMrgtHVXcb7pOuEthWemEFvBkPARL%2fSpCjgTfXN0vuBHvbH4rQ%2fsikyNjg6q37xL3GsV47cqQ4HHEl8rIxefeZhNHmMmIehsB2dp8nunnZy9hsbiriDWuqTWqpfxdBsLb2ZGzhm8y%2f6b2i%2bWO8HLFcMGe8BAAA%3d" target="_blank">Run the query</a>

```Kusto
// Generate random data of user activities
let _start = datetime(2017-01-01);
let _end = datetime(2017-01-31);
range _day from _start to _end step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+100*r-1), 1)
| mv-expand id=_users to typeof(long) limit 1000000
// Calculate DAU/WAU ratio
| evaluate activity_engagement(['id'], _day, _start, _end, 1d, 7d)
| project _day, Dau_Wau=activity_ratio*100
| render timechart
```

> [!TIP]
> When calculating DAU/MAU, change the end data and the moving window period (OuterActivityWindow).

### activity_metrics plugin

[**activity_metrics plugin**](./kusto/query/activity-metrics-plugin.md):
Calculates useful activity metrics (distinct count values, distinct count of new values, retention rate, and churn rate) based on the current period window vs. the previous period window.

The following query calculates the churn and retention rate for a given dataset.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAG2SwW7CMAyG70i8g2%2bk0KoNE%2bIwscsOe4hpqqLGQFjaVKkLVNrDLw7RxjRyqBTr%2fz%2f3t1OW8IYdekUIXnXataAVKXB7GAf0oBoyZ0MGh%2fnMIkE9kPIEO1YhmRbFupLbopJFtc6ekwY7%2fV%2bxKZ4kK0KXA0Kt1QR7H9olIrmbbyDsQer57AvwSlxhFjnruoMQ0VYkT1ZKnd0JfRByBpGt5F255iDDLvYVCaSXm2rpsxz%2b3FfrKnwLGeoygtszXvtABKN3Nwz%2fJ009ur1gYwbWtIZAVvGw53JEn%2fK9PJwSi3rvTthQlOWBPp%2bVJbwq24yWN3FB%2fLQTeAwByLgOeD8x0lnZkRVpL1PdInnTDOJ9YfTiI0%2fE24DyONIctvpB0x94zfBlSJBDcxz97509PgDCM%2bAMzTEgvwEO44wSMAIAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
// Generate random data of user activities
let _start = datetime(2017-01-02);
let _end = datetime(2017-05-31);
range _day from _start to _end step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+200*r-1), 1)
| mv-expand id=_users to typeof(long) limit 1000000
| where _day > datetime(2017-01-02)
| project _day, id
// Calculate weekly retention rate
| evaluate activity_metrics(['id'], _day, _start, _end, 7d)
| project _day, retention_rate*100, churn_rate*100
| render timechart
```

### new_activity_metrics plugin

[**new_activity_metrics plugin**](./kusto/query/new-activity-metrics-plugin.md):
Calculates useful activity metrics (distinct count values, distinct count of new values, retention rate, and churn rate) for the cohort of new users. The concept of this plugin is similar to [**activity_metrics plugin**](./kusto/query/activity-metrics-plugin.md), but focuses on new users.

The following query calculates a retention and churn rate with a week-over-week window for the new users cohort (users that arrived on the first week).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAG1Ry27DIBC8W%2fI%2f7C04wbJJFeVQ5VapP9BbVVnIrGMaGyy8eVjqxxcwh1QqBx7LzCwzVBW8o0EnCcFJo%2bwISpIE28F1RgeyJX3TpHHOswEJmpmkIzgFFJIeke1rcSzrQ1mL4jVh0Kj%2fEC8R4bucEd7kAp3z3ZIg2ZU2E04gVJ79AD4oVIIU2cGaM2OBVSZKUQlVPOGcxwUHrNiJp3ITbMyn2JUlHbU91FtXcPhz3u1rP5fC10UUHm%2f4mLwiaHVaZcIzaZnQdiwQCxj0qAlEHUeeVRV8yAuCNcMC1CN02s0Ed8QLtLa33igbpK9M0skRCd3q4CaHa%2fgBg%2fcmJb40%2ft7pdmafG602XzxExpN3HsPicFQ8z1IcQWhy9htbisk2EU92XZ1vZkhb04Sv5tD2V7fufwFYtolnAgIAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
// Generate random data of user activities
let _start = datetime(2017-05-01);
let _end = datetime(2017-05-31);
range Day from _start to _end step 1d
| extend d = tolong((Day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+200*r-1), 1)
| mv-expand id=_users to typeof(long) limit 1000000
// Take only the first week cohort (last parameter)
| evaluate new_activity_metrics(['id'], Day, _start, _end, 7d, _start)
| project from_Day, to_Day, retention_rate, churn_rate
```

### session_count plugin

[**session_count plugin**](./kusto/query/session-count-plugin.md): Calculates the count of sessions based on ID column over a timeline.

The following query returns the count of sessions. A session is considered active if a user ID appears at least once at a timeframe of 100-time slots, while the session look-back window is 41-time slots.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAFWPQYvCQAyF74X%2bh3dZUCjYgfUgMkcP3r2XoZPqaM3INK4u7I%2ffzOwiNQRC8pKPl5EEnXfiYJEcHwmHcKUxMGFI8QoDidhoYBK6wdTVD%2bgpxB5dd6FvPSuzcwyMS2BvAzMlLP5gez%2fDrNt%2fCN4Z1iwRua5Kk2GPE6WZkY%2bMsRZt1m4pnqmXl9qouK2r1Qo75cUB5RlPQ%2bAgoWDzpPj%2bcuPdCWGiaVKp6%2bOdZbH3zYxmNFuNUhp8mmU%2bTWpWv8or%2fckl%2bQXutT48NwEAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
let _data = range Timeline from 1 to 9999 step 1
| extend __key = 1
| join kind=inner (range Id from 1 to 50 step 1 | extend __key=1) on __key
| where Timeline % Id == 0
| project Timeline, Id;
// End of data definition
_data
| evaluate session_count(Id, Timeline, 1, 10000, 100, 41)
| render linechart
```

### funnel_sequence plugin

[**funnel_sequence plugin**](./kusto/query/funnel-sequence-plugin.md):
Calculates the distinct count of users who have taken a sequence of states; shows the distribution of previous and next states that have led to or were followed by the sequence.

The following query shows what event happens before and after all Tornado events in 2007.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAGWOPYvCQBCG%2b0D%2bw3QmEEmieIqNVQrBRgxYiMhcdqKLyWzcnQiCP95V70DuYIrh5Xk%2f0hRWxpw1H8EwbMTYtrgSiwMnKNqJrtw8DNIU1vkcticUOGHXETv4ptpYgtJYRmWAnrbFGx39QbEWsv%2fIj7YwuHsZmx6FoO6ZqTk4uvTEFUVFp51RtFSJH4hWSt1SAsqj4r9olGXTYZb7i5Mw%2bJRnvzLkKhl%2fTXzAq668dc%2bAG2Orq2g3%2bBk22MfxA23MLGQQAQAA" target="_blank">Run the query</a>

```Kusto
// Looking on StormEvents statistics:
// Q1: What happens before Tornado event?
// Q2: What happens after Tornado event?
StormEvents
| evaluate funnel_sequence(EpisodeId, StartTime, datetime(2007-01-01), datetime(2008-01-01), 1d,365d, EventType, dynamic(['Tornado']))
```

### funnel_sequence_completion plugin

[**funnel_sequence_completion plugin**](./kusto/query/funnel-sequence-completion-plugin.md): Calculates the funnel of completed sequence steps within different time periods.

The following query checks the completion funnel of the sequence: `Hail -> Tornado -> Thunderstorm -> Wind` in "overall" times of one hour, four hours, and one day (`[1h, 4h, 1d]`).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12QTYvCMBCG74L/YW6tkIV2XT9g8SjsnlvwICKhM9JAOqlJqrj4402CW0RIIB/PPLwzmjwcnZfWwwZQevKqo/yzKFYfRRnW7Hs60ZEhxjdi/UZcFaO5VuqPAjhfLvD/w9F5IG7iM95YdqrJ99mPVDoTkNXGskSTju3ASNZ5Y7t43wVhdhj9PVll0L1aylbAV9glJqyKldsLsXfTyR3oIvUQAsNpYCY95jg2puuDUhnOt71yBukXBVRxCnVoTjwnIlLX4rUzAUlf3/pEPYViDDd7AOyqowFQAQAA" target="_blank">Run the query</a>

```Kusto
let _start = datetime(2007-01-01);
let _end = datetime(2008-01-01);
let _windowSize = 365d;
let _sequence = dynamic(['Hail', 'Tornado', 'Thunderstorm', 'Wind']);
let _periods = dynamic([1h, 4h, 1d]);
StormEvents
| evaluate funnel_sequence_completion(EpisodeId, StartTime, _start, _end, _windowSize, EventType, _sequence, _periods)
```

## Functions

This section covers [**functions**](./kusto/query/functions/index.md): reusable queries that are stored on the server. Functions can be invoked by queries and other functions (recursive functions aren't supported).

> [!NOTE]
> You cannot create functions on the help cluster, which is read-only. Use your own test cluster for this part.

The following example creates a function that takes a state name (`MyState`) as an argument.

```Kusto
.create function with (folder="Demo")
MyFunction (MyState: string)
{
StormEvents
| where State =~ MyState
}
```

The following example calls a function, which gets data for the state of Texas.

```Kusto
MyFunction ("Texas")
| summarize count()
```

The following example deletes the function that was created in the first step.

```Kusto
.drop function MyFunction
```

## Next steps

[Kusto Query Language reference](./kusto/query/index.md)
