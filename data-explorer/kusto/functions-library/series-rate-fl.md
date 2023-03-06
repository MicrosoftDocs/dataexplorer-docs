---
title: series_rate_fl() - Azure Data Explorer
description: This article describes the series_rate_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# series_rate_fl()

The function `series_rate_fl()` calculates the average rate of metric increase per second. Its logic follows PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. It should be used for time series of counter metrics ingested to Azure Data Explorer by [Prometheus](https://prometheus.io/) monitoring system, and retrieved by [series_metric_fl()](series-metric-fl.md).

> [!NOTE]
>`series_rate_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_rate_fl(`[ *n_bins* [`,` *fix_reset* ]]`)`

`T` is a table returned from [series_metric_fl()](series-metric-fl.md). Its schema includes `(timestamp:dynamic, name:string, labels:string, value:dynamic)`.

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n_bins*|int||The number of bins to specify the gap between the extracted metric values for calculation of the rate. The function calculates the difference between the current sample and the one *n_bins* before, and divide it by the difference of their respective timestamps in seconds. The default is one bin. The default settings calculate [irate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#irate), the PromQL instantaneous rate function.|
|*fix_reset*|bool||Controls whether to check for counter resets and correct it like PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. The default is `true`. Set it to `false` to save redundant analysis in case no need to check for resets.|

## Usage

`series_rate_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

> [!NOTE]
> [series_metric_fl()](series-metric-fl.md) is used as a part of the function and must be installed or embedded.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WUzY7TMBDH73mKua0jUpr2AirkDRBCWsQ1cuLJxjSxI3uSbGF5d8b5aNWwApGL4/n4z2/ksRsk8Og0+txJwrxqMkFFcxKkW/Qk2+6kLka2ukxgkE2P6zZOwOSFNv6kDWWHBCr9nDv0SKfC2iYj12Mc/YyAPxac1hcYa3R4C4X///Z7gC/Otkg19h5K2xtCxz/SgDXNBZ4s9N1Srh12suvYOKEDWaBLh7YSyvZFgzFncNwULACfCY1iReewJM2uDHRViTn3I3QOh3nDvd9t0rdpvLDpChhsqaewdCg9ehgRpPd9i6AJRulhbp+B0gS8BakUNNLTnLjQr0B9m99BOTvmbGQ5cbPHm6TZgSqfUbIF6c1GbslirVY6/WMlz6CVZ8wb7UlspOK1Um8CTpiW68EaS+J6uPEG6TpRjywvnZOX3Ne6otzpp5puA7cOVrxM3Ovhk+sael9JEacsU+37gpws7/RvJH9JVHrQCoWiBA74Lv73VJbWDOjIQ8XjyTXKsw8H7JEdym8KDa8QLi3NTW/IwuX8k21IGHmN7Jz9zue0k6O8QMAO7luri/CqH/2KPkT7faSwtXl3vVDRC2gz2DOupdjudMnvgnj4ylqPQeshgYfPssWwfpIFNj78fZNNWEanCYPBVhVPQWbsKOKdYv7AIo7pMd0djrv0PaTpKU15SrYll4dIHIPLcffopj7KWjq+PZpqMUdmzVQ8/g0kHb6PxQQAAA==" target="_blank">Run the query</a>

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

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2OywrDIBBF9/0KySYREjCuSsA/KN20dCsmTlDiIziWbPrx1bSrO/dwGQ5CsoAyqQxydR3+qoec7FKBBh/lnmIhBt7Yk/ZpPTyy8ntbyl15qHlTMzis10u5GkeyGU7QaItbMzWo1dgU4GLcZrVsgpuexHVFyCLEo6ODLhK5fO8442wY+cCuhLGJMUp7EuRsA4qR0cuHJAgaEqnjxaiUyWGz+csLd7rQL1n/Rx7aAAAA" target="_blank">Run the query</a>

```kusto
series_rate_fl(series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1"', lookback=2h, offset=now()-datetime(2020-12-08 00:00)), n_bins=10)
| render timechart with(series=labels)
```

:::image type="content" source="images/series-rate-fl/main-disks-write-rate-10-bins.png" alt-text="Graph showing rate per second of main disk write metric in the last two hours with 10 bins gap." border="false":::
