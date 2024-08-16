---
title:  series_magnitude()
description: Learn how to use the series_magnitude() function to calculate the magnitude of series elements.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# series_magnitude()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the [magnitude](https://en.wikipedia.org/wiki/Magnitude_(mathematics)#Euclidean_vector_space) of series elements. This is equivalent to the square root of the [dot product](https://en.wikipedia.org/wiki/Dot_product) of the series with itself.

## Syntax

`series_magnitude(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | Array of numeric values. |

## Returns

Returns a double type value representing the magnitude of the series.

[!INCLUDE [optimization-note](../includes/vector16-encoding-policy.md)]

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYxidVU4OWqUUitKEnNS1EoTi3KTC2Oz01Mz8ssKU1JtUUX0ACaoQkADZHIIU4AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4]) 
| extend series_magnitude=series_magnitude(arr)
```

**Output**

|s1|s2|series_magnitude|
|---|---|---|
|[1,2,3,4]|5.4772255750516612|
