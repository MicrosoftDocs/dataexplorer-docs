---
title:  series_abs()
description: Learn how to use the series_abs() function to calculate the element-wise absolute value of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_abs()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise absolute value of the numeric series input.

## Syntax

`series_abs(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the absolute value function is applied. |

## Returns

Dynamic array of calculated absolute value. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY10zPVMdCx0DOK1eSqUUitKEnNSwEpik9MKgYqLE4tykwtBnE0gIKaAGEU39tEAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = dynamic([-6.5,0,8.2])
| extend arr_abs = series_abs(arr)
```

**Output**

|arr|arr_abs|
|---|---|
|[-6.5,0,8.2]|[6.5,0,8.2]|
