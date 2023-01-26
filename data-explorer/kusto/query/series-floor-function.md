---
title: series_floor() - Azure Data Explorer
description: Learn how to use the series_floor() function to calculate the element-wise floor function of the numeric series input.
ms.reviewer: afridman
ms.topic: reference
ms.date: 01/23/2023
---
# series_floor()

Calculates the element-wise floor function of the numeric series input.

## Syntax

`series_floor(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the floor function is applied. The argument must be a dynamic array.

## Returns

Dynamic array of the calculated floor function. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print s = dynamic([-1.5,1,2.5])
| extend s_floor = series_floor(s)
```

**Output**

|s|s_floor|
|---|---|
|[-1.5,1,2.5]|[-2.0,1.0,2.0]|
