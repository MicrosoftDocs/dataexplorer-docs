---
title:  time_weighted_avg_fl()
description: This article describes time_weighted_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# time_weighted_avg_fl()

The function `time_weighted_avg_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates the time weighted average of a metric in a given time window, over input time bins. This function is similar to [summarize operator](../query/summarize-operator.md). The function aggregates the metric by time bins, but instead of calculating simple [avg()](../query/avg-aggfunction.md) of the metric value in each bin, it weights each value by its duration. The duration is defined from the timestamp of the current value to the timestamp of the next value.

This type of aggregation is required for use cases where the metric values are emitted only when changed (and not in constant intervals). For example in IoT, where edge devices send metrics to the cloud only upon changes, and optimize communication bandwidth.

## Syntax

`T | invoke time_weighted_avg_fl(`*t_col*, *y_col*, *key_col*, *stime*, *etime*, *dt*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *t_col* | string |  :heavy_check_mark: | The name of the column containing the time stamp of the records.|
| *y_col* | string |  :heavy_check_mark: | The name of the column containing the metric value of the records.|
| *key_col* | string |  :heavy_check_mark: | The name of the column containing the partition key of the records.|
| *stime* | datetime |  :heavy_check_mark: | The start time of the aggregation window.|
| *etime* | datetime |  :heavy_check_mark: | The end time of the aggregation window.|
| *dt* | timespan |  :heavy_check_mark: | The aggregation time bin.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `time_weighted_avg_fl()`, see [Example](#example).

```kusto
let time_weighted_avg_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan)
{
    let tbl_ex = tbl | extend timestamp = column_ifexists(t_col, datetime(null)), value = column_ifexists(y_col, 0.0), key = column_ifexists(key_col, '');
    let gridTimes = range timestamp from stime to etime step dt | extend value=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where timestamp between (stime..etime)
    | partition hint.strategy=native by key (
        order by timestamp asc, value nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(value), s.f_value, value);)    // fill forward null values
        | extend diff_t=(next(timestamp)-timestamp)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(timestamp, dt, stime), key
    | where t_sum > 0
    | extend tw_avg = tw_sum/t_sum
    | project-away tw_sum, t_sum
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time weighted average of a metric")
time_weighted_avg_fl(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan)
{
    let tbl_ex = tbl | extend timestamp = column_ifexists(t_col, datetime(null)), value = column_ifexists(y_col, 0.0), key = column_ifexists(key_col, '');
    let gridTimes = range timestamp from stime to etime step dt | extend value=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where timestamp between (stime..etime)
    | partition hint.strategy=native by key (
        order by timestamp asc, value nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(value), s.f_value, value);)    // fill forward null values
        | extend diff_t=(next(timestamp)-timestamp)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(timestamp, dt, stime), key
    | where t_sum > 0
    | extend tw_avg = tw_sum/t_sum
    | project-away tw_sum, t_sum
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let time_weighted_avg_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan)
{
    let tbl_ex = tbl | extend timestamp = column_ifexists(t_col, datetime(null)), value = column_ifexists(y_col, 0.0), key = column_ifexists(key_col, '');
    let gridTimes = range timestamp from stime to etime step dt | extend value=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where timestamp between (stime..etime)
    | partition hint.strategy=native by key (
        order by timestamp asc, value nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(value), s.f_value, value);)    // fill forward null values
        | extend diff_t=(next(timestamp)-timestamp)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(timestamp, dt, stime), key
    | where t_sum > 0
    | extend tw_avg = tw_sum/t_sum
    | project-away tw_sum, t_sum
};
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(2021-04-26 00:00), 100, 'Device1',
    datetime(2021-04-26 00:45), 200, 'Device1',
    datetime(2021-04-26 01:06), 100, 'Device1',
    datetime(2021-04-26 00:30), 400, 'Device2',
    datetime(2021-04-26 01:00), 100, 'Device2',
    datetime(2021-04-26 02:00), 300, 'Device2',
];
let minmax=materialize(tbl | summarize mint=min(ts), maxt=max(ts));
let stime=toscalar(minmax | project mint);
let etime=toscalar(minmax | project maxt);
let dt = 1h;
tbl
| invoke time_weighted_avg_fl('ts', 'val', 'key', stime, etime, dt)
| project-rename val = tw_avg
| order by key asc, timestamp asc
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(2021-04-26 00:00), 100, 'Device1',
    datetime(2021-04-26 00:45), 200, 'Device1',
    datetime(2021-04-26 01:06), 100, 'Device1',
    datetime(2021-04-26 00:30), 400, 'Device2',
    datetime(2021-04-26 01:00), 100, 'Device2',
    datetime(2021-04-26 02:00), 300, 'Device2',
]
;
let minmax=materialize(tbl | summarize mint=min(ts), maxt=max(ts));
let stime=toscalar(minmax | project mint);
let etime=toscalar(minmax | project maxt);
let dt = 1h;
tbl
| invoke time_weighted_avg_fl('ts', 'val', 'key', stime, etime, dt)
| project-rename val = tw_avg
| order by key asc, timestamp asc
```

---

**Output**

| timestamp | key | val |
|---|---|---|
| 2021-04-26 00:00:00.0000000 | Device1 | 125 |
| 2021-04-26 01:00:00.0000000 | Device1 | 110 |
| 2021-04-26 00:00:00.0000000 | Device2 | 200 |
| 2021-04-26 01:00:00.0000000 | Device2 | 100 |

The first value is (45m\*100 + 15m\*200)/60m = 125, the second value is (6m*200 + 54m*100)/60m = 110, and so on.
