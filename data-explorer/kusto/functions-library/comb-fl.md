---
title:  comb_fl()
description: This article describes comb_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/30/2023
---
# comb_fl()

Calculate *C(n, k)*

The function `comb_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates *C(n, k)*, the number of [combinations](https://en.wikipedia.org/wiki/Combination) for selection of k items out of n, without order. It's based on the native [gamma()](../query/gammafunction.md) function to calculate factorial. For more information, see [facorial_fl()](factorial-fl.md). For a selection of k items with order, use [perm_fl()](perm-fl.md).

## Syntax

`comb_fl(`*n*, *k*`)`
  
[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n*|int, long, or real|&check;|The total number of items.|
|*k*|int, long, or real|&check;|The selected number of items.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `comb_fl()`, see [Example](#example).

```kusto
let comb_fl=(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    let fact_k = gamma(k+1);
    tolong(fact_n/fact_nk/fact_k)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate number of combinations for selection of k items out of n items without order")
comb_fl(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    let fact_k = gamma(k+1);
    tolong(fact_n/fact_nk/fact_k)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WPwQrCMBBE7/sVc0zQorU3S7+lxJgESbKRNgdB/XdTWwjoXgb27Qw7wWToFC+jDYPg843zHn4RSU9CmVAOrNJ5ZAxwKkYleNfK/gf6Shv/zyuuMKeQ2InVf9hiVvWS3tTTpNgZMOyUIrpiQHvEnM0dHb1gHtnwFUs0N6e60N9ntlKCSx/5Abm0FffmAAAA" target="_blank">Run the query</a>

```kusto
let comb_fl=(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    let fact_k = gamma(k+1);
    tolong(fact_n/fact_nk/fact_k)
};
range n from 3 to 10 step 3
| extend k = n-2
| extend cnk = comb_fl(n, k)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
range n from 3 to 10 step 3
| extend k = n-2
| extend cnk = comb_fl(n, k)
```

---

**Output**

| n | k | cnk |
|---|---|-----|
| 3 | 1 |  3  |
| 6 | 4 |  15 |
| 9 | 7 |  36 |
