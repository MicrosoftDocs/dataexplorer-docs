# series_fit_2lines_dynamic()

Applies two segments linear regression on a series, returning dynamic object.  

Takes an expression containing dynamic numerical array as input and applies [two segments linear regression](https://en.wikipedia.org/wiki/Segmented_regression) in order to identify and quantify trend change in a series. The function iterates on the series indexes and in each iteration splits the series to 2 parts, fits a separate line (using [series_fit_line()](query_language_series_fit_linefunction.md) or [series_fit_line_dynamic()](query_language_series_fit_line_dynamicfunction.md)) to each part and calculate the total r-square. The best split is the one that maximized r-square; the function returns its parameters in dynamic value with the following content::
* `rsquare`: [r-square](https://en.wikipedia.org/wiki/Coefficient_of_determination) is a standard measure of the fit quality. It's a number in the range [0-1], where 1 - is the best possible fit, and 0 means the data is totally unordered and do not fit any line
* `split_idx`: the index of breaking point to 2 segments (zero-based)
* `variance`: variance of the input data
* `rvariance`: residual variance which is the variance between the input data values the approximated ones (by the 2 line segments).
* `line_fit`: numerical array holding a series of values of the best fitted line. The series length is equal to the length of the input array. It is mainly used for charting.
* `right.rsquare`: r-square of the line on the right side of the split, see [series_fit_line()](query_language_series_fit_linefunction.md) or[series_fit_line_dynamic()](query_language_series_fit_line_dynamicfunction.md)
* `right.slope`: slope of the right approximated line (this is a from y=ax+b)
* `right.interception`: interception of the approximated left line (this is b from y=ax+b)
* `right.variance`: variance of the input data on the right side of the split
* `right.rvariance`: residual variance of the input data on the right side of the split
* `left.rsquare`: r-square of the line on the left side of the split, see [series_fit_line()](query_language_series_fit_linefunction.md) or [series_fit_line_dynamic()](query_language_series_fit_line_dynamicfunction.md)
* `left.slope`: slope of the left approximated line (this is a from y=ax+b)
* `left.interception`: interception of the approximated left line (this is b from y=ax+b)
* `left.variance`: variance of the input data on the left side of the split
* `left.rvariance`: residual variance of the input data on the left side of the split

This operator is similar to [series_fit_2lines](query_language_series_fit_2linesfunction.md), but unlike `series_fit_2lines` it returns a dynamic bag.

**Syntax**

`series_fit_2lines_dynamic(`*x*`)`

**Arguments**

* *x*: Dynamic array of numeric values.  

**Important note**

Most convenient way of using this function is applying it to results of [make-series](query_language_make_seriesoperator.md) operator.

**Examples**

```
range x from 1 to 1 step 1
| project id=' ', x=range(bin(now(), 1h)-11h, bin(now(), 1h), 1h), y=dynamic([1,2.2, 2.5, 4.7, 5.0, 12, 10.3, 10.3, 9, 8.3, 6.2])
| extend LineFit=series_fit_line_dynamic(y).line_fit, LineFit2=series_fit_2lines_dynamic(y).line_fit
| project id, x, y, LineFit, LineFit2
| render timechart
```

![](./Images/samples/series_fit_2lines.png)
