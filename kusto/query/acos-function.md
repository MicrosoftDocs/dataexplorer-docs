---
title:  acos()
description: Learn how to use the acos() function to calculate the angle of the cosine input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# acos()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the angle whose cosine is the specified number. Inverse operation of [`cos()`](cos-function.md).

## Syntax

`acos(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The value used to calculate the arc cosine. |

## Returns

The value of the arc cosine of `x`. The return value is `null` if `x` < -1 or `x` > 1.
