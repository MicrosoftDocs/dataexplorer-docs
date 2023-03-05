---
title: series_exp_smoothing_fl() - Azure Data Explorer
description: This article describes series_exp_smoothing_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_exp_smoothing_fl()

Applies a basic exponential smoothing filter on a series.

The function `series_exp_smoothing_fl()` takes an expression containing a dynamic numerical array as input and applies a [basic exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Basic_(simple)_exponential_smoothing_(Holt_linear)) filter.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_exp_smoothing_fl(`*y_series* [`,` *alpha* ]`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*|dynamic|&check;|An array cell of numeric values.|
|*alpha*|real||A value in the range [0-1] that specifies the weight of the last point vs. the weight of the previous points, which is `1 - alpha`. The default is 0.5.|

## Usage

`series_exp_smoothing_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPzWrDMBCE73qKuRQscIMFzSXFzyK29iYWkWSzUkDqz7tXaUNDDt3j7H6zM54zEovjZLlsNoV1zYuLJ3v0GNFV+7s8zDVScFMP8ttCh3m9vHkeh91eqw+FNjcT5+QP6rHRdLYkQrX74fSDZG5uz0Zr9aVelVA8MQqOsgYY5BX7ASnzBqM+wSVznFFbroInmKFp6RICiXu/UiMCndl6l3JX2qf6oFR9t7g3tdejf/p3tcewe9FooDSMBd5FnhaS/A2UDARTNwEAAA==" target="_blank">Run the query</a>

```kusto
let series_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5)
{
    series_iir(y_series, pack_array(alpha), pack_array(1, alpha-1))
}
;
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend exp_smooth_y = series_exp_smoothing_fl(y, 0.4) 
| render linechart
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Basic exponential smoothing for a series")
series_exp_smoothing_fl(y_series:dynamic, alpha:double=0.5)
{
    series_iir(y_series, pack_array(alpha), pack_array(1, alpha-1))
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend exp_smooth_y = series_exp_smoothing_fl(y, 0.4) 
| render linechart
```

---

:::image type="content" source="images/series-exp-smoothing-fl/exp-smoothing-demo.png" alt-text="Graph showing exponential smoothing of artificial series." border="false":::
