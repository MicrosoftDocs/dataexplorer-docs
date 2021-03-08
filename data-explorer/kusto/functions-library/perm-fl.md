---
title: perm_fl() - Azure Data Explorer
description: This article describes perm_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 03/07/2021
---
# perm_fl()

Calculate *P(n, k)*

The function `perm_fl()`calculates *P(n, k)*, the number of [permutations](https://en.wikipedia.org/wiki/Permutation) for selection of k items out of n, with order. It is based on ADX native [gamma()](../query/gammafunction.md) function to calculate factorial, (see [facorial_fl()](factorial-fl.md)). For selection of k items without order use [comb_fl()](comb-fl.md)

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`perm_fl(`*n*, *k*`)`
  
## Arguments

* *n*: Total number of items.
* *k*: Selected number of items.

## Usage

`perm_fl()` is a user-defined function. You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let perm_fl=(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    tolong(fact_n/fact_nk)
}
;
range n from 3 to 10 step 3
| extend k = n-2
| extend pnk = perm_fl(n, k)
```

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate number of permutations for selection of k items out of n items with order")
perm_fl(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    tolong(fact_n/fact_nk)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
range n from 3 to 10 step 3
| extend k = n-2
| extend pnk = perm_fl(n, k)
```

---

```kusto
n	k	pnk
3	1	3
6	4	360
9	7	181440
```
