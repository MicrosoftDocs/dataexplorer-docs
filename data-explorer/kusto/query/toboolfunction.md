---
title: tobool() - Azure Data Explorer
description: Learn how to use the tobool() function to convert an input to a boolean representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# tobool()

Convert inputs to boolean (signed 8-bit) representation.

> The `tobool()` and `toboolean()` functions are equivalent

## Syntax

`tobool(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be converted to boolean.

## Returns

If conversion is successful, result will be a boolean.
If conversion isn't successful, result will be `null`.

## Example

```kusto
tobool("true") == true
tobool("false") == false
tobool(1) == true
tobool(123) == true
```
