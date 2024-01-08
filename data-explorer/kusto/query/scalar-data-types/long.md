---
title:  The long data type
description: This article describes the long data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The long data type

The `long` data type represents a signed, 64-bit wide, integer.

## long literals

To specify a `long` literal, use the following syntax:

`long(`*value*`)`

The following formats are supported for the *value* parameter:

|Description|Example|
|--|--|
|One more or digits, in which case the literal value is the decimal representation of these digits.|`long(12)`|
|The prefix `0x` followed by one or more hex digits.|`long(0xf)` is equivalent to `long(15)`|
|A negative (`-`) sign followed by one or more digits.|`long(-1)`|
|`null`, which represents a missing value.|`long(null)`|

> [!NOTE]
> Whole numbers and those specified with the 0x prefix followed by hex digits are considered `long` literals. For example, `123` and `0x123` are direct literals of type long. However, `-2` isn't considered a literal in this context. Instead, it's interpreted as the unary function `-` applied to the literal `2` of type long.

## Related content

* [tolong()](../../query/tolongfunction.md)
* To convert the `long` type into a hex string, see [tohex() function](../tohexfunction.md).
