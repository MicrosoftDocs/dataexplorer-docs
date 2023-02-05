---
title: comb_fl() - Azure Data Explorer
description: This article describes comb_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/07/2021
---
# comb_fl()

Calculate *C(n, k)*

The function `comb_fl()`calculates *C(n, k)*, the number of [combinations](https://en.wikipedia.org/wiki/Combination) for selection of k items out of n, without order. It is based on the Azure Data Explorer native [gamma()](../query/gammafunction.md) function to calculate factorial. For more information, see [facorial_fl()](factorial-fl.md). For a selection of k items with order, use [perm_fl()](perm-fl.md)

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`comb_fl(`*n*, *k*`)`
  
## Arguments

* *n*: Total number of items.
* *k*: Selected number of items.

## Usage

`comb_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let comb_fl=(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    let fact_k = gamma(k+1);
    tolong(fact_n/fact_nk/fact_k)
}
;
range n from 3 to 10 step 3
| extend k = n-2
| extend cnk = comb_fl(n, k)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
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

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range n from 3 to 10 step 3
| extend k = n-2
| extend cnk = comb_fl(n, k)
```

---

```kusto
n	k	cnk
3	1	3
6	4	15
9	7	36
```
