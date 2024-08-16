---
title:  series_greater()
description: Learn how to use the series_greater() function to calculate the element-wise greater (`>`) logic operation of two numeric series inputs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_greater()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise greater (`>`) logic operation of two numeric series inputs.

## Syntax

`series_greater(`*series1*`,` *series2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series1*, *series2* | `dynamic` |  :heavy_check_mark: | The arrays of numeric values to be element-wise compared.|

## Returns

Dynamic array of booleans containing the calculated element-wise greater logic operation between the two inputs. Any non-numeric element or non-existing element (arrays of different sizes) yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSg2VLBVSKnMS8zNTNaINtQx0jGJ1dRRKDZCFjYBChvGanLVKKRWlKTmpQB1xacXpSaWpBbFg1UWpxZlphbDxDSKDUEmaAIAcWLMOWIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print s1 = dynamic([1,2,4]), s2 = dynamic([4,2,1])
| extend s1_greater_s2 = series_greater(s1, s2)
```

**Output**

|s1|s2|s1_greater_s2|
|---|---|---|
|[1,2,4]|[4,2,1]|[false,false,true]|

## Related content

For entire series statistics comparisons, see:

* [series_stats()](series-stats-function.md)
* [series_stats_dynamic()](series-stats-dynamic-function.md)
