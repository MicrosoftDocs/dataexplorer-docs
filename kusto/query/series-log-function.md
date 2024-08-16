---
title:  series_log()
description: Learn how to use the series_log() function to calculate the element-wise natural logarithm function (base-e) of the numeric series input.
ms.reviewer: afridman
ms.topic: reference
ms.date: 08/11/2024
---
# series_log()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise natural logarithm function (base-e) of the numeric series input.

## Syntax

`series_log(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values on which the natural logarithm function is applied.|

## Returns

Dynamic array of the calculated natural logarithm function. Any non-numeric element yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShWsFVIqcxLzM1M1og21DHSMY7V5KpRSK0oSc1LUSiOz8lPB6ooTi3KTAVzNIo1AcJsOMY5AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print s = dynamic([1,2,3])
| extend s_log = series_log(s)
```

**Output**

|s|s_log|
|---|---|
|[1,2,3]|[0.0,0.69314718055994529,1.0986122886681098]|
