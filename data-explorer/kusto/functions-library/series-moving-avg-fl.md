---
title: series_moving_avg_fl() - Azure Data Explorer
description: This article describes series_moving_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_moving_avg_fl()

Applies a moving average filter on a series.

The function `series_moving_avg_fl()` takes an expression containing a dynamic numerical array as input and applies a [simple moving average](https://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) filter.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_moving_avg_fl(`*y_series*`,` *n*`,` [ *center* ]`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*|dynamic|&check;|An array cell of numeric values.|
|*n*|int|&check;|The width of the moving average filter.|
|*center*|bool||Indicates whether the moving average is either applied symmetrically on a window before and after the current point or applied on a window from the current point backwards. By default, *center* is `false`.|

## Usage

`series_moving_avg_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PsU7EMAyG9zzFPzZS0KnDLUV9BMTAiTVKW7cX0SSV41ZUwLuTcgcTlhfr1/fZnkmQiT1lG9Lm42TdNtlxRotqt7ekGfbogu8NYuOjGPQUhbjpUprb0c2ZtPpQKHU3jZ7/YAOmhZxUdcG1gfBKvwatvtSjOp1KA08/6+E2YjcR0ogzOh/zkQ8Ukg3uje7SWn3iGB9uI+Ia2j6tUSqNFHHxgV7EhQVZaEF9RbfjOb8SF47eheJwIMXY/vd7VTKDs8Gl3KoLwgUghhRtf3Us3/KQTtk1AQAA" target="_blank">Run the query</a>

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

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

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
