---
title: series_moving_avg_udf() - Azure Data Explorer
description: This article describes series_moving_avg_udf() user-defined function in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 08/24/2020
---
# series_moving_avg_udf()

Applies a moving average filter on a series.

The function `series_moving_avg_udf()` takes an expression containing a dynamic numerical array as input and applies a [simple moving average](https://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) filter.

> [!NOTE]
> This function is a [UDF (User-Defined Function)](../query/functions/user-defined-functions.md).For more information, see [usage](#usage).

## Syntax

`series_moving_avg_ext(`*y_series*`,` *n*`, [`*center*`])`
  
## Arguments

* *y_series*: Dynamic array cell of numeric values.
* *n*: The width of the moving average filter.
* *center*: An optional Boolean value that indicates whether the moving average is one of the following options:
    * applied symmetrically on a window before and after the current point, or 
    * applied on a window from the current point backwards. 
    By default, *center* is False.

## Usage

* `series_moving_avg_udf()` is a User-Defined Function. You can either embed its code in your query, or install it in your database:
    * For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.
    * For recurring usage, persist it using [.create function](../management/create-function.md). 

    > [!NOTE]
    > Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

# [Ad hoc usage](#tab/adhoc)

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let series_moving_avg_sf = (y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
}
;
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_sf(num, 5, True)
| render timechart 
```

# [Persistent usage](#tab/persistent)

* **One-time installation**
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate moving average of specified width")
series_moving_avg_sf(y_series:dynamic, n:int, center:bool=false)
{
    series_fir(y_series, repeat(1, n), true, center)
}
```

* **Usage**
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
//
//  Moving average of 5 bins
//
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| extend num_ma=series_moving_avg_sf(num, 5, True)
| render timechart 
```

---

:::image type="content" source="images/series-moving-avg-udf/moving-average-five-bins.png" alt-text="Graph depicting moving average of 5 bins" border="false":::
