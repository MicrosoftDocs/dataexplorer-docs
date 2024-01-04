---
title:  series_dbl_exp_smoothing_fl()
description: This article describes the series_dbl_exp_smoothing_fl() user-defined function in Azure Data Explorer.
ms.reviewer: joruales
ms.topic: reference
ms.date: 03/05/2023
---
# series_dbl_exp_smoothing_fl()

Applies a double exponential smoothing filter on a series.

The function `series_dbl_exp_smoothing_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a dynamic numerical array as input and applies a [double exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Double_exponential_smoothing) filter. When there is trend in the series, this function is superior to the [series_exp_smoothing_fl()](series-exp-smoothing-fl.md) function, which implements a [basic exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Basic_(simple)_exponential_smoothing_(Holt_linear)) filter.

## Syntax

`series_dbl_exp_smoothing_fl(`*y_series* [`,` *alpha* [`,` *beta* ]]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*|dynamic|&check;|An array of numeric values.|
|*alpha*|real||A value in the range [0-1] that specifies the weight of the last point vs. the weight of the previous points, which is `1 - alpha`. The default is 0.5.|
|*beta*|real||A value in the range [0-1] that specifies the weight of the last slope vs. the weight of the previous slopes, which is `1 - beta`. The default is 0.5.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_dbl_exp_smoothing_fl()`, see [Example](#example).

```kusto
let series_dbl_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Double exponential smoothing for a series")
series_dbl_exp_smoothing_fl(y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32Qza7CIBBG932KbwnammKuG02fhdB2tEQoDWBS7s+7S9V4bzd3Fiy+OXMyjKGIQF5TkH1rJM2TDNa5OOjxIs8GDViST+DYp1FZ3ZVQZhrUsXe31lBT7w4lWop/A158Fcj1Mmvt35YSk+quUnmvEnuIXr4NWySV4HyFiHdbbBeAV/sSonpknBc/p8Kr8UKYcfbOQiA6HGqESBNE8Q2aI409Uv7JjC0y3DO+EXVuhZu1yuvPZbiBVVeSRofI5rxBWiWJ/5rWZ5IL+M8BWSpR7/bL88GRLT47yMPokbpB+XgHMNFBGoEBAAA=" target="_blank">Run the query</a>

```kusto
let series_dbl_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5, beta:double=0.5)
{
    series_iir(y_series, pack_array(alpha, alpha*(beta-1)), pack_array(1, alpha*(1+beta)-2, 1-alpha))
};
range x from 1 to 50 step 1
| extend y = x + rand()*10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.2, 0.4) 
| render linechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
range x from 1 to 50 step 1
| extend y = x + rand()*10
| summarize x = make_list(x), y = make_list(y)
| extend dbl_exp_smooth_y = series_dbl_exp_smoothing_fl(y, 0.2, 0.4) 
| render linechart
```

---

**Output**

:::image type="content" source="images/series-dbl-exp-smoothing-fl/dbl-exp-smoothing-demo.png" alt-text="Graph showing double exponential smoothing of artificial series." border="false":::
