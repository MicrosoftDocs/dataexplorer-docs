---
title: series_dot_product_fl() - Azure Data Explorer
description: This article describes series_dot_product_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 10/18/2020
---
# series_dot_product_fl()

Calculates the dot product of two numerical vectors.

The function `series_dot_product_fl()` takes an expression containing two dynamic numerical arrays as input and calculates their [dot product](https://en.wikipedia.org/wiki/Dot_product).

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`series_dot_product_fl(`*vec1*`,` *vec2*`)`
  
## Arguments

* *vec1*: Dynamic array cell of numeric values.
* *vec2*: Dynamic array cell of numeric values, same length as *vec1*.

## Usage

`series_dot_product_fl()` is a user-defined function. You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
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

# [Persistent](#tab/persistent)

For persistent usage, use [.create function](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
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

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
union
(print 1 | project v1=range(1, 3, 1), v2=range(4, 6, 1)),
(print 1 | project v1=range(11, 13, 1), v2=range(14, 16, 1))
| extend v3=series_dot_product_fl(v1, v2)
```

---

:::image type="content" source="images/series-dot-product-fl/dot-product-result.png" alt-text="Table showing the result of dot product of 2 vectors using user-defined function series_dot_product_fl in Azure Data Explorer" border="false":::
