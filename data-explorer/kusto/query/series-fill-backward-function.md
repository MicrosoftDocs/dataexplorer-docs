---
title:  series_fill_backward()
description: Learn how to use the series_fill_backward() function to perform a backward fill interpolation of missing values in a series.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# series_fill_backward()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Performs a backward fill interpolation of missing values in a series.

An expression containing dynamic numerical array is the input. The function replaces all instances of missing_value_placeholder with the nearest value from its right side (other than missing_value_placeholder), and returns the resulting array. The rightmost instances of missing_value_placeholder are preserved.

## Syntax

`series_fill_backward(`*series*`[,`*missing_value_placeholder*`])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values.|
| *missing_value_placeholder* | scalar | | Specifies a placeholder for missing values. The default value is `double(`*null*`)`. The value can be of any type that converts to actual element types. `double`(*null*), `long`(*null*), and `int`(*null*) have the same meaning.|

> [!NOTE]
>
> * If you create *series* using the [make-series](make-series-operator.md) operator, specify *null* as the default value to use interpolation functions like `series_fill_backward()` afterwards. See [explanation](make-series-operator.md#list-of-series-interpolation-functions).
> * If *missing_value_placeholder* is `double`(*null*), or omitted, then a result can contain *null* values. To fill these *null* values, use other interpolation functions. Only [series_outliers()](series-outliers-function.md) supports *null* values in input arrays.
> * `series_fill_backward()` preserves the original type of the array elements.

## Returns

*series* with all instances of *missing_value_placeholder* filled backwards.

## Example

The following example performs a backwards fill on missing data in the datatable, *data*.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFISSxJVLAFUyWJSTmpGolFRVYKKZV5ibmZyZpcCkAQDSahQhrRhoaGOgp5pTk5OgrGZjoKJnAehDQEipkBxYyNkcVjNYFGcMVac4Ht46pRKCjKz0pNLgEbDbRSRwHMSsvMyYlPSkzOLk8sSgE6qzi1KDO1OB5FGORCTQBymgAduwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let data = datatable(arr: dynamic)
    [
    dynamic([111, null, 36, 41, null, null, 16, 61, 33, null, null])   
];
data 
| project
    arr, 
    fill_backward = series_fill_backward(arr)
```

**Output**

|`arr`|`fill_backward`|
|---|---|
|[111,null,36,41,null,null,16,61,33,null,null]|[111,36,36,41,16,16,16,61,33,null,null]|

> [!TIP]
> Use [series_fill_forward](series-fill-forward-function.md) or [series-fill-const](series-fill-const-function.md) to complete interpolation of the array.

## Related content

* [Time series analysis](time-series-analysis.md)
* [make-series operator](make-series-operator.md)
* [series_fill_const()](series-fill-const-function.md)
* [series_fill_forward()](series-fill-forward-function.md)
* [series_fill_linear()](series-fill-linear-function.md)
