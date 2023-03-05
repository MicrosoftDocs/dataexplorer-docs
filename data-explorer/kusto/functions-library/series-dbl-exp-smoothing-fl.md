---
title: series_dbl_exp_smoothing_fl() - Azure Data Explorer
description: This article describes the series_dbl_exp_smoothing_fl() user-defined function in Azure Data Explorer.
ms.reviewer: joruales
ms.topic: reference
ms.date: 03/05/2023
---
# series_dbl_exp_smoothing_fl()

Applies a double exponential smoothing filter on a series.

The function `series_dbl_exp_smoothing_fl()` takes an expression containing a dynamic numerical array as input and applies a [double exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Double_exponential_smoothing) filter. When there is trend in the series, this function is superior to the [series_exp_smoothing_fl()](series-exp-smoothing-fl.md) function, which implements a [basic exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Basic_(simple)_exponential_smoothing_(Holt_linear)) filter.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_dbl_exp_smoothing_fl(`*y_series*`,` [ *alpha* ]`,` [ *beta* ]`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*|dynamic|&check;|An array of numeric values.|
|*alpha*|real||A value in the range [0-1] that specifies the weight of the last point vs. the weight of the previous points, which is `1 - alpha`. The default is 0.5.|
|*beta*|real||A value in the range [0-1] that specifies the weight of the last slope vs. the weight of the previous slopes, which is `1 - beta`. The default is 0.5.|

## Usage

`series_dbl_exp_smoothing_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XMMQ6DMAwF0N2n+GMilkZsoJwFWa2DIiUOSj1Eor07rLwDvCKGxG9rPXPZUolOl6zm6STcdq6VnU7B059W6qy7YCD1VhFgDeGFr8mBmX6QYaIfpIH4ON3wF7cGc3NnAAAA" target="_blank">Run the query</a>

```kusto
let series_dbl_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
}
;
range x from 1 to 50 step 1
| extend y = x + rand()*10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.2, 0.4) 
| render linechart
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Double exponential smoothing for a series")
series_dbl_exp_smoothing_fl(y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 50 step 1
| extend y = x + rand()*10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.2, 0.4) 
| render linechart
```

---

:::image type="content" source="images/series-dbl-exp-smoothing-fl/dbl-exp-smoothing-demo.png" alt-text="Graph showing double exponential smoothing of artificial series." border="false":::
