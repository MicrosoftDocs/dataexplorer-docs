---
title:  series_floor()
description: Learn how to use the series_floor() function to calculate the element-wise floor function of the numeric series input.
ms.reviewer: afridman
ms.topic: reference
ms.date: 01/29/2023
---
# series_floor()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise floor function of the numeric series input.

## Syntax

`series_floor(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values on which the floor function is applied.|

## Returns

Dynamic array of the calculated floor function. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShWsFVIqcxLzM1M1ojWNdQz1THUMdIzjdXkqlFIrShJzUtRKI5Py8nPLwIqLE4tykyFcjWKNQFIrQOdQgAAAA==" target="_blank">Run the query</a>
:::moniker-end

```kusto
print s = dynamic([-1.5,1,2.5])
| extend s_floor = series_floor(s)
```

**Output**

|s|s_floor|
|---|---|
|[-1.5,1,2.5]|[-2.0,1.0,2.0]|
