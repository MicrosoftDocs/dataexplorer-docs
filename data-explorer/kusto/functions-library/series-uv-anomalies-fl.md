> [!IMPORTANT]
> The content below is Microsoft confidential(not available in the [public site](https://docs.microsoft.com/en-us/azure/data-explorer/))

# series_uv_anomalies_fl()

The function `series_uv_anomalies_fl()` detects anomalies in time series by calling [the Univariate Anomaly Detection API](/azure/cognitive-services/anomaly-detector/overview), part of [Azure Cognitive Services](/azure/cognitive-services/what-are-cognitive-services). The function accepts a limited set of time series (as numerical dynamic arrays) and the required anomaly detection sensitivity level. It converts each time series to the required Json format and posts it to the Anomaly Detector service endpoint. The service response contains dynamic arrays of high/low/all anomalies, the modeled baseline time series, its normal high/low boundaries (a value above/below the high/low boundary is an anomaly) and the detected seasonality.

> [!NOTE]
>
> * `series_uv_anomalies_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.
> * This function calls the anomaly detection service endpoint, thus requires:
>     * Enabling the [http_request_post() plugin](https://kusto.azurewebsites.net/docs/kusto/query/httprequestplugin.html) on the cluster.
>     * Modify the callout policy of type webapi to allow accessing the service endpoint as explained [here](https://kusto.azurewebsites.net/docs/kusto/management/calloutpolicy.html).
> * A key is required to access the service, you can obtain is [here](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector).
> * Consider using the native function [series_decompose_anomalies()](../query/series-decompose-anomaliesfunction.md) which is more scalable and runs faster.

## Syntax

`T | invoke series_uv_anomalies_fl(`*y_series*`, [` *sensitivity*`, ` *tsid*]`)`

## Arguments

* *y_series*: The name of the input table column containing the values of the series to be anomaly detected.
* *sensitivity*: An integer in the range [0-100] specifying the anomaly detection sensitivity. 0 is the least sensitive detection, while 100 is the most sensitive one (that is, even a small deviation from the expected baseline would be tagged as anomaly). Optional parameter, default is 85.
* *tsid*: The name of the input table column containing the time series ID. Optional parameter, can be omitted if analyzing a single time series.

## Usage

`series_uv_anomalies_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

> [!NOTE]
> In the function below, replace the 'YOUR-KEY' in the 'Ocp-Apim-Subscription-Key' of the header with your key.

## [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let series_uv_anomalies_fl=(tbl:(*), y_series:string, sensitivity:int=85, tsid:string='_tsid')
{
    let uri = 'https://adi.cognitiveservices.azure.com/anomalydetector/v1.0/timeseries/entire/detect';
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'YOUR-KEY'});
    let kwargs = pack('y_series', y_series, 'sensitivity', sensitivity);
    let code = ```if 1:
        import json
        y_series = kargs["y_series"]
        sensitivity = kargs["sensitivity"]
        json_str = []
        for i in range(len(df)):
            row = df.iloc[i, :]
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))]
            json_data = {'series': ts, "sensitivity":sensitivity}     # auto-detect period, or we can force 'period': 84. We can also add 'maxAnomalyRatio':0.25 for maximum 25% anomalies
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
       | project period=ResponseBody.period, baseline_ama=ResponseBody.expectedValues, ad_ama=series_add(0, ResponseBody.isAnomaly), pos_ad_ama=series_add(0, ResponseBody.isPositiveAnomaly)
       , neg_ad_ama=series_add(0, ResponseBody.isNegativeAnomaly), upper_ama=series_add(ResponseBody.expectedValues, ResponseBody.upperMargins), lower_ama=series_subtract(ResponseBody.expectedValues, ResponseBody.lowerMargins)
       | extend _tsid=toscalar(_tsid)
      )
}
;
let etime=datetime(2017-03-02);
let stime=datetime(2017-01-01);
let dt=1h;
let ts = requests
| make-series value=avg(value) on timestamp from stime to etime step dt
| extend _tsid='TS1';
ts
| invoke series_uv_anomalies_fl('value')
| lookup ts on _tsid
| render anomalychart with(xcolumn=timestamp, ycolumns=value, anomalycolumns=ad_ama)
~~~

## [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md).  Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time Series Anomaly Detection by Azure Cognitive Service")
series_uv_anomalies_fl(tbl:(*), y_series:string, sensitivity:int=85, tsid:string='_tsid')
{
    let uri = 'https://adi.cognitiveservices.azure.com/anomalydetector/v1.0/timeseries/entire/detect';
    let headers=dynamic({'Ocp-Apim-Subscription-Key': h'YOUR-KEY'});
    let kwargs = pack('y_series', y_series, 'sensitivity', sensitivity);
    let code = ```if 1:
        import json
        y_series = kargs["y_series"]
        sensitivity = kargs["sensitivity"]
        json_str = []
        for i in range(len(df)):
            row = df.iloc[i, :]
            ts = [{'value':row[y_series][j]} for j in range(len(row[y_series]))]
            json_data = {'series': ts, "sensitivity":sensitivity}     # auto-detect period, or we can force 'period': 84. We can also add 'maxAnomalyRatio':0.25 for maximum 25% anomalies
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
       | project period=ResponseBody.period, baseline_ama=ResponseBody.expectedValues, ad_ama=series_add(0, ResponseBody.isAnomaly), pos_ad_ama=series_add(0, ResponseBody.isPositiveAnomaly)
       , neg_ad_ama=series_add(0, ResponseBody.isNegativeAnomaly), upper_ama=series_add(ResponseBody.expectedValues, ResponseBody.upperMargins), lower_ama=series_subtract(ResponseBody.expectedValues, ResponseBody.lowerMargins)
       | extend _tsid=toscalar(_tsid)
      )
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let etime=datetime(2017-03-02);
let stime=datetime(2017-01-01);
let dt=1h;
let ts = requests
| make-series value=avg(value) on timestamp from stime to etime step dt
| extend _tsid='TS1';
ts
| invoke series_uv_anomalies_fl('value')
| lookup ts on _tsid
| render anomalychart with(xcolumn=timestamp, ycolumns=value, anomalycolumns=ad_ama)
~~~

---

![Graph showing anomalies on a time series.](images/series-uv-anomalies-fl/uv-anomalies-example-1.png)

The following example assumes the function is already installed.

* Compare the Univariate Anomaly Detection API to ADX native function series_decompose_anomalies() over three time series:

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let ts = demo_make_series2
| summarize TimeStamp=make_list(TimeStamp), num=make_list(num) by sid;
ts
| invoke series_uv_anomalies_fl('num', 'sid', 90)
| join ts on $left._tsid == $right.sid
| project-away _tsid
| extend (ad_adx, score_adx, baseline_adx)=series_decompose_anomalies(num, 1.5, -1, 'linefit')
| project-reorder num, *
| render anomalychart with(series=sid, xcolumn=TimeStamp, ycolumns=num, baseline_adx, baseline_ama, lower_ama, upper_ama, anomalycolumns=ad_adx, ad_ama)
~~~

Anomalies detected by the Univariate Anomaly Detection API on TS1. You can select also TS2 or TS3 in the chart filter box.

![Graph showing anomalies using the Univariate API on a time series.](images/series-uv-anomalies-fl/uv-anomalies-example-2.png)

Anomalies detected by ADX native function on TS1

![Graph showing anomalies using ADX native function on a time series.](images/series-uv-anomalies-fl/adx-anomalies-example-2.png)
