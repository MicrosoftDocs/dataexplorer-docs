---
title:  Scalar data types
description: This article describes Scalar data types in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/27/2020
---
# Scalar data types

Every data value (such as the value of an expression, or the parameter to a function) has a **data type**. A data type is either a **scalar data type**
(one of the built-in predefined types listed below), or a **user-defined record**
(an ordered sequence of name/scalar-data-type pairs, such as the data type of a
row of a table).

Kusto supplies a set of system data types that define all the types of data
that can be used with Kusto.

> [!NOTE]
> User-defined data types are not supported in Kusto.

## Supported data types

The following data types are supported:

| Type | Description |
|--|--|
| [bool](bool.md) (`boolean`) | `true` (`1`), `false` (`0`), or null. |
| [datetime](datetime.md) (`date`) | An instant in time, typically expressed as a date and time of day. |
| [dynamic](dynamic.md) | An array, a property bag, null, or a value of any of the other scalar data types.|
| [guid](guid.md) | A 128-bit globally-unique value. |
| [int](int.md) | A signed, 32-bit wide, integer. |
| [long](long.md) | A signed, 64-bit wide, integer. |
| [real](real.md) (double) | A 64-bit wide, double-precision, floating-point number. |
| [string](string.md) | A sequence of zero or more [Unicode](https://home.unicode.org/) characters.|
| [timespan](timespan.md) (time) | A time interval. |
| [decimal](decimal.md) | A 128-bit wide, decimal number.|

> [!TIP]
> To check the data type of a value, use the the [gettype()](../../query/gettypefunction.md) function.

## Null values

All non-string data types can be null, indicating the absence or mismatch of data. For example, if you try to input the string "abc" into an integer column, it results in the null value.

You can't create the null value directly, but you can check if an expression equals this value using the [isnull()](../../query/isnullfunction.md) function.

## Related content

* [Null values](null-values.md)
