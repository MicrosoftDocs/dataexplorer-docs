---
title: series_cosine_similarity_fl() - Azure Data Explorer
description: This article describes series_cosine_similarity_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 05/08/2023
---
# series_cosine_similarity_fl()

Calculates the cosine similarity of two numerical vectors.

The function `series_cosine_similarity_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing two dynamic numerical arrays as input and calculates their [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity).

## Syntax

`series_cosine_similarity_fl(`*vec1*`,` *vec2*`,` [ *vec1_size* [`,` *vec2_size* ]]`)`

[!INCLUDE [syntax-conventions-note](includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*vec1*|dynamic|&check;|An array of numeric values.|
|*vec2*|dynamic|&check;|An array of numeric values that is the same length as *vec1*.|
|*vec1_size*|real| |The size of *vec1*. This is equivalent to the square root of the dot product of the vector with itself.|
|*vec2_size*|real| |The size of *vec2*.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `series_cosine_similarity_fl()`, see [Example](#example).

```kusto
let series_cosine_similarity_fl=(vec1:dynamic, vec2:dynamic, vec1_size:real=double(null), vec2_size:real=double(null))
{
    let dp = series_dot_product(vec1, vec2);
    let v1l = iff(isnull(vec1_size), sqrt(series_dot_product(vec1, vec1)), vec1_size);
    let v2l = iff(isnull(vec2_size), sqrt(series_dot_product(vec2, vec2)), vec2_size);
    dp/(v1l*v2l)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Calculate the Cosine similarity of 2 numerical arrays")
series_cosine_similarity_fl(vec1:dynamic, vec2:dynamic, vec1_size:real=double(null), vec2_size:real=double(null))
{
    let dp = series_dot_product(vec1, vec2);
    let v1l = iff(isnull(vec1_size), sqrt(series_dot_product(vec1, vec1)), vec1_size);
    let v2l = iff(isnull(vec2_size), sqrt(series_dot_product(vec2, vec2)), vec2_size);
    dp/(v1l*v2l)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42R0WoDIRBF3/0KH8clkGihD1n8FrHqhqHGteoGtqX/nkmyCVtKQ30b7vXcO0wMjddQMFTjxoopmIpHjLZgm80QNZyCk3s/J3tEt+E0qR+TJP9n2Jdgo/bj9BYDpClGcbP+IQr2xTi9SOE+c31v4Mdmchn95No19wYR/cN8kpHcOAyA9UKCRwMKrB+lwTOSFGLVeY1Vv7HqH1i1FFxvu2B93gK17Qgt2HfPLjFV6mzdu7Gl2Bl2Gy7FIqi1cA1U92Si9ywXTI3bdIhBW7oTPDkZVNq20rctqC4jCNG9vO7OCmRtfegBAAA=" target="_blank">Run the query</a>

```kusto
let series_cosine_similarity_fl=(vec1:dynamic, vec2:dynamic, vec1_size:real=double(null), vec2_size:real=double(null))
{
    let dp = series_dot_product(vec1, vec2);
    let v1l = iff(isnull(vec1_size), sqrt(series_dot_product(vec1, vec1)), vec1_size);
    let v2l = iff(isnull(vec2_size), sqrt(series_dot_product(vec2, vec2)), vec2_size);
    dp/(v1l*v2l)
};
let s1=pack_array(0, 1);
let s2=pack_array(sqrt(2), sqrt(2));
print angle=acos(series_cosine_similarity_fl(s1, s2))/(2*pi())*360
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let s1=pack_array(0, 1);
let s2=pack_array(sqrt(2), sqrt(2));
print angle=acos(series_cosine_similarity_fl(s1, s2))/(2*pi())*360
```

---

**Output**

| angle |
|--|
| 45 |
