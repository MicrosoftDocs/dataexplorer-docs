---
title:  cot()
description: Learn how to use the cot() function to calculate the trigonometric cotangent of the specified angle in radians.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2022
---
# cot()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the trigonometric cotangent of the specified angle, in radians.

## Syntax

`cot(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | `real` |  :heavy_check_mark: | The value for which to calculate the cotangent. |

## Returns

The cotangent function value for *number*.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjOL9Ew1AQA9l3LZAwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print cot(1)
```

**Output**

|result|
|--|
|0.64209261593433065|
