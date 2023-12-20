---
title:  todouble()
description: Learn how to use the todouble() function to convert the input expression to a value of type `real`.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/18/2023
---
# todouble()

Converts the input expression to a value of type [real](scalar-data-types/real.md).

> The `todouble()` and `toreal()` functions are equivalent

## Syntax

`todouble(`*Expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to [real](scalar-data-types/real.md).|

## Returns

If conversion is successful, the result is a value of type `real`. Otherwise, the returned value will be `real(null)`.

## Example

```kusto
todouble("123.4") == 123.4
```

> [!NOTE]
> Use [double() or real()](./scalar-data-types/real.md) when possible.
