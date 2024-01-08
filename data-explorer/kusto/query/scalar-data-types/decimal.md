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
> If your use case doesn't require very high precision, it's advised to switch to `real`.

## datetime literals

`decimal(1.0)`, `decimal(0.1)`, and `decimal(1e5)` are all literals of type `decimal`.

The special form `decimal(null)` represents the [null value](null-values.md).

## Related content

* [todecimal()](../../query/todecimalfunction.md)
* [toreal()](../../query/todoublefunction.md)
