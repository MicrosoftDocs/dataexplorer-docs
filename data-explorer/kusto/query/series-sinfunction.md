---
title: series_sin() - Azure Data Explorer
description: Learn how to use the series_sin() function to calculate the element-wise sine of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# series_sin()

Calculates the element-wise sine function of the numeric series input.

## Syntax

`series_sin(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the sine function is applied. The argument must be a dynamic array.

## Returns

Dynamic array of calculated sine function values. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print arr = dynamic([-1,0,1])
| extend arr_sin = series_sin(arr)
```

**Output**

|arr|arr_sin|
|---|---|
|[-6.5,0,8.2]|[-0.8414709848078965,0.0,0.8414709848078965]|
