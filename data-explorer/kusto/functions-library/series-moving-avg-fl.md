---
title: series_moving_avg_fl() - Azure Data Explorer
description: This article describes series_moving_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 09/08/2020
---
# series_moving_avg_fl()

Applies a moving average filter on a series.

The function `series_moving_avg_fl()` takes an expression containing a dynamic numerical array as input and applies a [simple moving average](https://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) filter.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_moving_avg_fl(`*y_series*`,` *n*`, [`*center*`])`
  
## Arguments

* *y_series*: Dynamic array cell of numeric values.
* *n*: The width of the moving average filter.
* *center*: An optional Boolean value that indicates whether the moving average is one of the following options:
    * applied symmetrically on a window before and after the current point, or 
    * applied on a window from the current point backwards. <br>
    By default, *center* is False.

## Usage

`series_moving_avg_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let series_moving_avg_fl = (y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
}
;
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_fl(num, 5, True)
| render timechart 
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate moving average of specified width")
series_moving_avg_fl(y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_fl(num, 5, True)
| render timechart 
```

---

:::image type="content" source="images/series-moving-avg-fl/moving-average-five-bins.png" alt-text="Graph depicting moving average of 5 bins." border="false":::
