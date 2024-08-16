---
title:  series_tan()
description: Learn how to use the series_tan() function to calculate the element-wise tangent of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_tan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise tangent of the numeric series input.

## Syntax

`series_tan(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values on which the tangent function is applied.|

## Returns

A dynamic array of calculated tangent function values. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY11FEw0FEwjNXkqlFIrShJzUsBKYkvScwDKitOLcpMLQZxNICCmgCTiCSoQgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = dynamic([-1, 0, 1])
| extend arr_tan = series_tan(arr)
```

**Output**

|arr|arr_tan|
|---|---|
|[-6.5,0,8.2]|[-1.5574077246549023,0.0,1.5574077246549023]|
