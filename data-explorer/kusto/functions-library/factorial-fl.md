---
title:  factorial_fl()
description: This article describes factorial_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/30/2023
---
# factorial_fl()

Calculate factorial.

The function `factorial_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that calculates [factorial](https://en.wikipedia.org/wiki/Factorial) of positive integers (*n!*). It's a simple wrapper of the native [gamma()](../query/gamma-function.md) function.

## Syntax

`factorial_fl(`*n*`)`
  
[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n*|int|&check;|The input integer for which to calculate the factorial.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `factorial_fl()`, see [Example](#example).

```kusto
let factorial_fl=(n:int)
{
    gamma(n+1)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate factorial")
factorial_fl(n:int)
{
    gamma(n+1)
}
```

---

## Example

### [Query-defined](#tab/query-defined)

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XMMQ6DMAwF0N2n+GMilkZsoJwFWa2DIiUOSj1Eor07rLwDvCKGxG9rPXPZUolOl6zm6STcdq6VnU7B03+lzroLBlJvFQHWEF74mhyY6QcZJvpBGoiP0g1/ARFWBuNmAAAA" target="_blank">Run the query</a>

```kusto
let factorial_fl=(n:int)
{
    gamma(n+1)
};
range x from 1 to 10 step 3
| extend fx = factorial_fl(x)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0UCguSS1QMOaqUUitKEnNS1FIq1CwVUhLTC7JL8pMzIlPy9Go0AQAVBtAKDkAAAA=" target="_blank">Run the query</a>

```kusto
range x from 1 to 10 step 3
| extend fx = factorial_fl(x)
```

---

**Output**

| x | fx |
|---|---|
| 1 | 1 |
| 4 | 24 |
| 7 | 5040 |
| 10 | 3628799 |
