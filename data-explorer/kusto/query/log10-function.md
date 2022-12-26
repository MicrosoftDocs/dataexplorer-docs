---
title: log10() - Azure Data Explorer
description: Learn how to use the log10() function to return the common (base-10) logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2022
---
# log10()

The common logarithm is the base-10 logarithm: the inverse of the exponential function (exp) with base 10.

## Syntax

`log10(`*x*`)`

## Arguments

* *x*: A real number > 0.

## Returns

* `log10()` returns the common (base-10) logarithm of the input.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## See also

* For natural (base-e) logarithms, see [log()](log-function.md).
* For base-2 logarithms, see [log2()](log2-function.md)