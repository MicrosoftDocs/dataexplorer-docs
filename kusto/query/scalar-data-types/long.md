---
title:  The long data type
description:  This article describes the long data type.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The long data type

The `long` data type represents a signed, 64-bit wide, integer.

By default, integers and integers represented with hexadecimal syntax are of type `long`.

## `long` literals

To specify a `long` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|
|*number*|An integer. You don't need to wrap the integer with `long()` because integers are by default of type `long`.|`12`|
|`0x`*hex*|An integer represented with hexadecimal syntax.|`0xf` is equivalent to 15|
|`long(-`*number*`)`|A negative integer.|`long(-1)`|
|`long(null)`|Represents the [null value](null-values.md).||

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Related content

* [tolong()](../../query/tolongfunction.md)
* To convert the `long` type into a hex string, see [tohex() function](../tohexfunction.md).
