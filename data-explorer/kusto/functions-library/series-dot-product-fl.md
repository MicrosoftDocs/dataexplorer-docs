---
title:  series_dot_product_fl()
description: This article describes series_dot_product_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# series_dot_product_fl()

Calculates the dot product of two numerical vectors.

The function `series_dot_product_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing two dynamic numerical arrays as input and calculates their [dot product](https://en.wikipedia.org/wiki/Dot_product).

> [!NOTE]
>
> Use the native function [series_dot_product()](../query/series-dot-product-function.md) instead of the function described in this document. The native function provides the same functionality and is better for performance and scalability. This document is provided for reference purposes only.

## Syntax

`series_dot_product_fl(`*vec1*`,` *vec2*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*vec1*| `dynamic` | :heavy_check_mark:|An array of numeric values.|
|*vec2*| `dynamic` | :heavy_check_mark:|An array of numeric values that is the same length as *vec1*.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_dot_product_fl()`, see [Example](#example).

```kusto
let series_dot_product_fl=(vec1:dynamic, vec2:dynamic)
{
    let elem_prod = series_multiply(vec1, vec2);
    let cum_sum = series_iir(elem_prod, dynamic([1]), dynamic([1,-1]));
    todouble(cum_sum[-1])
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate the dot product of 2 numerical arrays")
series_dot_product_fl(vec1:dynamic, vec2:dynamic)
{
    let elem_prod = series_multiply(vec1, vec2);
    let cum_sum = series_iir(elem_prod, dynamic([1]), dynamic([1,-1]));
    todouble(cum_sum[-1])
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32Qy4oDIRBF935FLRXMwk7IIqG/JAxNRivBwUdjq0yYzL9P9SMPwhB39+o5JeUww4DJ4tCZmLs+RVN07k6u5RW12plLOHqrJVBqbkmwHwZ0HMHo0E8YtDeRLy7b3l0mw0yK/R3QxXdD8Y/n1iZ+t0hYZvCD+hDPSa6oWDw5mlg+HfJFdhjv2O+elWBjYLxPNmRQcAVyfqHOUFWbjuGMnD60lqBIXZul2kjYjpWQ70lC1SurCFYzza6A3xmDgbpu/90pr+M6GvEHdvJymnUBAAA=" target="_blank">Run the query</a>

```kusto
let series_dot_product_fl=(vec1:dynamic, vec2:dynamic)
{
    let elem_prod = series_multiply(vec1, vec2);
    let cum_sum = series_iir(elem_prod, dynamic([1]), dynamic([1,-1]));
    todouble(cum_sum[-1])
};
union
(print 1 | project v1=range(1, 3, 1), v2=range(4, 6, 1)),
(print 1 | project v1=range(11, 13, 1), v2=range(14, 16, 1))
| extend v3=series_dot_product_fl(v1, v2)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
union
(print 1 | project v1=range(1, 3, 1), v2=range(4, 6, 1)),
(print 1 | project v1=range(11, 13, 1), v2=range(14, 16, 1))
| extend v3=series_dot_product_fl(v1, v2)
```

---

**Output**

:::image type="content" source="media/series-dot-product-fl/dot-product-result.png" alt-text="Table showing the result of dot product of 2 vectors using user-defined function series_dot_product_fl." border="false":::
