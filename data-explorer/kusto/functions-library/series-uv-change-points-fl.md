
> [!IMPORTANT]
> The content below is Microsoft confidential(not available in the [public site](https://docs.microsoft.com/en-us/azure/data-explorer/))

# series_uv_change_points_fl()

The function `series_uv_change_points_fl()` finds change points in time series by calling [the Univariate Anomaly Detection API](/azure/cognitive-services/anomaly-detector/overview), part of [Azure Cognitive Services](/azure/cognitive-services/what-are-cognitive-services). The function accepts a limited set of time series (as numerical dynamic arrays), change point detection threshold, and the minimum size of the stable trend window. It converts each time series to the required Json format and posts it to the Anomaly Detector service endpoint. The service response contains dynamic arrays of change points, their respective confidence, and the detected seasonality.

> [!NOTE]
>
> * `series_uv_change_points_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.
> * This function calls the anomaly detection service endpoint, thus requires:
>     * Enabling the [http_request_post() plugin](https://kusto.azurewebsites.net/docs/kusto/query/httprequestplugin.html) on the cluster.
>     * Modify the callout policy of type webapi to allow accessing the service endpoint as explained [here](https://kusto.azurewebsites.net/docs/kusto/management/calloutpolicy.html).
> * A key is required to access the service, you can obtain it [here](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector).

## Syntax

`T | invoke series_uv_change_points_fl(`*y_series*`, [` *score_threshold*`, ` *trend_window*`, `*tsid*]`)`

## Arguments

* *y_series*: The name of the input table column containing the values of the series to be anomaly detected.
* *score_threshold*: A real value specifying the minimum confidence to declare a change point. Each point whose confidence is above the threshold is defined as a change point. Optional parameter, default is 0.9.
* *trend_window*: An integer specifying the minimal window size for robust calculation of trend changes. Optional parameter, default is 5.
* *tsid*: The name of the input table column containing the time series ID. Optional parameter, can be omitted if analyzing a single time series.

## Usage

`series_uv_change_points_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

> [!NOTE]
> In the function below, replace the 'YOUR-KEY' in the 'Ocp-Apim-Subscription-Key' of the header with your key.

## [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let series_uv_change_points_fl=(tbl:(*), y_series:string, score_threshold:real=0.9, trend_window:int=5, tsid:string='_tsid')
{
    let uri = 'https://adi.cognitiveservices.azure.com/anomalydetector/v1.0/timeseries/changepoint/detect';
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'YOUR-KEY'});
    let kwargs = pack('y_series', y_series, 'score_threshold', score_threshold, 'trend_window', trend_window);
    let code = ```if 1:
        import json
        y_series = kargs["y_series"]
        score_threshold = kargs["score_threshold"]
        trend_window = kargs["trend_window"]
        json_str = []
        for i in range(len(df)):
            row = df.iloc[i, :]
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))]
            json_data = {'series': ts, "threshold":score_threshold, "stableTrendWindow": trend_window}     # auto-detect period, or we can force 'period': 84
            json_str = json_str + [json.dumps(json_data)]
        result = df
        result['json_str'] = json_str
    ```;
    tbl
    | evaluate python(typeof(*, json_str:string), code, kwargs)
    | extend _tsid = column_ifexists(tsid, 1)
    | partition by _tsid (
       project json_str
       | evaluate http_request_post(uri, headers, dynamic(null))
        | project period=ResponseBody.period, change_point=series_add(0, ResponseBody.isChangePoint), confidence=ResponseBody.confidenceScores
        | extend _tsid=toscalar(_tsid)
       )
}
;
let ts = range x from 1 to 300 step 1
| extend y=iff(x between (100 .. 110) or x between (200 .. 220), 20, 5)
| extend ts=datetime(2021-01-01)+x*1d
| extend y=y+4*rand()
| summarize ts=make_list(ts), y=make_list(y)
| extend sid=1;
ts
| invoke series_uv_change_points_fl('y', 0.8, 10, 'sid')
| join ts on $left._tsid == $right.sid
| project-away _tsid
| project-reorder y, *      //  just to visualize the anomalies on top of y series
| render anomalychart with(xcolumn=ts, ycolumns=y, confidence, anomalycolumns=change_point)
~~~

## [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md).  Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time Series Change Points Detection by Azure Cognitive Service")
series_uv_change_points_fl(tbl:(*), y_series:string, score_threshold:real=0.9, trend_window:int=5, tsid:string='_tsid')
{
    let uri = 'https://adi.cognitiveservices.azure.com/anomalydetector/v1.0/timeseries/changepoint/detect';
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'YOUR-KEY'});
    let kwargs = pack('y_series', y_series, 'score_threshold', score_threshold, 'trend_window', trend_window);
    let code = ```if 1:
        import json
        y_series = kargs["y_series"]
        score_threshold = kargs["score_threshold"]
        trend_window = kargs["trend_window"]
        json_str = []
        for i in range(len(df)):
            row = df.iloc[i, :]
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))]
            json_data = {'series': ts, "threshold":score_threshold, "stableTrendWindow": trend_window}     # auto-detect period, or we can force 'period': 84
            json_str = json_str + [json.dumps(json_data)]
        result = df
        result['json_str'] = json_str
    ```;
    tbl
    | evaluate python(typeof(*, json_str:string), code, kwargs)
    | extend _tsid = column_ifexists(tsid, 1)
    | partition by _tsid (
       project json_str
       | evaluate http_request_post(uri, headers, dynamic(null))
        | project period=ResponseBody.period, change_point=series_add(0, ResponseBody.isChangePoint), confidence=ResponseBody.confidenceScores
        | extend _tsid=toscalar(_tsid)
       )
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let ts = range x from 1 to 300 step 1
| extend y=iff(x between (100 .. 110) or x between (200 .. 220), 20, 5)
| extend ts=datetime(2021-01-01)+x*1d
| extend y=y+4*rand()
| summarize ts=make_list(ts), y=make_list(y)
| extend sid=1;
ts
| invoke series_uv_change_points_fl('y', 0.8, 10, 'sid')
| join ts on $left._tsid == $right.sid
| project-away _tsid
| project-reorder y, *      //  just to visualize the anomalies on top of y series
| render anomalychart with(xcolumn=ts, ycolumns=y, confidence, anomalycolumns=change_point)
~~~

---

![Graph showing change points on a time series.](images/series-uv-change-points-fl/uv-change-points-example-1.png)
