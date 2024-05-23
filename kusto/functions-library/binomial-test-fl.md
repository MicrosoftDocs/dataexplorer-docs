---
title:  binomial_test_fl()
description:  This article describes the binomial_test_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# binomial_test_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `binomial_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that performs the [binomial test](https://en.wikipedia.org/wiki/Binomial_test).

[!INCLUDE [python-zone-pivot-fabric](../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke binomial_test_fl(`*successes*`,` *trials* [`,`*success_prob* [`,` *alt_hypotheis* ]]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *successes* | `string` |  :heavy_check_mark: | The name of the column containing the number of success results.|
| *trials* | `string` |  :heavy_check_mark: | The name of the column containing the total number of trials.|
| *p_value* | `string` |  :heavy_check_mark: | The name of the column to store the results.|
| *success_prob* | `real` | | The success probability. The default is 0.5.|
| *alt_hypotheis* | `string` | | The alternate hypothesis can be `two-sided`, `greater`, or `less`. The default is `two-sided`.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `binomial_test_fl()`, see [Example](#example).

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
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

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

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

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
};
datatable(id:string, x:int, n:int) [
'Test #1', 3, 5,
'Test #2', 5, 5,
'Test #3', 3, 15
]
| extend p_val=0.0
| invoke binomial_test_fl('x', 'n', 'p_val', success_prob=0.2, alt_hypotheis='greater')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

| id | x | n | p_val |
|---|---|---|---|
| Test #1 | 3 | 5 | 0.05792 |
| Test #2 | 5 | 5 | 0.00032 |
| Test #3 | 3 | 15 | 0.601976790745087 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
