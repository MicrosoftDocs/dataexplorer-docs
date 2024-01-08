---
title:  tobool()
description: Learn how to use the tobool() function to convert an input to a boolean representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2024
---
# tobool()

Convert inputs to boolean (signed 8-bit) representation.

> The `tobool()` and `toboolean()` functions are equivalent

> [!NOTE]
> For optimal efficiency, use [bool literals](../query/scalar-data-types/bool.md#literals) when possible.

## Syntax

`tobool(`*value*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | string | &check; | The value to convert to boolean.|

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
