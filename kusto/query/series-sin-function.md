---
title:  series_sin()
description: Learn how to use the series_sin() function to calculate the element-wise sine of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_sin()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise sine of the numeric series input.

## Syntax

`series_sin(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the sine function is applied.|

## Returns

A dynamic array of calculated sine function values. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY11FEw0FEwjNXkqlFIrShJzUsBKYkvzswDKitOLcpMLQZxNICCmgAHnzJlQgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = dynamic([-1, 0, 1])
| extend arr_sin = series_sin(arr)
```

**Output**

|arr|arr_sin|
|---|---|
|[-6.5,0,8.2]|[-0.8414709848078965,0.0,0.8414709848078965]|
