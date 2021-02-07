---
title: series_dbl_exp_smoothing_fl() - Azure Data Explorer
description: This article describes the series_dbl_exp_smoothing_fl() user-defined function in Azure Data Explorer.
author: jruales
ms.author: joruales
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 02/06/2021
---
# series_dbl_exp_smoothing_fl()

Applies a double exponential smoothing filter on a series.

The function `series_dbl_exp_smoothing_fl()` takes an expression containing a dynamic numerical array as input and applies a [double exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Double_exponential_smoothing) filter.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_dbl_exp_smoothing_fl(`*y_series*`, [`*alpha*`, `*beta*`])`
  
## Arguments

* *y_series*: Dynamic array cell of numeric values.
* *alpha*: An optional real value in the range [0-1], specifying the weight of the last point vs. the weight of the previous points (which is `1-alpha`). Default is 0.5.
  * A smaller value will cause the result to be smoother, whereas a larger value will make the result closer to the original series.
* *beta*: An optional real value in the range [0-1], specifying the weight of the last slope vs. the weight of the previous slopes (which is `1-beta`). Default is 0.5.
  * A smaller value will cause the result to have more "momentum", and a larger value will cause less "momentum".

## Usage

`series_dbl_exp_smoothing_fl()` is a user-defined function. You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let series_dbl_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
}
;
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.4, 0.4) 
| render linechart
```

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Double exponential smoothing for a series")
series_dbl_exp_smoothing_fl(y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
}
```

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.4, 0.4) 
| render linechart
```

---

:::image type="content" source="images/series-exp-smoothing-fl/dbl-exp-smoothing-demo.png" alt-text="Graph showing double exponential smoothing of artificial series" border="false":::
