---
title: series_fit_poly() - Azure Data Explorer
description: This article describes the series_fit_poly() in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 09/21/2020
---
# series_fit_poly()

The function `series_fit_poly()` applies a polynomial regression from an independent variable (x_series) to a dependent variable (y_series). It takes a table that contains multiple series (dynamic numerical array) and generates, for each series, the high-order polynomial that best fits it using [polynomial regression](https://en.wikipedia.org/wiki/Polynomial_regression). The function generates the following columns:
* `rsquare`: [r-square](https://en.wikipedia.org/wiki/Coefficient_of_determination) is a standard measure of the fit quality. The value's a number in the range [0-1], where 1 - is the best possible fit, and 0 means the data is unordered and doesn't fit any line.
* `coefficients`:  Numerical array holding the coefficients of the best fitted polynomial with the given degree, ordered from the highest power coefficient to the lowest.
* `variance`: Variance of the dependent variable (y_series).
* `rvariance`: Residual variance that is the variance between the input data values the approximated ones.
* `poly_fit`: Numerical array holding a series of values of the best fitted polynom. The series length is equal to the length of the dependent variable (y_series). The value's used for charting.

> [!TIP]
> * For linear regression of an evenly spaced series, as created by [make-series operator](make-seriesoperator.md), you can use use the simpler function [series_fit_line()](series-fit-linefunction.md). See 2<sup>nd</sup> example below.
> * If *x_series* is supplied, and regression is done for high degree, consider normalize it to [0-1] range. See 3<sup>rd</sup> example below.
> * If *x_series* is of datetime type, it must be converted to double and normalized. See same example below.
> * See [series_fit_poly_fl()](../functions-library/series-fit-poly-fl.md) for reference implementation of polynomial regression using inline Python.

## Syntax

`T | extend  series_fit_poly(`*y_series*`, `*x_series*`, `*degree*`)`
  
## Arguments

* *y_series*: Dynamic numerical array containing the [dependent variable](https://en.wikipedia.org/wiki/Dependent_and_independent_variables).
* *x_series*: Dynamic numerical array containing the [independent variable](https://en.wikipedia.org/wiki/Dependent_and_independent_variables). This parameter is optional, and is needed only for [unevenly spaced series](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series). If not given, it is set to default value of [1,2, ..., length(y_series)].
* *degree*: The required order of the polynomial to fit. For example, 1 for linear regression, 2 for quadratic regression, and so on. This parameter is optional, defaults to 1 (linear regression).

## Examples

1. 5<sup>th</sup> order polynomial with noise on x & y axes:
    <!-- csl: https://help.kusto.windows.net:443/Samples -->
    ```kusto
    range x from 1 to 200 step 1
    | project x = rand()*5 - 2.3
    | extend y = pow(x, 5)-8*pow(x, 3)+10*x+6
    | extend y = y + (rand() - 0.5)*0.5*y
    | summarize x=make_list(x), y=make_list(y)
    | extend series_fit_poly(y, x, 5)
    | project-rename fy=series_fit_poly_y_poly_fit, coeff=series_fit_poly_y_coefficients
    |fork (project x, y, fy) (project-away x, y, fy)
    | render linechart 
    ```
    :::image type="content" source="images/series-fit-poly-function/fifth-order-noise-1.png" alt-text="Graph showing 5th order polynomial fit to a series with noise" border="false":::
    :::image type="content" source="images/series-fit-poly-function/fifth-order-noise-table-1.png" alt-text="Coefficients of fifth order polynomial fit to  a series with noise" border="false":::
    
1. Verify that series_fit_poly with degree=1 matches series_fit_line
    <!-- csl: https://help.kusto.windows.net:443/Samples -->
    ```kusto
    demo_series1
    | extend series_fit_line(y)
    | extend series_fit_poly(y)
    | project-rename y_line = series_fit_line_y_line_fit, y_poly = series_fit_poly_y_poly_fit
    | fork (project x, y, y_line, y_poly) (project-away id, x, y, y_line, y_poly) 
    | render linechart with(xcolumn=x, ycolumns=y, y_line, y_poly)
    ```
    :::image type="content" source="images/series-fit-poly-function/fit-poly-line.png" alt-text="Graph showing linear regression" border="false":::
    :::image type="content" source="images/series-fit-poly-function/fit-poly-line-table.png" alt-text="Coefficients of linear regression" border="false":::
    
1. Irregular (unevenly spaced) time series:
    <!-- csl: https://help.kusto.windows.net:443/Samples -->
    ```kusto
    //
    //  x-axis must be normalized to the range [0-1] if either degree is relatively big (>= 5) or original x range is big.
    //  so if x is a time axis it must be normalized as conversion of timestamp to long generate huge numbers (number of 100 nano-sec ticks from 1/1/1970)
    //
    //  Normalization: x_norm = (x - min(x))/(max(x) - min(x))
    //
    irregular_ts
    | extend x = series_divide(series_subtract(TimeStamp, tolong(TimeStamp[0])), tolong(TimeStamp[-1])-tolong(TimeStamp[0])) // normalize time axis to [0-1] range
    | extend series_fit_poly(num, x, 8)
    | project-rename fnum=series_fit_poly_num_poly_fit
    | render timechart with(ycolumns=num, fnum)
    ```
    :::image type="content" source="images/series-fit-poly-function/irregular-time-series-1.png" alt-text="Graph showing eighth order polynomial fit to an irregular time series" border="false":::
