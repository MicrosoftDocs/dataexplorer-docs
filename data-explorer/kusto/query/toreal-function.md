---
title:  toreal()
description: Learn how to use the toreal() function to convert the input expression to a value of type `real`.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# toreal()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input expression to a value of type [real](scalar-data-types/real.md).

> The `todouble()` and `toreal()` functions are equivalent.

> [!NOTE]
> When possible, use [real literals](scalar-data-types/real.md) instead.

## Syntax

`toreal(`*Expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to [real](scalar-data-types/real.md).|

## Returns

If conversion is successful, the result is a value of type `real`. Otherwise, the returned value is `real(null)`.

## Example

The following example checks whether the input `"123.4"` was converted to the `real` value.

```kusto
toreal("123.4") == 123.4
```

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [The real data type](scalar-data-types/real.md)
* [todecimal()](todecimal-function.md)
* [toint()](toint-function.md)
