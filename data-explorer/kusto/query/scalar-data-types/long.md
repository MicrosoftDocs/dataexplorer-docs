---
title:  The long data type
description: This article describes the long data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The long data type

The `long` data type represents a signed, 64-bit wide, integer.

## `long` literals

To specify a `long` literal, use one of the following syntax options:

|Value|Example|
|--|--|
|One more or digits representing a whole number|`12`|
|The prefix `0x` followed by one or more hex digits (hexadecimal number)|`0xf` is equivalent to `long(15)`|
|A negative (`-`) sign followed by one or more digits|`long(-1)`|
|`long(null)` to indicate a missing value||

## Related content

* [tolong()](../../query/tolongfunction.md)
* To convert the `long` type into a hex string, see [tohex() function](../tohexfunction.md).
