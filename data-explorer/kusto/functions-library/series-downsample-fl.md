---
title: series_downsample_fl() - Azure Data Explorer
description: This article describes the series_downsample_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_downsample_fl()

The function `series_downsample_fl()` [downsamples a time series by an integer factor](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)#Downsampling_by_an_integer_factor). This function takes a table containing multiple time series (dynamic numerical array), and downsamples each series. The output contains both the coarser series and its respective times array. To avoid [aliasing](https://en.wikipedia.org/wiki/Aliasing), the function applies a simple [low pass filter](https://en.wikipedia.org/wiki/Low-pass_filter) on each series before subsampling.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_downsample_fl(`*t_col*`,` *y_col*`,` *ds_t_col*`,` *ds_y_col*`,` *sampling_factor*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*t_col*|string|&check;|The name of the column that contains the time axis of the series to downsample.|
|*y_col*|string|&check;|The name of the column that contains the series to downsample.|
|*ds_t_col*|string|&check;|The name of the column to store the down sampled time axis of each series.|
|*ds_y_col*|string|&check;|The name of the column to store the down sampled series.|
|*sampling_factor*|int|&check;|An integer specifying the required down sampling.|

## Examples

`series_downsample_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22TTZObMAyG7/wKXToxHdJsOj2lw633Htrp1WNAbLzxB2OLENrtf68MZNOw4RBifTzSKxmDBBGDxigbP7iobGdQtqYUVJmD+JgXQLL25hApaPdcwHh3aqKkteE+YiLyP9mqmnw4aEd59icDfrjC9H4FvBC6BpgFJXB2b53ULV50pCimAkwenbK6Fk8598RFHkSO7yJX/ClrkdvqINhQQMAOFYn9u16T9tDj/Jsn0m4HoLrOjKAg6jQqMH6ATsUIrTaEASpsfUCIfbW94pYm7Hk75yaZ5IHGDn0rvinCn9riourmaHxfGa7r3QQQi4igmzL4QbreVhhEvt0v/OGIXJjd8GGtBEoeFupkESvX7vOnJ2bAgyepfaAj9taqoH/jsi+rTigNL0Dw+W03/1lHuV4ErylyTKWeZafqk7heoyIhb5doYl1Tu+BfsKatGtQ4h7Hzij0r0/McJ2LvJmaqkWd/s69Zg9bLqZ959fvsdWpvOx+BJ1nWvnck0rAhLeMHsWaIhB3sj1CN8D3+wsB52p39CR9+MmLzlrkpYMPU9Kq9ChHlnWuxzRFfcsYGngpfHuKo+qgCwaDpKC7zBS/XDP4KZ08sb6j8H3eKyanLAwAA" target="_blank">Run the query</a>

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

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

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

