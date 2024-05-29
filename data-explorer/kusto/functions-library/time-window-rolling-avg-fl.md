---
title:  time_window_rolling_avg_fl()
description: This article describes time_window_rolling_avg_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
---
# time_window_rolling_avg_fl()

The function `time_window_rolling_avg_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that calculates the rolling average of the required value over a constant duration time window.

Calculating rolling average over a constant time window for regular time series (that is, having constant intervals) can be achieved using [series_fir()](../query/series-fir-function.md), as the constant time window can be converted to a fixed width filter of equal coefficients. However, calculating it for irregular time series is more complex, as the actual number of samples in the window varies. Still it can be achieved using the powerful [scan](../query/scan-operator.md) operator.

This type of rolling window calculation is required for use cases where the metric values are emitted only when changed (and not in constant intervals). For example in IoT, where edge devices send metrics to the cloud only upon changes, optimizing communication bandwidth.

## Syntax

`T | invoke time_window_rolling_avg_fl(`*t_col*`,` *y_col*`,` *key_col*`,` *dt* [`,` *direction* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *t_col* | `string` |  :heavy_check_mark: | The name of the column containing the time stamp of the records.|
| *y_col* | `string` |  :heavy_check_mark: | The name of the column containing the metric value of the records.|
| *key_col* | `string` |  :heavy_check_mark: | The name of the column containing the partition key of the records.|
| *dt* | `timespan` |  :heavy_check_mark: | The duration of the rolling window.|
| *direction* | `int` | | The aggregation direction. The possible values are +1 or -1. A rolling window is set from current time forward/backward respectively. Default is -1, as backward rolling window is the only possible method for streaming scenarios.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `time_window_rolling_avg_fl()`, see [Example](#example).

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
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

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

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VUXbOaMBB951fsG8SiV2+vbcWhT/0XnQ4TIWhqSBgSUKb2v3cT+fLW0jgiSc7unnM2UTADhhcsuXCZqUtSKSG4PCa0OSa5iANzEFGwICGYJFUi0qbC3RDah9mZPc4zE9mcuqQSJ7xiqeFKRlyaGL/BckOI98sDHMKWP4iEXSG2L3ADdjVMZo6UNrQocQNz14VMeM6uXBsdOC6YmRpmYYGshSDIsaGiZk/w7R2/Xq2JI/sE0kkIwffJ3lHraLn3G5S0MtyqgBNKWKFSLH5sY32q81wwOLQusUMH7mnHey1xSdNzQquKtsGwGE60Lke7FplBthkThiLfSeBygEzMJUPNGxTNkl3R+6mJRoFpS6byoHdtSD5uCSWP00RaVcYqG9NQnfZhGdOphU3xKZW4ngpaMQjSukh0XUSZqg+Cxeh+CHYtVbU0ka0VrwlcuDmNOUbr7NCGlaAjMJVt69cxGg3Rq3H24U4phIfo96PjM8Ta9y4SFvezsx8zTH3o2mjvRH/EeI5O9uZDHMMmhLJiTa+avAwzx5GEff2XcW1S4nJi6FnX7RjGHk/9LSv1E1dhcnQcn3Ck5s63dxfwe+919wsJY9vxg40IjI76MxCCTRBVjAoX2N1gAt9diuGCfYnW9uqgRv8ba3jKNn74F2KDiNdZxBYRH/+L2KwHyOsTyM6WmYW8Wa5v/66zu6vZziKsmk+zCKdmhsgu2toynydJvB97D9vh3YDLRp3ZzF9v4BvtYyj2x/5gc3xrTUH+AIs9HfiyBQAA" target="_blank">Run the query</a>

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
};
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

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

| timestamp | value | avg_value | key |
|---|---|---|---|
| 2021-11-29 08:05:00.0000000 | 10 | 10 | Device2 |
| 2021-11-29 08:09:00.0000000 | 20 | 15 | Device2 |
| 2021-11-29 09:05:00.0000000 | 30 | 30 | Device2 |
| 2021-11-29 08:00:00.0000000 | 1 | 1 | Device1 |
| 2021-11-29 08:01:00.0000000 | 2 | 1.5 | Device1 |
| 2021-11-29 08:05:00.0000000 | 3 | 2 | Device1 |
| 2021-11-29 08:40:00.0000000 | 4 | 4 | Device1 |
| 2021-11-29 09:00:00.0000000 | 5 | 5 | Device1 |
| 2021-11-29 09:01:00.0000000 | 6 | 5.5 | Device1 |
| 2021-11-29 09:50:00.0000000 | 7 | 7 | Device1 |

The first value (10) at 8:05 contains only a single value, which fell in the 10-minute backward window, the second value (15) is the average of two samples at 8:09 and at 8:05, etc.
