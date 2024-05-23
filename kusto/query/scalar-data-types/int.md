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

To specify an `int` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|
|`int(`*number*`)`|A positive integer.|`int(2)`|
|`int(-`*number*`)`|A negative integer.|`int(-2)`|
|`int(null)`|Represents the [null value](null-values.md).||

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Related content

* [toint()](../../query/tointfunction.md)
