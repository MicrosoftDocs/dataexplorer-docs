---
title:  The decimal data type
description: This article describes the decimal data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The decimal data type

The `decimal` data type represents a 128-bit wide, decimal number.

> [!CAUTION]
> Arithmetic operations involving `decimal` values are significantly slower than operations on [real](real.md) data type.
> If your use case doesn't require very high precision, we recommend using `real`.

## `decimal` literals

To specify a `decimal` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|
|`decimal(`*number*`)`|A decimal number represented by one or more digits, followed by a decimal point, and then one or more digits.|`decimal(1.0)`|
|`decimal(`*number*`e`*exponent*`)`|A decimal number represented by scientific notation.|`decimal(1e5)` is equivalent to 100,000|
|`decimal(null)`|Represents the [null value](null-values.md).||

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Related content

* [todecimal()](../../query/todecimalfunction.md)
* [toreal()](../../query/todoublefunction.md)
