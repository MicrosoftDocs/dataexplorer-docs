---
title:  top-nested operator
description: Learn how to use the top-nested operator to produce a hierarchical aggregation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/13/2023
---
# top-nested operator

The `top-nested` operator performs hierarchical aggregation and value selection.

Imagine you have a table with sales information like regions, salespeople, and amounts sold. The `top-nested` operator can help you answer complex questions, such as "What are the top five regions by sales, and who are the top three salespeople in each of those regions?"

The source data is partitioned based on the criteria set in the first `top-nested` clause, such as region. Next, the operator picks the top records in each partition using an aggregation, such as adding sales amounts. Each subsequent `top-nested` clause refines the partitions created by the previous clause, creating a hierarchy of more precise groups.

The result is a table with two columns per clause. One column holds the partitioning values, such as region, while the other column holds the outcomes of the aggregation calculation, like the sum of sales.

## Syntax

*T* `|` `top-nested` [ *N* ] `of` *Expr* [`with` `others` `=` *ConstExpr*] `by` *Aggregation* [`asc` | `desc`] [`,`  
&emsp;&emsp;`top-nested` ... ]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*T*|string| :heavy_check_mark:|The input tabular expression.|
|*N*|int||The number of top values to be returned for this hierarchy level. If omitted, all distinct values are returned.|
|*Expr*|string| :heavy_check_mark:|An expression over the input record indicating which value to return for this hierarchy level. Typically, it refers to a column from *T* or involves a calculation like [bin()](bin-function.md) on a column. Optionally, set an output column name as *Name* `=` *Expr*.|
|*ConstExpr*|string||If specified, for each hierarchy level, one record is added with the value that is the aggregation over all records that didn't make it to the top.|
|*Aggregation*|string||The aggregation function applied to records with the same *Expr* value. The result determines the top records. See [Supported aggregation functions](#supported-aggregation-functions). Optionally, set an output column name as *Name* `=` *Aggregation*.|

### Supported aggregation functions

The following aggregation functions are supported:

* [sum()](sum-aggregation-function.md)
* [count()](count-aggregation-function.md)
* [max()](max-aggregation-function.md)
* [min()](min-aggregation-function.md)
* [dcount()](dcountif-aggregation-function.md)
* [avg()](avg-aggfunction.md)
* [percentile()](percentiles-aggregation-function.md)
* [percentilew()](percentilesw-aggregation-function.md)

> [!NOTE]
> Any algebraic combination of the aggregations is also supported.

## Returns

A table with two columns for each clause. One column contains unique values computed using *Expr*, and the other column shows the results obtained from the *Aggregation* calculation.

### Include data from other columns

Only columns specified as a `top-nested` clause *Expr* are displayed in the output table.

To include all values of a column at a specific level:

1. Don't specify the value of *N*.
1. Use the column name as the value of *Expr*.
1. Use `Ignore=max(1)` as the value of *Aggregation*.
1. Remove the unnecessary `Ignore` column with [project-away](project-away-operator.md).

For an example, see [Get the most recent events per state with additional data from other columns](#get-the-most-recent-events-per-state-with-additional-data-from-other-columns).

## Performance considerations

The number of records may grow exponentially with the number of `top-nested` clauses, and record growth is even faster if no *N* limit is specified. This operator may consume a considerable amount of resources.

If the distribution of the aggregation is considerably non-uniform, limit the number of distinct values to return by specifying *N*. Then, use the `with` `others` `=` *ConstExpr* specification to get an indication for the weight of all other cases.

## Examples

### Get started with the `top-nested` operator

The following query partitions the `StormEvents` table by the `State` column and calculates the total latitude for each state. The query selects the top two states with the highest latitude sum. Within these top two states, the query groups the data by `Source` and selects the top three sources with the highest latitude sum. For each of the top three sources in the top two states, the query groups the data by `EndLocation` and selects the `EndLocation` with the highest latitude sum.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42OSw6CQBAF957iLTVRCXIDIzt2eIGWaZUEugnTmJh4ePnMgviJvnWl6uWmbZ3eWMzjz0URDmQEr11b8HbxgGmzEfbGDjvoGbmRcaBPd/iuXu75UkpGtloHxVGbHh5JP0CmRhUqstI611sxtyajdez9tiaB/KBFKWAqrlP3JRIPkVRcpkWPq7xFMIvEr+S30HSaxIXmE8PE8rpxAQAA" target="_blank">Run the query</a>

```kusto
StormEvents                                        // Data source.
| top-nested 2 of State       by sum(BeginLat),    // Top 2 States by total latitude.
  top-nested 3 of Source      by sum(BeginLat),    // Top 3 Sources by total latitude in each State.
  top-nested 1 of EndLocation by sum(BeginLat)     // Top 1 EndLocation by total latitude in each Source and State.
```

**Output**

|State|aggregated_State|Source|aggregated_Source|EndLocation|aggregated_EndLocation|
|---|---|---|---|---|---|
|KANSAS|87771.2355000001|Law Enforcement|18744.823|FT SCOTT|264.858|
|KANSAS|87771.2355000001|Public|22855.6206|BUCKLIN|488.2457|
|KANSAS|87771.2355000001|Trained Spotter|21279.7083|SHARON SPGS|388.7404|
|TEXAS|123400.5101|Public|13650.9079|AMARILLO|246.2598|
|TEXAS|123400.5101|Law Enforcement|37228.5966|PERRYTON|289.3178|
|TEXAS|123400.5101|Trained Spotter|13997.7124|CLAUDE|421.44|

### Enhance top-nested results with data from another column

The following query builds upon the previous example by introducing an extra `top-nested` clause. In this new clause, the absence of a numeric specification results in the extraction of all distinct values of `EventType` across the partitions. The `max(1)` aggregation function is merely a placeholder, rendering its outcome irrelevant, so the [project-away](project-away-operator.md) operator removes the `Ignore` column. The result shows all event types associated with the previously aggregated data.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKMkv0M1LLS5JTVEwUshPUwguSSxJVYCApEqF4tJcDafU9Mw8n8QSTR0uBWT1xmD1+aVFyalEqTcEqXfNS/HJT04syczPI6ReAawe5NCQyoJUiPme6Xn5RakKtgq5iRUahppADxQU5WelJpfoJpYnwqQBMzafY+IAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| top-nested 2 of State       by sum(BeginLat),
  top-nested 3 of Source      by sum(BeginLat),
  top-nested 1 of EndLocation by sum(BeginLat),
  top-nested   of EventType   by Ignore = max(1)
| project-away Ignore
```

**Output**

| State | aggregated_State | Source | aggregated_Source | EndLocation | aggregated_EndLocation | EventType |
|--|--|--|--|--|--|--|
| TEXAS | 123400.51009999994 | Public | 13650.907900000002 | AMARILLO | 246.25979999999998 | Hail |
| TEXAS | 123400.51009999994 | Public | 13650.907900000002 | AMARILLO | 246.25979999999998 | Thunderstorm Wind |
| KANSAS | 87771.235500000068 | Public | 22855.6206 | BUCKLIN | 488.2457 | Flood |
| KANSAS | 87771.235500000068 | Public | 22855.6206 | BUCKLIN | 488.2457 | Thunderstorm Wind |
| KANSAS | 87771.235500000068 | Public | 22855.6206 | BUCKLIN | 488.2457 | Hail |
| TEXAS | 123400.51009999994 | Trained Spotter | 13997.712400000009 | CLAUDE | 421.44 | Hail |
| KANSAS | 87771.235500000068 | Law Enforcement | 18744.823000000004 | FT SCOTT | 264.858 | Flash Flood |
| KANSAS | 87771.235500000068 | Law Enforcement | 18744.823000000004 | FT SCOTT | 264.858 | Thunderstorm Wind |
| KANSAS | 87771.235500000068 | Law Enforcement | 18744.823000000004 | FT SCOTT | 264.858 | Flood |
| TEXAS | 123400.51009999994 | Law Enforcement | 37228.596599999961 | PERRYTON | 289.3178 | Hail |
| ... | ... | ... | ... | ... | ... |

### Use `with` `others` to explore excluded data

When incorporated within a `top-nested` clause, the `with` `others` specification introduces an extra record that aggregates data excluded from the top results. In the following query, an extra record is created in the `State` and `aggregated_State` columns, representing the collective latitude of all states except Kansas and Texas. Moreover, the `EndLocation` and `aggregated_EndLocation` column have an extra nine records. These records show the combined latitude of end locations not qualifying as the top location within each state and source.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKMkv0M1LLS5JTVEwUshPUwguSSxJVSjPLMlQyC/JSC0qVrBVUHLMyVHwB/Eg0sVKCkmVCsWluRpOqemZeT6JJZo6XArIRhmDjcovLUpOJaTUEKTUNS/FJz85sSQzPw+33UBFCjBVWJwAABtuhnPYAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| top-nested 2 of State with others = "All Other States" by sum(BeginLat),
  top-nested 3 of Source by sum(BeginLat),
  top-nested 1 of EndLocation with others = "All Other End Locations" by sum(BeginLat)
```

**Output**

|State|aggregated_State|Source|aggregated_Source|EndLocation|aggregated_EndLocation|
|---|---|---|---|---|---|
|KANSAS|87771.2355000001|Law Enforcement|18744.823|FT SCOTT|264.858|
|KANSAS|87771.2355000001|Public|22855.6206|BUCKLIN|488.2457|
|KANSAS|87771.2355000001|Trained Spotter|21279.7083|SHARON SPGS|388.7404|
|TEXAS|123400.5101|Public|13650.9079|AMARILLO|246.2598|
|TEXAS|123400.5101|Law Enforcement|37228.5966|PERRYTON|289.3178|
|TEXAS|123400.5101|Trained Spotter|13997.7124|CLAUDE|421.44|
|KANSAS|87771.2355000001|Law Enforcement|18744.823|All Other End Locations|18479.965|
|KANSAS|87771.2355000001|Public|22855.6206|All Other End Locations|22367.3749|
|KANSAS|87771.2355000001|Trained Spotter|21279.7083|All Other End Locations|20890.9679|
|TEXAS|123400.5101|Public|13650.9079|All Other End Locations|13404.6481|
|TEXAS|123400.5101|Law Enforcement|37228.5966|All Other End Locations|36939.2788|
|TEXAS|123400.5101|Trained Spotter|13997.7124|All Other End Locations|13576.2724|
|KANSAS|87771.2355000001|||All Other End Locations|24891.0836|
|TEXAS|123400.5101|||All Other End Locations|58523.2932000001|
|All Other States|1149279.5923|||All Other End Locations|1149279.5923|

The following query shows the same results for the first level used in the previous example.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVUMzMU9BQD3GNcAxW11FQ93b0CwayNIGqiktzcxOLMqtSQSwNp9T0zDyfxBJNAPC7f85LAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where State !in ('TEXAS', 'KANSAS')
| summarize sum(BeginLat)
```

**Output**

|sum_BeginLat|
|---|
|1149279.5923|

### Sort hierarchical results

To achieve a comprehensive sort order, the following query uses index-based sorting for each value within the current hierarchy level, per group. This sorting is geared towards arranging the result according to the ultimate nested level, in this case the `EndLocation`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WQwW7CMBBE73zFHIPkSFD12kslbtzyAdE2WVyr2Eb2BkHVj+86AupCpfq4O/Nm1p3E5DdHDpIXX5B4aANn4RFPiDt0QsJ4OyNPvnll68KWZGkWeFTGKQ3/Sp+LdBPGbRxIXAwPeu2QY5Iyn7PNBWxA1ia2Ohr7ClD0k/eU3CdrFGp4xgs8fXC/d1maamGwXumbywH8s+gm/9v0d+jVP9vvm2ojPolC4cLoBseFmChYblZ6RUp07vccrLzXlfISLdYKLj/gjy2fDqSIWmHum5pbwjd+JIknxQEAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| top-nested 2 of State by sum(BeginLat),
  top-nested 2 of Source by sum(BeginLat),
  top-nested 4 of EndLocation by sum(BeginLat)
| sort by State, Source, aggregated_EndLocation
| summarize
    EndLocations = make_list(EndLocation, 10000),
    endLocationSums = make_list(aggregated_EndLocation, 10000)
    by State, Source
| extend indicies = range(0, array_length(EndLocations) - 1, 1)
| mv-expand EndLocations, endLocationSums, indicies
```

**Output**

|State|Source|EndLocations|endLocationSums|indices|
|---|---|---|---|---|
|TEXAS|Trained Spotter|CLAUDE|421.44|0|
|TEXAS|Trained Spotter|AMARILLO|316.8892|1|
|TEXAS|Trained Spotter|DALHART|252.6186|2|
|TEXAS|Trained Spotter|PERRYTON|216.7826|3|
|TEXAS|Law Enforcement|PERRYTON|289.3178|0|
|TEXAS|Law Enforcement|LEAKEY|267.9825|1|
|TEXAS|Law Enforcement|BRACKETTVILLE|264.3483|2|
|TEXAS|Law Enforcement|GILMER|261.9068|3|
|KANSAS|Trained Spotter|SHARON SPGS|388.7404|0|
|KANSAS|Trained Spotter|ATWOOD|358.6136|1|
|KANSAS|Trained Spotter|LENORA|317.0718|2|
|KANSAS|Trained Spotter|SCOTT CITY|307.84|3|
|KANSAS|Public|BUCKLIN|488.2457|0|
|KANSAS|Public|ASHLAND|446.4218|1|
|KANSAS|Public|PROTECTION|446.11|2|
|KANSAS|Public|MEADE STATE PARK|371.1|3|

### Get the most recent events per state with additional data from other columns

The following query demonstrates how to retrieve the two most recent events for each US state along with relevant event details. Notice the use of `max(1)` within certain columns, identified by `Ignore*`, which aids in propagating data through the query without imposing any selection logic.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA33Rz1LCMBAG8DtPsUd1+CN49uCBcbg54gssydKGSbN1s0WZ4eFNU8Aq1R5yaGe/XzffWlmq5Z6CxtERlOtJoKhkgbewVlSCzQFWRWCh+8cKP2/mt2O4emYzeEFRp44DaElgUbGdJDQlNMG9NwR79OlMubHNnY6gzy1OoOibq3roPKOXDx2euGfSDC2g4qggZNIKQHkRcKGDh6DELIP9iSz+2ixBT3VNwWbrPLdl6fIzN5Bfu8iWVvZbeDgJ/+df5n4LR6iFd2R0gh94zry77mGwmVeqeE9ZaEJIFxUjygGwKIQKzJUZ9k0VYguxWJL2x7v2MZpxrxdL0Qwra5a2htj4VAD6usQNqTPofaLSgqYUDuy56N5NvwCXNfoveQIAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| top-nested of State by Ignore0=max(1),                  // Partition the data by each unique value of state.
  top-nested 2 of StartTime by Ignore1=max(StartTime),    // Get the 2 most recent events in each state.
  top-nested of EndTime by Ignore2=max(1),                // Append the EndTime for each event.
  top-nested of EpisodeId by Ignore3=max(1)               // Append the EpisodeId for each event.
| project-away Ignore*                                    // Remove the unnecessary aggregation columns.
| order by State asc, StartTime desc                      // Sort results alphabetically and chronologically.
```

### Get the latest records per identity with additional data from other columns

The following query showcases how to extract the latest records per identity and builds on the concepts introduced in the previous example. The first `top-nested` clause partitions the data by distinct values of `id`. The subsequent clause identifies the two most recent records based on the `timestamp` for each `id`. Other information is appended using a `top-nested` operator alongside an unspecified count and the arbitrary `max(1)` aggregation. Finally, unnecessary aggregation columns are removed using the `project-away` operator.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42STU+DQBCG7/yKCac2oRTQVm3iwY/E9Ga8Gg9TmNJVdhd3l2oTf7yzVKhprbqQDR/P7MO8S4GOj0VFA1HMwDojVBmBE5KsQ1nPoEBH/jYC7VZk5mqpjUQntOrwIYzHcGOIQUCwujE5+bLtunHwGACP8BoNvoRRv+AgS9LJKEn5HEYQpmF0nJvuuOw37sxzWeK5k4671Qqr4jh4+jeYnntw8g/wwoPTMHgKPsDpeqQ4RipAL0EUsNjAvFTaUHIp8X3g2zkcnOU9Gid8wsCJt0n6UsJ8BY0Srw3BGiue21Vj/qZvpsw/7bdvp0xbZf/Cq9l0R651ZCC1dWAoJ+WA1jxb4I3eSrnC0Z6HLfv/w06WffXXd3RV16SKw4pe0SpjDq02+plyN8I37NOKuh66i+zH2B5I6jW1/TRKcSvWotkAlqWhcuvLddVIZeNPusl9PvYCAAA=" target="_blank">Run the query</a>

```kusto
datatable(id: string, timestamp: datetime, otherInformation: string) // Create a source datatable.
[
    "Barak", datetime(2015-01-01), "1",
    "Barak", datetime(2016-01-01), "2",
    "Barak", datetime(2017-01-20), "3",
    "Donald", datetime(2017-01-20), "4",
    "Donald", datetime(2017-01-18), "5",
    "Donald", datetime(2017-01-19), "6"
]
| top-nested of id by Ignore0=max(1),                     // Partition the data by each unique value of id.
  top-nested 2 of timestamp by Ignore1=max(timestamp),    // Get the 2 most recent events for each state.
  top-nested of otherInformation by Ignore2=max(1)        // Append otherInformation for each event.
| project-away Ignore0, Ignore1, Ignore2                  // Remove the unnecessary aggregation columns.
```

**Output**

| id | timestamp | otherInformation |
|---|---|---|
| Barak | 2016-01-01T00:00:00Z | 2 |
| Donald | 2017-01-19T00:00:00Z | 6 |
| Barak | 2017-01-20T00:00:00Z | 3 |
| Donald | 2017-01-20T00:00:00Z | 4 |

## Related content

* [partition operator](partition-operator.md)
