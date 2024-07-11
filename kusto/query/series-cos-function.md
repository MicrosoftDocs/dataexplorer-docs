---
title:  series_cos()
description: Learn how to use the series_cos() function to calculate the element-wise cosine function of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/22/2023
---
# series_cos()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise cosine function of the numeric series input.

## Syntax

`series_cos(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the cosine function is applied. |

## Returns

Dynamic array of calculated cosine function values. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY11DHQMYzV5KpRSK0oSc1LASmIT84vBioqTi3KTC0GcTSAgpoASCWUy0AAAAA=" target="_blank">Run the query</a>
:::moniker-end

```kusto
print arr = dynamic([-1,0,1])
| extend arr_cos = series_cos(arr)
```

**Output**

|arr|arr_cos|
|---|---|
|[-6.5,0,8.2]|[0.54030230586813976,1.0,0.54030230586813976]|
