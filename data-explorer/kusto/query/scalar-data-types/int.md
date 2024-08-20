---
title:  The int data type
description:  This article describes the int data type.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# The int data type

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

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

* [toint()](../toint-function.md)
