---
title:  mann_whitney_u_test_fl()
description:  This article describes the mann_whitney_u_test_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# mann_whitney_u_test_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The function `mann_whitney_u_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that performs the [Mann-Whitney U Test](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test).

[!INCLUDE [python-zone-pivot-fabric](../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | mann_whitney_u_test_fl(`*data1*`,` *data2*`,` *test_statistic*`,`*p_value* [`,` *use_continuity* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*data1*| `string` | :heavy_check_mark:|The name of the column containing the first set of data to be used for the test.|
|*data2*| `string` | :heavy_check_mark:|The name of the column containing the second set of data to be used for the test.|
|*test_statistic*| `string` | :heavy_check_mark:|The name of the column to store test statistic value for the results.|
|*p_value*| `string` | :heavy_check_mark:|The name of the column to store p-value for the results.|
|*use_continuity*| `bool` | |Determines if a continuity correction (1/2) is applied. Default is `true`.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `mann_whitney_u_test_fl()`, see [Example](#example).

~~~kusto
let mann_whitney_u_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, use_continuity:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'use_continuity', use_continuity);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        use_continuity = kargs["use_continuity"]
        def func(row):
            statistics = stats.mannwhitneyu(row[data1], row[data2], use_continuity=use_continuity)
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
        ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Mann-Whitney U Test")
mann_whitney_u_test_fl(tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, use_continuity:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'use_continuity', use_continuity);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        use_continuity = kargs["use_continuity"]
        def func(row):
            statistics = stats.mannwhitneyu(row[data1], row[data2], use_continuity=use_continuity)
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

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let mann_whitney_u_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, use_continuity:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'use_continuity', use_continuity);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        use_continuity = kargs["use_continuity"]
        def func(row):
            statistics = stats.mannwhitneyu(row[data1], row[data2], use_continuity=use_continuity)
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
| invoke mann_whitney_u_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

~~~kusto
datatable(id:string, sample1:dynamic, sample2:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]), dynamic([27.1, 22.12, 33.56]),
'Test #2', dynamic([20.85, 21.89, 23.41]), dynamic([35.09, 30.02, 26.52]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02]), dynamic([32.2, 32.79, 33.9, 34.22])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke mann_whitney_u_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
~~~

---

**Output**

| id | sample1 | sample2 | test_stat | p_val |
|---|---|---|---|---|
| Test #1 | [23.64, 20.57, 20.42] | [27.1, 22.12, 33.56] | 1 | 0.095215131912761986 |
| Test #2 | [20.85, 21.89, 23.41] | [35.09, 30.02, 26.52] | 0 | 0.04042779918502612 |
| Test #3 | [20.13, 20.5, 21.7, 22.02] | [32.2, 32.79, 33.9, 34.22] | 0 | 0.015191410988288745 |

