---
title:  series_moving_var_fl()
description:  This article describes series_moving_var_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 05/23/2023
---
# series_moving_var_fl()

Applies a moving variance filter on a series.

The function `series_moving_var_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a dynamic numerical array as input and applies on it a moving variance filter.

## Syntax

`series_moving_var_fl(`*y_series*`,` *n* [`,` *center* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*| `dynamic` | :heavy_check_mark:|An array cell of numeric values.|
|*n*| `int` | :heavy_check_mark:|The width of the moving variance filter.|
|*center*| `bool` ||Indicates whether the moving variance is either applied symmetrically on a window before and after the current point or applied on a window from the current point backwards. By default, *center* is `false`.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_moving_var_fl()`, see [Example](#example).

```kusto
let series_moving_var_fl = (y_series:dynamic, n:int, center:bool=false)
{
    let ey = series_fir(y_series, repeat(1, n), true, center);
    let e2y = series_multiply(ey, ey);
    let y2 = series_multiply(y_series, y_series);
    let ey2 = series_fir(y2, repeat(1, n), true, center);
    let var_series = series_subtract(ey2, e2y);
    var_series
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate moving variance of specified width")
series_moving_var_fl(y_series:dynamic, n:int, center:bool=false)
{
    let ey = series_fir(y_series, repeat(1, n), true, center);
    let e2y = series_multiply(ey, ey);
    let y2 = series_multiply(y_series, y_series);
    let ey2 = series_fir(y2, repeat(1, n), true, center);
    let var_series = series_subtract(ey2, e2y);
    var_series
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42T3W6jMBBG73mKubQpTYG0UpXIb5F75MAktWpsZJsE73bffYcSElSlarnyz3fOjC2jMYBHp9BXrT0pc6xO0lUHDQJYrKadTRONbFWdgdkoEzKo0QR0m721Whyk9siTvwnQp8mGkdiL8qDc1ZKBww5lYAV5eAbB9Tir+PaGlwu+7XVQnY4MY0biRSyWd1K3UvNoKV4in42Vv2xpvJGJuwl8vw9O1oE6Iw01fcnfssm/ZJuMuFcGz/KEgg2bxvZ7TTU6itjmOj1KZS4TUaxy2n+THueVfJXPFzwGUxKyMu0U40+TJ2XDwyfB+bWqEUX5Og13osin0VmZxp7FLi23SW+UNQlz0hwRBjg420IOwYJ5LMAH7KCAD8AhoGkgivkUbMhgx3n2hTQjWab32fEAXwHKjsj6G+SHcuuJfv6GZsPjepWnhj/RJdwp/jzhL78rnnyAdQ062EcSSF8Drfi+baVTf8gpWvmOlVY+sIFeUVzM4wjP3vHXEvd+Nkavezc9vzHvKE3VNHVRv0kX/gMOVfCqpAMAAA==" target="_blank">Run the query</a>

```kusto
let series_moving_var_fl = (y_series:dynamic, n:int, center:bool=false)
{
    let ey = series_fir(y_series, repeat(1, n), true, center);
    let e2y = series_multiply(ey, ey);
    let y2 = series_multiply(y_series, y_series);
    let ey2 = series_fir(y2, repeat(1, n), true, center);
    let var_series = series_subtract(ey2, e2y);
    var_series
}
;
let sinewave=(x:double, period:double, gain:double=1.0, phase:double=0.0)
{
    gain*sin(2*pi()/period*(x+phase))
}
;
let n=128;
let T=10;
let window=T*2;
union
(range x from 0 to n-1 step 1 | extend y=sinewave(x, T)),
(range x from n to 2*n-1 step 1 | extend y=0.0),
(range x from 2*n to 3*n-1 step 1 | extend y=sinewave(x, T)),
(range x from 3*n to 4*n-1 step 1 | extend y=(x-3.0*n)/128.0),
(range x from 4*n to 5*n-1 step 1 | extend y=sinewave(x, T))
| order by x asc 
| summarize x=make_list(x), y=make_list(y)
| extend y_var=series_moving_var_fl(y, T, true)
| render linechart  
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let sinewave=(x:double, period:double, gain:double=1.0, phase:double=0.0)
{
    gain*sin(2*pi()/period*(x+phase))
}
;
let n=128;
let T=10;
let window=T*2;
union
(range x from 0 to n-1 step 1 | extend y=sinewave(x, T)),
(range x from n to 2*n-1 step 1 | extend y=0.0),
(range x from 2*n to 3*n-1 step 1 | extend y=sinewave(x, T)),
(range x from 3*n to 4*n-1 step 1 | extend y=(x-3.0*n)/128.0),
(range x from 4*n to 5*n-1 step 1 | extend y=sinewave(x, T))
| order by x asc 
| summarize x=make_list(x), y=make_list(y)
| extend y_var=series_moving_var_fl(y, T, true)
| render linechart
```

---

**Output**

:::image type="content" source="media/series-moving-var-fl/series-moving-var-sine-wave.png" alt-text="Graph depicting moving variance applied over a sine wave." border="false":::
