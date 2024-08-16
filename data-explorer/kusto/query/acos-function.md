---
title:  acos()
description: Learn how to use the acos() function to calculate the angle of the cosine input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/11/2023
---
# acos()

Calculates the angle whose cosine is the specified number. Inverse operation of [`cos()`](cos-function.md).

## Syntax

`acos(`*x*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The value used to calculate the arc cosine. |

## Returns

The value of the arc cosine of `x`. The return value is `null` if `x` < -1 or `x` > 1.
