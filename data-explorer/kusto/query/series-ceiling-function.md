---
title: series_ceiling() - Azure Data Explorer
description: Learn how to use the series_ceiling() function to calculate the element-wise ceiling function of the numeric series input.
ms.reviewer: afridman
ms.topic: reference
ms.date: 01/22/2023
---
# series_ceiling()

Calculates the element-wise ceiling function of the numeric series input.

## Syntax

`series_ceiling(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the ceiling function is applied. The argument must be a dynamic array.

## Returns

Dynamic array of the calculated ceiling function. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print s = dynamic([-1.5,1,2.5])
| extend s_ceiling = series_ceiling(s)
```

**Output**

|s|s_ceiling|
|---|---|
|[-1.5,1,2.5]|[-1.0,1.0,3.0]|