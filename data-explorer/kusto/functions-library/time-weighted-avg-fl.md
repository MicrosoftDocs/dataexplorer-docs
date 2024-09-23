---
title:  time_weighted_avg_fl()
description:  This article describes time_weighted_avg_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# time_weighted_avg_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function `time_weighted_avg_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates the time weighted average of a metric in a given time window, over input time bins. This function is similar to [summarize operator](../query/summarize-operator.md). The function aggregates the metric by time bins, but instead of calculating simple [avg()](../query/avg-aggregation-function.md) of the metric value in each bin, it weights each value by its duration. The duration is defined from the timestamp of the current value to the timestamp of the next value.

There are two options to calculate time weighted average. This function fills forward the the value of the current sample until the next one. Alternatively [time_weighted_avg2_fl()](time-weighted-avg2-fl.md) linearly interpolates the metric value between consecutive samples.

## Syntax

`T | invoke time_weighted_avg_fl(`*t_col*`,` *y_col*`,` *key_col*`,` *stime*`,` *etime*`,` *dt*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *t_col* | `string` |  :heavy_check_mark: | The name of the column containing the time stamp of the records.|
| *y_col* | `string` |  :heavy_check_mark: | The name of the column containing the metric value of the records.|
| *key_col* | `string` |  :heavy_check_mark: | The name of the column containing the partition key of the records.|
| *stime* | `datetime` |  :heavy_check_mark: | The start time of the aggregation window.|
| *etime* | `datetime` |  :heavy_check_mark: | The end time of the aggregation window.|
| *dt* | `timespan` |  :heavy_check_mark: | The aggregation time bin.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `time_weighted_avg_fl()`, see [Example](#example).

```kusto
let time_weighted_avg_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan)
{
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let _etime = etime + dt;
    let gridTimes = range _ts from stime to _etime step dt | extend _val=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime.._etime)
    | partition hint.strategy=native by _key (
        order by _ts asc, _val nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(_val), s.f_value, _val);) // fill forward null values
        | extend diff_t=(next(_ts)-_ts)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(_ts, dt, stime), _key
    | where t_sum > 0 and _ts <= etime
    | extend tw_avg = tw_sum/t_sum
    | project-away tw_sum, t_sum
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time weighted average of a metric using fill forward interpolation")
time_weighted_avg_fl(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan)
{
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let _etime = etime + dt;
    let gridTimes = range _ts from stime to _etime step dt | extend _val=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime.._etime)
    | partition hint.strategy=native by _key (
        order by _ts asc, _val nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(_val), s.f_value, _val);) // fill forward null values
        | extend diff_t=(next(_ts)-_ts)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(_ts, dt, stime), _key
    | where t_sum > 0 and _ts <= etime
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
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let _etime = etime + dt;
    let gridTimes = range _ts from stime to _etime step dt | extend _val=real(null), dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime.._etime)
    | partition hint.strategy=native by _key (
        order by _ts asc, _val nulls last
        | scan declare(f_value:real=0.0) with (step s: true => f_value = iff(isnull(_val), s.f_value, _val);) // fill forward null values
        | extend diff_t=(next(_ts)-_ts)/1m
    )
    | where isnotnull(diff_t)
    | summarize tw_sum=sum(f_value*diff_t), t_sum =sum(diff_t) by bin_at(_ts, dt, stime), _key
    | where t_sum > 0 and _ts <= etime
    | extend tw_avg = tw_sum/t_sum
    | project-away tw_sum, t_sum
};
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(2021-04-26 00:00), 100, 'Device1',
    datetime(2021-04-26 00:45), 300, 'Device1',
    datetime(2021-04-26 01:15), 200, 'Device1',
    datetime(2021-04-26 00:00), 600, 'Device2',
    datetime(2021-04-26 00:30), 400, 'Device2',
    datetime(2021-04-26 01:30), 500, 'Device2',
    datetime(2021-04-26 01:45), 300, 'Device2'
];
let minmax=materialize(tbl | summarize mint=min(ts), maxt=max(ts));
let stime=toscalar(minmax | project mint);
let etime=toscalar(minmax | project maxt);
let dt = 1h;
tbl
| invoke time_weighted_avg_fl('ts', 'val', 'key', stime, etime, dt)
| project-rename val = tw_avg
| order by _key asc, _ts asc
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(2021-04-26 00:00), 100, 'Device1',
    datetime(2021-04-26 00:45), 300, 'Device1',
    datetime(2021-04-26 01:15), 200, 'Device1',
    datetime(2021-04-26 00:00), 600, 'Device2',
    datetime(2021-04-26 00:30), 400, 'Device2',
    datetime(2021-04-26 01:30), 500, 'Device2',
    datetime(2021-04-26 01:45), 300, 'Device2'
];
let minmax=materialize(tbl | summarize mint=min(ts), maxt=max(ts));
let stime=toscalar(minmax | project mint);
let etime=toscalar(minmax | project maxt);
let dt = 1h;
tbl
| invoke time_weighted_avg_fl('ts', 'val', 'key', stime, etime, dt)
| project-rename val = tw_avg
| order by _key asc, _ts asc
```

---

**Output**

| _ts | _key | val |
|---|---|---|
| 2021-04-26 00:00:00.0000000 | Device1	| 150 |
| 2021-04-26 01:00:00.0000000 | Device1	| 225 |
| 2021-04-26 00:00:00.0000000 | Device2	| 500 |
| 2021-04-26 01:00:00.0000000 | Device2	| 400 |

The first value of Device1 is (45m*100 + 15m*300)/60m = 150, the second value is (15m*300 + 45m*200)/60m = 225
The first value of Device2 is (30m*600 + 30m*400)/60m = 500, the second value is (30m*400 + 15m*500 + 15m*300)/60m = 400