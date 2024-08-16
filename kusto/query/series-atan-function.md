---
title:  series_atan()
description: Learn how to use the series_atan() function to calculate the element-wise arctangent of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_atan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise arctangent function of the numeric series input.

## Syntax

`series_atan(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the arctangent function is applied. |

## Returns

Dynamic array of calculated arctangent function values. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY11DHQMYzV5KpRSK0oSc1LASmITyxJzAOqKk4tykwtBvM0gMKaAKvO/bxCAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = dynamic([-1,0,1])
| extend arr_atan = series_atan(arr)
```

**Output**

|arr|arr_atan|
|---|---|
|[-6.5,0,8.2]|[-0.78539816339744828,0.0,0.78539816339744828]|
