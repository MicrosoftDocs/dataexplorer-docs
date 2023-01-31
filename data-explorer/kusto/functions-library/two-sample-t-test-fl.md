---
title: two_sample_t_test_fl() - Azure Data Explorer
description: This article describes the two_sample_t_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/08/2022
---
# two_sample_t_test_fl()

The function `two_sample_t_test_fl()` performs the [Two-Sample T-Test](https://en.wikipedia.org/wiki/Student%27s_t-test#Independent_two-sample_t-test).

> [!NOTE]
> * `two_sample_t_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.
> * If the assumption is that the two datasets to be compared have different variances, we suggest using the native [welch_test()](../query/welch-testfunction.md).

## Syntax

`T | invoke two_sample_t_test_fl(`*data1*`,` *data2*`,` *test_statistic*`,`*p_value*`,` *equal_var*`)`

## Arguments

* *data1*: The name of the column containing the first set of data to be used for the test.
* *data2*: The name of the column containing the second set of data to be used for the test.
* *test_statistic*: The name of the column to store test statistic value for the results.
* *p_value*: The name of the column to store p-value for the results.
* *equal_var*: If `true` (default), performs a standard independent 2 sample test that assumes equal population variances. If `false`, performs Welch’s t-test, which does not assume equal population variance. As mentioned above, consider using the native [welch_test()](../query/welch-testfunction.md).

## Usage

`two_sample_t_test_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let two_sample_t_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, equal_var:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'equal_var', equal_var);
    let code =
        'from scipy import stats\n'
        'import pandas\n'
        '\n'
        'data1 = kargs["data1"]\n'
        'data2 = kargs["data2"]\n'
        'test_statistic = kargs["test_statistic"]\n'
        'p_value = kargs["p_value"]\n'
        'equal_var = kargs["equal_var"]\n'
        '\n'
        'def func(row):\n'
        '    statistics = stats.ttest_ind(row[data1], row[data2], equal_var=equal_var)\n'
        '    return statistics[0], statistics[1]\n'
        'result = df\n'
        'result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")\n'
    ;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
;
datatable(id:string, sample1:dynamic, sample2:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]), dynamic([27.1, 22.12, 33.56]),
'Test #2', dynamic([20.85, 21.89, 23.41]), dynamic([35.09, 30.02, 26.52]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02]), dynamic([32.2, 32.79, 33.9, 34.22])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke two_sample_t_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Two-Sample t-Test")
two_sample_t_test_fl(tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, equal_var:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'equal_var', equal_var);
    let code =
        'from scipy import stats\n'
        'import pandas\n'
        '\n'
        'data1 = kargs["data1"]\n'
        'data2 = kargs["data2"]\n'
        'test_statistic = kargs["test_statistic"]\n'
        'p_value = kargs["p_value"]\n'
        'equal_var = kargs["equal_var"]\n'
        '\n'
        'def func(row):\n'
        '    statistics = stats.ttest_ind(row[data1], row[data2], equal_var=equal_var)\n'
        '    return statistics[0], statistics[1]\n'
        'result = df\n'
        'result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")\n'
    ;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
datatable(id:string, sample1:dynamic, sample2:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]), dynamic([27.1, 22.12, 33.56]),
'Test #2', dynamic([20.85, 21.89, 23.41]), dynamic([35.09, 30.02, 26.52]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02]), dynamic([32.2, 32.79, 33.9, 34.22])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke two_sample_t_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
```

---

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
id             sample1                    sample2                test_stat          p_val
Test #1, [23.64, 20.57, 20.42], [27.1, 22.12, 33.56], -1.7415675457565645, 0.15655096653487446
Test #2, [20.85, 21.89, 23.41], [35.09, 30.02, 26.52], -3.2711673491022579, 0.030755331219276136
Test #3, [20.13, 20.5, 21.7, 22.02], [32.2, 32.79, 33.9, 34.22], -18.5515946201742, 1.5823717131966134E-06
```
