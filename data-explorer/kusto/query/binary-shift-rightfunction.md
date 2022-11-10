---
title: binary_shift_right() - Azure Data Explorer
description: This article describes binary_shift_right() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/10/2022
---
# binary_shift_right()

Returns binary shift right operation on a pair of numbers.

```kusto
binary_shift_right(x,y)
```

## Syntax

`binary_shift_right(`*value*`,` *shift* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | int | &check; | The start value. |
| *shift* | int | &check; | The number of bits to shift. |

## Returns

Returns binary shift right operation on a pair of numbers: num1 >> (num2%64).
If n is negative a NULL value is returned.
