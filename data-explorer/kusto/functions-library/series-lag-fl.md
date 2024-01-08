---
title:  series_lag_fl()
description: This article describes series_lag_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# series_lag_fl()

Applies a lag on a series.

The function `series_lag_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a dynamic numerical array as input and shifts it backward. It's commonly used for shifting time series to test whether a pattern is new or it matches historical data.

## Syntax

`series_lag_fl(`*y_series*`,` *offset*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *y_series* | dynamic | &check; | An array cell of numeric values.|
| *offset* | int | &check; | An integer specifying the required offset in bins.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_lag_fl()`, see [Example](#example).

```kusto
let series_lag_fl = (series:dynamic, offset:int)
{
    let lag_f = toscalar(range x from 1 to offset+1 step 1
    | project y=iff(x == offset+1, 1, 0)
    | summarize lag_filter = make_list(y));
    fir(series, lag_f, false)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

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

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WRzW7DIBCE736KPRrVVetrIp6hh0a9WsQsCS0/Fqwlu03fvWuw0hZxYZhPMwsOCTImi3lw6jIYBxLaKhz0GpS3YwfRmIx0sIFE89UAL8dY8bOdYh6VU6lNKlwQFjApeuhZ38GHHjLhBH1BbzCl+I4jwSqtMe0CUt6NHfB+Frsxz96rZD+xZllHmDjQqw8cnM3UrkIci9fYtLfuqrcDo1xG0Xwfm62sJgb7az2Q9TjkqzVF1FU825DvIkUetv31PWniJI0+DiW9ZvXNrZR5rEcIs5djnJkUEAOcGH8l5ac6Plc4r/CS3zAxhwth0BtSE1DLf//Q8k33p5RgJjHBL7DVGq8q0Q9sViILvQEAAA==" target="_blank">Run the query</a>

```kusto
let series_lag_fl = (series:dynamic, offset:int)
{
    let lag_f = toscalar(range x from 1 to offset+1 step 1
    | project y=iff(x == offset+1, 1, 0)
    | summarize lag_filter = make_list(y));
    fir(series, lag_f, false)
};
let dt = 1h;
let time_shift = 1d;
let bins_shift = toint(time_shift/dt);
demo_make_series1
| make-series num=count() on TimeStamp step dt by OsVer
| extend num_shifted=series_lag_fl(num, bins_shift)
| render timechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

:::image type="content" source="images/series-lag-fl/series-lag-1-day.png" alt-text="Graph of a time series shifted by one day." border="false":::
