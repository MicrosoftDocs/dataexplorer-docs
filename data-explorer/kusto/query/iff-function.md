---
title:  iff()
description: This article describes iff() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# iff()

Returns the *:::no-loc text="then":::* value when the *:::no-loc text="if":::* condition evaluates to `true`, otherwise it returns the *:::no-loc text="else":::* value.

> The `iff()` and `iif()` functions are equivalent.

## Syntax

`iff(`*:::no-loc text="if":::*`,` *:::no-loc text="then":::*`,` *:::no-loc text="else":::*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*:::no-loc text="if":::*| `string` |  :heavy_check_mark: | An expression that evaluates to a boolean value.|
|*:::no-loc text="then":::*| scalar |  :heavy_check_mark: | An expression that returns its value when the *:::no-loc text="if":::* condition evaluates to `true`.|
|*:::no-loc text="else":::*| scalar |  :heavy_check_mark: | An expression that returns its value when the *:::no-loc text="if":::* condition evaluates to `false`.|

## Returns

This function returns the  *:::no-loc text="then":::* value when the *:::no-loc text="if":::* condition evaluates to `true`, otherwise it returns the *:::no-loc text="else":::* value.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUQhKzMxTsFXITEvT0ADLhVQWpCoAxTSUPFITyyrBCpR0FJTcchKLMxTccvLzUyBcEENTE8gEG5EK0guS8MsvUShCiGgCrSooys9KTS5RCC5JLEnVUQBb45kCZYDs0wHbAgAA0TJCoAAAAA==" target="_blank">Run the query</a>

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
