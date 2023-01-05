---
title: log() - Azure Data Explorer
description: Learn how to use the log() function to return the natural logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2022
---
# log()

The natural logarithm is the base-e logarithm: the inverse of the natural exponential function (exp).  

## Syntax

`log(`*x*`)`

## Arguments

* *x*: A real number > 0.

## Returns

* `log()` returns the natural logarithm of the input.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## See also

* For common (base-10) logarithms, see [log10()](log10-function.md).
* For base-2 logarithms, see [log2()](log2-function.md).
