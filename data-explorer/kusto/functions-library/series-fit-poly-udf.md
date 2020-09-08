---
title: series_fit_poly_udf() - Azure Data Explorer
description: This article describes the series_fit_poly_udf() user-defined function in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 08/23/2020
---
# series_fit_poly_udf()

Applies a polynomial regression on a series.

The function `series_fit_poly_udf()` takes a table that contains multiple series (dynamic numerical array) and generates, for each series, the high-order polynomial that best fits it using [polynomial regression](https://en.wikipedia.org/wiki/Polynomial_regression). The function returns both the polynomial coefficients and the interpolated polynomial over the range of the series.

> [!NOTE]
>* This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.
>* This function is a [UDF (User Defined Function)](../query/functions/user-defined-functions.md). See [how to use it](#usage) below.
>* For linear regression of evenly spaced series (as created by [make-series operator](../query/make-seriesoperator.md)), use the native function [series_fit_line()](../query/series-fit-linefunction.md).

## Syntax

`T | invoke series_fit_poly_ext(`*y_series*`,` *y_fit_series*`,` *fit_coeff*`,` *degree*`, [`*x_series*`,` *x_istime*]`)`
  
## Arguments

* *y_series*: The name of the column (of the input table) containing the [dependent variable](https://en.wikipedia.org/wiki/Dependent_and_independent_variables). That is, the series to fit.
* *y_fit_series*: The name of the column to store the best fit series.
* *fit_coeff*: The name of the column to store the best fit polynomial coefficients.
* *degree*: The required order of the polynomial to fit. For example, 1 for linear regression, 2 for quadratic regression, and so on.
* *x_series*: The name of the column containing the [independent variable](https://en.wikipedia.org/wiki/Dependent_and_independent_variables), that is, the x or time axis. This parameter is optional, and is needed only for [unevenly spaced series](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series). Default is empty string, as x is redundant for regression of evenly spaced series.
* *x_istime*: This boolean parameter is optional. This parameter is needed only if *x_series* is specified and it's a vector of datetime.

## Usage

* `series_fit_poly_udf()` is a User-Defined Function. You can either embed its code in your query, or install it in your database:
    * For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.
    * For recurring usage, persist it using [.create function](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md)
* `series_fit_poly_udf()` is a [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md)

# [Ad hoc usage](#tab/adhoc)

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let series_fit_poly_ext=(tbl:(*), y_series:string, y_fit_series:string, fit_coeff:string, degree:int, x_series:string='', x_istime:bool=False)
{
    let kwargs = pack('y_series', y_series, 'y_fit_series', y_fit_series, 'fit_coeff', fit_coeff, 'degree', degree, 'x_series', x_series, 'x_istime', x_istime);
    let code=
        '\n'
        'y_series = kargs["y_series"]\n'
        'y_fit_series = kargs["y_fit_series"]\n'
        'fit_coeff = kargs["fit_coeff"]\n'
        'degree = kargs["degree"]\n'
        'x_series = kargs["x_series"]\n'
        'x_istime = kargs["x_istime"]\n'
        '\n'
        'def fit(ts_row, x_col, y_col, deg):\n'
        '    y = ts_row[y_col]\n'
        '    # if x column exists check whether its a time column. If so, convert it to numeric seconds, else take it as is. If there is no x column creates sequential numbers\n'
        '    if x_col == "":\n'
        '       x = np.arange(len(y))\n'
        '    else:\n'
        '       if x_istime:\n'
        '           x = pd.to_numeric(pd.to_datetime(ts_row[x_col]))/(1e9*60) #convert ticks to minutes\n'
        '           x = x - x.min()\n'
        '       else:\n'
        '           x = ts_row[x_col]\n'
        '    coeff = np.polyfit(x, y, deg)\n'
        '    p = np.poly1d(coeff)\n'
        '    z = p(x)\n'
        '    return z, coeff\n'
        '\n'
        'result = df\n'
        'if len(df):\n'
        '   result[[y_fit_series, fit_coeff]] = df.apply(fit, axis=1, args=(x_series, y_series, degree,), result_type="expand")\n'
    ;
    tbl
     | evaluate python(typeof(*), code, kwargs)
};
//
// Fit 5th order polynomial to a regular (evenly spaced) time series, created with make-series
//
let max_t = datetime(2016-09-03);
demo_make_series1
| make-series num=count() on TimeStamp from max_t-1d to max_t step 5m by OsVer
| extend fnum = dynamic(null), coeff=dynamic(null), fnum1 = dynamic(null), coeff1=dynamic(null)
| invoke series_fit_poly_ext('num', 'fnum', 'coeff', 5)
| render timechart with(ycolumns=num, fnum)
```

# [Persistent usage](#tab/persistent)

* **One time installation**
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Fit a polynomial of a specified degree to a series")
series_fit_poly_ext(tbl:(*), y_series:string, y_fit_series:string, fit_coeff:string, degree:int, x_series:string='', x_istime:bool=false)
{
    let kwargs = pack('y_series', y_series, 'y_fit_series', y_fit_series, 'fit_coeff', fit_coeff, 'degree', degree, 'x_series', x_series, 'x_istime', x_istime);
    let code=
        '\n'
        'y_series = kargs["y_series"]\n'
        'y_fit_series = kargs["y_fit_series"]\n'
        'fit_coeff = kargs["fit_coeff"]\n'
        'degree = kargs["degree"]\n'
        'x_series = kargs["x_series"]\n'
        'x_istime = kargs["x_istime"]\n'
        '\n'
        'def fit(ts_row, x_col, y_col, deg):\n'
        '    y = ts_row[y_col]\n'
        '    # if x column exists check whether its a time column. If so, convert it to numeric seconds, else take it as is. If there is no x column creates sequential numbers\n'
        '    if x_col == "":\n'
        '       x = np.arange(len(y))\n'
        '    else:\n'
        '       if x_istime:\n'
        '           x = pd.to_numeric(pd.to_datetime(ts_row[x_col]))/(1e9*60) #convert ticks to minutes\n'
        '           x = x - x.min()\n'
        '       else:\n'
        '           x = ts_row[x_col]\n'
        '    coeff = np.polyfit(x, y, deg)\n'
        '    p = np.poly1d(coeff)\n'
        '    z = p(x)\n'
        '    return z, coeff\n'
        '\n'
        'result = df\n'
        'if len(df):\n'
        '   result[[y_fit_series, fit_coeff]] = df.apply(fit, axis=1, args=(x_series, y_series, degree,), result_type="expand")\n'
    ;
    tbl
     | evaluate python(typeof(*), code, kwargs)
}
```

* **Usage**
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
//
// Fit 5th order polynomial to a regular (evenly spaced) time series, created with make-series
//
let max_t = datetime(2016-09-03);
demo_make_series1
| make-series num=count() on TimeStamp from max_t-1d to max_t step 5m by OsVer
| extend fnum = dynamic(null), coeff=dynamic(null), fnum1 = dynamic(null), coeff1=dynamic(null)
| invoke series_fit_poly_ext('num', 'fnum', 'coeff', 5)
| render timechart with(ycolumns=num, fnum)
```

---

:::image type="content" source="images/series-fit-poly-ext/series-fit-poly-ext-1.png" alt-text="Series fit polynomial 1" border="false":::

## Additional Examples

The following examples assume the function is already installed

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
//
//  Test irregular (unevenly spaced) time series
//
let max_t = datetime(2016-09-03);
demo_make_series1
| where TimeStamp between ((max_t-2d)..max_t)
| summarize num=count() by bin(TimeStamp, 5m), OsVer
| order by TimeStamp asc
| where hourofday(TimeStamp) % 6 != 0   //  delete every 6th hour to create unevenly spaced time series
| summarize TimeStamp=make_list(TimeStamp), num=make_list(num) by OsVer
| extend fnum = dynamic(null), coeff=dynamic(null)
| invoke series_fit_poly_ext('num', 'fnum', 'coeff', 8, 'TimeStamp', True)
| render timechart with(ycolumns=num, fnum)
```

:::image type="content" source="images/series-fit-poly-ext/series-fit-poly-ext-2.png" alt-text="Series fit polynomial 2" border="false":::

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
//
// 5th order polynomial with noise on x & y axes
//
range x from 1 to 200 step 1
| project x = rand()*5 - 2.3
| extend y = pow(x, 5)-8*pow(x, 3)+10*x+6
| extend y = y + (rand() - 0.5)*0.5*y
| order by x asc 
| summarize x=make_list(x), y=make_list(y)
| extend y_fit = dynamic(null), coeff=dynamic(null)
| invoke series_fit_poly_ext('y', 'y_fit', 'coeff', 5, 'x')
|fork (project-away coeff) (project coeff | mv-expand coeff)
| render linechart
```

:::image type="content" source="images/series-fit-poly-ext/series-fit-poly-ext-3.png" alt-text="Series fit polynomial 3" border="false":::
:::image type="content" source="images/series-fit-poly-ext/series-fit-poly-ext-4.png" alt-text="Series fit polynomial 4" border="false":::
