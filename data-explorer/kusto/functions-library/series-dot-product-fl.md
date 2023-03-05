---
title: series_dot_product_fl() - Azure Data Explorer
description: This article describes series_dot_product_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_dot_product_fl()

Calculates the dot product of two numerical vectors.

The function `series_dot_product_fl()` takes an expression containing two dynamic numerical arrays as input and calculates their [dot product](https://en.wikipedia.org/wiki/Dot_product).

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_dot_product_fl(`*vec1*`,` *vec2*`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*vec1*|dynamic|&check;|An array of numeric values.|
|*vec2*|dynamic|&check;|An array of numeric values that is the same length as *vec1*.|

## Usage

`series_dot_product_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32Q3WoCMRBG7/MUc5lAimQtvajskyyyaDKVSH6WbBIU7bt3VlctIubu+5JzJozDDCMmi2NvYu6HFE3Ruf9xLa+o1bc5ho23WgKl5pYEOzGg4whGh/6CQXsT+eKyHdzxYriSYnUHdPH9WPzjubWJ3y0S5hm8U2vxP8kPKmZPjiaWrUM+y7rpjv2u2GLBSrAxMD4kGzIoOANp96gzVNWmTdghpz8tJSiy12auPiV8TZWQ70lC1TOrCFZXmp0BDxmDgbpsX66V12kjjfgDPSnst3gBAAA=" target="_blank">Run the query</a>

```kusto
let series_dot_product_fl=(vec1:dynamic, vec2:dynamic)
{
    let elem_prod = series_multiply(vec1, vec2);
    let cum_sum = series_iir(elem_prod, dynamic([1]), dynamic([1,-1]));
    todouble(cum_sum[-1])
};
//
union
(print 1 | project v1=range(1, 3, 1), v2=range(4, 6, 1)),
(print 1 | project v1=range(11, 13, 1), v2=range(14, 16, 1))
| extend v3=series_dot_product_fl(v1, v2)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate the dot product of 2 numerical arrays")
series_dot_product_fl(vec1:dynamic, vec2:dynamic)
{
    let elem_prod = series_multiply(vec1, vec2);
    let cum_sum = series_iir(elem_prod, dynamic([1]), dynamic([1,-1]));
    todouble(cum_sum[-1])
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
union
(print 1 | project v1=range(1, 3, 1), v2=range(4, 6, 1)),
(print 1 | project v1=range(11, 13, 1), v2=range(14, 16, 1))
| extend v3=series_dot_product_fl(v1, v2)
```

---

:::image type="content" source="images/series-dot-product-fl/dot-product-result.png" alt-text="Table showing the result of dot product of 2 vectors using user-defined function series_dot_product_fl in Azure Data Explorer." border="false":::
