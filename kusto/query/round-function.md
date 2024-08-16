---
title:  round()
description: Learn how to use the round() function to round the number to the specified precision.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# round()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the rounded number to the specified precision.

## Syntax

`round(`*number* [`,` *precision*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number*| long or real |  :heavy_check_mark: | The number to calculate the round on.|
| *precision*| `int` | | The number of digits to round to. The default is 0.|

## Returns

The rounded number to the specified precision.

Round is different from the [`bin()`](bin-function.md) function in
that the `round()` function rounds a number to a specific number of digits while the `bin()` function rounds the value to an integer multiple of a given bin size. For example, `round(2.15, 1)` returns 2.2 while `bin(2.15, 1)` returns 2.

## Examples

```kusto
round(2.98765, 3)   // 2.988
round(2.15, 1)      // 2.2
round(2.15)         // 2 // equivalent to round(2.15, 0)
round(-50.55, -2)   // -100
round(21.5, -1)     // 20
```
