---
title:  exp()
description: Learn how to use the exp() function to return the base-e exponential value of x.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# exp()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The base-e exponential function of x, which is e raised to the power x: e^x.  

## Syntax

`exp(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark:| The value of the exponent. |

## Returns

The exponential value of x.

## Examples

The following example shows how to use the `exp()` function to calculate the exponential value of 2.

```kusto
print result = exp(2)
```

**Output**

| result   |
|----------|
| 7.389056 |

## Related content

* For natural (base-e) logarithms, see [log()](log-function.md).
* For exponential functions of base-2 and base-10 logarithms, see [exp2()](exp2-function.md), [exp10()](exp10-function.md).
