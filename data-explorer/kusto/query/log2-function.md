---
title: log2() - Azure Data Explorer
description: Learn how to use the log2() function to return the base-2 logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2022
---
# log2()

 The logarithm is the base-2 logarithm: the inverse of the exponential function (exp) with base 2.

## Syntax

`log2(`*x*`)`

## Arguments

* *x*: A real number > 0.

## Returns

* `log2()` returns the base-2 logarithm of the input.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## See also

* For natural (base-e) logarithms, see [log()](log-function.md).
* For common (base-10) logarithms, see [log10()](log10-function.md).
