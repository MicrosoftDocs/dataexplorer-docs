---
title:  The int data type
description: This article describes the int data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The int data type

The `int` data type represents a signed, 32-bit wide, integer.

## `int` literals

To specify an `int` literal, use the following syntax:

`int(`*value*`)`

The following formats are supported for the *value* parameter:

|Description|Example|
|--|--|
|A whole number|`int(2)`|
|A negative whole number|`int(-2)`|
|`null`, which represents a missing value|`int(null)`|

## Related content

* [toint()](../../query/tointfunction.md)
