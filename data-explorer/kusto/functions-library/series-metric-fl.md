---
title: series_metric_fl() - Azure Data Explorer
description: This article describes the series_metric_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 12/13/2020
---
# series_metric_fl()


The `series_metric_fl()` function selects and retrieves time series of metrics ingested to Azure Data Explorer using the [Prometheus](https://prometheus.io/) monitoring system. This function assumes the data stored in Azure Data Explorer is structured following the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). Specifically, each record contains:
 * timestamp 
 * metric name 
 * metric value 
 * a variable set of labels (`"key":"value"` pairs)
 
 Prometheus defines a time series by its metric name and a distinct set of labels. You can retrieve sets of time series using [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/) by specifying the metric name and time series selector (a set of labels).

> [!NOTE]
> `series_metric_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke series_metric_fl(`*timestamp_col*`,` *name_col*`,` *labels_col*`,` *value_col*`,` *metric_name*`,` *labels_selector*`,` *lookback*`,` *offset*`)`

## Arguments

* *timestamp_col*: The name of the column containing the timestamp.
* *name_col*: The name of the column containing the metric name.
* *labels_col*: The name of the column containing the labels dictionary.
* *value_col*: The name of the column containing the metric value.
* *metric_name*: The metric time series to retrieve.
* *labels_selector*: Time series selector string, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#time-series-selectors). It's a string containing a list of `"key":"value"` pairs, for example `'"key1":"val1","key2":"val2"'`. This parameter is optional, default to empty string, that means no filtering. Note that regular expressions are not supported. 
* *lookback*: Range vector to retrieve, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#range-vector-selectors). This parameter is optional, default to 10 minutes.
* *offset*: Offset back from current time to retrieve, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier). Data is retrieved from *ago(offset)-lookback* to *ago(offset)*. This parameter is optional, default is 0, which means that data is retrieved up to now().

## Usage

`series_metric_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let series_metric_fl=(metrics_tbl:(*), timestamp_col:string, name_col:string, labels_col:string, value_col:string, metric_name:string, labels_selector:string='', lookback:timespan=timespan(10m), offset:timespan=timespan(0))
{
    let selector_d=iff(labels_selector == '', dynamic(['']), split(labels_selector, ','));
    let etime = ago(offset);
    let stime = etime - lookback;
    metrics_tbl
    | extend timestamp = column_ifexists(timestamp_col, datetime(null)), name = column_ifexists(name_col, ''), labels = column_ifexists(labels_col, dynamic(null)), value = column_ifexists(value_col, 0)
    | extend labels = dynamic_to_json(labels)       //  convert to string and sort by key
    | where name == metric_name and timestamp between(stime..etime)
    | order by timestamp asc
    | summarize timestamp = make_list(timestamp), value=make_list(value) by name, labels
    | where labels has_all (selector_d)
}
;
//
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1","host":"aks-agentpool-88086459-vmss000001"', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create function with (folder = "Packages\\Series", docstring = "Selecting & retrieving metrics like PromQL")
series_metric_fl(metrics_tbl:(*), timestamp_col:string, name_col:string, labels_col:string, value_col:string, metric_name:string, labels_selector:string='', lookback:timespan=timespan(10m), offset:timespan=timespan(0))
{
    let selector_d=iff(labels_selector == '', dynamic(['']), split(labels_selector, ','));
    let etime = ago(offset);
    let stime = etime - lookback;
    metrics_tbl
    | extend timestamp = column_ifexists(timestamp_col, datetime(null)), name = column_ifexists(name_col, ''), labels = column_ifexists(labels_col, dynamic(null)), value = column_ifexists(value_col, 0)
    | extend labels = dynamic_to_json(labels)       //  convert to string and sort by key
    | where name == metric_name and timestamp between(stime..etime)
    | order by timestamp asc
    | summarize timestamp = make_list(timestamp), value=make_list(value) by name, labels
    | where labels has_all (selector_d)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1","host":"aks-agentpool-88086459-vmss000001"', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels)
```

---

:::image type="content" source="images/series-metric-fl/disk-write-metric-10m.png" alt-text="Graph showing disk write metric over 10 minutes." border="false":::

## Example

The following example doesn't specify selector, so all 'writes' metrics are selected. This example assumes that the function is already installed, and uses alternative direct calling syntax, specifying the input table as the first parameter:
    
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels, ysplit=axes)
```
    
:::image type="content" source="images/series-metric-fl/all-disks-write-metric-10m.png" alt-text="Graph showing disk write metric for all disks over 10 minutes." border="false":::
