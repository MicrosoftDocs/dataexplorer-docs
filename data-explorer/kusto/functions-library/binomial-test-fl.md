---
title: binomial_test_fl() - Azure Data Explorer
description: This article describes the binomial_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/02/2023
---
# binomial_test_fl()

The function `binomial_test_fl()` performs the [binomial test](https://en.wikipedia.org/wiki/Binomial_test).

> [!NOTE]
> * `binomial_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke binomial_test_fl(`*successes*`,` *trials*`,` [ *success_prob* ]`,` [ *alt_hypotheis* ]`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *successes* | string | &check; | The name of the column containing the number of success results.|
| *trials* | string | &check; | The name of the column containing the total number of trials.|
| *p_value* | string | &check; | The name of the column to store the results.|
| *success_prob* | real | | The success probability. The default is 0.5.|
| *alt_hypotheis* | string | | The alternate hypothesis can be `two-sided`, `greater`, or `less`. The default is `two-sided`.|

## Usage

`binomial_test_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let binomial_test_fl = (tbl:(*), successes:string, trials:string, p_value:string, success_prob:real=0.5, alt_hypotheis:string='two-sided')
{
    let kwargs = bag_pack('successes', successes, 'trials', trials, 'p_value', p_value, 'success_prob', success_prob, 'alt_hypotheis', alt_hypotheis);
    let code = ```if 1:
        from scipy import stats
        
        successes = kargs["successes"]
        trials = kargs["trials"]
        p_value = kargs["p_value"]
        success_prob = kargs["success_prob"]
        alt_hypotheis = kargs["alt_hypotheis"]
        
        def func(row, prob, h1):
            pv = stats.binom_test(row[successes], row[trials], p=prob, alternative=h1)
            return pv
        result = df
        result[p_value] = df.apply(func, axis=1, args=(success_prob, alt_hypotheis), result_type="expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
;
datatable(id:string, x:int, n:int) [
'Test #1', 3, 5,
'Test #2', 5, 5,
'Test #3', 3, 15
]
| extend p_val=0.0
| invoke binomial_test_fl('x', 'n', 'p_val', success_prob=0.2, alt_hypotheis='greater')
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Binomial test")
binomial_test_fl(tbl:(*), successes:string, trials:string, p_value:string, success_prob:real=0.5, alt_hypotheis:string='two-sided')
{
    let kwargs = bag_pack('successes', successes, 'trials', trials, 'p_value', p_value, 'success_prob', success_prob, 'alt_hypotheis', alt_hypotheis);
    let code = ```if 1:
        from scipy import stats
        
        successes = kargs["successes"]
        trials = kargs["trials"]
        p_value = kargs["p_value"]
        success_prob = kargs["success_prob"]
        alt_hypotheis = kargs["alt_hypotheis"]
        
        def func(row, prob, h1):
            pv = stats.binom_test(row[successes], row[trials], p=prob, alternative=h1)
            return pv
        result = df
        result[p_value] = df.apply(func, axis=1, args=(success_prob, alt_hypotheis), result_type="expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(id:string, x:int, n:int) [
'Test #1', 3, 5,
'Test #2', 5, 5,
'Test #3', 3, 15
]
| extend p_val=0.0
| invoke binomial_test_fl('x', 'n', 'p_val', success_prob=0.2, alt_hypotheis='greater')
```

---

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
id	x	n	p_val
Test #1	3	5	0.05792
Test #2	5	5	0.00032
Test #3	3	15	0.601976790745087
```
