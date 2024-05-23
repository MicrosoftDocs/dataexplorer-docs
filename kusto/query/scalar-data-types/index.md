---
title:  Scalar data types
description:  This article describes Scalar data types.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/27/2020
---
# Scalar data types

Every data value, like the value of an expression or a function parameter, has a *data type*. A data type is either a *scalar data type*, which is one of the built-in predefined types listed below, or a *user-defined record*, which is an ordered sequence of name and scalar-data-type pairs, like the data type of a row in a table.

> [!NOTE]
> User-defined data types are not supported in Kusto.

## Supported data types

The following data types are supported:

| Type | Description |
|--|--|
| [bool](bool.md) (`boolean`) | `true` (`1`) or `false` (`0`). |
| [datetime](datetime.md) (`date`) | An instant in time, typically expressed as a date and time of day. |
| [decimal](decimal.md) | A 128-bit wide, decimal number.|
| [dynamic](dynamic.md) | An array, a property bag, or a value of any of the other scalar data types.|
| [guid](guid.md) (`uuid`, `uniqueid`)| A 128-bit globally unique value. |
| [int](int.md) | A signed, 32-bit wide, integer. |
| [long](long.md) | A signed, 64-bit wide, integer. |
| [real](real.md) (`double`) | A 64-bit wide, double-precision, floating-point number. |
| [string](string.md) | A sequence of zero or more [Unicode](https://home.unicode.org/) characters.|
| [timespan](timespan.md) (`time`) | A time interval. |

> [!TIP]
> To check the data type of a value, use the the [gettype()](../../query/gettypefunction.md) function.

## Null values

All nonstring data types can be null. When a value is null, it indicates an absence or mismatch of data. For example, if you try to input the string `abc` into an integer column, it results in the null value. To check if an expression is null, use the [isnull()](../../query/isnullfunction.md) function.

For more information, see [Null values](null-values.md).
