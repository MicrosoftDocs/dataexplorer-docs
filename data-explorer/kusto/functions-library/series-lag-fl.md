---
title: series_lag_fl() - Azure Data Explorer
description: This article describes series_lag_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_lag_fl()

Applies a lag on a series.

The function `series_lag_fl()` takes an expression containing a dynamic numerical array as input and shifts it backward. It's commonly used for shifting time series to test whether a pattern is new or it matches historical data.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_lag_fl(`*y_series*`,` *offset*`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *y_series* | dynamic | &check; | An array cell of numeric values.|
| *offset* | int | &check; | An integer specifying the required offset in bins.|

## Usage

`series_lag_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WRzW7DIBCE7zzFHo3qyvU1Ec/QQ6teLWKWhJYfC9ZS3Kbv3g1EaYu4MMynGRaPBAWzwzJ5fZysBwVdE3Zmizq4uYdkbUHauUhSfAng5RmrfrZTKrP2OndZxyPCGWxOAUbWb+DDCIVwgbGiF1hyeseZYFPO2u4MSt2NPfB+kjdjWUPQ2X1iy3KeMHNg0B84eVeo26TcV691+da6b94erPYFpfgWezEM4lrYEMPjaV8P5AJO5eRsFU0TDy6Wu0iJH9z9+gZDnGYwpKk2aHmjuNRCj+0IcQ1qTiuTElKEV8ZfSIeljYArHDZ4Lm+YmcMzYTRXpCWgUf/+ouOb/k8pyUxmgqdwrTWfdKYfkxiPZMEBAAA=" target="_blank">Run the query</a>

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

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

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
