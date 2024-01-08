---
title:  The real data type
description: This article describes the real data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The real data type

The `real` data type represents a 64-bit wide, double-precision, floating-point number.

## `real` literals

To specify a `real` literal, use the following syntax:

`real(`*value*`)`

The following formats are supported for the *value* parameter:

|Value|Example|
|--|--|
|One or more digits, followed by a decimal point, and then one or more digits|`real(1.0)`|
|One or more digits, followed by the letter `e`, and then another digit, indicating scientific notation|`real(1e5)`|
|`null` to indicate a missing value|`real(null)`|
|`nan` to indicate not-a-number (NaN), such as when dividing a `0.0` by another `0.0`|`real(nan)`|
|`+inf` to indicate positive infinity, such as when dividing `1.0` by `0.0`.|`real(+inf)`|
|`-inf` to indicate negative infinity, such as when dividing `-1.0` by `0.0`.|`real(-inf)`|

> [!NOTE]
> By default, decimal numbers and numbers specified with scientific notation are `real` literals. For example, `1.0`, `0.1`, and `1e5` are direct literals of type `real`.

## Related content

* [toreal()](../../query/toreal-function.md)
