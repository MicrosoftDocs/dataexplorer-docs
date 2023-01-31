---
title: sqrt() - Azure Data Explorer
description: Learn how to use the sqrt() function to return the square root of the input,
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/31/2023
---
# sqrt()

Returns the square root of the input.

## Syntax

`sqrt(`*x*`)`

## Arguments

* *x*: A real number >= 0.

## Returns

* A positive number such that `sqrt(x) * sqrt(x) == x`
* `null` if the argument is negative or can't be converted to a `real` value.
