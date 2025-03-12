---
title:  totimespan()
description: Learn how to use the totimespan() function to convert the input to a `timespan` scalar value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# totimespan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input to a [timespan](scalar-data-types/timespan.md) scalar value.

> **Deprecated aliases:** totime()

> [!NOTE]
> When possible, we recommend using [timespan literals](../query/scalar-data-types/timespan.md#timespan-literals) instead.

## Syntax

`totimespan(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The value to convert to a [timespan](scalar-data-types/timespan.md).|

## Returns

If conversion is successful, result is a [timespan](scalar-data-types/timespan.md) value.
Else, result is null.

## Example

The following example checks whether the input matches the defined timespan. 

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoS8wpTbU1teblKijKzCtRyM3MKw4uKbItyS%2FJzE0tLkjM01Ay0DMwsDIwtjIwUNLUUUhJrCxGljZJAQpm5Jei6AEbq6ClYJgBlASZiU3SKBcoWZyanJ%2BXgiJvCpQzKQbKwUR8M%2FNs4bJGpkDzNAFFa0mAvAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let value=5;
print minsStr=totimespan("0.00:03:00"), days=totimespan(4d), hour=totimespan(value * 1h), mins=totimespan(value * 2m), seconds=totimespan(5 * 4s), timespanMin=timespan(25min)
```

**Output**
|minsStr|days|hour|mins|seconds|timespanMin|
|---|---|---|---|---|---|
|00:03:00|4.00:00:00|05:00:00|00:10:00|00:00:20|00:25:00|

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [timespan datatype](scalar-data-types/timespan.md)
* [make-timespan function](make-timespan-function.md)
