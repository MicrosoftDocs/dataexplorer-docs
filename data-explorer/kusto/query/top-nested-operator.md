---
title:  top-nested operator
description: Learn how to use the top-nested operator to produce a hierarchical aggregation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/05/2024
---
# top-nested operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `top-nested` operator performs hierarchical aggregation and value selection.

Imagine you have a table with sales information like regions, salespeople, and amounts sold. The `top-nested` operator can help you answer complex questions, such as "What are the top five regions by sales, and who are the top three salespeople in each of those regions?"

The source data is partitioned based on the criteria set in the first `top-nested` clause, such as region. Next, the operator picks the top records in each partition using an aggregation, such as adding sales amounts. Each subsequent `top-nested` clause refines the partitions created by the previous clause, creating a hierarchy of more precise groups.

The result is a table with two columns per clause. One column holds the partitioning values, such as region, while the other column holds the outcomes of the aggregation calculation, like the sum of sales.

## Syntax

*T* `|` `top-nested` [ *N* ] `of` *Expr* [`with` `others` `=` *ConstExpr*] `by` *Aggregation* [`asc` | `desc`] [`,`  
&emsp;&emsp;`top-nested` ... ]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*T*| `string` | :heavy_check_mark:|The input tabular expression.|
|*N*| `int` ||The number of top values to be returned for this hierarchy level. If omitted, all distinct values are returned.|
|*Expr*| `string` | :heavy_check_mark:|An expression over the input record indicating which value to return for this hierarchy level. Typically, it refers to a column from *T* or involves a calculation like [bin()](bin-function.md) on a column. Optionally, set an output column name as *Name* `=` *Expr*.|
|*ConstExpr*| `string` ||If specified, for each hierarchy level, one record is added with the value that is the aggregation over all records that didn't make it to the top.|
|*Aggregation*| `string` ||The aggregation function applied to records with the same *Expr* value. The result determines the top records. See [Supported aggregation functions](#supported-aggregation-functions). Optionally, set an output column name as *Name* `=` *Aggregation*.|

### Supported aggregation functions

The following aggregation functions are supported:

* [sum()](sum-aggregation-function.md)
* [count()](count-aggregation-function.md)
* [max()](max-aggregation-function.md)
* [min()](min-aggregation-function.md)
* [dcount()](dcountif-aggregation-function.md)
* [avg()](avg-aggregation-function.md)
* [percentile()](percentiles-aggregation-function.md)
* [percentilew()](percentilesw-aggregation-function.md)

> [!NOTE]
> Any algebraic combination of the aggregations is also supported.

## Returns

A table with two columns for each clause. One column contains unique values computed using *Expr*, and the other column shows the results obtained from the *Aggregation* calculation.

### Using the `with` `others` clause

Using the `top-nested` operator with `with` `others` adds the ability to see your top content contextualized in a wider data set. Evaluating your data in this way is valuable when rendering the data visually.

### Include data from other columns

Only columns specified as a `top-nested` clause *Expr* are displayed in the output table.

To include all values of a column at a specific level:

1. Don't specify the value of *N*.
1. Use the column name as the value of *Expr*.
1. Use `Ignore=max(1)` as the value of *Aggregation*.
1. Remove the unnecessary `Ignore` column with [project-away](project-away-operator.md).

For an example, see [Most recent events per state with other column data](#most-recent-events-per-state-with-other-column-data).

## Performance considerations

The number of records can grow exponentially with the number of `top-nested` clauses, and record growth is even faster without specifying an *N* limit. This operator can consume a considerable amount of resources.

If the aggregation distribution is irregular, limit the number of distinct values to return by specifying *N*. Then, use the `with` `others` `=` *ConstExpr* clause to get a sense of the weight of all other cases.

## Examples

### Top damaged states, event types, and end locations by property damage

The following query partitions the `StormEvents` table by the `State` column and calculates the total property damage for each state. The query selects the top two states with the largest amount of property damage. Within these top two states, the query groups the data by `EventType` and selects the top three event types with the most damage. Then the query groups the data by `EndLocation` and selects the `EndLocation` with the highest damage. Only one `EndLocation` value appears in the results, possibly due to the large nature of the storm events or not documenting the end location.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42OMW%2FCQAyFd37FG1spEAFzN9g6IJG9MjkTQM35dGeQIvHjyeWoEkVExaP9PX9vr%2BLr7Y2tBiDPsSElBLn6khezO1Tc3HJQNlhBjtgrKSPNoUG41h8bqqninRfHXpvPLJ7aR4W4NtLxIaIqSr8wHWzgnvhihqFjHR1dm6Jx%2FK5mPYhMmnAUD6bylDqNxMtObM23lKRnsRNWDKzLMf%2Bfty9J1vy1uEfwwqWmRdZT2fB%2Fls5FVKRO%2BAJVleeqXZufcXgSfP3%2BJdmfHy%2F%2FKD8lAgAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents  // Data source.
| top-nested 2 of State       by sum(DamageProperty),    // Top 2 States by total damaged property.
  top-nested 3 of EventType      by sum(DamageProperty),    // Top 3 EventType by total damaged property for each State.
  top-nested 1 of EndLocation by sum(DamageProperty)     // Top 1 EndLocation by total damaged property for each EventType and State.
| project State, EventType, EndLocation, StateTotalDamage = aggregated_State, EventTypeTotalDamage = aggregated_EventType, EndLocationDamage = aggregated_EndLocation 
```

**Output**

|State|EventType|EndLocation|StateTotalDamage|EventTypeTotalDamage|EndLocationDamage|
|---|---|---|---|---|---|
|CALIFORNIA|Wildfire||1445937600|1326315000|1326315000|
|CALIFORNIA|HighWind||1445937600|61320000|61320000|
|CALIFORNIA|DebrisFlow||1445937600|48000000|48000000|
|OKLAHOMA|IceStorm||915470300|826000000|826000000|
|OKLAHOMA|WinterStorm||915470300|40027000|40027000|
|OKLAHOMA|Flood|COMMERCE|915470300|21485000|20000000|

### Top five states with property damage `with` `others` grouped

The following example uses the `top-nested` operator to identify the top five states with the most property damage and uses the `with` `others` clause to group damaged property for all other states. It then visualizes damaged property for the top five states and all other states as a `piechart` using the `render` command.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAx3MMQ7CMBBE0Z5TjFJBQUmZDmoi5QSGDDiFvdbuAIqUw0OovvSKP8q8XN6sit0KWTtWhjjhBHtgVBLxmZVhyvTou%2BvWv0eH24J4lf05lfTk4NboWg6%2FkbNOdLSZ95xcXzAmzPxmAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| top-nested 5 of State with others="OtherStates" by sum(DamageProperty)
| render piechart  
```

**Output**

:::image type="content" source="../media/top-nested/with-others-piechart.png" alt-text="Screenshot of the top five states with the most property damaged, and all other states grouped separately rendered as a piechart. "  lightbox="../media/top-nested/with-others-piechart.png":::

### Most recent events per state with other column data

The following query retrieves the two most recent events for each US state with relevant event details. It uses `max(1)` within certain columns to propagate data without using the top-nested selection logic. The generated `Ignore` aggregation columns are removed using `project-away`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA33Rz1LCMBAG8DtPsUd1+CN49uCBcbg54gssydKGSbN1s0WZ4eFNU8Aq1R5yaGe/XzffWlmq5Z6CxtERlOtJoKhkgbewVlSCzQFWRWCh+8cKP2/mt2O4emYzeEFRp44DaElgUbGdJDQlNMG9NwR79OlMubHNnY6gzy1OoOibq3roPKOXDx2euGfSDC2g4qggZNIKQHkRcKGDh6DELIP9iSz+2ixBT3VNwWbrPLdl6fIzN5Bfu8iWVvZbeDgJ/+df5n4LR6iFd2R0gh94zry77mGwmVeqeE9ZaEJIFxUjygGwKIQKzJUZ9k0VYguxWJL2x7v2MZpxrxdL0Qwra5a2htj4VAD6usQNqTPofaLSgqYUDuy56N5NvwCXNfoveQIAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| top-nested of State by Ignore0=max(1),                  // Partition the data by each unique value of state.
  top-nested 2 of StartTime by Ignore1=max(StartTime),    // Get the 2 most recent events in each state.
  top-nested of EndTime by Ignore2=max(1),                // Append the EndTime for each event.
  top-nested of EpisodeId by Ignore3=max(1)               // Append the EpisodeId for each event.
| project-away Ignore*                                    // Remove the unnecessary aggregation columns.
| order by State asc, StartTime desc                      // Sort results alphabetically and chronologically.
```

### Latest records per identity with other column data

The following `top-nested` example extracts the latest records per identity and builds on the concepts introduced in the previous example. The first `top-nested` clause partitions the data by distinct values of `id` using `Ignore0=max(1)` as a placeholder. For each `id`, it identifies the two most recent records based on the `timestamp`. Other information is appended using a `top-nested` operator without specifying a count and using  `Ignore2=max(1)` as a placeholder. Finally, unnecessary aggregation columns are removed using the `project-away` operator.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42STU+DQBCG7/yKCac2oRTQVm3iwY/E9Ga8Gg9TmNJVdhd3l2oTf7yzVKhprbqQDR/P7MO8S4GOj0VFA1HMwDojVBmBE5KsQ1nPoEBH/jYC7VZk5mqpjUQntOrwIYzHcGOIQUCwujE5+bLtunHwGACP8BoNvoRRv+AgS9LJKEn5HEYQpmF0nJvuuOw37sxzWeK5k4671Qqr4jh4+jeYnntw8g/wwoPTMHgKPsDpeqQ4RipAL0EUsNjAvFTaUHIp8X3g2zkcnOU9Gid8wsCJt0n6UsJ8BY0Srw3BGiue21Vj/qZvpsw/7bdvp0xbZf/Cq9l0R651ZCC1dWAoJ+WA1jxb4I3eSrnC0Z6HLfv/w06WffXXd3RV16SKw4pe0SpjDq02+plyN8I37NOKuh66i+zH2B5I6jW1/TRKcSvWotkAlqWhcuvLddVIZeNPusl9PvYCAAA=" target="_blank">Run the query</a>
::: moniker-end

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
