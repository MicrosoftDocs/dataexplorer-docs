---
title: series_rate_fl() - Azure Data Explorer
description: This article describes the series_rate_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 12/13/2020
---
# series_rate_fl()


The function `series_rate_fl()` calculates the average rate of metric increase per second. Its logic follows PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. It should be used for time series of counter metrics ingested to ADX by [Prometheus](https://prometheus.io/) monitoring system, and retrieved by [series_metric_fl()](series-metric-fl.md).

> [!NOTE]
>`series_rate_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_rate_fl(`*n_bins*`)`

`T` is a table returned from [series_metric_fl()](series-metric-fl.md). Its schema includes `(timestamp:dynamic, name:string, labels:string, value:dynamic)`.

## Arguments

* *n_bins*: The number of bins to specify the gap between the extracted metric values for calculation of the rate. The function calculates the difference between the current sample and the one *n_bins* before, and divide it by the difference of their respective timestamps in seconds. This parameter is optional, default to one bin, which calculates [irate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#irate), PromQL instantaneous rate function.

## Usage

`series_rate_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

> [!NOTE]
> [series_metric_fl()](series-metric-fl.md) is used as a part of the function and must be installed or embedded.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using the [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let series_rate_fl=(tbl:(timestamp:dynamic, name:string, labels:string, value:dynamic), n_bins:int=1)
{
    tbl
    | extend timestampS = array_shift_right(timestamp, n_bins), valueS = array_shift_right(value, n_bins)
    | extend dt = series_subtract(timestamp, timestampS)
    | extend dt = series_divide(dt, 1e7)                              //  converts from ticks to seconds
    | extend dv = series_subtract(value, valueS)
    | extend dv = array_iff(series_greater_equals(dv, 0), dv, value)  //  handles negative difference like PromQL
    | extend rate = series_divide(dv, dt)
    | project timestamp, name, rate, labels
}
;
//
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Simulate PromQL rate()")
series_rate_fl(tbl:(timestamp:dynamic, name:string, labels:string, value:dynamic), n_bins:int=1)
{
    tbl
    | extend timestampS = array_shift_right(timestamp, n_bins), valueS = array_shift_right(value, n_bins)
    | extend dt = series_subtract(timestamp, timestampS)
    | extend dt = series_divide(dt, 1e7)                              //  converts from ticks to seconds
    | extend dv = series_subtract(value, valueS)
    | extend dv = array_iff(series_greater_equals(dv, 0), dv, value)  //  handles negative difference like PromQL
    | extend rate = series_divide(dv, dt)
    | project timestamp, name, rate, labels
}
```

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

---

:::image type="content" source="images/series-rate-fl/all-disks-write-rate-2bins.png" alt-text="Graph showing rate per second of disk write metric for all disks" border="false":::

## Example

The following example selects the main disk of two hosts, and assumes that the function is already installed. This example uses alternative direct calling syntax, specifying the input table as the first parameter:
    
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
series_rate_fl(series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', 'disk:sda1', lookback=2h, offset=now()-datetime(2020-12-08 00:00)), n_bins=10)
| render timechart with(series=labels)
```
    
:::image type="content" source="images/series-rate-fl/main-disks-write-rate-10bins.png" alt-text="Graph showing rate per second of main disk write metric in the last two hours with 10 bins gap" border="false":::
