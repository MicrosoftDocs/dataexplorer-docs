---
title: percentiles_linear_fl() - Azure Data Explorer
description: Learn how to use the percentiles_linear_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/08/2022
---
# percentiles_linear_fl()

The function `percentiles_linear_fl()` calculates percentiles using linear interpolation between closest ranks, the same method used by Excel's [PERCENTILES.INC](https://support.microsoft.com/en-us/office/percentile-inc-function-680f9539-45eb-410b-9a5e-c1355e5fe2ed) function. Kusto native [percentile functions](../query/percentiles-aggfunction.md) use the nearest rank method. For large sets of values the difference between both methods is insignificant, and we recommend using the native function for best performance. For further details on these and additional percentile calculation methods have a look at [percentile article on Wikipedia](https://en.wikipedia.org/wiki/Percentile#Calculation_methods).
The function accepts a table containing the column to calculate on and an optional grouping key, and a dynamic array of the required percentiles, and returns a column containing dynamic array of the percentiles' values per each group.

> [!NOTE]
>
> * `percentiles_linear_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke percentiles_linear_fl(`*val_col*`,` *pct_arr*`,` *aggr_col*`)`
  
## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *val_col* | string | &check; | The name of the column (of the input table) containing the values to calculate the percentiles on|
| *pct_arr* | dynamic | &check; | A numerical array containing the required percentiles, each one should be in the range [0-100]. |
| *aggr_col* | string | | The name of the column (of the input table) containing the grouping key. |

## Usage

`percentiles_linear_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

### [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

```kusto
let percentiles_linear_fl=(tbl:(*), val_col:string, pct_arr:dynamic, aggr_col:string='')
{
    tbl
    | extend _vals = column_ifexists(val_col, 0.0)
    | extend _key = column_ifexists(aggr_col, 'ALL')
    | order by _key asc, _vals asc 
    | summarize _vals=make_list(_vals) by _key
    | extend n = array_length(_vals)
    | extend pct=pct_arr
    | mv-apply pct to typeof(real) on (
          extend index=pct/100.0*(n-1)
        | extend low_index=tolong(floor(index, 1)), high_index=tolong(ceiling(index))
        | extend interval=toreal(_vals[high_index])-toreal(_vals[low_index])
        | extend pct_val=toreal(_vals[low_index])+(index-low_index)*interval
        | summarize pct_arr=make_list(pct), pct_val=make_list(pct_val))
    | project-away n
}
;
datatable(x:long, name:string) [
5, 'A',
9, 'A',
7, 'A',
5, 'B',
7, 'B',
7, 'B',
10, 'B',
]
| invoke percentiles_linear_fl('x', dynamic([0, 25, 50, 75, 100]), 'name')
| project-rename name=_key, x=_vals
```

### [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md).  Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One time installation

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate linear interpolated percentiles (identical to Excel's PERCENTILE.INC)")
percentiles_linear_fl(tbl:(*), val_col:string, pct_arr:dynamic, aggr_col:string='')
{
    tbl
    | extend _vals = column_ifexists(val_col, 0.0)
    | extend _key = column_ifexists(aggr_col, 'ALL')
    | order by _key asc, _vals asc 
    | summarize _vals=make_list(_vals) by _key
    | extend n = array_length(_vals)
    | extend pct=pct_arr
    | mv-apply pct to typeof(real) on (
          extend index=pct/100.0*(n-1)
        | extend low_index=tolong(floor(index, 1)), high_index=tolong(ceiling(index))
        | extend interval=toreal(_vals[high_index])-toreal(_vals[low_index])
        | extend pct_val=toreal(_vals[low_index])+(index-low_index)*interval
        | summarize pct_arr=make_list(pct), pct_val=make_list(pct_val))
    | project-away n
}
```

### Usage

```kusto
datatable(x:long, name:string) [
5, 'A',
9, 'A',
7, 'A',
5, 'B',
7, 'B',
7, 'B',
10, 'B',
]
| invoke percentiles_linear_fl('x', dynamic([0, 25, 50, 75, 100]), 'name')
| project-rename name=_key, x=_vals
```

---

```kusto
name	x	pct_arr    pct_val
A      [5,  [0.0,      [5.0,
        7,   25.0,      6.0,
        9]	 50.0,      7.0,
             75.0,      8.0,
             100.0]     9.0]
B      [5,  [0.0,      [5.0,
        7,   25.0,      6.5,
        7,	 50.0,      7.0,
        10]  75.0,      7.75,
             100.0]     10.0]
```
