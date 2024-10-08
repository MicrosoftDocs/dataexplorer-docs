---
title:  series_ceiling()
description: Learn how to use the series_ceiling() function to calculate the element-wise ceiling function of the numeric series input.
ms.reviewer: afridman
ms.topic: reference
ms.date: 08/11/2024
---
# series_ceiling()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise ceiling function of the numeric series input.

## Syntax

`series_ceiling(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values over which the ceiling function is applied. |

## Returns

Dynamic array of the calculated ceiling function. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShWsFVIqcxLzM1M1ojWNdQz1THUMdIzjdXkqlFIrShJzUtRKI5PTs3MycxLByotTi3KTIULaBRrAgCQd2nZRgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print s = dynamic([-1.5,1,2.5])
| extend s_ceiling = series_ceiling(s)
```

**Output**

|s|s_ceiling|
|---|---|
|[-1.5,1,2.5]|[-1.0,1.0,3.0]|