---
title:  levene_test_fl()
description: This article describes the levene_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# levene_test_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `levene_test_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that performs the [Levene Test](https://en.wikipedia.org/wiki/Levene%27s_test).

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke levene_test_fl(`*data1*`,` *data2*`,` *test_statistic*`,`*p_value*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*data1*|string|&check;|The name of the column containing the first set of data to be used for the test.|
|*data2*|string|&check;|The name of the column containing the second set of data to be used for the test.|
|*test_statistic*|string|&check;|The name of the column to store test statistic value for the results.|
|*p_value*|string|&check;|The name of the column to store p-value for the results.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `levene_test_fl()`, see [Example](#example).

~~~kusto
<!-- let levene_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.levene(row[data1], row[data2])
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

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Levene Test")
levene_test_fl(tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.levene(row[data1], row[data2])
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
<!-- let levene_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.levene(row[data1], row[data2])
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
| invoke levene_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
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
| invoke levene_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
~~~

---

**Output**

| id | sample1 | sample2 | test_stat | p_val |
|---|---|---|---|---|
| Test #1 | [23.64, 20.57, 20.42] | [27.1, 22.12, 33.56] | 1.5587395987367387 | 0.27993504690044563 |
| Test #2 | [20.85, 21.89, 23.41] | [35.09, 30.02, 26.52] | 1.6402495788130482 | 0.26950872948841353 |
| Test #3 | [20.13, 20.5, 21.7, 22.02] | [32.2, 32.79, 33.9, 34.22] | 0.0032989690721642395 | 0.95606240301049072 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
