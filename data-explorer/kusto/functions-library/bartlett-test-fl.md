---
title: bartlett_test_fl() - Azure Data Explorer
description: This article describes the bartlett_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/06/2023
---
# bartlett_test_fl()

The `bartlett_test_fl()` function is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) function that performs the [Bartlett Test](https://en.wikipedia.org/wiki/Bartlett%27s_test).

## Prerequisites

* `python()` plugin must be [turned on for the cluster]](../query/pythonplugin.md#enable-the-plugin). This is required for the inline Python to used in the function.

## Syntax

`T | invoke bartlett_test_fl()(`*data1*`,` *data2*`,` *test_statistic*`,`*p_value*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *data1* | string | &check; | The name of the column containing the first set of data to be used for the test.|
| *data2* | string | &check; | The name of the column containing the second set of data to be used for the test.|
| *test_statistic* | string | &check; | The name of the column to store test statistic value for the results.|
| *p_value* | string | &check; | The name of the column to store p-value for the results.|

## Function declaration

You can define the function by either embeding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Embed the code in the query using the [let statement](../query/letstatement.md). No permissions are required.

~~~kusto
let bartlett_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.bartlett(row[data1], row[data2])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
~~~

### [Stored](#tab/stored)

Use the [`.create function`](../management/create-function.md) to add the code as a stored function in your database. Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md) command.

~~~kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Bartlett Test")
bartlett_test_fl(tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.bartlett(row[data1], row[data2])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invokeoperator.md) to run the function.

### [Query-defined](#tab/query-defined-example)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let bartlett_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.bartlett(row[data1], row[data2])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
datatable(id:string, sample1:dynamic, sample2:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]), dynamic([27.1, 22.12, 33.56]),
'Test #2', dynamic([20.85, 21.89, 23.41]), dynamic([35.09, 30.02, 26.52]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02]), dynamic([32.2, 32.79, 33.9, 34.22])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke bartlett_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
~~~

### [Stored](#tab/stored-example)

~~~kusto
datatable(id:string, sample1:dynamic, sample2:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]), dynamic([27.1, 22.12, 33.56]),
'Test #2', dynamic([20.85, 21.89, 23.41]), dynamic([35.09, 30.02, 26.52]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02]), dynamic([32.2, 32.79, 33.9, 34.22])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke bartlett_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
~~~

---

## Output

| id | sample1 | sample2 | test_stat | p_val |
| --- | --- | --- | --- | --- |
| Test #1 | [23.64, 20.57, 20.42] | [27.1, 22.12, 33.56] | 1.7660796224425723 | 0.183868001738637 |
| Test #2 | [20.85, 21.89, 23.41] | [35.09, 30.02, 26.52] | 1.9211710616896014 | 0.16572762069132516 |
| Test #3 | [20.13, 20.5, 21.7, 22.02] | [32.2, 32.79, 33.9, 34.22] | 0.0026985713829234454 | 0.958570306268548 |
