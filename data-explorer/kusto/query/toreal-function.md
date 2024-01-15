---
title:  toreal()
description: Learn how to use the toreal() function to convert the input expression to a value of type `real`.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2024
---
# toreal()

Converts the input expression to a value of type [real](scalar-data-types/real.md).

> The `todouble()` and `toreal()` functions are equivalent.

> [!NOTE]
> When possible, use [real literals](./scalar-data-types/real.md) instead.

## Syntax

`toreal(`*Expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to [real](scalar-data-types/real.md).|

## Returns

If conversion is successful, the result is a value of type `real`. Otherwise, the returned value will be `real(null)`.

## Example

```kusto
toreal("123.4") == 123.4
```
