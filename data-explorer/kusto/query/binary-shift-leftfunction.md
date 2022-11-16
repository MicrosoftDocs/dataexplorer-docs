---
title: binary_shift_left() - Azure Data Explorer
description: This article describes binary_shift_left() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/10/2022
---
# binary_shift_left()

Returns binary shift left operation on a pair of numbers.

## Syntax

`binary_shift_left(`*value*`,` *shift* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | int | &check; | The start value. |
| *shift* | int | &check; | The number of bits to shift left. |

## Returns

Returns binary shift left operation on a pair of numbers: num1 << (num2%64).
If n is negative a NULL value is returned.

## Example

```kusto
binary_shift_left(1,2)
```

|Result|
|------|
|4 |
