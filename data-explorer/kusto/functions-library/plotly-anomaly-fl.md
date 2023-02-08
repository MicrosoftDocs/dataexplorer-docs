---
title: plotly_anomaly_fl() - Azure Data Explorer
description: Learn how to use the plotly_anomaly_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 01/15/2023
---
# plotly_anomaly_fl()

The function `plotly_anomaly_fl()` allows you to customize a [plotly](https://plotly.com/python/) template to create an interactive anomaly chart.  

The function accepts a table containing the source and the baseline time series, lists of positive and negative anomalies with their respective sizes, and chart labeling string. The function returns a single cell table containing [plotly JSON](https://plotly.com/chart-studio-help/json-chart-schema/) to be rendered in an [Azure Data Explorer dashboard](../../azure-data-explorer-dashboards.md) tile. For more information, see [Plotly visual in dashboards](../../dashboard-customize-visuals.md#plotly-preview).

> [!NOTE]
>
> * `plotly_anomaly_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * Consider using ADX native [`" | render anomalychart"`](../query/renderoperator.md#syntax) method for rendering a non-interactive anomaly chart.

## Prerequisite

Extract the required 'anomaly' template from the publicly available `PlotlyTemplate` table. Copy this table from the Samples database to your database by running the following KQL command from your target database:

```kusto
.set PlotlyTemplate <| cluster('help.kusto.windows.net').database('Samples').PlotlyTemplate
```

## Syntax

`T | invoke plotly_anomaly_fl(`*time_col*`,` *val_col*`,` *baseline_col*`,` *time_high_col*`,` *val_high_col*`,` *time_low_col*`,` *val_low__col*`,` *chart_title*`,` *series_name*`,` *val_name*`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *time_col* | string | &check; | The name of the column containing the dynamic array of the time points of the original time series|
| *val_col* | string | &check; | The name of the column containing the values of the original time series|
| *baseline_col* | string | &check; | The name of the column containing the values of the baseline time series. Anomalies are usually detected by large value offset from the expected baseline value. |
| *time_high_col* | string | &check; | The name of the column containing the time points of high (above the baseline) anomalies |
| *val_high_col* | string | &check; | The name of the column containing the values of the high anomalies|
| *time_low_col* | string | &check; | The name of the column containing the time points of low anomalies|
| *val_low_col* | string | &check; | The name of the column containing the values of the low anomalies|
| *chart_title* | string | | Chart title, default is 'Anomaly Chart'|
| *series_name* | string | | Time series name, default is 'Metric'|
| *val_name* | string | | Value axis name, default is 'Value'|

## Usage

`plotly_anomaly_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for examples.

### [Query-defined](#tab/adhoc)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permission is required.

```kusto
let plotly_anomaly_fl=(tbl:(*), time_col:string, val_col:string, baseline_col:string, time_high_col:string , val_high_col:string, time_low_col:string , val_low_col:string,
                                chart_title:string='Anomaly chart', series_name:string='Metric', val_name:string='Value')
{
    let anomaly_chart = toscalar(PlotlyTemplate | where name == "anomaly" | project plotly);
    let tbl_ex = tbl | extend _timestamp = column_ifexists(time_col, datetime(null)), _values = column_ifexists(val_col, 0.0), _baseline = column_ifexists(val_col, 0.0),
                              _high_timestamp = column_ifexists(time_high_col, datetime(null)), _high_values = column_ifexists(val_high_col, 0.0),
                              _low_timestamp = column_ifexists(time_low_col, datetime(null)), _low_values = column_ifexists(val_low_col, 0.0);
    tbl_ex
    | extend plotly = anomaly_chart
    | extend plotly=replace_string(plotly, '$TIME_STAMPS$', tostring(_timestamp))
    | extend plotly=replace_string(plotly, '$SERIES_VALS$', tostring(_values))
    | extend plotly=replace_string(plotly, '$BASELINE_VALS$', tostring(_baseline))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_HIGH_ANOMALIES$', tostring(_high_timestamp))
    | extend plotly=replace_string(plotly, '$HIGH_ANOMALIES_VALS$', tostring(_high_values))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_LOW_ANOMALIES$', tostring(_low_timestamp))
    | extend plotly=replace_string(plotly, '$LOW_ANOMALIES_VALS$', tostring(_low_values))
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$SERIES_NAME$', series_name)
    | extend plotly=replace_string(plotly, '$Y_NAME$', val_name)
    | project plotly
}
;
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
let marker_scale = 8;
let s_name = 'TS1';
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t step dt by sid
| where sid == s_name
| extend (anomalies, score, baseline) = series_decompose_anomalies(num, 1.5, -1, 'linefit')
| mv-apply num1=num to typeof(double), anomalies1=anomalies to typeof(double), score1=score to typeof(double), TimeStamp1=TimeStamp to typeof(datetime)  on (
    summarize pAnomalies=make_list_if(num1, anomalies1 > 0), pTimeStamp=make_list_if(TimeStamp1, anomalies1 > 0), pSize=make_list_if(toint(score1*marker_scale), anomalies1 > 0),
              nAnomalies=make_list_if(num1, anomalies1 < 0), nTimeStamp=make_list_if(TimeStamp1, anomalies1 < 0), nSize=make_list_if(toint(-score1*marker_scale), anomalies1 < 0)
)
| invoke plotly_anomaly_fl('TimeStamp', 'num', 'baseline', 'pTimeStamp', 'pAnomalies', 'nTimeStamp', 'nAnomalies',
                           chart_title='Anomaly chart using plotly_anomaly_fl()', series_name=s_name, y_name='# of requests')
```

### [Stored](#tab/persistent)

To store the function, see [`.create function`](../management/create-function.md).  Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One time installation

```kusto
.create-or-alter function with (folder = "Packages\\Plotly", docstring = "Render anomaly chart using plotly template")
plotly_anomaly_fl(tbl:(*), time_col:string, val_col:string, baseline_col:string, time_high_col:string , val_high_col:string, time_low_col:string , val_low_col:string,
                                chart_title:string='Anomaly chart', series_name:string='Metric', val_name:string='Value')
{
    let anomaly_chart = toscalar(PlotlyTemplate | where name == "anomaly" | project plotly);
    let tbl_ex = tbl | extend _timestamp = column_ifexists(time_col, datetime(null)), _values = column_ifexists(val_col, 0.0), _baseline = column_ifexists(val_col, 0.0),
                              _high_timestamp = column_ifexists(time_high_col, datetime(null)), _high_values = column_ifexists(val_high_col, 0.0),
                              _low_timestamp = column_ifexists(time_low_col, datetime(null)), _low_values = column_ifexists(val_low_col, 0.0);
    tbl_ex
    | extend plotly = anomaly_chart
    | extend plotly=replace_string(plotly, '$TIME_STAMPS$', tostring(_timestamp))
    | extend plotly=replace_string(plotly, '$SERIES_VALS$', tostring(_values))
    | extend plotly=replace_string(plotly, '$BASELINE_VALS$', tostring(_baseline))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_HIGH_ANOMALIES$', tostring(_high_timestamp))
    | extend plotly=replace_string(plotly, '$HIGH_ANOMALIES_VALS$', tostring(_high_values))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_LOW_ANOMALIES$', tostring(_low_timestamp))
    | extend plotly=replace_string(plotly, '$LOW_ANOMALIES_VALS$', tostring(_low_values))
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$SERIES_NAME$', series_name)
    | extend plotly=replace_string(plotly, '$Y_NAME$', val_name)
    | project plotly
}
```

### Usage

```kusto
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
let marker_scale = 8;
let s_name = 'TS1';
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t step dt by sid
| where sid == s_name
| extend (anomalies, score, baseline) = series_decompose_anomalies(num, 1.5, -1, 'linefit')
| mv-apply num1=num to typeof(double), anomalies1=anomalies to typeof(double), score1=score to typeof(double), TimeStamp1=TimeStamp to typeof(datetime)  on (
    summarize pAnomalies=make_list_if(num1, anomalies1 > 0), pTimeStamp=make_list_if(TimeStamp1, anomalies1 > 0), pSize=make_list_if(toint(score1*marker_scale), anomalies1 > 0),
              nAnomalies=make_list_if(num1, anomalies1 < 0), nTimeStamp=make_list_if(TimeStamp1, anomalies1 < 0), nSize=make_list_if(toint(-score1*marker_scale), anomalies1 < 0)
)
| invoke plotly_anomaly_fl('TimeStamp', 'num', 'baseline', 'pTimeStamp', 'pAnomalies', 'nTimeStamp', 'nAnomalies',
                           chart_title='Anomaly chart using plotly_anomaly_fl()', series_name=s_name, y_name='# of requests')
```

---

The output is a Plotly JSON string that can be rendered in an Azure Data Explorer dashboard tile. For more information on creating dashboard tiles, see [Visualize data with Azure Data Explorer dashboards (Preview)](../../azure-data-explorer-dashboards.md).

The following image shows a sample anomaly chart using the above function:

![Screenshot of anomaly chart of the sample data set.](images\plotly-anomaly-fl\plotly-anomaly-chart.png)

You can zoom in and hover over anomalies:

![Screenshot of zoom in anomalous region.](images\plotly-anomaly-fl\plotly-anomaly-chart-zooming.png)
![Screenshot of hover over anomaly.](images\plotly-anomaly-fl\plotly-anomaly-chart-zoomed.png)
