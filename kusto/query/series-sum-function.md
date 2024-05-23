---
title:  series_sum()
description: Learn how to use the series_sum() function to calculate the sum of series elements.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/20/2023
---
# series_sum()

Calculates the sum of series elements.

## Syntax

`series_sum(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | Array of numeric values. |

## Returns

Returns a double type value with the sum of the elements of the array.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYxidVU4OWqUUitKEnNS1EoTi3KTC2OLy7NtUUwNYD6NAFXJh4UQgAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print arr=dynamic([1,2,3,4]) 
| extend series_sum=series_sum(arr)
```

**Output**

|s1|series_sum|
|---|---|
|[1,2,3,4]|10|
