---
title: series_lag_fl() - Azure Data Explorer
description: This article describes series_lag_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/09/2022
---
# series_lag_fl()

Applies a lag on a series.

The function `series_lag_fl()` takes an expression containing a dynamic numerical array as input and shifts it backward. It's commonly used for shifting time series to test whether a pattern is new or it matches historical data.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_lag_fl(`*y_series*`,` *offset*`)`
  
## Arguments

* *y_series*: Dynamic array cell of numeric values.
* *offset*: An integer specifying the required offset in bins.

## Usage

`series_lag_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let series_lag_fl = (series:dynamic, offset:int)
{
    let lag_f = toscalar(range x from 1 to offset+1 step 1
    | project y=iff(x == offset+1, 1, 0)
    | summarize lag_filter = make_list(y));
    fir(series, lag_f, false)
}
;
//
let dt = 1h;
let time_shift = 1d;
let bins_shift = toint(time_shift/dt);
demo_make_series1
| make-series num=count() on TimeStamp step dt by OsVer
| extend num_shifted=series_lag_fl(num, bins_shift)
| render timechart
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function  with (folder = "Packages\\Series", docstring = "Shift a series by a specified offset")
series_lag_fl(series:dynamic, offset:int)
{
    let lag_f = toscalar(range x from 1 to offset+1 step 1
    | project y=iff(x == offset+1, 1, 0)
    | summarize lag_filter = make_list(y));
    fir(series, lag_f, false)
} 
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let dt = 1h;
let time_shift = 1d;
let bins_shift = toint(time_shift/dt);
demo_make_series1
| make-series num=count() on TimeStamp step dt by OsVer
| extend num_shifted=series_lag_fl(num, bins_shift)
| render timechart
```

---

:::image type="content" source="images/series-lag-fl/series-lag-1-day.png" alt-text="Graph of a time series shifted by one day." border="false":::
