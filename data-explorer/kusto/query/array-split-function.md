---
title:  array_split()
description: Learn how to use the array_split() function to split an array into multiple arrays.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# array_split()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Splits an array to multiple arrays according to the split indices and packs the generated array in a dynamic array.

## Syntax

`array_split`(*array*, *index*)

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *array*| `dynamic` |  :heavy_check_mark: | The array to split.|
| *index* | `int` or `dynamic` |  :heavy_check_mark:| An integer or dynamic array of integers used to indicate the location at which to split the array. The start index of arrays is zero. Negative values are converted to `array_length` + `value`.|

## Returns

Returns a dynamic array containing N+1 arrays with the values in the range `[0..i1), [i1..i2), ... [iN..array_length)` from `array`, where N is the number of input indices and `i1...iN` are the indices.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1VTgqlFIrShJzUsBKYkvLsjJLLEFshIrIWwNIFtHwUgTAB7YikBGAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4,5]) 
| extend arr_split=array_split(arr, 2)
```

**Output**

|arr|arr_split|
|---|---|
|[1,2,3,4,5]|[[1,2],[3,4,5]]|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYx0TGN1VTgqlFIrShJzUsBKYkvLsjJLLEFshIrIWwNIFtHAUmncaymJgD5vl9PUwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4,5]) 
| extend arr_split=array_split(arr, dynamic([1,3]))
```

**Output**

|arr|arr_split|
|---|---|
|[1,2,3,4,5]|[[1],[2,3],[4,5]]|
