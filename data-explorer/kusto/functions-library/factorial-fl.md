---
title: factorial_fl() - Azure Data Explorer
description: This article describes factorial_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/02/2023
---
# factorial_fl()

Calculate factorial.

The function `factorial_fl()`calculates [factorial](https://en.wikipedia.org/wiki/Factorial) of positive integers (*n!*). It's a simple wrapper of the Azure Data Explorer native [gamma()](../query/gammafunction.md) function.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`factorial_fl(`*n*`)`
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n*|int|&check;|The input integer for which to calculate the factorial.|

## Usage

`factorial_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XMMQ6DMAwF0N2n+GMilkZsoJwFWa2DIiUOSj1Eor07rLwDvCKGxG9rPXPZUolOl6zm6STcdq6VnU7B059W6qy7YCD1VhFgDeGFr8mBmX6QYaIfpIH4ON3wF7cGc3NnAAAA" target="_blank">Run the query</a>

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

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

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

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0UCguSS1QMOaqUUitKEnNS1FIq1CwVUhLTC7JL8pMzIlPy9Go0AQAVBtAKDkAAAA=" target="_blank">Run the query</a>

```kusto
range x from 1 to 10 step 3
| extend fx = factorial_fl(x)
```

---

| x | fx |
|---|---|
| 1 | 1 |
| 4 | 24 |
| 7 | 5040 |
| 10 | 3628799 |
