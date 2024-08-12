---
title:  series_exp_smoothing_fl()
description: This article describes series_exp_smoothing_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# series_exp_smoothing_fl()

Applies a basic exponential smoothing filter on a series.

The function `series_exp_smoothing_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a dynamic numerical array as input and applies a [basic exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing#Basic_(simple)_exponential_smoothing_(Holt_linear)) filter.

## Syntax

`series_exp_smoothing_fl(`*y_series* [`,` *alpha* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*y_series*| `dynamic` | :heavy_check_mark:|An array cell of numeric values.|
|*alpha*| `real` ||A value in the range [0-1] that specifies the weight of the last point vs. the weight of the previous points, which is `1 - alpha`. The default is 0.5.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_exp_smoothing_fl()`, see [Example](#example).

```kusto
let series_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5)
{
    series_iir(y_series, pack_array(alpha), pack_array(1, alpha-1))
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Basic exponential smoothing for a series")
series_exp_smoothing_fl(y_series:dynamic, alpha:double=0.5)
{
    series_iir(y_series, pack_array(alpha), pack_array(1, alpha-1))
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPzWrDMBCE73qKuRQscIMFzSXFzyK29iYWkWSzUkDqz7tXaUNDDt3j7H6zM54zEovjZLlsNoV1zYuLJ3v0GNFV+7s8zDVScFMP8ttCh3m9vHkeh91eqw+FNjcT5+QP6rHRdLYkQrX74fSDZG5uz0Zr9fWqhOKJUXCUNcAgr9gPSJk3GPUJLpnjjNpiFTzBDE1LlxBI3PuVGhHozNa7lLvSHtUHpeq7xb2ovR79U7+rPYbdi0YDpWEs8C7ytJDkb6qtG1o2AQAA" target="_blank">Run the query</a>

```kusto
let series_exp_smoothing_fl = (y_series:dynamic, alpha:double=0.5)
{
    series_iir(y_series, pack_array(alpha), pack_array(1, alpha-1))
};
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend exp_smooth_y = series_exp_smoothing_fl(y, 0.4) 
| render linechart
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
range x from 1 to 50 step 1
| extend y = x % 10
| summarize x = make_list(x), y = make_list(y)
| extend exp_smooth_y = series_exp_smoothing_fl(y, 0.4) 
| render linechart
```

---

**Output**

:::image type="content" source="media/series-exp-smoothing-fl/exp-smoothing-demo.png" alt-text="Graph showing exponential smoothing of artificial series." border="false":::
