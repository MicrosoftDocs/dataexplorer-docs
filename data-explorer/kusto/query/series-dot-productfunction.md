---
title: series_dot_product() - Azure Data Explorer
description: This article describes series_dot_product() in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/12/2022
---
# series_dot_product()

Calculates the dot product of two numeric series inputs.

The function `series_dot_product()` takes an expression containing two numeric series inputs as input and calculates their [dot product](https://en.wikipedia.org/wiki/Dot_product).

## Syntax

`series_dot_product(`*series1*`,` *series2*`)`

## Arguments

* *series1, series2*: Input numeric arrays to be element-wise multiplied and then summed into a double type value.

## Returns

Returns a double type value with the sum of the elements of the array, created by the element-wise multiplication operation between the two inputs.

> [!NOTE]
> If the input contains empty arrays, the result is `null`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 3 step 1 
| extend y = x * 2
| extend z = y * 2
| project s1 = pack_array(x,y,z), s2 = pack_array(z, y, x)
| extend s1_dot_product_s2 = series_dot_product(s1, s2)
```

|s1|s2|s1_dot_product_s2|
|---|---|---|
|[1,2,4]|[4,2,1]|12|
|[2,4,8]|[8,4,2]|48|
|[3,6,12]|[12,6,3]|108|
