---
title:  two_sample_t_test_fl()
description: This article describes the two_sample_t_test_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# two_sample_t_test_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `two_sample_t_test_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that performs the [Two-Sample T-Test](https://en.wikipedia.org/wiki/Student%27s_t-test#Independent_two-sample_t-test).

> [!NOTE]
> If the assumption is that the two datasets to be compared have different variances, we suggest using the native [welch_test()](../query/welch-testfunction.md).

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke two_sample_t_test_fl(`*data1*`,` *data2*`,` *test_statistic*`,`*p_value*`,` *equal_var*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *data1* | string | &check; | The name of the column containing the first set of data to be used for the test.|
| *data2* | string | &check; | The name of the column containing the second set of data to be used for the test.|
| *test_statistic* | string | &check; | The name of the column to store test statistic value for the results.|
| *p_value* | string | &check; | The name of the column to store p-value for the results.|
| *equal_var* | bool | | If `true` (default), performs a standard independent 2 sample test that assumes equal population variances. If `false`, performs Welch’s t-test, which does not assume equal population variance. As mentioned above, consider using the native [welch_test()](../query/welch-testfunction.md).|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `two_sample_t_test_fl()`, see [Example](#example).

```kusto
let two_sample_t_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, equal_var:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'equal_var', equal_var);
    let code = ```if 1:
        from scipy import stats
        import pandas
        
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        equal_var = kargs["equal_var"]
        
        def func(row):
            statistics = stats.ttest_ind(row[data1], row[data2], equal_var=equal_var)
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
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
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Two-Sample t-Test")
two_sample_t_test_fl(tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, equal_var:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'equal_var', equal_var);
    let code = ```if 1:
        from scipy import stats
        import pandas
        
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        equal_var = kargs["equal_var"]
        
        def func(row):
            statistics = stats.ttest_ind(row[data1], row[data2], equal_var=equal_var)
            return statistics[0], statistics[1]
        result = df
        result[[test_statistic, p_value]]  = df.apply(func, axis=1, result_type = "expand")
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
let two_sample_t_test_fl = (tbl:(*), data1:string, data2:string, test_statistic:string, p_value:string, equal_var:bool=true)
{
    let kwargs = bag_pack('data1', data1, 'data2', data2, 'test_statistic', test_statistic, 'p_value', p_value, 'equal_var', equal_var);
    let code = ```if 1:
        from scipy import stats
        import pandas
        
        data1 = kargs["data1"]
        data2 = kargs["data2"]
        test_statistic = kargs["test_statistic"]
        p_value = kargs["p_value"]
        equal_var = kargs["equal_var"]
        
        def func(row):
            statistics = stats.ttest_ind(row[data1], row[data2], equal_var=equal_var)
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
| invoke two_sample_t_test_fl('sample1', 'sample2', 'test_stat', 'p_val')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

| ID | sample1 | sample2 | test_stat | p_val |
|---|---|---|---|---|
| Test #1 | [23.64, 20.57, 20.42] | [27.1, 22.12, 33.56] | -1.7415675457565645 | 0.15655096653487446 |
| Test #2 | [20.85, 21.89, 23.41] | [35.09, 30.02, 26.52], -3.2711673491022579 | 0.030755331219276136 |
| Test #3 | [20.13, 20.5, 21.7, 22.02] | [32.2, 32.79, 33.9, 34.22] | -18.5515946201742 | 1.5823717131966134E-06 |
::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
