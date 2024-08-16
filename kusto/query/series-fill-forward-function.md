---
title:  series_fill_forward()
description: Learn how to use the series_fill_forward() function to perform a forward fill interpolation of missing values in a series.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_fill_forward()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Performs a forward fill interpolation of missing values in a series.

An expression containing dynamic numerical array is the input. The function replaces all instances of missing_value_placeholder with the nearest value from its left side other than missing_value_placeholder, and returns the resulting array. The leftmost instances of missing_value_placeholder are preserved.

## Syntax

`series_fill_forward(`*series*`,` [ *missing_value_placeholder* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values.|
| *missing_value_placeholder* | scalar | | Specifies a placeholder for missing values. The default value is `double(`*null*`)`. The value can be of any type that will be converted to actual element types. `double`(*null*), `long`(*null*) and `int`(*null*) have the same meaning.|

## Returns

*series* with all instances of *missing_value_placeholder* filled forwards.

> [!NOTE]
>
> * If you create *series* using the [make-series](make-series-operator.md) operator, specify *null* as the default value to use interpolation functions like `series_fill_forward()` afterwards. See [explanation](make-series-operator.md#list-of-series-interpolation-functions).
> * If *missing_value_placeholder* is `double`(*null*), or omitted, then a result may contain *null* values. To fill these *null* values, use other interpolation functions. Only [series_outliers()](series-outliers-function.md) supports *null* values in input arrays.
> * `series_fill_forward()` preserves the original type of the array elements.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA8tJLVFISSxJVLAFUyWJSTmpGolFRVYKKZV5ibmZyZq8XApAEA2hoIIa0XmlOTk6ChDS2ExHwcQQxoOQhkAxM6CYsTGyeKwm0AxerlhrXi6wpbxcNQoFRflZqcklEPOBNusoQJhpmTk58Wn5ReWJRSlA1xWnFmWmFscji4LcqQkA68oew8EAAAA=" target="_blank">Run the query</a>
::: moniker-end


```kusto
let data = datatable(arr: dynamic)
    [
    dynamic([null, null, 36, 41, null, null, 16, 61, 33, null, null])   
];
data 
| project
    arr, 
    fill_forward = series_fill_forward(arr)  
```

**Output**

|`arr`|`fill_forward`|
|---|---|
|[null,null,36,41,null,null,16,61,33,null,null]|[null,null,36,41,41,41,16,61,33,33,33]|

Use [series_fill_backward](series-fill-backward-function.md) or [series-fill-const](series-fill-const-function.md) to complete interpolation of the above array.
