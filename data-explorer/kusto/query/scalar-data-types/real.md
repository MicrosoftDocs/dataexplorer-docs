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

To specify a `real` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|--|
|*n*`.`*fraction*|A real number represented by one or more digits, followed by a decimal point, and then one or more digits.|`1.0`|
|*n*`e`*exponent*|A real number represented by scientific notation.|`1e5`|
|`real(null)`|Represents the [null value](null-values.md).||
|`real(nan)`|Not-a-number (NaN), such as when dividing a `0.0` by another `0.0`.||
|`real(+inf)`|Positive infinity, such as when dividing `1.0` by `0.0`.||
|`real(-inf)`|Negative infinity, such as when dividing `-1.0` by `0.0`.||

## Related content

* [toreal()](../../query/toreal-function.md)
