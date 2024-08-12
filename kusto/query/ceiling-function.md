---
title:  ceiling()
description: Learn how to use the ceiling() function to calculate the smallest integer greater than, or equal to, the specified numeric expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# ceiling()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the smallest integer greater than, or equal to, the specified numeric expression.

## Syntax

`ceiling(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | int, long, or real |  :heavy_check_mark: | The value to round up. |

## Returns

The smallest integer greater than, or equal to, the specified numeric expression.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUg2VLBVSE7NzMnMS9fQNdQz1NRRSDZCEjMACRgjC+hZagIAMiJDFDwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print c1 = ceiling(-1.1), c2 = ceiling(0), c3 = ceiling(0.9)
```

**Output**

|c1|c2|c3|
|---|---|---|
|-1|0|1|
