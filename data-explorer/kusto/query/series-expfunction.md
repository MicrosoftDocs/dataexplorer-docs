---
title: series_exp() - Azure Data Explorer
description: This article describes series_exp() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 11/10/2021
---
# series_exp()

Calculates the element-wise exponential function (e^x) of the numeric series input.

## Syntax

`series_exp(`*series*`)`

## Arguments

* *series*: Input numeric array to be used as as the exponent in the exponential function. The result is a dynamic array. The argument must be a dynamic array. 

## Returns

Dynamic array of calculated exponential function. Any non-numeric element yields a `null` element value.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 4 step 3
| extend y = x + 1
| extend z = y + 1
| project s = pack_array(x,y,z)
| extend s_exp = series_exp(s)
```

|s|s_exp|
|---|---|
|[1,2,3]|[2.7182818284590451,7.38905609893065,20.085536923187668]|
|[4,5,6]|[54.598150033144236,148.4131591025766,403.42879349273511]|
