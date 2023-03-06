---
title: normality_test_fl() - Azure Data Explorer
description: This article describes the normality_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# normality_test_fl()

The function `normality_test_fl()` performs the [Normality Test](https://en.wikipedia.org/wiki/Normality_test).

> [!NOTE]
> * `normality_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke normality_test_fl()(`*data*`,` *test_statistic*`,`*p_value*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*data*|string|&check;|The name of the column containing the data to be used for the test.|
|*test_statistic*|string|&check;|The name of the column to store test statistic value for the results.|
|*p_value*|string|&check;|The name of the column to store p-value for the results.|

## Usage

`normality_test_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
let normality_test_fl = (tbl:(*), data:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data', data, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data = kargs["data"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.normaltest(row[data])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
;
datatable(id:string, sample1:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42, 27.1, 22.12, 33.56, 23.64, 20.57]),
'Test #2', dynamic([20.85, 21.89, 23.41, 35.09, 30.02, 26.52, 20.85, 21.89]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02, 32.2, 32.79, 33.9, 34.22, 20.13, 20.5])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke normality_test_fl('sample1', 'test_stat', 'p_val')
~~~

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Normality Test")
normality_test_fl(tbl:(*), data:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data', data, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data = kargs["data"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.normaltest(row[data])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
datatable(id:string, sample1:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42, 27.1, 22.12, 33.56, 23.64, 20.57]),
'Test #2', dynamic([20.85, 21.89, 23.41, 35.09, 30.02, 26.52, 20.85, 21.89]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02, 32.2, 32.79, 33.9, 34.22, 20.13, 20.5])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke normality_test_fl('sample1', 'test_stat', 'p_val')
~~~

---

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
id             sample1        test_stat        p_val
Test #1, [23.64, 20.57, 20.42, 27.1, 22.12, 33.56, 23.64, 20.57], 7.4881873153941036, 0.023657060728893706
Test #2, [20.85, 21.89, 23.41, 35.09, 30.02, 26.52, 20.85, 21.89], 3.29982750330276, 0.19206647332255408
Test #3, [20.13, 20.5, 21.7, 22.02, 32.2, 32.79, 33.9, 34.22, 20.13, 20.5], 6.9868433851364324, 0.030396685911910585
~~~
