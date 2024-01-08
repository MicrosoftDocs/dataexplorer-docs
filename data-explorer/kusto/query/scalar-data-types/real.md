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

By default, numbers in decimal format and numbers specified with scientific notation are `real` literals. For example, `1.0`, `0.1`, and `1e5` are all `real` literals.

The following `real` literals indicate special cases:

|Literal|Description|
|--|--|
|`real(null)`|Indicates a missing value. For more information, see [null value](null-values.md).|
|`real(nan)`|Not-a-Number (NaN). For example, the result of dividing a `0.0` by another `0.0`.|
|`real(+inf)`|Positive infinity. For example, the result of dividing `1.0` by `0.0`.|
|`real(-inf)`|Negative infinity. For example, the result of dividing `-1.0` by `0.0`.|

## Related content

* [toreal()](../../query/toreal-function.md)
