---
title:  Scalar data types
description:  This article describes Scalar data types.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/07/2025
---
# Scalar data types

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Every data value, like the value of an expression or a function parameter, has a *data type* which is either a *scalar data type* or a *user-defined record*. A *scalar data type* is one of the built-in predefined types in [Supported data types](#supported-data-types). A *user-defined record* is an ordered sequence of name and scalar-data-type pairs, like the data type of a row in a table.

As in most languages, the data type determines what calculations and manipulations can be run against a value. For example, if you have a value that is of type *string*, you won't be able to perform arithmetic calculations against it.

> [!NOTE]
> While user-defined records are supported in Kusto, user-defined data types aren't.

## Supported data types

In Kusto Query Language, most of the data types follow standard conventions and have names you've probably seen before. The following table shows the full list:

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
> To check the data type of a value, use the [gettype()](../gettype-function.md) function.

::: moniker range="microsoft-sentinel"
While most of the data types are standard, you might be less familiar with types like *[dynamic](dynamic.md)* or *[timespan](timespan.md)*, and *[guid](guid.md)*.

- ***Dynamic*** has a structure similar to JSON, but with one key difference: It can store Kusto Query Language-specific data types that traditional JSON can't, such as a nested *dynamic* value, or *timespan*.

- ***Timespan*** is a data type that refers to a measure of time such as hours, days, or seconds. Don't confuse *timespan* with *datetime*, which evaluates to an actual date and time, not a measure of time. The following table shows a list of *timespan* suffixes.

- ***Guid*** is a datatype representing a 128-bit, globally unique identifier, which follows the standard format of [8]-[4]-[4]-[4]-[12], where each [number] represents the number of characters and each character can range from 0-9 or a-f.
::: moniker-end

## Null values

All nonstring data types can be null. When a value is null, it indicates an absence or mismatch of data. For example, if you try to input the string `abc` into an integer column, it results in the null value. To check if an expression is null, use the [isnull()](../isnull-function.md) function.

For more information, see [Null values](null-values.md).
