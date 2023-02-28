---
title: series_rate_fl() - Azure Data Explorer
description: This article describes the series_rate_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/13/2020
---
# series_rate_fl()


The function `series_rate_fl()` calculates the average rate of metric increase per second. Its logic follows PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. It should be used for time series of counter metrics ingested to Azure Data Explorer by [Prometheus](https://prometheus.io/) monitoring system, and retrieved by [series_metric_fl()](series-metric-fl.md).

> [!NOTE]
>`series_rate_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_rate_fl(`*n_bins*`,` *fix_reset*`)`

`T` is a table returned from [series_metric_fl()](series-metric-fl.md). Its schema includes `(timestamp:dynamic, name:string, labels:string, value:dynamic)`.

## Arguments

* *n_bins*: The number of bins to specify the gap between the extracted metric values for calculation of the rate. The function calculates the difference between the current sample and the one *n_bins* before, and divide it by the difference of their respective timestamps in seconds. This parameter is optional, with a default of one bin. The default settings calculate [irate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#irate), the PromQL instantaneous rate function.
* *fix_reset*: A boolean flag controlling whether to check for counter resets and correct it like PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. This parameter is optional, with a default of `true`. Set it to `false` to save redundant analysis in case no need to check for resets.

## Usage

`series_rate_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

> [!NOTE]
> [series_metric_fl()](series-metric-fl.md) is used as a part of the function and must be installed or embedded.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let series_rate_fl=(tbl:(timestamp:dynamic, value:dynamic), n_bins:int=1, fix_reset:bool=true)
{
    tbl
    | where fix_reset                                                   //  Prometheus counters can only go up
    | mv-apply value to typeof(double) on   
    ( extend correction = iff(value < prev(value), prev(value), 0.0)    // if the value decreases we assume it was reset to 0, so add last value
    | extend cum_correction = row_cumsum(correction)
    | extend corrected_value = value + cum_correction
    | summarize value = make_list(corrected_value))
    | union (tbl | where not(fix_reset))
    | extend timestampS = array_shift_right(timestamp, n_bins), valueS = array_shift_right(value, n_bins)
    | extend dt = series_subtract(timestamp, timestampS)
    | extend dt = series_divide(dt, 1e7)                              //  converts from ticks to seconds
    | extend dv = series_subtract(value, valueS)
    | extend rate = series_divide(dv, dt)
    | project-away dt, dv, timestampS, value, valueS
}
;
//
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create function with (folder = "Packages\\Series", docstring = "Simulate PromQL rate()")
series_rate_fl(tbl:(timestamp:dynamic, value:dynamic), n_bins:int=1, fix_reset:bool=true)
{
    tbl
    | where fix_reset                                                   //  Prometheus counters can only go up
    | mv-apply value to typeof(double) on   
    ( extend correction = iff(value < prev(value), prev(value), 0.0)    // if the value decreases we assume it was reset to 0, so add last value
    | extend cum_correction = row_cumsum(correction)
    | extend corrected_value = value + cum_correction
    | summarize value = make_list(corrected_value))
    | union (tbl | where not(fix_reset))
    | extend timestampS = array_shift_right(timestamp, n_bins), valueS = array_shift_right(value, n_bins)
    | extend dt = series_subtract(timestamp, timestampS)
    | extend dt = series_divide(dt, 1e7)                              //  converts from ticks to seconds
    | extend dv = series_subtract(value, valueS)
    | extend rate = series_divide(dv, dt)
    | project-away dt, dv, timestampS, value, valueS
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

---

:::image type="content" source="images/series-rate-fl/all-disks-write-rate-2-bins.png" alt-text="Graph showing rate per second of disk write metric for all disks." border="false":::

## Example

The following example selects the main disk of two hosts, and assumes that the function is already installed. This example uses alternative direct calling syntax, specifying the input table as the first parameter:
    
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
series_rate_fl(series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1"', lookback=2h, offset=now()-datetime(2020-12-08 00:00)), n_bins=10)
| render timechart with(series=labels)
```
    
:::image type="content" source="images/series-rate-fl/main-disks-write-rate-10-bins.png" alt-text="Graph showing rate per second of main disk write metric in the last two hours with 10 bins gap." border="false":::
