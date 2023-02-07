---
title: series_downsample_fl() - Azure Data Explorer
description: This article describes the series_downsample_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/08/2022
---
# series_downsample_fl()


The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). This function takes a table containing multiple time series (dynamic numerical array), and downsamples each series. The output contains both the coarser series and its respective times array. To avoid [aliasing](https://en.wikipedia.org/wiki/Aliasing), the function applies a simple [low pass filter](https://en.wikipedia.org/wiki/Low-pass_filter) on each series before subsampling.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_downsample_fl(`*t_col*`,` *y_col*`,` *ds_t_col*`,` *ds_y_col*`,` *sampling_factor*`)`

## Arguments

* *t_col*: The name of the column (of the input table) containing the time axis of the series to downsample.
* *y_col*: The name of the column (of the input table) containing the series to downsample.
* *ds_t_col*: The name of the column to store the downsampled time axis of each series.
* *ds_y_col*: The name of the column to store the down sampled series.
* *sampling_factor*: an integer specifying the required down sampling.

## Usage

`series_downsample_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
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
}
;
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| invoke series_downsample_fl('TimeStamp', 'num', 'coarse_TimeStamp', 'coarse_num', 4)
| render timechart with(xcolumn=coarse_TimeStamp, ycolumns=coarse_num)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
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

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| invoke series_downsample_fl('TimeStamp', 'num', 'coarse_TimeStamp', 'coarse_num', 4)
| render timechart with(xcolumn=coarse_TimeStamp, ycolumns=coarse_num)
```

---

The time series downsampled by 4:
:::image type="content" source="images/series-downsample-fl/downsampling-demo.png" alt-text="Graph showing downsampling of a time series." border="false":::

For reference, here is the original time series (before downsampling):
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
demo_make_series1
| make-series num=count() on TimeStamp step 1h by OsVer
| render timechart with(xcolumn=TimeStamp, ycolumns=num)
```

:::image type="content" source="images/series-downsample-fl/original-time-series.png" alt-text="Graph showing the original time series, before downsampling" border="false":::

