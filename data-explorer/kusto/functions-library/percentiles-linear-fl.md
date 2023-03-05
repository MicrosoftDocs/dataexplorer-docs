---
title: percentiles_linear_fl() - Azure Data Explorer
description: Learn how to use the percentiles_linear_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# percentiles_linear_fl()

The function `percentiles_linear_fl()` calculates percentiles using linear interpolation between closest ranks, the same method used by Excel's [PERCENTILES.INC](https://support.microsoft.com/en-us/office/percentile-inc-function-680f9539-45eb-410b-9a5e-c1355e5fe2ed) function. Kusto native [percentile functions](../query/percentiles-aggfunction.md) use the nearest rank method. For large sets of values the difference between both methods is insignificant, and we recommend using the native function for best performance. For further details on these and additional percentile calculation methods have a look at [percentile article on Wikipedia](https://en.wikipedia.org/wiki/Percentile#Calculation_methods).
The function accepts a table containing the column to calculate on and an optional grouping key, and a dynamic array of the required percentiles, and returns a column containing dynamic array of the percentiles' values per each group.

> [!NOTE]
>
> * `percentiles_linear_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke percentiles_linear_fl(`*val_col*`,` *pct_arr* [`,` *aggr_col* ]`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *val_col* | string | &check; | The name of the column that contains the values with which to calculate the percentiles.|
| *pct_arr* | dynamic | &check; | A numerical array containing the required percentiles. Each percentile should be in the range [0-100]. |
| *aggr_col* | string | | The name of the column that contains the grouping key.|

## Usage

`percentiles_linear_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

### [Query-defined](#tab/query-defined)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21T246bMBB95yvmDTt1tkml1WpT8bB93j+IIuTAhLgxNjJOFtrtv3cMJpcV8DAwPnPmzMUaPTToCjReaWxzrQxKlx90xvxeb9iCC7hInRdWb1rvlKkENIXPpXObsjeyVoUAWVXuDpGlKU/+JkAPcQz2E7DzaErIiayFDAh9rk2uDtip1rcs5hCwelrxLyEn7GcipqQC0rf393QKsq5EB/t+DJMtyRtz0idETHuua+nUHxyPslqekCpvPRv++RT+qMOQCCpb9rlGU/ljBD+CqDdZ7E88qC9L2TS6D0fgLfi+QXtgDqXmYA2wATc+kUSZErtA8329on4smFmu+RV2zaXtRz5CvdXWVOygrXVscAlYcxrdUVXHR0yBimZcjSg+w6qMR0eVUUBpz3uNY53bG9WOL7+cXZXsZghDO2b47mK+jWqWVxdfTCru6G5Tiw2+mxt5uLhmevAHD5+m1Dj7Gwu/lB+yB5P8S34mpfT0Bl3dJnRIAG01xlXmsE2ew4alInmN9iXa4P8V/+/tehU/dskndfNiTzh/xVjapQLiLWJbCvtBnM9kX8jS6HdUUxrU0HbftDsMrkFlFrZUQJcNLf0PuYtI1MwDAAA=" target="_blank">Run the query</a>

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
        | extend interval=todouble(_vals[high_index])-todouble(_vals[low_index])
        | extend pct_val=todouble(_vals[low_index])+(index-low_index)*interval
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

### [Stored](#tab/stored)

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
        | extend interval=todouble(_vals[high_index])-todouble(_vals[low_index])
        | extend pct_val=todouble(_vals[low_index])+(index-low_index)*interval
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

**Output**

|name|x|pct_arr|pct_val|
|--|--|--|--|
|A|[5,7,9]|[0,25,50,75,100]|[5,6,7,8,9]|
|B|[5,7,7,10]|[0,25,50,75,100]|[5,6.5,7,7.75,10]
