---
title:  iff()
description:  This article describes iff().
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2024
---
# iff()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the *:::no-loc text="then":::* value when the *:::no-loc text="if":::* condition evaluates to `true`, otherwise it returns the *:::no-loc text="else":::* value.

> The `iff()` and `iif()` functions are equivalent.

## Syntax

`iff(`*:::no-loc text="if":::*`,` *:::no-loc text="then":::*`,` *:::no-loc text="else":::*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*:::no-loc text="if":::*| `string` |  :heavy_check_mark: | An expression that evaluates to a boolean value.|
|*:::no-loc text="then":::*| scalar |  :heavy_check_mark: | An expression that returns its value when the *:::no-loc text="if":::* condition evaluates to `true`.|
|*:::no-loc text="else":::*| scalar |  :heavy_check_mark: | An expression that returns its value when the *:::no-loc text="if":::* condition evaluates to `false`.|

## Returns

This function returns the  *:::no-loc text="then":::* value when the *:::no-loc text="if":::* condition evaluates to `true`, otherwise it returns the *:::no-loc text="else":::* value.

## Examples

### Classify data using iff()

The following query uses the `iff()` function to categorize storm events as either "Rain event" or "Not rain event" based on their event type, and then projects the state, event ID, event type, and the new rain category.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUQhKzMxTsFXITEvT0ADLhVQWpCoAxTSUPFITyyrBCpR0FJTcchKLMxTccvLzUyBcEENTE8gEG5EK0guS8MsvUShCiGgCrSooys9KTS5RCC5JLEnVUQBb45kCZYDs0wHbAgAA0TJCoAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| extend Rain = iff((EventType in ("Heavy Rain", "Flash Flood", "Flood")), "Rain event", "Not rain event")
| project State, EventId, EventType, Rain
```

**Output**

The following table shows only the first five rows.

|State|EventId|EventType|Rain|
|--|--|--|--|
|ATLANTIC SOUTH| 61032 |Waterspout |Not rain event|
|FLORIDA| 60904 |Heavy Rain |Rain event|
|FLORIDA| 60913 |Tornado |Not rain event|
|GEORGIA| 64588 |Thunderstorm Wind |Not rain event|
|MISSISSIPPI| 68796 |Thunderstorm Wind |Not rain event|
|...|...|...|...|

### Combine iff() with other functions

The following query calculates the total damage from crops and property, categorizes the severity of storm events based on total damage, direct injuries, and direct deaths, and then summarizes the total number of events and the number of events by severity.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQTQ6CQAyF956imRVEF7hwJ27ERBNNTPACIxQY4zCmFBTj4R0YI%2F501b6mX%2FsasyG9arDkavQAvDGWKRwMy3MktcwRQnDJksylgvGr2tsKidthJsYGSXFrB1SWeZ%2BIBUyDPsAQbMpTTQqrSBEm3Pc6OULJxSAGExBrlRdi8kebw6xnSbv0BxaG4PQvWqda3NZcLU3sTIokGYXv2%2BOrWmtJ6o7Os3uEtZCYumTPh2P7NvYEXHtYMioBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| extend TotalDamage = DamageCrops + DamageProperty
| extend Severity = iff(TotalDamage > 1000000 or InjuriesDirect > 10 or DeathsDirect > 0, "High", iff(TotalDamage < 50000 and InjuriesDirect == 0 and DeathsDirect == 0, "Low", "Moderate"))
| summarize TotalEvents = count(), SeverityEvents = count() by Severity
```

**Output**

| Severity | TotalEvents |
|----------|-------------|
| Low      | 54805       |
| High     | 977         |
| Moderate | 3284        |

## Related content

* [Scalar function types summary](scalar-functions.md)
* [array_iff()](array-iff-function.md)
* [bin()](bin-function.md)
* [extend operator](extend-operator.md)
