---
title: perm_fl() - Azure Data Explorer
description: This article describes perm_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/07/2021
---
# perm_fl()

Calculate *P(n, k)*

The function `perm_fl()`calculates *P(n, k)*, the number of [permutations](https://en.wikipedia.org/wiki/Permutation) for selection of k items out of n, with order. It is based on the Azure Data Explorer native [gamma()](../query/gammafunction.md) function to calculate factorial, (see [facorial_fl()](factorial-fl.md)). For selection of k items without order, use [comb_fl()](comb-fl.md)

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`perm_fl(`*n*, *k*`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n*|int|&check;|The total number of items.|
|*k*|int|&check;|The selected number of items.|

## Examples

`perm_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OQQrCMBBF9znFXyZo0dqdpWcpQSdBkkxCnUVBvbupFgvO5sO8x8yPJCg0pdHFQfP5xrJHWMKoh0KdWAVnLzIyBnibktW8a03/B8NGm/DjkmNmr7/KYTWNeqleTZY9geGmnNBVE+0Rd6GCTj1BsxBfsVzl5rQtyufRWlhz7WreODahQsIAAAA=" target="_blank">Run the query</a>

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

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
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

```kusto
range n from 3 to 10 step 3
| extend k = n-2
| extend pnk = perm_fl(n, k)
```

---

**Output**

| n | k | pnk    |
|---|---|--------|
| 3 | 1 | 3      |
| 6 | 4 | 360    |
| 9 | 7 | 181440 |
