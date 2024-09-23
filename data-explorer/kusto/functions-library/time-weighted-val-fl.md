---
title:  time_weighted_val_fl()
description:  This article describes time_weighted_val_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 09/23/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# time_weighted_avg_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function `time_weighted_val_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that linearly interpolates metric value by time weighted average of the values of its previous point and its next point.

## Syntax

`T | invoke time_weighted_avg_fl(`*t_col*`,` *y_col*`,` *key_col*`,` *stime*`,` *etime*`,` *dt*`,` *keep_orig*`)`

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
| *keep_orig* | `bool` | | Keep original samples. Default is false.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `time_weighted_avg_fl()`, see [Example](#example).

```kusto
let time_weighted_val_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan, keep_orig:bool=false)
{
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let gridTimes = range _ts from stime to etime step dt | extend _val=real(null), grid=1, dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime..etime)
    | partition hint.strategy=native by _key (
      order by _ts desc, _val nulls last
    | scan declare(val1:real=0.0, t1:datetime) with (                // fill backward null values
        step s: true => val1=iff(isnull(_val), s.val1, _val), t1=iff(isnull(_val), s.t1, _ts);)
    | extend dt1=(t1-_ts)/1m
    | order by _ts asc, _val nulls last
    | scan declare(val0:real=0.0, t0:datetime) with (                // fill forward null values
        step s: true => val0=iff(isnull(_val), s.val0, _val), t0=iff(isnull(_val), s.t0, _ts);)
    | extend dt0=(_ts-t0)/1m
    | extend _twa_val=iff(dt0+dt1 == 0, _val, ((val0*dt1)+(val1*dt0))/(dt0+dt1))
    | scan with (                                                    // fill forward null twa values
        step s: true => _twa_val=iff(isnull(_twa_val), s._twa_val, _twa_val);)
    )
    | where grid == 1 or (keep_orig and _ts != next(_ts))
    | project _ts, _key, _twa_val, orig_val=iff(grid == 1, 0, 1)
    | order by _key asc, _ts asc
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Linear interpolation of metric value by time weighted average")
time_weighted_val_fl(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan, keep_orig:bool=false)
{
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let gridTimes = range _ts from stime to etime step dt | extend _val=real(null), grid=1, dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime..etime)
    | partition hint.strategy=native by _key (
      order by _ts desc, _val nulls last
    | scan declare(val1:real=0.0, t1:datetime) with (                // fill backward null values
        step s: true => val1=iff(isnull(_val), s.val1, _val), t1=iff(isnull(_val), s.t1, _ts);)
    | extend dt1=(t1-_ts)/1m
    | order by _ts asc, _val nulls last
    | scan declare(val0:real=0.0, t0:datetime) with (                // fill forward null values
        step s: true => val0=iff(isnull(_val), s.val0, _val), t0=iff(isnull(_val), s.t0, _ts);)
    | extend dt0=(_ts-t0)/1m
    | extend _twa_val=iff(dt0+dt1 == 0, _val, ((val0*dt1)+(val1*dt0))/(dt0+dt1))
    | scan with (                                                    // fill forward null twa values
        step s: true => _twa_val=iff(isnull(_twa_val), s._twa_val, _twa_val);)
    )
    | where grid == 1 or (keep_orig and _ts != next(_ts))
    | project _ts, _key, _twa_val, orig_val=iff(grid == 1, 0, 1)
    | order by _key asc, _ts asc
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let time_weighted_val_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, stime:datetime, etime:datetime, dt:timespan, keep_orig:bool=false)
{
    let tbl_ex = tbl | extend _ts = column_ifexists(t_col, datetime(null)), _val = column_ifexists(y_col, 0.0), _key = column_ifexists(key_col, '');
    let gridTimes = range _ts from stime to etime step dt | extend _val=real(null), grid=1, dummy=1;
    let keys = materialize(tbl_ex | summarize by _key | extend dummy=1);
    gridTimes
    | join kind=fullouter keys on dummy
    | project-away dummy, dummy1
    | union tbl_ex
    | where _ts between (stime..etime)
    | partition hint.strategy=native by _key (
      order by _ts desc, _val nulls last
    | scan declare(val1:real=0.0, t1:datetime) with (                // fill backward null values
        step s: true => val1=iff(isnull(_val), s.val1, _val), t1=iff(isnull(_val), s.t1, _ts);)
    | extend dt1=(t1-_ts)/1m
    | order by _ts asc, _val nulls last
    | scan declare(val0:real=0.0, t0:datetime) with (                // fill forward null values
        step s: true => val0=iff(isnull(_val), s.val0, _val), t0=iff(isnull(_val), s.t0, _ts);)
    | extend dt0=(_ts-t0)/1m
    | extend _twa_val=iff(dt0+dt1 == 0, _val, ((val0*dt1)+(val1*dt0))/(dt0+dt1))
    | scan with (                                                    // fill forward null twa values
        step s: true => _twa_val=iff(isnull(_twa_val), s._twa_val, _twa_val);)
    )
    | where grid == 1 or (keep_orig and _ts != next(_ts))
    | project _ts, _key, _twa_val, orig_val=iff(grid == 1, 0, 1)
    | order by _key asc, _ts asc
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
| invoke time_weighted_val_fl('ts', 'val', 'key', stime, etime, dt, keep_orig=true)
| project-rename val = _twa_val
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
| invoke time_weighted_val_fl('ts', 'val', 'key', stime, etime, dt, keep_orig=true)
| project-rename val = _twa_val
| order by _key asc, _ts asc
```

---

**Output**

| _ts | _key | val | orig_val |
|---|---|---|---|
| 2021-04-26 00:00:00.0000000 | Device1 | 100 | 1 |
| 2021-04-26 00:45:00.0000000 | Device1 | 300 | 1 |
| 2021-04-26 01:00:00.0000000 | Device1 | 250 | 0 |
| 2021-04-26 01:15:00.0000000 | Device1 | 200 | 1 |
| 2021-04-26 00:00:00.0000000 | Device2 | 600 | 1 |
| 2021-04-26 00:30:00.0000000 | Device2 | 400 | 1 |
| 2021-04-26 01:00:00.0000000 | Device2 | 450 | 0 |
| 2021-04-26 01:30:00.0000000 | Device2 | 500 | 1 |
| 2021-04-26 01:45:00.0000000 | Device2 | 300 | 1 |