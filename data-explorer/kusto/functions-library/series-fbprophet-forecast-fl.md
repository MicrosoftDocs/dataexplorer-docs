---
title: series_fbprophet_forecast_fl() - Azure Data Explorer
description: This article describes the series_fbprophet_forecast_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2021
---
# series_fbprophet_forecast_fl()

The function `series_fbprophet_forecast_fl()` takes an expression containing a time series as input, and predicts the values of the last trailing points using the [Prophet algorithm](https://facebook.github.io/prophet/). The function returns both the forecasted points and their confidence intervals. This function is a Kusto Query Language (KQL) wrapper to Prophet() class, and exposes only the parameters that are mandatory for prediction. Feel free to modify your copy to support more parameters. such as holidays, change points, Fourier order, and so on. 

> [!NOTE]
> * `series_fbprophet_forecast_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.
> * Consider using the native function [series_decompose_forecast()](../query/series-decompose-forecastfunction.md) which is based on a simpler model but is more scalable and runs much faster.

## Syntax

`T | invoke series_fbprophet_forecast_fl(`*ts_series*`,` *y_series*`,` *y_pred_series*`, [` *points*`, `*y_pred_low_series*`,` *y_pred_high_series*]`)`
  
## Arguments

* *ts_series*: The name of the input table column containing the time stamps of the series to predict.
* *y_series*: The name of the input table column containing the values of the series to predict.
* *y_pred_series*: The name of the column to store the predicted series.
* *points*: Integer specifying the number of points at the end of the series to predict (forecast). These points are excluded from the learning (regression) process. Optional parameter, default to 0.
* *y_pred_low_series*: The name of the column to store the series of the lowest values of the confidence interval. Optional parameter, can be omitted if confidence interval is not needed.
* *y_pred_high_series*: The name of the column to store the series of the highest values of the confidence interval. Optional parameter, can be omitted if confidence interval is not needed.

## Usage

`series_fbprophet_forecast_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

Note that fbprophet package is _not_ included in the Python image; to install and use it, follow the guidelines for [Installing packages for the Python plugin](../query/pythonplugin.md#install-packages-for-the-python-plugin). Specifically:
- To save the process of creating fbprophet's zip file (containing the wheel files of fbprophet and its dependencies), you can copy it from [https://artifcatswestus.blob.core.windows.net/public/fbprophet-0.7.1.zip](https://artifcatswestus.blob.core.windows.net/public/fbprophet-0.7.1.zip) to your whitelisted blob container
- Create a SAS token with read access to your zip file
- In the example below, replace the URL reference in the external_artifacts parameter to reference your file with its SAS token

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
let series_fbprophet_forecast_fl=(tbl:(*), ts_series:string, y_series:string, y_pred_series:string, points:int=0, y_pred_low_series:string='', y_pred_high_series:string='')
{
    let kwargs = pack('ts_series', ts_series, 'y_series', y_series, 'y_pred_series', y_pred_series, 'points', points, 'y_pred_low_series', y_pred_low_series, 'y_pred_high_series', y_pred_high_series);
    let code = ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install("fbprophet.zip")
        import os
        os.chdir("D:\\\\Library\\\\mingw-w64\\\\bin")   #  must set this otherwise loading the mingw-w64 DLLs fails
        ts_series = kargs["ts_series"]
        y_series = kargs["y_series"]
        y_pred_series = kargs["y_pred_series"]
        points = kargs["points"]
        y_pred_low_series = kargs["y_pred_low_series"]
        y_pred_high_series = kargs["y_pred_high_series"]
        result = df
        result[y_pred_series] = df[y_series]
        if y_pred_low_series != '':
            result[y_pred_low_series] = df[y_series]
        if y_pred_high_series != '':
            result[y_pred_high_series] = df[y_series]
        from fbprophet import Prophet
        df1 = pd.DataFrame(columns=["ds", "y"])
        for i in range(df.shape[0]):
            df1["ds"] = pd.to_datetime(df[ts_series][i])
            df1["ds"] = df1["ds"].dt.tz_convert(None)
            df1["y"] = df[y_series][i]
            df2 = df1[:-points]
            m = Prophet()
            m.fit(df2)
            future = df1[["ds"]]
            forecast = m.predict(future)
            result.loc[i, y_pred_series] = list(forecast["yhat"])
            if y_pred_low_series != '':
                result.loc[i, y_pred_low_series] = list(forecast["yhat_lower"])
            if y_pred_high_series != '':
                result.loc[i, y_pred_high_series] = list(forecast["yhat_upper"])
    ```;
    tbl
     | evaluate python(typeof(*), code, kwargs
//  fbprophet v0.7.1 for Python 3.6.5
, external_artifacts=pack('fbprophet.zip', 'https://artifcatswestus.blob.core.windows.net/public/fbprophet-0.7.1.zip?*** YOUR SAS TOKEN ***'))
};
//
//  Forecasting 3 time series using fbprophet, compare to forecasting using the native function series_decompose_forecast()
//
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
let horizon=7d;
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t+horizon step dt by sid 
| extend pred_num_native = series_decompose_forecast(num, toint(horizon/dt))
| extend pred_num=dynamic(null), pred_num_lower=dynamic(null), pred_num_upper=dynamic(null)
| invoke series_fbprophet_forecast_fl('TimeStamp', 'num', 'pred_num', toint(horizon/dt), 'pred_num_lower', 'pred_num_upper')
| render timechart 
~~~

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md).  Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time Series Forecast using Facebook fbprophet package")
series_fbprophet_forecast_fl(tbl:(*), ts_series:string, y_series:string, y_pred_series:string, points:int=0, y_pred_low_series:string='', y_pred_high_series:string='')
{
    let kwargs = pack('ts_series', ts_series, 'y_series', y_series, 'y_pred_series', y_pred_series, 'points', points, 'y_pred_low_series', y_pred_low_series, 'y_pred_high_series', y_pred_high_series);
    let code = ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install("fbprophet.zip")
        import os
        os.chdir("D:\\\\Library\\\\mingw-w64\\\\bin")   #  must set this otherwise loading the mingw-w64 DLLs fails
        ts_series = kargs["ts_series"]
        y_series = kargs["y_series"]
        y_pred_series = kargs["y_pred_series"]
        points = kargs["points"]
        y_pred_low_series = kargs["y_pred_low_series"]
        y_pred_high_series = kargs["y_pred_high_series"]
        result = df
        result[y_pred_series] = df[y_series]
        if y_pred_low_series != '':
            result[y_pred_low_series] = df[y_series]
        if y_pred_high_series != '':
            result[y_pred_high_series] = df[y_series]
        from fbprophet import Prophet
        df1 = pd.DataFrame(columns=["ds", "y"])
        for i in range(df.shape[0]):
            df1["ds"] = pd.to_datetime(df[ts_series][i])
            df1["ds"] = df1["ds"].dt.tz_convert(None)
            df1["y"] = df[y_series][i]
            df2 = df1[:-points]
            m = Prophet()
            m.fit(df2)
            future = df1[["ds"]]
            forecast = m.predict(future)
            result.loc[i, y_pred_series] = list(forecast["yhat"])
            if y_pred_low_series != '':
                result.loc[i, y_pred_low_series] = list(forecast["yhat_lower"])
            if y_pred_high_series != '':
                result.loc[i, y_pred_high_series] = list(forecast["yhat_upper"])
    ```;
    tbl
     | evaluate python(typeof(*), code, kwargs
//  fbprophet v0.7.1 for Python 3.6.5
, external_artifacts=pack('fbprophet.zip', 'https://artifcatswestus.blob.core.windows.net/public/fbprophet-0.7.1.zip?*** YOUR SAS TOKEN ***'))
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
~~~kusto
//
//  Forecasting 3 time series using fbprophet, compare to forecasting using the native function series_decompose_forecast()
//
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
let horizon=7d;
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t+horizon step dt by sid 
| extend pred_num_native = series_decompose_forecast(num, toint(horizon/dt))
| extend pred_num=dynamic(null), pred_num_lower=dynamic(null), pred_num_upper=dynamic(null)
| invoke series_fbprophet_forecast_fl('TimeStamp', 'num', 'pred_num', toint(horizon/dt), 'pred_num_lower', 'pred_num_upper')
| render timechart 
~~~

---

:::image type="content" source="images/series-fbprophet-forecast-fl/fbprophet-example.png" alt-text="Graph showing forecasting few time series" border="false":::
