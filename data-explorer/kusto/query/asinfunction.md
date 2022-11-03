---
title: asin() - Azure Data Explorer
description: Learn how to use the asin() function to calculate the angle from a sine input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/03/2022
---
# asin()

Calculates the angle whose sine is the specified number (the inverse operation of [`sin()`](sinfunction.md)).

## Syntax

`asin(`*x*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*x* | real | &check;| A real number in range [-1, 1].|

## Returns

Returns the value of the arc sine of `x`. Returns `null` if `x` < -1 or `x` > 1.
