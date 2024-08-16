---
title:  series_fit_2lines_dynamic()
description: Learn how to use the series_fit_2lines_dynamic() function to apply two segments linear regression on a dynamic numerical array.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_fit_2lines_dynamic()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Applies two segments linear regression on a series, returning a dynamic object.  

Takes an expression containing dynamic numerical array as input and applies [two segments linear regression](https://en.wikipedia.org/wiki/Segmented_regression) in order to identify and quantify trend changes in a series. The function iterates on the series indexes. In each iteration, it splits the series to two parts, and fits a separate line using [series_fit_line()](series-fit-line-function.md) or [series_fit_line_dynamic()](series-fit-line-dynamic-function.md). The function fits the lines to each of the two parts, and calculates the total R-squared value. The best split is the one that maximizes R-squared. The function returns its parameters in dynamic value with the following content:

* `rsquare`: [R-squared](https://en.wikipedia.org/wiki/Coefficient_of_determination) is a standard measure of the fit quality. It's a number in the range of [0-1], where 1 is the best possible fit, and 0 means the data is unordered and don't fit any line.
* `split_idx`: the index of breaking point to two segments (zero-based).
* `variance`: variance of the input data.
* `rvariance`: residual variance that is the variance between the input data values the approximated ones (by the two line segments).
* `line_fit`: numerical array holding a series of values of the best fitted line. The series length is equal to the length of the input array. It's used for charting.
* `right.rsquare`: r-square of the line on the right side of the split, see [series_fit_line()](series-fit-line-function.md) or [series_fit_line_dynamic()](series-fit-line-dynamic-function.md).
* `right.slope`: slope of the right approximated line (of the form y=ax+b).
* `right.interception`: interception of the approximated left line (b from y=ax+b).
* `right.variance`: variance of the input data on the right side of the split.
* `right.rvariance`: residual variance of the input data on the right side of the split.
* `left.rsquare`: r-square of the line on the left side of the split, see [series_fit_line()].(series-fit-line-function.md) or [series_fit_line_dynamic()](series-fit-line-dynamic-function.md).
* `left.slope`: slope of the left approximated line (of the form y=ax+b).
* `left.interception`: interception of the approximated left line (of the form y=ax+b).
* `left.variance`: variance of the input data on the left side of the split.
* `left.rvariance`: residual variance of the input data on the left side of the split.

This operator is similar to [series_fit_2lines](series-fit-2lines-function.md). Unlike `series-fit-2lines`, it returns a dynamic bag.

## Syntax

`series_fit_2lines_dynamic(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | An array of numeric values.|

> [!TIP]
> The most convenient way of using this function is applying it to the results of the [make-series](make-series-operator.md) operator.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAA21PywrCMBC8F/oPe7OFNTTxfcjVk38gUmq72hWNkgZswY83sVQsmMMkOzszm31YNi6OwB+u9AQm2BettoU5U3Jkk5j7M0kRZJ3CFKSsEcZsD72v01VnihuXyV4iKKECLBDmYoWwEJnXekpmYjbgBmEd7qVQhzSOXkCtI1P1cTs2tGWnG7JMTX5il189lQ9DulR8at/AkUP9WlTQNP9MYd7D3i9UOr8/QovQ4ZDxfaggs/5TZMHxjcq6sO4NHF3PtzoBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print
    id=' ',
    x=range(bin(now(), 1h) - 11h, bin(now(), 1h), 1h),
    y=dynamic([1, 2.2, 2.5, 4.7, 5.0, 12, 10.3, 10.3, 9, 8.3, 6.2])
| extend
    LineFit=series_fit_line_dynamic(y).line_fit,
    LineFit2=series_fit_2lines_dynamic(y).line_fit
| project id, x, y, LineFit, LineFit2
| render timechart
```

:::image type="content" source="media/series-fit-2lines/series-fit-2lines.png" alt-text="Series fit 2 lines.":::
