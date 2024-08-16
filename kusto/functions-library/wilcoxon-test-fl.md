---
title:  wilcoxon_test_fl()
description:  This article describes the wilcoxon_test_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# wilcoxon_test_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The function `wilcoxon_test_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that performs the [Wilcoxon Test](https://en.wikipedia.org/wiki/Wilcoxon_signed-rank_test).

[!INCLUDE [python-zone-pivot-fabric](../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke wilcoxon_test_fl()(`*data*`,` *test_statistic*`,`*p_value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *data* | `string` |  :heavy_check_mark: | The name of the column containing the data to be used for the test.|
| *test_statistic* | `string` |  :heavy_check_mark: | The name of the column to store test statistic value for the results.|
| *p_value* | `string` |  :heavy_check_mark: | The name of the column to store p-value for the results.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `wilcoxon_test_fl()`, see [Example](#example).

~~~kusto
let wilcoxon_test_fl = (tbl:(*), data:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data', data, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data = kargs["data"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.wilcoxon(row[data])
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
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Wilcoxon Test")
wilcoxon_test_fl(tbl:(*), data:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data', data, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data = kargs["data"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.wilcoxon(row[data])
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
let wilcoxon_test_fl = (tbl:(*), data:string, test_statistic:string, p_value:string)
{
    let kwargs = bag_pack('data', data, 'test_statistic', test_statistic, 'p_value', p_value);
    let code = ```if 1:
        from scipy import stats
        data = kargs["data"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        def func(row):
            statistics = stats.wilcoxon(row[data])
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
datatable(id:string, sample1:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]),
'Test #2', dynamic([20.85, 21.89, 23.41]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke wilcoxon_test_fl('sample1', 'test_stat', 'p_val') -->
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

~~~kusto
datatable(id:string, sample1:dynamic) [
'Test #1', dynamic([23.64, 20.57, 20.42]),
'Test #2', dynamic([20.85, 21.89, 23.41]),
'Test #3', dynamic([20.13, 20.5, 21.7, 22.02])
]
| extend test_stat= 0.0, p_val = 0.0
| invoke wilcoxon_test_fl('sample1', 'test_stat', 'p_val')
~~~

---

**Output**

| ID | sample1 | test_stat | p_val |
|---|---|---|---|
| Test #1 | [23.64, 20.57, 20.42] | 0, 0.10880943004054568 |
| Test #2 | [20.85, 21.89, 23.41] | 0, 0.10880943004054568 |
| Test #3 | [20.13, 20.5, 21.7, 22.02] | 0, 0.06788915486182899 |

