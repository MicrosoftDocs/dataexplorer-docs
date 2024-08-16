---
title:  series_equals()
description: Learn how to use the series_equals() function to calculate the element-wise equals (`==`) logic operation of two numeric series inputs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_equals()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise equals (`==`) logic operation of two numeric series inputs.

## Syntax

`series_equals (`*series1*`,` *series2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series1, series2* | `dynamic` |  :heavy_check_mark: | The numeric arrays to be element-wise compared. |

## Returns

Dynamic array of booleans containing the calculated element-wise equal logic operation between the two inputs. Any non-numeric element or non-existing element (arrays of different sizes) yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSg2VLBVSKnMS8zNTNaINtQx0jGJ1dRRKDZCFjYBChvGanLVKKRWlKTmpQB1xacWlibmFMeDFRanFmWmFkOFNIoNQfo1AT5VmINgAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print s1 = dynamic([1,2,4]), s2 = dynamic([4,2,1])
| extend s1_equals_s2 = series_equals(s1, s2)
```

**Output**

|s1|s2|s1_equals_s2|
|---|---|---|
|[1,2,4]|[4,2,1]|[false,true,false]|

## Related content

For entire series statistics comparisons, see:

* [series_stats()](series-stats-function.md)
* [series_stats_dynamic()](series-stats-dynamic-function.md)
