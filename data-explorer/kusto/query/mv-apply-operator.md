---
title:  mv-apply operator
description: Learn how to use the mv-apply operator to apply a subquery to each record and union the results of each subquery.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/04/2025
---
# mv-apply operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Applies a subquery to each record, and returns the union of the results of
all subqueries.

For example, assume a table `T` has a column `Metric` of type `dynamic`
whose values are arrays of `real` numbers. The following query locates the
two biggest values in each `Metric` value, and returns the records corresponding
to these values.

```kusto
T | mv-apply Metric to typeof(real) on 
(
   top 2 by Metric desc
)
```

The `mv-apply` operator has the following
processing steps:

1. Uses the [`mv-expand`](mv-expand-operator.md) operator to expand each record in the input into subtables (order is preserved).
1. Applies the subquery for each of the subtables.
1. Adds zero or more columns to the resulting subtable. These columns contain the values of the source columns that aren't expanded, and are repeated where needed.
1. Returns the union of the results.

The `mv-apply` operator gets the following inputs:

1. One or more expressions that evaluate into dynamic arrays to expand.
   The number of records in each expanded subtable is the maximum length of
   each of those dynamic arrays. Null values are added where multiple expressions are specified and the corresponding arrays have different lengths.

1. Optionally, the names to assign the values of the expressions after expansion.
   These names become the columns names in the subtables.
   If not specified, the original name of the column is used when the expression is a column reference. A random name is used otherwise.

   > [!NOTE]
   > We recommend that you use the default column names.

1. The data types of the elements of those dynamic arrays, after expansion.
   These data types become the column types of the columns in the subtables.
   If not specified, `dynamic` is used.

1. Optionally, the name of a column to add to the subtables that specifies the
   0-based index of the element in the array that resulted in the subtable record.

1. Optionally, the maximum number of array elements to expand.

The `mv-apply` operator can be thought of as a generalization of the
[`mv-expand`](mv-expand-operator.md) operator (in fact, the latter can be implemented
by the former, if the subquery includes only projections.)

## Syntax

*T* `|` `mv-apply` [*ItemIndex*] *ColumnsToExpand* [*RowLimit*] `on` `(` *SubQuery* `)`

Where *ItemIndex* has the syntax:

`with_itemindex` `=` *IndexColumnName*

*ColumnsToExpand* is a comma-separated list of one or more elements of the form:

[*Name* `=`] *ArrayExpression* [`to` `typeof` `(`*Typename*`)`]

*RowLimit* is simply:

`limit` *RowLimit*

*SubQuery* has the same syntax of any query statement.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`ItemIndex`| `string` ||Indicates the name of a column of type `long` that's appended to the input as part of the array-expansion phase and indicates the 0-based array index of the expanded value.|
|`Name`| `string` ||The name to assign the array-expanded values of each array-expanded expression. If not specified, the name of the column is used if available. A random name is generated if *ArrayExpression* isn't a simple column name.|
|`ArrayExpression`| `dynamic` | :heavy_check_mark:|The array whose values are array-expanded. If the expression is the name of a column in the input, the input column is removed from the input and a new column of the same name, or *ColumnName* if specified, appears in the output.|
|`Typename`| `string` ||The name of the type that the individual elements of the `dynamic` array *ArrayExpression* take. Elements that don't conform to this type are replaced by a null value. If unspecified, `dynamic` is used by default.|
|`RowLimit`| `int` ||A limit on the number of records to generate from each record of the input. If unspecified, 2147483647 is used.|
|`SubQuery`| `string` ||A tabular query expression with an implicit tabular source that gets applied to each array-expanded subtable.|

>[!NOTE]
> Unlike the [`mv-expand`](mv-expand-operator.md) operator, the `mv-apply` operator doesn't support `bagexpand=array` expansion. If the expression to be expanded is a property bag and not an array, you can use an inner `mv-expand` operator (see the following example).

## Examples

Review the examples and run them in your Data Explorer query page.

### Internal mv-expand done by  mv-apply

The query helps in understanding the mv-expand done internally by mv-apply

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02MwQrCMBBE7%2FmKOSYQIfGgUOnB7yg9rCZKME1CWYoBP940IDiHWeYtvOgZjpgw9sN0ix4yJOffA0Jijeu6DnA10RLuSkwCLUb%2FiJzOs9Id2j940rBtt5%2BYL2I3iw%2BW7UClxLorj2MrcAbX4vNDxpyeCjmhq2TvFqaXhzWmb%2FUFxRAwu60AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let data = datatable (index: int, Arr: dynamic)
[
    0, dynamic([7]),
    1, dynamic([6, 11, 7])
];
data
| mv-apply Arr2=Arr to typeof(long) on 
    (
       take 100
    )
```

**Output**

| index | Arr | `Arr2` |
|--|--|--|
| 0 | [7] | 7 |
| 1 | [6, 11, 7] | 6 |
| 1 | [6, 11, 7] | 11|
| 1 | [6, 11, 7] | 7 |

### Getting the largest element from the array

The query creates a new column having the largest element of an array.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NwQoCMQxE7%2F2KObZQwSoirOzBg1%2Bx9NC1VQrdtixBLPjx1oBiDkmYN8mkQPCOHEYe5OYUIGP24TkgZtI4r%2BsA37Jb4lWJSaDXVn8VORmNg8beKs3I%2FKPu2zE%2BWiXsSXwixAvLY%2BNqTQ1U6iWFZewZfQe1GspNppLvCiWDH0ru3QmD%2BXfConoD3WN%2F8L4AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let data = datatable (index: int, Arr: dynamic)
[
    0, dynamic([1, 5, 3]),
    1, dynamic([10, 2, 5, 7])
];
data
| mv-apply topElem=Arr to typeof(long) on 
    (
    top 1 by topElem
    )
```

**Output**

| index | Arr | `topElem` |
|--|--|--|
| 0 | [1, 5, 3] | 5 |
| 1 | [10, 2, 5, 7] | 10 |

### Find top two elements in an array

The query saves the top two elements of an array in a new array column Top2.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NzQrCMBCE73mKOSYQwVZFUXrwHbyVIqmNEswf7SpW%2BvCmEcE9zMLMx4zVhE6RQpUfqdZqcOM7%2FdrDeJI49v0e3eiVMxfBaoZ0S%2FlzeL2RKCRWjZA5Kv6idYoSupPYNoI1BzZPsAnuuVAx2nHuLqskoAAaow5XboO%2FCQSP3MazUogo0X757EwYHs6p3rw1TiGWlVN3fbZmID4zIkPiA06i8CLdAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let data = datatable (index: int, Arr: dynamic)
[
    0, dynamic([5, 1, 3]),
    1, dynamic([4, 10, 8, 7])
];
data
| mv-apply Arr2=Arr to typeof(long) on 
    (
    top 2 by Arr2
    | summarize Top2=make_list(Arr2)
    )
```

**Output**

| index | Arr | `Top2` |
|--|--|--|
| 0 | [5, 1, 3] | [5, 3] |
| 1 | [4, 10, 8, 7] | [10, 8] |

### Select elements in arrays

The query identifies the top two elements from each dynamic array based on the Arr2 values and summarizes them into new lists.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PQYvCMBCF7/kV79YEsmBSu4rgoe3doxcpEjW7FJO21KhU/PGmsVZZNsM8eDPzzZCDcj52RoOulVmUleNI21YsDl2lbLkPTr4cIxsIjsHRTZSKiCNKZdA4KhjH840jYsIR+5z1PQLMPvEs4FnAs+RfPOEQ/mQy8U2Px594HvA84HkcdBqWjCPfHFN/XPqcF4wUIHfYy5dqGtNhpa/9V5e98MHJ3km4Gq5rdP1DTV39MtQVKPHVBhK7FykJ7jidrVVtedPjOquOemvKk6NDhb2X/+1JRtgDW1SAO4MBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (Val:int, Arr1:dynamic, Arr2:dynamic)
[ 1, dynamic(['A1', 'A2', 'A3']),       dynamic([10, 30, 7]), 
  7, dynamic(['B1', 'B2', 'B5']),       dynamic([15, 11, 50]),
  3, dynamic(['C1', 'C2', 'C3', 'C4']), dynamic([6, 40, 20, 8])
] 
| mv-apply NewArr1=Arr1, NewArr2=Arr2 to typeof(long) on (
 top 2 by NewArr2
 | summarize NewArr1=make_list(NewArr1), NewArr2=make_list(NewArr2)
)
```

**Output**

| Val1 | Arr1 | Arr2 | `NewArr1` | `NewArr2` |
|--|--|--|--|--|
| 1 | `["A1","A2","A3"]` | `[10,30,7]` | `["A2',"A1"]` | `[30,10]` |
| 7 | `["B1","B2","B5"]` | `[15,11,50]` | `["B5","B1"]` | `[50,15]` |
| 3 | `["C1","C2","C3","C4"]` | `[6,40,20,8]` | `["C2","C3"]` | `[40,20]` |

### Using `with_itemindex` for working with a subset of the array

The query results in a table with rows where the index is 2 or greater, including the index and element values from the original lists.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02N2wrCMBBE3%2FMV89YGIrVeUCoV%2FI5SJLarDeRSStpa8OONEcF92IWZ2TmaPFrpJcp4vLxpQjq4uYCyXuAyDAXaxUqjGs4qhjBr8VPSai%2BQC2xrLqKV%2F1m7YIXoUeBQc1af2AfAXjDTSva9XjAr312VJ6NsS88ybkxSj1QGLLyDX3py91Q7%2B%2BBwFoGRRk6WoaOBsLgRnZwISfxO0Dg9Ghszc0x8W88lNkHkb%2BM%2FJCbvAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let data = datatable (row: int, Arr: dynamic)
[
    0, dynamic([5, 1, 3]),
    1, dynamic([4, 10, 8, 7])
];
data
| mv-apply with_itemindex=index value=Arr to typeof(long) on 
  (
    // here you have 'index' column
    where index >= 2
  )
```

**Output**

| row | Arr | `value` | `index` |
|--|--|--|--|
| 0 | [5, 1, 3] | 3 | 2 |
| 1 | [4, 10, 8, 7] | 8 | 2 |
| 1 | [4, 10, 8, 7] | 7 | 3 |

### Using multiple columns to join element of two arrays

The query combines elements from two dynamic arrays into a new concatenated format and then summarizes them into lists.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12OMQuDMBCF9%2FyKh4sJ2CEpXQQHtXsX6SIiqWaQGisaSy3%2B%2BCaBFukdHPfefXdcK43NW69Ar7KP0Q0mQjpNPEa7DlJ3jZfiJxkpCWzw6OvQMkx5GCFMRVixvZ15OxO%2BHv3Q7572UO6h%2FH%2F3zK1BKpAN%2BnmQ49ivKHjiXotQCNcIPAZQf1G9jBpaXBaDBLOZGmloYcGgDhzNPLRhXrSWU%2FdWjkyg5V3VfTcbaqVj2Afoyn8xDwEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (Val: int, Arr1: dynamic, Arr2: dynamic)
[
    1, dynamic(['A1', 'A2']), dynamic(['B1', 'B2', 'B3']), 
    5, dynamic(['C1', 'C2']), dynamic(['D1'])
] 
| mv-apply T1=Arr1, T2=Arr2 on (
    extend Out = strcat(T1, "_", T2)
    | summarize Out= make_list(Out)
  )
```

**Output**

| Val | Arr1 | Arr2 | `Out` |
|--|--|--|--|
| 1 | ["A1","A2"] | ["B1","B2","B3"] | ["A1_B1","A2_B2","_B3"] |
| 5 | ["C1","C2"] | ["D1"] | ["C1_D1","C2_"] |

### Applying mv-apply to a property bag

This query dynamically removes properties from the packed values object based on the criteria that their values don't start with 555. The final result contains the original columns with unwanted properties removed.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1VPwW6DMAy98xVeLwUJpMGgh0k97QeqrbcKIZdaNCMkURKgTP34edkm1ERxHL%2Fn55cLet5nSfGHHm1Lr%2BC8FapL4Yi2I7%2B%2B3%2FSo%2BCm16pLoFAGvbVVVWV68lNv0P88LzstduuJFWQScj1A%2BVqOUSVRHd6CbJ3WBA7Y97MHw1aCUccLQMGVojFzA0qAnOlhtyHpBjomBrxWECXGITKebQRbrBYc9oLW4BGbA7zBfyVIonPIanpxH690s%2FBU27HHzx3LjMKAVXwSGJ7qjfg%2FjWXDAnhpHPg4Sz3USOpL1FxPKMdg7Y9f8um56WlxoSB%2F1ftq48Emtz3Bmow%2FoNx7hPWmSAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Source: string, Target: string, Count: long)
[
    '555-1234', '555-1212', 46,
    '555-2424', '', int(null)
]
| extend Pack = pack_all()
| mv-apply removeProperties = Pack on 
    (
    mv-expand kind = array Pack
    | where Pack[1] !startswith "555"
    | summarize propsToRemove = make_set(Pack[0])
    )
| extend values = bag_remove_keys(Pack, propsToRemove)
| project-away propsToRemove
```

**Output**

| Source | Target | Count | Pack | `values` |
|--|--|--|--|
| 555-1234 | 555-1212 | 46 | {<br>	"Source": "555-1234",<br>	"Target": "555-1212",<br>	"Count": 46<br>} | {<br> "Source": "555-1234",<br>   "Target": "555-1212"<br> } |
| 555-2424 | &nbsp; | &nbsp; | {<br>	"Source": "555-2424",<br>	"Target": "",<br>	"Count": null<br>} | {<br> "Source": "555-2424"<br> } |

## Related content

* [mv-expand](mv-expand-operator.md) operator
* [array_iff](./array-iff-function.md) function
