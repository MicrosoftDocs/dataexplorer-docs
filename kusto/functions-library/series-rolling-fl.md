---
title:  series_rolling_fl()
description:  This article describes the series_rolling_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# series_rolling_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `series_rolling_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that applies rolling aggregation on a series. It takes a table containing multiple series (dynamic numerical array) and applies, for each series, a rolling aggregation function.

[!INCLUDE [python-zone-pivot-fabric](../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke series_rolling_fl(`*y_series*`,` *y_rolling_series*`,` *n*`,` *aggr*`,` *aggr_params*`,` *center*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *y_series* | `string` |  :heavy_check_mark: | The name of the column that contains the series to fit.|
| *y_rolling_series* | `string` |  :heavy_check_mark: | The name of the column to store the rolling aggregation series.|
| *n* | `int` |  :heavy_check_mark: | The width of the rolling window.|
| *aggr* | `string` |  :heavy_check_mark: | The name of the aggregation function to use. See [aggregation functions](#aggregation-functions).|
| *aggr_params* | `string` | | Optional parameters for the aggregation function.|
| *center* | `bool` | |Indicates whether the rolling window is applied symmetrically before and after the current point or applied from the current point backwards. By default, *center* is `false`, for calculation on streaming data.|

## Aggregation functions

This function supports any aggregation function from [numpy](https://numpy.org/) or [scipy.stats](https://docs.scipy.org/doc/scipy/reference/stats.html#module-scipy.stats) that calculates a scalar out of a series. The following list isn't exhaustive:

* [`sum`](https://numpy.org/doc/stable/reference/generated/numpy.sum.html#numpy.sum)
* [`mean`](https://numpy.org/doc/stable/reference/generated/numpy.mean.html?highlight=mean#numpy.mean)
* [`min`](https://numpy.org/doc/stable/reference/generated/numpy.amin.html#numpy.amin)
* [`max`](https://numpy.org/doc/stable/reference/generated/numpy.amax.html)
* [`ptp (max-min)`](https://numpy.org/doc/stable/reference/generated/numpy.ptp.html)
* [`percentile`](https://numpy.org/doc/stable/reference/generated/numpy.percentile.html)
* [`median`](https://numpy.org/doc/stable/reference/generated/numpy.median.html)
* [`std`](https://numpy.org/doc/stable/reference/generated/numpy.std.html)
* [`var`](https://numpy.org/doc/stable/reference/generated/numpy.var.html)
* [`gmean` (geometric mean)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gmean.html)
* [`hmean` (harmonic mean)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.hmean.html)
* [`mode` (most common value)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mode.html)
* [`moment` (n<sup>th</sup> moment)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.moment.html)
* [`tmean` (trimmed mean)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tmean.html)
* [`tmin`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tmin.html)
* [`tmax`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tmax.html)
* [`tstd`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tstd.html)
* [`iqr` (inter quantile range)](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.iqr.html)

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_rolling_fl()`, see [Examples](#examples).

```kusto
let series_rolling_fl = (tbl:(*), y_series:string, y_rolling_series:string, n:int, aggr:string, aggr_params:dynamic=dynamic([null]), center:bool=true)
{
    let kwargs = bag_pack('y_series', y_series, 'y_rolling_series', y_rolling_series, 'n', n, 'aggr', aggr, 'aggr_params', aggr_params, 'center', center);
    let code = ```if 1:
        y_series = kargs["y_series"]
        y_rolling_series = kargs["y_rolling_series"]
        n = kargs["n"]
        aggr = kargs["aggr"]
        aggr_params = kargs["aggr_params"]
        center = kargs["center"]
        result = df
        in_s = df[y_series]
        func = getattr(np, aggr, None)
        if not func:
            import scipy.stats
            func = getattr(scipy.stats, aggr)
        if func:
            result[y_rolling_series] = list(pd.Series(in_s[i]).rolling(n, center=center, min_periods=1).apply(func, args=aggr_params).values for i in range(len(in_s)))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Examples](#examples).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Rolling window functions on a series")
series_rolling_fl(tbl:(*), y_series:string, y_rolling_series:string, n:int, aggr:string, aggr_params:dynamic, center:bool=true)
{
    let kwargs = bag_pack('y_series', y_series, 'y_rolling_series', y_rolling_series, 'n', n, 'aggr', aggr, 'aggr_params', aggr_params, 'center', center);
    let code = ```if 1:
        y_series = kargs["y_series"]
        y_rolling_series = kargs["y_rolling_series"]
        n = kargs["n"]
        aggr = kargs["aggr"]
        aggr_params = kargs["aggr_params"]
        center = kargs["center"]
        result = df
        in_s = df[y_series]
        func = getattr(np, aggr, None)
        if not func:
            import scipy.stats
            func = getattr(scipy.stats, aggr)
        if func:
            result[y_rolling_series] = list(pd.Series(in_s[i]).rolling(n, center=center, min_periods=1).apply(func, args=aggr_params).values for i in range(len(in_s)))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
```

---
## Examples

The following examples use the [invoke operator](../query/invoke-operator.md) to run the function.

### Calculate rolling median of 9 elements

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let series_rolling_fl = (tbl:(*), y_series:string, y_rolling_series:string, n:int, aggr:string, aggr_params:dynamic=dynamic([null]), center:bool=true)
{
    let kwargs = bag_pack('y_series', y_series, 'y_rolling_series', y_rolling_series, 'n', n, 'aggr', aggr, 'aggr_params', aggr_params, 'center', center);
    let code = ```if 1:
        y_series = kargs["y_series"]
        y_rolling_series = kargs["y_rolling_series"]
        n = kargs["n"]
        aggr = kargs["aggr"]
        aggr_params = kargs["aggr_params"]
        center = kargs["center"]
        result = df
        in_s = df[y_series]
        func = getattr(np, aggr, None)
        if not func:
            import scipy.stats
            func = getattr(scipy.stats, aggr)
        if func:
            result[y_rolling_series] = list(pd.Series(in_s[i]).rolling(n, center=center, min_periods=1).apply(func, args=aggr_params).values for i in range(len(in_s)))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
//
//  Calculate rolling median of 9 elements
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend rolling_med = dynamic(null)
| invoke series_rolling_fl('num', 'rolling_med', 9, 'median')
| render timechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
//  Calculate rolling median of 9 elements
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend rolling_med = dynamic(null)
| invoke series_rolling_fl('num', 'rolling_med', 9, 'median', dynamic([null]))
| render timechart
```

---

**Output**

:::image type="content" source="media/series-rolling-fl/rolling-median-9.png" alt-text="Graph depicting rolling median of 9 elements." border="false":::

### Calculate rolling min, max & 75th percentile of 15 elements

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let series_rolling_fl = (tbl:(*), y_series:string, y_rolling_series:string, n:int, aggr:string, aggr_params:dynamic=dynamic([null]), center:bool=true)
{
    let kwargs = bag_pack('y_series', y_series, 'y_rolling_series', y_rolling_series, 'n', n, 'aggr', aggr, 'aggr_params', aggr_params, 'center', center);
    let code = ```if 1:
        y_series = kargs["y_series"]
        y_rolling_series = kargs["y_rolling_series"]
        n = kargs["n"]
        aggr = kargs["aggr"]
        aggr_params = kargs["aggr_params"]
        center = kargs["center"]
        result = df
        in_s = df[y_series]
        func = getattr(np, aggr, None)
        if not func:
            import scipy.stats
            func = getattr(scipy.stats, aggr)
        if func:
            result[y_rolling_series] = list(pd.Series(in_s[i]).rolling(n, center=center, min_periods=1).apply(func, args=aggr_params).values for i in range(len(in_s)))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
//
//  Calculate rolling min, max & 75th percentile of 15 elements
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend rolling_min = dynamic(null), rolling_max = dynamic(null), rolling_pct = dynamic(null)
| invoke series_rolling_fl('num', 'rolling_min', 15, 'min', dynamic([null]))
| invoke series_rolling_fl('num', 'rolling_max', 15, 'max', dynamic([null]))
| invoke series_rolling_fl('num', 'rolling_pct', 15, 'percentile', dynamic([75]))
| render timechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
//  Calculate rolling min, max & 75th percentile of 15 elements
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend rolling_min = dynamic(null), rolling_max = dynamic(null), rolling_pct = dynamic(null)
| invoke series_rolling_fl('num', 'rolling_min', 15, 'min', dynamic([null]))
| invoke series_rolling_fl('num', 'rolling_max', 15, 'max', dynamic([null]))
| invoke series_rolling_fl('num', 'rolling_pct', 15, 'percentile', dynamic([75]))
| render timechart
```

---

**Output**

:::image type="content" source="media/series-rolling-fl/graph-rolling-15.png" alt-text="Graph depicting rolling min, max & 75th percentile of 15 elements." border="false":::

### Calculate the rolling trimmed mean

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let series_rolling_fl = (tbl:(*), y_series:string, y_rolling_series:string, n:int, aggr:string, aggr_params:dynamic=dynamic([null]), center:bool=true)
{
    let kwargs = bag_pack('y_series', y_series, 'y_rolling_series', y_rolling_series, 'n', n, 'aggr', aggr, 'aggr_params', aggr_params, 'center', center);
    let code = ```if 1:
        y_series = kargs["y_series"]
        y_rolling_series = kargs["y_rolling_series"]
        n = kargs["n"]
        aggr = kargs["aggr"]
        aggr_params = kargs["aggr_params"]
        center = kargs["center"]
        result = df
        in_s = df[y_series]
        func = getattr(np, aggr, None)
        if not func:
            import scipy.stats
            func = getattr(scipy.stats, aggr)
        if func:
            result[y_rolling_series] = list(pd.Series(in_s[i]).rolling(n, center=center, min_periods=1).apply(func, args=aggr_params).values for i in range(len(in_s)))
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
range x from 1 to 100 step 1
| extend y=iff(x % 13 == 0, 2.0, iff(x % 23 == 0, -2.0, rand()))
| summarize x=make_list(x), y=make_list(y)
| extend yr = dynamic(null)
| invoke series_rolling_fl('y', 'yr', 7, 'tmean', pack_array(pack_array(-2, 2), pack_array(false, false))) //  trimmed mean: ignoring values outside [-2,2] inclusive
| render linechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
range x from 1 to 100 step 1
| extend y=iff(x % 13 == 0, 2.0, iff(x % 23 == 0, -2.0, rand()))
| summarize x=make_list(x), y=make_list(y)
| extend yr = dynamic(null)
| invoke series_rolling_fl('y', 'yr', 7, 'tmean', pack_array(pack_array(-2, 2), pack_array(false, false))) //  trimmed mean: ignoring values outside [-2,2] inclusive
| render linechart
```

---

**Output**

:::image type="content" source="media/series-rolling-fl/rolling-trimmed-mean.png" alt-text="Graph depicting rolling trimmed mean." border="false":::

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
