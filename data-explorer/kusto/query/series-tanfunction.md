---
title: series_tan() - Azure Data Explorer
description: Learn how to use the series_tan() function to calculate the element-wise tangent of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# series_tan()

Calculates the element-wise tangent of the numeric series input.

## Syntax

`series_tan(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the tangent function is applied. The argument must be a dynamic array.

## Returns

Dynamic array of calculated tangent function values. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print arr = dynamic([-1,0,1])
| extend arr_tan = series_tan(arr)
```

**Output**

|arr|arr_tan|
|---|---|
|[-6.5,0,8.2]|[-1.5574077246549023,0.0,1.5574077246549023]|
