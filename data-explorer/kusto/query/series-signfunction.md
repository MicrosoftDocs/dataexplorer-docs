---
title: series_sign() - Azure Data Explorer
description: This article describes series_sign() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 11/10/2021
---
# series_sign()

Calculates the element-wise sign of the numeric series input.

## Syntax

`series_sign(`*series*`)`

## Arguments

* *series*: Input numeric array, on which the sign function is applied. The result is a dynamic array. The argument must be a dynamic array. 

## Returns

Dynamic array of calculated sign function values. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print arr = dynamic([-6,0,8])
| extend arr_sign = series_sign(arr)
```

|arr|arr_sign|
|---|---|
|[-6,0,8]|[-1,0,1]|

