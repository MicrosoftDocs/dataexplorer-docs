---
title: tolong() - Azure Data Explorer
description: Learn how to use the tolong() function to convert the input value to a long number representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/22/2023
---
# tolong()

Converts the input value to a long (signed 64-bit) number representation.

> [!NOTE]
> Prefer using [long()](./scalar-data-types/long.md) when possible.

## Syntax

`tolong(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be converted to long.

## Returns

If the conversion is successful, the result will be a long number. Otherwise, the result will be `null`.

## Example

```kusto
tolong("123") == 123
```
