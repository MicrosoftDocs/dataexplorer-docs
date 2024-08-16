---
title:  series_sign()
description: Learn how to use the series_sign() function to calculate the element-wise sign of the numeric series input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_sign()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise sign of the numeric series input.

## Syntax

`series_sign(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the sign function is applied.|

## Returns

A dynamic array of calculated sign function values. -1 for negative, 0 for 0, and 1 for positive. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKlKwVUipzEvMzUzWiNY101Ew0FGwiNXkqlFIrShJzUsBKYkvzkzPA6orTi3KTC0G8zSAwpoAa5KS9UQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr = dynamic([-6, 0, 8])
| extend arr_sign = series_sign(arr)
```

**Output**

|arr|arr_sign|
|---|---|
|[-6,0,8]|[-1,0,1]|
