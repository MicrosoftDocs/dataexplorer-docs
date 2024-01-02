---
title:  series_rate_fl()
description: This article describes the series_rate_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/30/2023
---
# series_rate_fl()

The function `series_rate_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates the average rate of metric increase per second. Its logic follows PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. It should be used for time series of counter metrics ingested to your cluster by [Prometheus](https://prometheus.io/) monitoring system, and retrieved by [series_metric_fl()](series-metric-fl.md).

## Syntax

`T | invoke series_rate_fl(`[ *n_bins* [`,` *fix_reset* ]]`)`

`T` is a table returned from [series_metric_fl()](series-metric-fl.md). Its schema includes `(timestamp:dynamic, name:string, labels:string, value:dynamic)`.

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*n_bins*|int||The number of bins to specify the gap between the extracted metric values for calculation of the rate. The function calculates the difference between the current sample and the one *n_bins* before, and divide it by the difference of their respective timestamps in seconds. The default is one bin. The default settings calculate [irate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#irate), the PromQL instantaneous rate function.|
|*fix_reset*|bool||Controls whether to check for counter resets and correct it like PromQL [rate()](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate) function. The default is `true`. Set it to `false` to save redundant analysis in case no need to check for resets.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `series_rate_fl()`, see [Examples](#examples).

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
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Examples](#examples).

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

---

## Examples

The following examples use the [invoke operator](../query/invoke-operator.md) to run the function.

### Calculate average rate of metric increase

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

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
};
//
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| invoke series_rate_fl(2)
| render timechart with(series=labels)
```

---

**Output**

:::image type="content" source="images/series-rate-fl/all-disks-write-rate-2-bins.png" alt-text="Graph showing rate per second of disk write metric for all disks." border="false":::

### Selects the main disk of two hosts

The following example selects the main disk of two hosts, and assumes that the function is already installed. This example uses alternative direct calling syntax, specifying the input table as the first parameter:

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WUzY7TMBDH732KUS8bi5SmvYACeQOEkBZxjZx4sjF17MieJFtY3p3JV6uWFQhfHI9n/vMbeSYGCQJ6jSH3kjCvTBZRYdKIdIOBZNOm6mxlo8sYemk6XI8iBpsX2oZUW8oOMVT6OfcYkNLCOZOR71Bsfm6AFwtO+wsMNXq8usL/r/0e4It3DVKNXYDSdZbQ84e04Kw5w5ODrl3SNf1Oti0bJ3QgB3Ru0VWRcl1hUHAE+03OEeAzoVWs6D2WpPkqA11V0Rz7EVqP/Xzg2m8OydtELGy6AgZb8iksPcqAAQYEGULXIGiCQQaYy2egJIbgQCoFRgaaAxf6Fahr8hso74acjSwXXe3iLmi+QJXPKNmC9OZObolirUZ6/WMlz6CRJ8yNDhTdSYk1U2dHnLFbLg9rHUWXxxV3SJeOemR56b0856HWFeVeP9V0bbi1scTSca+7T1cX19tMijhk6erQFeRleaN/JflLoNK9VhgpiuGA78S/u7J0tkdPASpuT85RnsL4wAH5QoW7RP0rhEtJc9F3ZONw/snWx4y8erbefed32slBnmHEHq+vpS7Cq/7m14fNfr+5nf1oOfJ0eV2OBoWNy9vLvMXw8JUVH0fFBz58lg2O+ydZoAnj1zdpxm3wmnAybJUOp226DUoetmwwzp0KWZ6yYx2DqyrulMy6IRI7xRAjb3RMjsnucNwl7yFJ0iQRl59NdkjE5oWnxyr0U3FlLT2PlKZ6gc/MxCJ+A6Niv4DaBAAA" target="_blank">Run the query</a>

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
};
//
series_rate_fl(series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1"', lookback=2h, offset=now()-datetime(2020-12-08 00:00)), n_bins=10)
| render timechart with(series=labels)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
series_rate_fl(series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1"', lookback=2h, offset=now()-datetime(2020-12-08 00:00)), n_bins=10)
| render timechart with(series=labels)
```

---

**Output**

:::image type="content" source="images/series-rate-fl/main-disks-write-rate-10-bins.png" alt-text="Graph showing rate per second of main disk write metric in the last two hours with 10 bins gap." border="false":::
