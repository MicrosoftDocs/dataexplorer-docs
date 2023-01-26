---
title: series_acos() - Azure Data Explorer
description: Learn how to use the series_acos() function to calculate the element-wise arccosine function of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/22/2023
---
# series_acos()

Calculates the element-wise arccosine function of the numeric series input.

## Syntax

`series_acos(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the arccosine function is applied. The argument must be a dynamic array.

## Returns

Dynamic array of calculated arccosine function values. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print arr = dynamic([-1,0,1])
| extend arr_acos = series_acos(arr)
```

**Output**

|arr|arr_acos|
|---|---|
|[-6.5,0,8.2]|[3.1415926535897931,1.5707963267948966,0.0]|
