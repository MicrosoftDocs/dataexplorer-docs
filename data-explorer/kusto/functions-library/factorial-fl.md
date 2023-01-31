---
title: factorial_fl() - Azure Data Explorer
description: This article describes factorial_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/07/2021
---
# factorial_fl()

Calculate factorial.

The function `factorial_fl()`calculates [factorial](https://en.wikipedia.org/wiki/Factorial) of positive integers (*n!*). It's a simple wrapper of the Azure Data Explorer native [gamma()](../query/gammafunction.md) function.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`factorial_fl(`*n*`)`
  
## Arguments

* *n*: The input integer.

## Usage

`factorial_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let factorial_fl=(n:int)
{
    gamma(n+1)
}
;
range x from 1 to 10 step 3
| extend fx = factorial_fl(x)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate factorial")
factorial_fl(n:int)
{
    gamma(n+1)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
range x from 1 to 10 step 3
| extend fx = factorial_fl(x)
```

---

```kusto
x	fx
1	1
4	24
7	5040
10	3628799
```
