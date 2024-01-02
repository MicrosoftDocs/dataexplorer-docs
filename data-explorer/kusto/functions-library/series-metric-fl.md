---
title:  series_metric_fl()
description: This article describes the series_metric_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/30/2023
---
# series_metric_fl()

The `series_metric_fl()` function is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that selects and retrieves time series of metrics ingested to your cluster using the [Prometheus](https://prometheus.io/) monitoring system. This function assumes the data stored in your cluster is structured following the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/). Specifically, each record contains:

* timestamp
* metric name
* metric value
* a variable set of labels (`"key":"value"` pairs)

 Prometheus defines a time series by its metric name and a distinct set of labels. You can retrieve sets of time series using [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/) by specifying the metric name and time series selector (a set of labels).

## Syntax

`T | invoke series_metric_fl(`*timestamp_col*`,` *name_col*`,` *labels_col*`,` *value_col*`,` *metric_name*`,` *labels_selector*`,` *lookback*`,` *offset*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *timestamp_col* | string | &check; | The name of the column containing the timestamp.|
| *name_col* | string | &check; | The name of the column containing the metric name.|
| *labels_col* | string | &check; | The name of the column containing the labels dictionary.|
| *value_col* | string | &check; | The name of the column containing the metric value.|
| *metric_name* | string | &check; | The metric time series to retrieve.|
| *labels_selector* | string | | Time series selector string, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#time-series-selectors). It's a string containing a list of `"key":"value"` pairs, for example `'"key1":"val1","key2":"val2"'`. The default is an empty string, which means no filtering. Note that regular expressions are not supported.|
| *lookback* | timespan | | The range vector to retrieve, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#range-vector-selectors). The default is 10 minutes.|
| *offset* | datetime | | Offset back from current time to retrieve, [similar to PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier). Data is retrieved from *ago(offset)-lookback* to *ago(offset)*. The default is 0, which means that data is retrieved up to `now()`.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `series_metric_fl()`, see [Examples](#examples).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21Ty66bMBDd8xUWG+wKbkjUVmmu+IOqm1bdVBUyMAQXY0eMk9y06b/XNhBCGm/8mPGZM+fYEgxB6AVg3oHpRZnXMqPDEnNTyB19x2JiRAdoeHfISy13aKNqHxPFO1gcSF6AxMXRicvjMmms4y4/XkSQUBrdj+dZFNmQ1m3By3bnORy4yqYFXaed5abrGsE8CaeMBX8CYof0XQ7YeZWJuqYPFUmWEVetulheoqQ/ouinxcaDFOYxNyZRHDH2eoMGV5JkhO81HdjcBXEMDknJrZ8h405pv78SeDOgqllxe9Wqd+xULmp4E2iQLtywnLnx4FQdpWRs8OXJtckuyz9ik+ZP8mYXZz0maG/nkzs3m2OSsmUntzojVm50/gu1GuswMozVilhUdYLeEKPJ8AIItwCo7VFxIS1cRuRzAz2MbWb3D8rnz9IVYM4AinoPXl68ShM73VfQO9g5nWM5BvHYdbwXv2HhQ8dbyKXtd3ZgkiSbY37PHLJjNOm8YD5K0nDMuZSEzm+TBX+D12C1CirodH7otW2ugSMGVyLUSbfw32+l0TdL5qsjY99v9MXWdPNnX8KtvnPppnMvDPiDsBLYhrsQK74O47DRaOyOt5jwPShz0Fom2226/fj+w6fk1CGmbqzDaPprmdJnypLbu9ukmzRZb5J0S9J0l7p/dyW99d4K7BLKhlsHz8I0dGCfjdb/A8laNKd+BAAA" target="_blank">Run the query</a>

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
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Examples](#examples).

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

---

## Examples

The following examples use the [invoke operator](../query/invoke-operator.md) to run the function.

### With specifying selector

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21TTY/bIBC951cgXwyVvetEbZVmxT9Y9dKql6qyiD2OWWOIPCTZtOl/L2A7jtNw4WOGN2/eAwWWIHQSMG/BdrLIK8Vpv8TcbtWGfmAJsbIFtKLd54VRG3RRvUuIFi3MDpTYgsLZ0VGowzxpqOMv319EUFBY0w3nPI5dyJhmK4pmEzjshebjgi6z1nEzVYVgH4QzxhZ/FsQNFbrssfOSy6qidxUJ58RXK8+Olyzozzj+5bBxr6S9z01InMSMvVyhwZcknIidoT2bmyAOwT4pvfbTZ9woHfYXAu8WdDkp7q469Q6tzmUF7xIt0pkbjrOwAZzqg1KM9b48uDba5fjHbNT8Qd7k4qTHCB3sfHDnanNCMjbv5FpnwMqtyd/Q6KEOI/14fiYOVR+hs8Qa0r8AIhwAGne0PZMGzgPyqYYOhjb57YMK+ZN0W7AnAE2DB09PQaWRnelK6DzslC6wGIJ4aFvRyd8w86EVDeTK9Ts5MErCp1jYM4/sGY06z5gPktQCc6EUodPbZIu/L4sSWpPvO+Maq+GAiwuR+mga+O+n0vi7I/LNE3FvN/7q6vn5NcD71Q+h/HTqpIVwEJUSm2gTYSmWURLVBq3biQZTsQNt98aodL3O1p8/fvqSHlvEzI9lFI//jGtzoiy9vrlVtsrS5SrN1iTLNpn/cxfSOd+duD6hqIVz7yRtTXv2fLD9H28bjCx6BAAA" target="_blank">Run the query</a>

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
};
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1","host":"aks-agentpool-88086459-vmss000001"', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
demo_prometheus
| invoke series_metric_fl('TimeStamp', 'Name', 'Labels', 'Val', 'writes', '"disk":"sda1","host":"aks-agentpool-88086459-vmss000001"', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels)
```

---

**Output**

:::image type="content" source="images/series-metric-fl/disk-write-metric-10m.png" alt-text="Graph showing disk write metric over 10 minutes." border="false":::

### Without specifying selector

The following example doesn't specify selector, so all 'writes' metrics are selected. This example assumes that the function is already installed, and uses alternative direct calling syntax, specifying the input table as the first parameter:

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA21TwY7bIBC95yvmZqicXW9OVVb8QdVLq16qCmFnvKbBJgKySdrtv3cAO46j+GKYGd483hsMBvDoNHrZY3C6ka0RLC+9DLXZsk+8hKB79EH1B9lYs/WUHd5KGFSPi4BRNRq/CL0rc1wWjX3i4fuDHg02wboxLoqCUtbua9Xst4nDQQ1iWrCXqidutm09hgfpivPV3xXQZ9ItM7bcCd227K4jCAGx2+5CvHTDfhbFL8L2B6PDfW0JRVlw/nqFxtgSBKg3yzKbm6Qfk7lofb1PrrhROu0/AM8Bh92sOB0l9Y79IHWLZ+2DZws3iLMKCZwNR2M4z748ODbZRfwLPmn+oG52cdZjgk52PjhztbmEii9vcu0zYslg5W9vh7EPh/w9PwOhDu/oAgQLeQJAEYC3FKovsMfLiHzq0OF4TXE7UKl+lq7GcEIcWPLg6SmpNLGzbocuws7lyjdj0h/7Xjn9Bxc+9GqP0tB9ZwcmScScS3sekSOjSecF81GSTnmpjAE2zyZf/Xtd3T9ItsPeyoOzFOnw6MnA70TgWyRAM1t8pT7x/yXBxtUPZeLv5HTAGMhTKQZ7Ynx9nZdNtanWL5t19RmqalvF9/IBjjwjYWJB0ylS/qRDxzIlkYmXcEkPQ6gzev4fmU9bcEMEAAA=" target="_blank">Run the query</a>

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
};
series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels, ysplit=axes)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
series_metric_fl(demo_prometheus, 'TimeStamp', 'Name', 'Labels', 'Val', 'writes', offset=now()-datetime(2020-12-08 00:00))
| render timechart with(series=labels, ysplit=axes)
```

---

**Output**

:::image type="content" source="images/series-metric-fl/all-disks-write-metric-10m.png" alt-text="Graph showing disk write metric for all disks over 10 minutes." border="false":::
