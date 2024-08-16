---
title:  The real data type
description:  This article describes the real data type.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# The real data type

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

The `real` data type represents a 64-bit wide, double-precision, floating-point number.

By default, decimal numbers and numbers represented with scientific notation are of type `real`.

## `real` literals

To specify a `real` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|--|
|*number*|A real number represented by one or more digits, followed by a decimal point, and then one or more digits.|`1.0`|
|*number*`e`*exponent*|A real number represented by scientific notation.|`1e5`|
|`real(null)`|Represents the [null value](null-values.md).||
|`real(nan)`|Not-a-number (NaN), such as when dividing a `0.0` by another `0.0`.||
|`real(+inf)`|Positive infinity, such as when dividing `1.0` by `0.0`.||
|`real(-inf)`|Negative infinity, such as when dividing `-1.0` by `0.0`.||

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Related content

* [toreal()](../toreal-function.md)
