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

The order of the operators is important, as the data flows from one operator to the next and is transformed at each step. Think of it like a funnel where the data starts as an entire table and is refined as it passes through each operator, until you're left with a final output at the end.

#### Example

The following steps are performed in this example query.

1. The `StormEvents` table is filtered to select rows with `StartTime` values within the specified date range.
1. The filtered table is further narrowed down to include only rows with a `State` value of "FLORIDA".
1. The final table is passed to the `count` operator, which returns a new table containing the count of rows.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksKgnJzE1VsLNVSEksSS0BsjWMDAzMdQ0NdQ0MNRUS81KQVNlgqDICqUIxsCRVwdZWQcnNxz/I08VRCSSXnF+aVwIAeGM3BoIAAAA=" target="_blank">Run the query</a>

```Kusto
StormEvents 
| where StartTime >= datetime(2007-11-01) and StartTime <= datetime(2007-12-01)
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

When writing queries, it's common that you'll be interested in a specific subset of columns. The [project](kusto/query/projectoperator.md) operator allows you to view a specific subset of columns.

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

### distinct

Let's use the [distinct](kusto/query/distinctoperator.md) operator to list all unique storm types.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRSMksLsnMSy5RAIuEVBakAgD24XVdIAAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents | distinct EventType
```

There are 46 types of storms in our table.

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

To view the top five floods in Texas that caused the most damage, let's use the [sort](kusto/query/sortoperator.md) operator to arrange the rows in descending order based on the `DamageProperty` column and `take` to display only the top five rows.

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

## Learn common functions

Let's take a look at some common functions and learn how to use them in queries. Remember that there are many more functions to choose from based on your specific needs and goals.

### between()

The [between](kusto/query/betweenoperator.md) function matches values that are inside the inclusive range.

The following query is equivalent to the example provided earlier in the [tabular expression statements](#tabular-expression-statements) example.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrApGRuaaCnp4ChrixgaYmyKTk%2fNK8EgBluyagXgAAAA%3d%3d" target="_blank">Run the query</a>

```Kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. datetime(2007-12-01))
| where State == "FLORIDA"
| count
```

|Count|
|--|
|28|

Write the query using a [timespan](kusto/query/scalar-data-types/timespan.md) value, such as a number of days, and achieve the same result.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksKgnJzE1VSEotKU9NzVPQSEksSS0BimgYGRiY6xoa6hoYairo6SkYG6RoomgsSVWwtVVQcvPxD/J0cVQCySXnl+aVAABlfHI1agAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents 
| where StartTime between (datetime(2007-11-01) .. 30d)
| where State == "FLORIDA"
| count
```

|Count|
|--|
|28|

### bin()

The [bin()](kusto/query/binfunction.md) function to group rows into distinct sets of data when aggregating by scalar values, like numbers and time values.

The following example finds the event count of storms for each day in the first week of November.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrGhrqGhhqKujpKWCKW2hqgkwqLs3NTSzKrEpVAJvunF+aV6Jgq5AMojU0FZIqFZIy8zTgNukoGKZoAgCRt8vYjQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where StartTime between (datetime(2007-11-01) .. datetime(2007-11-08))
| summarize EventCount = count() by bin(StartTime, 1d)
```

|StartTime|EventCount|
|---|---|
|2007-11-01T00:00:00Z| 335|
|2007-11-02T00:00:00Z| 14|
|2007-11-03T00:00:00Z| 49|
|2007-11-04T00:00:00Z| 38|
|2007-11-05T00:00:00Z| 73|
|2007-11-06T00:00:00Z| 14|
|2007-11-07T00:00:00Z| 62|

The [bin()](./binfunction.md) function is the same as the [floor()](kusto/query/floorfunction.md) function in many languages. It reduces every value to the nearest multiple of the modulus that you supply and allows [summarize](kusto/query/summarizeoperator.md) to assign the rows to groups.

### case()

The [case()](kusto/query/casefunction.md) function evaluates a list of conditions, called predicates, and returns a corresponding result expression for the first predicate that is satisfied. If none of the predicates are satisfied, `case()` will return the final else expression, if provided.

The following query returns a new column `injuries_bucket` and groups the injuries by number.

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

|State|InjuriesCount|InjuriesBucket|
|--|--|--|
|ALABAMA| 494| Large|
|ALASKA| 0| No injuries|
|AMERICAN SAMOA| 0| No injuries|
|ARIZONA| 6| Small|
|ARKANSAS| 54| Large|
|...|...|...|

## Perform advanced aggregations

We've already learned about basic aggregation functions like `count` and `summarize`. Now, let's move on to some more complex aggregation functions.

### dcount()

Use [dcount()](kusto/query/dcount-aggfunction.md) to return an estimate of the number of distinct values of an expression in the group.

The following query counts distinct `Source` by `State`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIzi8tSk4tVrBVSEnOL80r0YAIaCokVSoElySWpIKV5xeVgAUgigH09cdWTQAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize Sources = dcount(Source) by State
| sort by Sources
```

|State|Sources|
|--|--|
|FLORIDA| 26|
|TEXAS| 25|
|VIRGINIA| 24|
|ILLINOIS| 23|
|WISCONSIN| 23|
|SOUTH CAROLINA| 23|
|OKLAHOMA| 23|
|NEW YORK| 23|
|KANSAS| 23|
|MISSOURI| 23|
|...|...|

### dcountif()

Use [dcount()](kusto/query/dcount-aggfunction.md) to return an estimate of the number of distinct values of the expression for rows for which the predicate evaluates to true.

The following query counts the distinct values of `Source` by `State` in cases where the `DamageProperty` column value is greater than 5000.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSguzc1NLMqsSlUIzi8tSk4tVrBVSEnOL80ryUzTgAjpKLgk5iampwYU5RekFpVUKtgpmBoYGGgqJFUqBJcklqSCzckvKgELQEwBAHgC/sJmAAAA" target="_blank">Run the query</a>

```Kusto
StormEvents
| summarize Sources = dcountif(Source, DamageProperty > 5000) by State
| sort by Sources
```

|State|Sources|
|--|--|
|TEXAS| 23|
|IOWA| 21|
|NEW YORK| 21|
|OKLAHOMA| 20|
|CALIFORNIA| 17|
|KENTUCKY| 17|
|VIRGINIA| 16|
|MISSISSIPPI| 16|
|INDIANA| 16|
|OHIO| 16|
|...|...|

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

### top-nested

The [top-nested](kusto/query/topnestedoperator.md) operator produces hierarchical top results, where each level drills down based on the values of the previous level. This operator is useful for creating dashboards or for answering questions like "What are the top N values of K1, and for each of them, what are the top M values of K2?"

The following query returns a hierarchical table with `State` at the top level followed by `Sources`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjJL9DNSy0uSU1RMFbIT1MILkksSVVIqlQoLs3VcEnMTUxPDSjKL0gtKqnU1FHg5UJSbwRWn19alIxLAwBef4q5bAAAAA==" target="_blank">Run the query</a>

```Kusto
StormEvents
| top-nested 3 of State by sum(DamageProperty), 
top-nested 2 of Source by sum(DamageProperty)
```

|State| aggregated_State| Source| aggregated_Source|
|--|--|--|--|
|CALIFORNIA| 1445937600| Fire Department/Rescue| 826550000|
|CALIFORNIA| 1445937600| Newspaper| 554508100|
|OKLAHOMA| 915470300| Emergency Manager| 721867000|
|OKLAHOMA| 915470300| Trained Spotter| 152121000|
|KANSAS| 690178500| NWS Storm Survey| 256005000|
|KANSAS| 690178500| Emergency Manager| 188137500|

### pivot()

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

## Join data across tables

Use the [join](joinoperator.md) operator to merge the rows of two tables by matching values of the specified column(s) from each table.

Find two specific event types and in which state each of them happened by pulling storm events with the first `EventType` and the second `EventType`, and then join the two sets on `State`:

```kusto
StormEvents
| where EventType == "Lightning"
| join (
    StormEvents 
    | where EventType == "Avalanche"
) on State  
| distinct State
```

Let's join data from another table in our database.

```kusto
StormEvents
| where EventType == "Tornado"
| join kind=innerunique PopulationData on State
| project State, Population
```

> [!NOTE]
>
> * Reduce the number of rows and columns in the input tables using the `where` and `project` operators before performing the join.
> * Use the smaller table as the left table in the join.
> * Make sure the columns being used for the join have the same name, and use `project` to rename a column if needed.

## Visualize query results

This section teaches how to use common operators and functions to visualize your query results using the render operator.

### render

The [render](kusto/query/renderoperator.md) operator allows you to display query results as graphical output.

> [!NOTE]
> The render operator is a client-side feature that is integrated into the language for ease of use. It's not a part of the engine.

#### Column chart

Let's view the states that experienced over 50 storms in November 2007 in a column chart. The projected columns are used as the x-axis and y-axis of the chart.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1VNvQ6CQAzeTXyHjpAw4Oaig8ZNJp6gHg2c8Xqm9DAQH96rLDp9+f5bjRIuE7GOsN28YUwhoPiF4CueY2KFAzjDoqyg8V2mOPXFiXrPV9QSbjO0ikrrQBQ1JQeNvgaSv60j7PZ1bdZT4p2crt3qJ2OmEHck+feRArsBRT95g86eqgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| summarize EventCount = count(), Mid = avg(BeginLat) by State 
| sort by Mid
| where EventCount > 1800
| project State, EventCount
| render columnchart
```

We left out `Mid` in the project operation so it's not shown in the chart, but the states are still displayed in order based on their `Mid` values.

:::image type="content" source="media/write-queries/render-column-chart.png" alt-text="Screenshot of the Azure Data Explorer web UI column chart created by the previous render query.":::

#### Time chart

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

#### Pie chart

Let's create a pie chart to visualize the number of states that experienced storms resulting in a large, medium, or small number of injuries.

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

:::image type="content" source="media/write-queries/render-pie-chart.png" alt-text="Screenshot of Azure Data Explorer web UI pie chart rendered by the previous query.":::

## Next steps

* Read more about the [Kusto Query Language](./kusto/query/index.md)
* Learn how to perform [cross-database and cross-cluster queries](./kusto/query/cross-cluster-or-database-queries.md)
