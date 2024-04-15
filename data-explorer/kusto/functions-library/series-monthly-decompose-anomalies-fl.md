---
title:  series_monthly_decompose_anomalies_fl() - Azure Data Explorer
description: Learn how to use the series_monthly_decompose_anomalies_fl() function to detect anomalies in a series with monthly seasonality.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/15/2024
---
# series_monthly_decompose_anomalies_fl()

Detect anomalous points in a daily series with monthly seasonality.

The function `series_monthly_decompose_anomalies_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that detects anomalies in multiple time series that have monthly seasonality. The function is built on top of [series_decompose_anomalies()](../query/series-decompose-anomalies-function.md). The challenge is that the length of a month is variable between 28 to 31 days, so building a baseline by using series_decompose_anomalies() out of the box detects fixed seasonality thus fails to match spikes or other patterns that occur in the 1st or other day in each month.

## Syntax

`series_monthly_decompose_anomalies_fl(`*threshold*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *threshold* | `real` | | Anomaly threshold. Default is 1.5.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_clean_anomalies_fl()`, see [Example](#example).

```kusto
let series_monthly_decompose_anomalies_fl=(tbl:(_key:string, _date:datetime, _val:real), threshold:real=1.5)
{
    let _tbl=materialize(tbl
    | extend _year=getyear(_date), _dom = dayofmonth(_date), _moy=monthofyear(_date), _doy=dayofyear(_date)
    | extend _vdoy = 31*(_moy-1)+_dom                  //  virtual day of year (assuming all months have 31 days)
    );
    let median_tbl = _tbl | summarize p50=percentiles(_val, 50) by _key, _dom;
    let keys = _tbl | summarize by _key | extend dummy=1;
    let years = _tbl | summarize by _year | extend dummy=1;
    let vdoys = range _vdoy from 0 to 31*12-1 step 1 | extend _moy=_vdoy/31+1, _vdom=_vdoy%31+1, _vdoy=_vdoy+1 | extend dummy=1
    | join kind=fullouter years on dummy | join kind=fullouter keys on dummy | project-away dummy, dummy1, dummy2;
    vdoys
    | join kind=leftouter _tbl on _key, _year, _vdoy
    | project-away _key1, _year1, _moy1, _vdoy1
    | extend _adoy=31*12*_year+_doy, _vadoy = 31*12*_year+_vdoy
    | partition by _key (as T
        | where _vadoy >= toscalar(T | summarize (_adoy, _vadoy)=arg_min(_adoy, _vadoy) | project _vadoy) and 
          _vadoy <= toscalar(T | summarize (_adoy, _vadoy)=arg_max(_adoy, _vadoy) | project _vadoy)
    )
    | join kind=inner median_tbl on _key, $left._vdom == $right._dom
    | extend _vval = coalesce(_val, p50)
    //| order by _key asc, _vadoy asc     //  for debugging
    | make-series _vval=avg(_vval), _date=any(_date) default=datetime(null) on _vadoy step 1 by _key
    | extend (anomalies, score, baseline) = series_decompose_anomalies(_vval, threshold, 31)
    | mv-expand _date to typeof(datetime), _vval to typeof(real), _vadoy to typeof(long), anomalies to typeof(int), score to typeof(real), baseline to typeof(real)
    | project-away _vadoy
    | project-rename _val=_vval
    | where isnotnull(_date)
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Anomaly Detection for daily time series with monthly seasonality")
series_monthly_decompose_anomalies_fl(tbl:(_key:string, _date:datetime, _val:real), threshold:real=1.5)
{
    let _tbl=materialize(tbl
    | extend _year=getyear(_date), _dom = dayofmonth(_date), _moy=monthofyear(_date), _doy=dayofyear(_date)
    | extend _vdoy = 31*(_moy-1)+_dom                  //  virtual day of year (assuming all months have 31 days)
    );
    let median_tbl = _tbl | summarize p50=percentiles(_val, 50) by _key, _dom;
    let keys = _tbl | summarize by _key | extend dummy=1;
    let years = _tbl | summarize by _year | extend dummy=1;
    let vdoys = range _vdoy from 0 to 31*12-1 step 1 | extend _moy=_vdoy/31+1, _vdom=_vdoy%31+1, _vdoy=_vdoy+1 | extend dummy=1
    | join kind=fullouter years on dummy | join kind=fullouter keys on dummy | project-away dummy, dummy1, dummy2;
    vdoys
    | join kind=leftouter _tbl on _key, _year, _vdoy
    | project-away _key1, _year1, _moy1, _vdoy1
    | extend _adoy=31*12*_year+_doy, _vadoy = 31*12*_year+_vdoy
    | partition by _key (as T
        | where _vadoy >= toscalar(T | summarize (_adoy, _vadoy)=arg_min(_adoy, _vadoy) | project _vadoy) and 
          _vadoy <= toscalar(T | summarize (_adoy, _vadoy)=arg_max(_adoy, _vadoy) | project _vadoy)
    )
    | join kind=inner median_tbl on _key, $left._vdom == $right._dom
    | extend _vval = coalesce(_val, p50)
    //| order by _key asc, _vadoy asc     //  for debugging
    | make-series _vval=avg(_vval), _date=any(_date) default=datetime(null) on _vadoy step 1 by _key
    | extend (anomalies, score, baseline) = series_decompose_anomalies(_vval, threshold, 31)
    | mv-expand _date to typeof(datetime), _vval to typeof(real), _vadoy to typeof(long), anomalies to typeof(int), score to typeof(real), baseline to typeof(real)
    | project-away _vadoy
    | project-rename _val=_vval
    | where isnotnull(_date)
}
```

---

## Example

The input table must contain _key, _date and _val columns. It builds a set of time series of _val per each _key and adds anomalies, score and baseline columns.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEAE2O0QrCMAxF3wX%2fIY8T5if0W0JpI6trm9HE6cCPt920%2bBAI94Zz4ikxJs46xQ1Vzqc3LIXv5BRwps3UGQG9VTIqdVttNHXaXcgrzwRCJZB0hifHaWEhtJmTja27xeHyR74WyjYRND7uAhWzO0ZofPwK6pmnAgdnc5MtCs%2bg0%2fBLOD5SFtNFI7yObP%2b19xVX9R%2f75FBs6gAAAA%3d%3d" target="_blank">Run the query</a>

```kusto
let series_monthly_decompose_anomalies_fl=(tbl:(_key:string, _date:datetime, _val:real), threshold:real=1.5)
{
    let _tbl=materialize(tbl
    | extend _year=getyear(_date), _dom = dayofmonth(_date), _moy=monthofyear(_date), _doy=dayofyear(_date)
    | extend _vdoy = 31*(_moy-1)+_dom                  //  virtual day of year (assuming all months have 31 days)
    );
    let median_tbl = _tbl | summarize p50=percentiles(_val, 50) by _key, _dom;
    let keys = _tbl | summarize by _key | extend dummy=1;
    let years = _tbl | summarize by _year | extend dummy=1;
    let vdoys = range _vdoy from 0 to 31*12-1 step 1 | extend _moy=_vdoy/31+1, _vdom=_vdoy%31+1, _vdoy=_vdoy+1 | extend dummy=1
    | join kind=fullouter years on dummy | join kind=fullouter keys on dummy | project-away dummy, dummy1, dummy2;
    vdoys
    | join kind=leftouter _tbl on _key, _year, _vdoy
    | project-away _key1, _year1, _moy1, _vdoy1
    | extend _adoy=31*12*_year+_doy, _vadoy = 31*12*_year+_vdoy
    | partition by _key (as T
        | where _vadoy >= toscalar(T | summarize (_adoy, _vadoy)=arg_min(_adoy, _vadoy) | project _vadoy) and 
          _vadoy <= toscalar(T | summarize (_adoy, _vadoy)=arg_max(_adoy, _vadoy) | project _vadoy)
    )
    | join kind=inner median_tbl on _key, $left._vdom == $right._dom
    | extend _vval = coalesce(_val, p50)
    //| order by _key asc, _vadoy asc     //  for debugging
    | make-series _vval=avg(_vval), _date=any(_date) default=datetime(null) on _vadoy step 1 by _key
    | extend (anomalies, score, baseline) = series_decompose_anomalies(_vval, threshold, 31)
    | mv-expand _date to typeof(datetime), _vval to typeof(real), _vadoy to typeof(long), anomalies to typeof(int), score to typeof(real), baseline to typeof(real)
    | project-away _vadoy
    | project-rename _val=_vval
    | where isnotnull(_date)
};
demo_monthly_ts
| project _key=key, _date=ts, _val=val
| invoke series_monthly_decompose_anomalies_fl()
| project-rename key=_key, ts=_date, val=_val
| render anomalychart with(anomalycolumns=anomalies, xcolumn=ts, ycolumns=val)
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
demo_monthly_ts
| project _key=key, _date=ts, _val=val
| invoke series_monthly_decompose_anomalies_fl()
| project-rename key=_key, ts=_date, val=_val
| render anomalychart with(anomalycolumns=anomalies, xcolumn=ts, ycolumns=val)
```

---

**Output**

:::image type="content" source="media\series-monthly-decompose-anomalies-fl\series-monthly-decompose-anomalies-chart-A.png" alt-text="Graph of time series 'A' with monthly anomalies." lightbox="media\series-monthly-decompose-anomalies-fl\series-monthly-decompose-anomalies-chart-A.png" border="false":::

:::image type="content" source="media\series-monthly-decompose-anomalies-fl\series-monthly-decompose-anomalies-chart-B.png" alt-text="Graph of time series 'B' with monthly anomalies." lightbox="media\series-monthly-decompose-anomalies-fl\series-monthly-decompose-anomalies-chart-B.png" border="false":::
