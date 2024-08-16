---
title:  perm_fl()
description:  This article describes perm_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# perm_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculate *P(n, k)*

The function `perm_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates *P(n, k)*, the number of [permutations](https://en.wikipedia.org/wiki/Permutation) for selection of k items out of n, with order. It's based on the native [gamma()](../query/gamma-function.md) function to calculate factorial, (see [facorial_fl()](factorial-fl.md)). For selection of k items without order, use [comb_fl()](comb-fl.md).

## Syntax

`perm_fl(`*n*, *k*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n*| `int` | :heavy_check_mark:|The total number of items.|
|*k*| `int` | :heavy_check_mark:|The selected number of items.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `perm_fl()`, see [Example](#example).

```kusto
let perm_fl=(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    tolong(fact_n/fact_nk)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate number of permutations for selection of k items out of n items with order")
perm_fl(n:int, k:int)
{
    let fact_n = gamma(n+1);
    let fact_nk = gamma(n-k+1);
    tolong(fact_n/fact_nk)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OQQrCMBBF9znFXyZo0dqdpWcpQSdBkkxCnUVBvbupFgvO5sO8x8yPJCg0pdHFQfP5xrJHWMKoh0KdWAVnLzIyBnibktW8a03/B8NGm/DjkmNmr7/KYTWNeqleTZY9geGmnNBVE+0Rd6GCTj1BsxBfsVzl5rQtyufRWlhz7WreODahQsIAAAA=" target="_blank">Run the query</a>
::: moniker-end

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

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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
