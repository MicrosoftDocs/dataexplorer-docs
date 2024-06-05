---
title:  series_downsample_fl()
description:  This article describes the series_downsample_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# series_downsample_fl()

The function `series_downsample_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). This function takes a table containing multiple time series (dynamic numerical array), and downsamples each series. The output contains both the coarser series and its respective times array. To avoid [aliasing](https://en.wikipedia.org/wiki/Aliasing), the function applies a simple [low pass filter](https://en.wikipedia.org/wiki/Low-pass_filter) on each series before subsampling.

## Syntax

`T | invoke series_downsample_fl(`*t_col*`,` *y_col*`,` *ds_t_col*`,` *ds_y_col*`,` *sampling_factor*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*t_col*| `string` | :heavy_check_mark:|The name of the column that contains the time axis of the series to downsample.|
|*y_col*| `string` | :heavy_check_mark:|The name of the column that contains the series to downsample.|
|*ds_t_col*| `string` | :heavy_check_mark:|The name of the column to store the down sampled time axis of each series.|
|*ds_y_col*| `string` | :heavy_check_mark:|The name of the column to store the down sampled series.|
|*sampling_factor*| `int` | :heavy_check_mark:|An integer specifying the required down sampling.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_downsample_fl()`, see [Example](#example).

```kusto
let series_downsample_fl=(tbl:(*), t_col:string, y_col:string, ds_t_col:string, ds_y_col:string, sampling_factor:int)
{
    tbl
    | extend _t_ = column_ifexists(t_col, dynamic(0)), _y_ = column_ifexists(y_col, dynamic(0))
    | extend _y_ = series_fir(_y_, repeat(1, sampling_factor), true, true)    //  apply a simple low pass filter before sub-sampling
    | mv-apply _t_ to typeof(DateTime), _y_ to typeof(double) on
    (extend rid=row_number()-1
    | where rid % sampling_factor == ceiling(sampling_factor/2.0)-1                    //  sub-sampling
    | summarize _t_ = make_list(_t_), _y_ = make_list(_y_))
    | extend cols = bag_pack(ds_t_col, _t_, ds_y_col, _y_)
    | project-away _t_, _y_
    | evaluate bag_unpack(cols)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Downsampling a series by an integer factor")
series_downsample_fl(tbl:(*), t_col:string, y_col:string, ds_t_col:string, ds_y_col:string, sampling_factor:int)
{
    tbl
    | extend _t_ = column_ifexists(t_col, dynamic(0)), _y_ = column_ifexists(y_col, dynamic(0))
    | extend _y_ = series_fir(_y_, repeat(1, sampling_factor), true, true)    //  apply a simple low pass filter before sub-sampling
    | mv-apply _t_ to typeof(DateTime), _y_ to typeof(double) on
    (extend rid=row_number()-1
    | where rid % sampling_factor == ceiling(sampling_factor/2.0)-1                    //  sub-sampling
    | summarize _t_ = make_list(_t_), _y_ = make_list(_y_))
    | extend cols = bag_pack(ds_t_col, _t_, ds_y_col, _y_)
    | project-away _t_, _y_
    | evaluate bag_unpack(cols)
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22TTZObMAyG7/kVunRiOtBsOj2lw633Htrp1WNAbLzxB2OLENrtf68MZNOw4RBifTzSKxmDBBGDxigbP7iobGdQtqYUVJmD+JjlQLL25hApaPecw3h3aqKkteE+YiLyP9mqmnw4aEfZ5s8G+OEK0/sV8ELoGmAWlMDZvXVSt3jRkaKYCjB5dMrqWjxl3BMXeRA5votc8aesRW6rg2BDDgE7VCT273pN2kOP82+WSLsdgOo6M4KCqNOowPgBOhUjtNoQBqiw9QEh9lVxxS1N2HMx5yaZ5IHGDn0rvinCn9riourmaHxfGa7r3QQQi4igmzL4QbreVhhEVuwX/nBELsxu+LBWAiUPC3WyiJVr9/nTEzPgwZPUPtARe2tV0L9x2ZdVJ5SGFyD4/Lab/6yjXC+C1xQ5plLPslP1SVyvUZ6Qt0s0sa6pXfAvWFOhBjXOYey8Ys/K9DzHidi7iZlqZJu/XzcNWi+ndubN7zevU3fFfAQeZFn73pFIs4a0ix/EkiESdrA/QjXC9/gLA+dpd/YnfPjFiO1b5jaHLVPTq/YqRJR3rsU2R3zJGBt4KHx3iKPqowoEg6ajuMz3u1wz+COcPbG8obJ/VvBUm8oDAAA=" target="_blank">Run the query</a>

```kusto
let series_downsample_fl=(tbl:(*), t_col:string, y_col:string, ds_t_col:string, ds_y_col:string, sampling_factor:int)
{
    tbl
    | extend _t_ = column_ifexists(t_col, dynamic(0)), _y_ = column_ifexists(y_col, dynamic(0))
    | extend _y_ = series_fir(_y_, repeat(1, sampling_factor), true, true)    //  apply a simple low pass filter before sub-sampling
    | mv-apply _t_ to typeof(DateTime), _y_ to typeof(double) on
    (extend rid=row_number()-1
    | where rid % sampling_factor == ceiling(sampling_factor/2.0)-1                    //  sub-sampling
    | summarize _t_ = make_list(_t_), _y_ = make_list(_y_))
    | extend cols = bag_pack(ds_t_col, _t_, ds_y_col, _y_)
    | project-away _t_, _y_
    | evaluate bag_unpack(cols)
};
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| invoke series_downsample_fl('TimeStamp', 'num', 'coarse_TimeStamp', 'coarse_num', 4)
| render timechart with(xcolumn=coarse_TimeStamp, ycolumns=coarse_num)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| invoke series_downsample_fl('TimeStamp', 'num', 'coarse_TimeStamp', 'coarse_num', 4)
| render timechart with(xcolumn=coarse_TimeStamp, ycolumns=coarse_num)
```

---

**Output**

The time series downsampled by 4:
:::image type="content" source="media/series-downsample-fl/downsampling-demo.png" alt-text="Graph showing downsampling of a time series." border="false":::

For reference, here is the original time series (before downsampling):

```kusto
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| render timechart with(xcolumn=TimeStamp, ycolumns=num)
```

:::image type="content" source="media/series-downsample-fl/original-time-series.png" alt-text="Graph showing the original time series, before downsampling" border="false":::
