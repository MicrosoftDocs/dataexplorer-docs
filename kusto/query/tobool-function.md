---
title:  tobool()
description: Learn how to use the tobool() function to convert an input to a boolean representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# tobool()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Convert inputs to boolean (signed 8-bit) representation.

> The `tobool()` and `toboolean()` functions are equivalent

> [!NOTE]
> When possible, use [bool literals](../query/scalar-data-types/bool.md#bool-literals) instead.

## Syntax

`tobool(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The value to convert to boolean.|

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
