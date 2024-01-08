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

To specify a `decimal` literal, use the following syntax:

`decimal(`*value*`)`

The following formats are supported for the *value* parameter:

|Value|Example|
|--|--|
|One or more digits, followed by a decimal point, and then one or more digits|`decimal(1.0)`|
|One or more digits, followed by the letter e, and then another digit, indicating scientific notation|`decimal(1e5)`|
|`null` to represent a missing value|`decimal(null)`|

## Related content

* [todecimal()](../../query/todecimalfunction.md)
* [toreal()](../../query/todoublefunction.md)
