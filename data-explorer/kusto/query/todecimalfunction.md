---
title: todecimal() - Azure Data Explorer
description: Learn how to use the todecimal() function to convert the input expression to a decimal number representation. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/20/2023
---
# todecimal()

Converts the input to a decimal number representation.

```kusto
todecimal("123.45678") == decimal(123.45678)
```

## Syntax

`todecimal(`*Expr*`)`

## Arguments

* *Expr*: An expression that will be converted to a decimal representation.

## Returns

If the conversion is successful, the result will be a decimal number. Otherwise, the result will be `null`.

> [!NOTE]
> Use [real()](./scalar-data-types/real.md) when possible.
