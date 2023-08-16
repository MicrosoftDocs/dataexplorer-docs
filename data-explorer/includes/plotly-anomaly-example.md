---
ms.topic: include
ms.date: 08/16/2023
---
To use a query-defined function, invoke it after the embedded function definition.

```kusto
let plotly_anomaly_fl=(tbl:(*), time_col:string, val_col:string, baseline_col:string, time_high_col:string , val_high_col:string, size_high_col:string,
                                time_low_col:string, val_low_col:string, size_low_col:string,
                                chart_title:string='Anomaly chart', series_name:string='Metric', val_name:string='Value')
{
    let anomaly_chart = toscalar(PlotlyTemplate | where name == "anomaly" | project plotly);
    let tbl_ex = tbl | extend _timestamp = column_ifexists(time_col, datetime(null)), _values = column_ifexists(val_col, 0.0), _baseline = column_ifexists(baseline_col, 0.0),
                              _high_timestamp = column_ifexists(time_high_col, datetime(null)), _high_values = column_ifexists(val_high_col, 0.0), _high_size = column_ifexists(size_high_col, 1),
                              _low_timestamp = column_ifexists(time_low_col, datetime(null)), _low_values = column_ifexists(val_low_col, 0.0), _low_size = column_ifexists(size_low_col, 1);
    tbl_ex
    | extend plotly = anomaly_chart
    | extend plotly=replace_string(plotly, '$TIME_STAMPS$', tostring(_timestamp))
    | extend plotly=replace_string(plotly, '$SERIES_VALS$', tostring(_values))
    | extend plotly=replace_string(plotly, '$BASELINE_VALS$', tostring(_baseline))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_HIGH_ANOMALIES$', tostring(_high_timestamp))
    | extend plotly=replace_string(plotly, '$HIGH_ANOMALIES_VALS$', tostring(_high_values))
    | extend plotly=replace_string(plotly, '$HIGH_ANOMALIES_MARKER_SIZE$', tostring(_high_size))
    | extend plotly=replace_string(plotly, '$TIME_STAMPS_LOW_ANOMALIES$', tostring(_low_timestamp))
    | extend plotly=replace_string(plotly, '$LOW_ANOMALIES_VALS$', tostring(_low_values))
    | extend plotly=replace_string(plotly, '$LOW_ANOMALIES_MARKER_SIZE$', tostring(_low_size))
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$SERIES_NAME$', series_name)
    | extend plotly=replace_string(plotly, '$Y_NAME$', val_name)
    | project plotly
};
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
| invoke plotly_anomaly_fl('TimeStamp', 'num', 'baseline', 'pTimeStamp', 'pAnomalies', 'pSize', 'nTimeStamp', 'nAnomalies', 'nSize',
                           chart_title='Anomaly chart using plotly_anomaly_fl()', series_name=s_name, val_name='# of requests')
| render plotly
```
