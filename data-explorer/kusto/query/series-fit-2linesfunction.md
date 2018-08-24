# series-fit-2lines()

Applies two segments linear regression on a series, returning multiple columns.  

Takes an expression containing dynamic numerical array as input and applies [two segments linear regression](https://en.wikipedia.org/wiki/Segmented-regression) in order to identify and quantify trend change in a series. The function iterates on the series indexes and in each iteration splits the series to 2 parts, fits a separate line (using [series-fit-line()](series-fit-linefunction.md)) to each part and calculate the total r-square. The best split is the one that maximized r-square; the function returns its parameters:
* `rsquare`: [r-square](https://en.wikipedia.org/wiki/Coefficient-of-determination) is a standard measure of the fit quality. It's a number in the range [0-1], where 1 - is the best possible fit, and 0 means the data is totally unordered and do not fit any line
* `split-idx`: the index of breaking point to 2 segments (zero-based)
* `variance`: variance of the input data
* `rvariance`: residual variance which is the variance between the input data values the approximated ones (by the 2 line segments).
* `line-fit`: numerical array holding a series of values of the best fitted line. The series length is equal to the length of the input array. It is mainly used for charting.
* `right-rsquare`: r-square of the line on the right side of the split, see [series-fit-line()](series-fit-linefunction.md)
* `right-slope`: slope of the right approximated line (this is a from y=ax+b)
* `right-interception`: interception of the approximated left line (this is b from y=ax+b)
* `right-variance`: variance of the input data on the right side of the split
* `right-rvariance`: residual variance of the input data on the right side of the split
* `left-rsquare`: r-square of the line on the left side of the split, see [series-fit-line()](series-fit-linefunction.md)
* `left-slope`: slope of the left approximated line (this is a from y=ax+b)
* `left-interception`: interception of the approximated left line (this is b from y=ax+b)
* `left-variance`: variance of the input data on the left side of the split
* `left-rvariance`: residual variance of the input data on the left side of the split

*Note* that this function returns multiple columns therefore it cannot be used as an argument for another function.

**Syntax**

project `series-fit-2lines(`*x*`)`
* Will return all mentioned above columns with the following names: series-fit-2lines-x-rsquare, series-fit-2lines-x-split-idx and etc.
project (rs, si, v)=`series-fit-2lines(`*x*`)`
* Will return the following columns: rs (r-square), si (split index), v (variance) and the rest will look like series-fit-2lines-x-rvariance, series-fit-2lines-x-line-fit and etc.
extend (rs, si, v)=`series-fit-2lines(`*x*`)`
* Will return only: rs (r-square), si (split index) and v (variance).
  
**Arguments**

* *x*: Dynamic array of numeric values.  

**Important note**

Most convenient way of using this function is applying it to results of [make-series](make-seriesoperator.md) operator.

**Examples**

```kusto
range x from 1 to 1 step 1
| project id=' ', x=range(bin(now(), 1h)-11h, bin(now(), 1h), 1h), y=dynamic([1,2.2, 2.5, 4.7, 5.0, 12, 10.3, 10.3, 9, 8.3, 6.2])
| extend (Slope,Interception,RSquare,Variance,RVariance,LineFit)=series-fit-line(y), (RSquare2, SplitIdx, Variance2,RVariance2,LineFit2)=series-fit-2lines(y)
| project id, x, y, LineFit, LineFit2
| render timechart
```

![](./Images/samples/series-fit-2lines.png)


