---
title: tostring() - Azure Data Explorer
description: Learn how to use the tostring() function to convert the input value to a string representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/23/2023
---
# tostring()

Converts the input to a string representation.

## Syntax

`tostring(`*`Expr`*`)`

## Arguments

* *`Expr`*: Expression that will be converted to string.

## Returns

If the *`Expr`* value is non-null, the result will be a string representation of *`Expr`*.
If the *`Expr`* value is null, the result will be an empty string.

## Example

```kusto
tostring(123) == "123"
```
