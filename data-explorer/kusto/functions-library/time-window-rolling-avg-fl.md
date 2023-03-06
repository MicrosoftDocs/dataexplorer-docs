---
title: time_window_rolling_avg_fl() - Azure Data Explorer
description: This article describes time_window_rolling_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# time_window_rolling_avg_fl()

The function `time_window_rolling_avg_fl()` calculates the rolling average of the required value over a constant duration time window.

Calculating rolling average over a constant time window for regular time series (that is, having constant intervals) can be achieved using [series_fir()](../query/series-firfunction.md), as the constant time window can be converted to a fixed width filter of equal coefficients. However, calculating it for irregular time series is more complex, as the actual number of samples in the window varies. Still it can be achieved using the powerful [scan](../query/scan-operator.md) operator.

This type of rolling window calculation is required for use cases where the metric values are emitted only when changed (and not in constant intervals). For example in IoT, where edge devices send metrics to the cloud only upon changes, optimizing communication bandwidth.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`T | invoke time_window_rolling_avg_fl(`*t_col*`,` *y_col*`,` *key_col*`,` *dt* [`,` *direction* ]`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *t_col* | string | &check; | The name of the column containing the time stamp of the records.|
| *y_col* | string | &check; | The name of the column containing the metric value of the records.|
| *key_col* | string | &check; | The name of the column containing the partition key of the records.|
| *dt* | timespan | &check; | The duration of the rolling window.|
| *direction* | int | | The aggregation direction. The possible values are +1 or -1. A rolling window is set from current time forward/backward respectively. Default is -1, as backward rolling window is the only possible method for streaming scenarios.|

## Usage

`time_window_rolling_avg_fl()` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let time_window_rolling_avg_fl=(tbl:(*), t_col:string, y_col:string, key_col:string, dt:timespan, direction:int=int(-1))
{
    let tbl_ex = tbl | extend timestamp = column_ifexists(t_col, datetime(null)), value = column_ifexists(y_col, 0.0), key = column_ifexists(key_col, '');
    tbl_ex 
    | partition hint.strategy=shuffle by key 
    (
        extend timestamp=pack_array(timestamp, timestamp - direction*dt), delta = pack_array(-direction, direction)
        | mv-expand timestamp to typeof(datetime), delta to typeof(long)
        | sort by timestamp asc, delta desc    
        | scan declare (cum_sum:double=0.0, cum_count:long=0) with 
        (
            step s: true => cum_count = s.cum_count + delta, 
                            cum_sum = s.cum_sum + delta * value; 
        )
        | extend avg_value = iff(direction == 1, prev(cum_sum)/prev(cum_count), cum_sum/cum_count)
        | where delta == -direction 
        | project timestamp, value, avg_value, key
    )
}
;
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(8:00), 1, 'Device1',
    datetime(8:01), 2, 'Device1',
    datetime(8:05), 3, 'Device1',
    datetime(8:05), 10, 'Device2',
    datetime(8:09), 20, 'Device2',
    datetime(8:40), 4, 'Device1',
    datetime(9:00), 5, 'Device1',
    datetime(9:01), 6, 'Device1',
    datetime(9:05), 30, 'Device2',
    datetime(9:50), 7, 'Device1'
];
tbl
| invoke time_window_rolling_avg_fl('ts', 'val', 'key', 10m)
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time based rolling average of a metric")
time_window_rolling_avg_fl(tbl:(*), t_col:string, y_col:string, key_col:string, dt:timespan, direction:int=int(-1))
{
    let tbl_ex = tbl | extend timestamp = column_ifexists(t_col, datetime(null)), value = column_ifexists(y_col, 0.0), key = column_ifexists(key_col, '');
    tbl_ex 
    | partition hint.strategy=shuffle by key 
    (
        extend timestamp=pack_array(timestamp, timestamp - direction*dt), delta = pack_array(-direction, direction)
        | mv-expand timestamp to typeof(datetime), delta to typeof(long)
        | sort by timestamp asc, delta desc    
        | scan declare (cum_sum:double=0.0, cum_count:long=0) with 
        (
            step s: true => cum_count = s.cum_count + delta, 
                            cum_sum = s.cum_sum + delta * value; 
        )
        | extend avg_value = iff(direction == 1, prev(cum_sum)/prev(cum_count), cum_sum/cum_count)
        | where delta == -direction 
        | project timestamp, value, avg_value, key
    )
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let tbl = datatable(ts:datetime,  val:real, key:string) [
    datetime(8:00), 1, 'Device1',
    datetime(8:01), 2, 'Device1',
    datetime(8:05), 3, 'Device1',
    datetime(8:05), 10, 'Device2',
    datetime(8:09), 20, 'Device2',
    datetime(8:40), 4, 'Device1',
    datetime(9:00), 5, 'Device1',
    datetime(9:01), 6, 'Device1',
    datetime(9:05), 30, 'Device2',
    datetime(9:50), 7, 'Device1'
];
tbl
| invoke time_window_rolling_avg_fl('ts', 'val', 'key', 10m)
```

---

```kusto
timestamp	                value	avg_value	key
2021-11-29 08:05:00.0000000	10	    10	        Device2
2021-11-29 08:09:00.0000000	20    	15        	Device2
2021-11-29 09:05:00.0000000	30	    30        	Device2
2021-11-29 08:00:00.0000000	1	    1	        Device1
2021-11-29 08:01:00.0000000	2	    1.5        	Device1
2021-11-29 08:05:00.0000000	3	    2        	Device1
2021-11-29 08:40:00.0000000	4	    4        	Device1
2021-11-29 09:00:00.0000000	5	    5        	Device1
2021-11-29 09:01:00.0000000	6	    5.5	        Device1
2021-11-29 09:50:00.0000000	7	    7	        Device1
```

The first value (10) at 8:05 contains only a single value, which fell in the 10-minute backward window, the second value (15) is the average of two samples at 8:09 and at 8:05, etc.
