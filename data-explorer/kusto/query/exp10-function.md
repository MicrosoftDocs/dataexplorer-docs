---
title:  exp10()
description: Learn how to use the exp10() function to return the base-10 exponential value of x.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# exp10()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The base-10 exponential function of x, which is 10 raised to the power x: 10^x.  

## Syntax

`exp10(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark:| The value of the exponent. |

## Returns

Returns the exponential value of x.

## Examples

The following example shows how to use the `exp10()` function to calculate the exponential value of 2.

```kusto
print result = exp10(2)
```

**Output**

```Kusto
result
-------
100
```

## Related content

* For natural (base-10) logarithms, see [log10()](log10-function.md).
* For exponential functions of base-e and base-2 logarithms, see [exp()](exp-function.md), [exp2()](exp2-function.md).
