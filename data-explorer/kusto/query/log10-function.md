---
title: log10() - Azure Data Explorer
description: Learn how to use the log10() function to return the common (base-10) logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/05/2023
---
# log10()

`log10()` returns the common (base-10) logarithm of the input.

## Syntax

`log10(`*x*`)`

## Arguments

* *x*: A real number > 0.

## Returns

* The common logarithm is the base-10 logarithm: the inverse of the exponential function (exp) with base 10.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## See also

* For natural (base-e) logarithms, see [log()](log-function.md).
* For base-2 logarithms, see [log2()](log2-function.md)