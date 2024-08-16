---
title:  series_fbprophet_forecast_fl()
description: This article describes the series_fbprophet_forecast_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# series_fbprophet_forecast_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `series_fbprophet_forecast_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that takes an expression containing a time series as input, and predicts the values of the last trailing points using the [Prophet algorithm](https://facebook.github.io/prophet/). The function returns both the forecasted points and their confidence intervals. This function is a Kusto Query Language (KQL) wrapper to Prophet() class, and exposes only the parameters that are mandatory for prediction. Feel free to modify your copy to support more parameters. such as holidays, change points, Fourier order, and so on.

> [!NOTE]
> Consider using the native function [series_decompose_forecast()](../query/series-decompose-forecast-function.md). The native function is based on a simpler model, but is more scalable and runs faster.

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

* Install the `fbprophet` package since it isn't included in the Python image. To install the package, do the following:
  1. Follow the guidelines for [Installing packages for the Python plugin](../query/python-plugin.md#install-packages-for-the-python-plugin).
     * To save time in the above guidelines, you can download the `prophet` zip file, containing the wheel files of `prophet` and its dependencies, from [https://artifactswestusnew.blob.core.windows.net/public/prophet-1.1.5.zip](https://artifactswestusnew.blob.core.windows.net/public/prophet-1.1.5.zip). Save this file to your allowlisted blob container.
  1. Create a SAS token with read access to your zip file. To create a SAS token, see [get the SAS for a blob container](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container).
  1. In the [Example](#example), replace the URL reference in the `external_artifacts` parameter with your file path and its SAS token.

## Syntax

`T | invoke series_fbprophet_forecast_fl(`*ts_series*`,` *y_series*`,` *y_pred_series*`,` [ *points* ]`,` [ *y_pred_low_series* ]`,` [ *y_pred_high_series* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]
  
## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ts_series*| `string` | :heavy_check_mark:|The name of the input table column containing the time stamps of the series to predict.|
|*y_series*| `string` | :heavy_check_mark:|The name of the input table column containing the values of the series to predict.|
|*y_pred_series*| `string` | :heavy_check_mark:|The name of the column to store the predicted series.|
|*points*| `int` | :heavy_check_mark:|The number of points at the end of the series to predict (forecast). These points are excluded from the learning (regression) process. The default is 0.|
|*y_pred_low_series*| `string` ||The name of the column to store the series of the lowest values of the confidence interval. Omit if the confidence interval isn't needed.|
|*y_pred_high_series*| `string` ||The name of the column to store the series of the highest values of the confidence interval. Omit if the confidence interval isn't needed.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `series_fbprophet_forecast_fl()`, see [Example](#example).

~~~kusto
let series_fbprophet_forecast_fl=(tbl:(*), ts_series:string, y_series:string, y_pred_series:string, points:int=0, y_pred_low_series:string='', y_pred_high_series:string='')
{
    let kwargs = bag_pack('ts_series', ts_series, 'y_series', y_series, 'y_pred_series', y_pred_series, 'points', points, 'y_pred_low_series', y_pred_low_series, 'y_pred_high_series', y_pred_high_series);
    let code = ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install("prophet.zip")
        ts_series = kargs["ts_series"]
        y_series = kargs["y_series"]
        y_pred_series = kargs["y_pred_series"]
        points = kargs["points"]
        y_pred_low_series = kargs["y_pred_low_series"]
        y_pred_high_series = kargs["y_pred_high_series"]
        result = df
        sr = pd.Series(df[y_pred_series])
        if y_pred_low_series != '':
            srl = pd.Series(df[y_pred_low_series])
        if y_pred_high_series != '':
            srh = pd.Series(df[y_pred_high_series])
        from prophet import Prophet
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
            sr[i] = list(forecast["yhat"])
            if y_pred_low_series != '':
                srl[i] = list(forecast["yhat_lower"])
            if y_pred_high_series != '':
                srh[i] = list(forecast["yhat_upper"])
        result[y_pred_series] = sr
        if y_pred_low_series != '':
            result[y_pred_low_series] = srl
        if y_pred_high_series != '':
            result[y_pred_high_series] = srh
    ```;
    tbl
     | evaluate python(typeof(*), code, kwargs
, external_artifacts=bag_pack('prophet.zip', 'https://artifactswestusnew.blob.core.windows.net/public/prophet-1.1.5.zip?*** YOUR SAS TOKEN ***'))
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Time Series Forecast using Facebook fbprophet package")
series_fbprophet_forecast_fl(tbl:(*), ts_series:string, y_series:string, y_pred_series:string, points:int=0, y_pred_low_series:string='', y_pred_high_series:string='')
{
    let kwargs = bag_pack('ts_series', ts_series, 'y_series', y_series, 'y_pred_series', y_pred_series, 'points', points, 'y_pred_low_series', y_pred_low_series, 'y_pred_high_series', y_pred_high_series);
    let code = ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install("prophet.zip")
        ts_series = kargs["ts_series"]
        y_series = kargs["y_series"]
        y_pred_series = kargs["y_pred_series"]
        points = kargs["points"]
        y_pred_low_series = kargs["y_pred_low_series"]
        y_pred_high_series = kargs["y_pred_high_series"]
        result = df
        sr = pd.Series(df[y_pred_series])
        if y_pred_low_series != '':
            srl = pd.Series(df[y_pred_low_series])
        if y_pred_high_series != '':
            srh = pd.Series(df[y_pred_high_series])
        from prophet import Prophet
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
            sr[i] = list(forecast["yhat"])
            if y_pred_low_series != '':
                srl[i] = list(forecast["yhat_lower"])
            if y_pred_high_series != '':
                srh[i] = list(forecast["yhat_upper"])
        result[y_pred_series] = sr
        if y_pred_low_series != '':
            result[y_pred_low_series] = srl
        if y_pred_high_series != '':
            result[y_pred_high_series] = srh
    ```;
    tbl
     | evaluate python(typeof(*), code, kwargs
, external_artifacts=bag_pack('prophet.zip', 'https://artifactswestusnew.blob.core.windows.net/public/prophet-1.1.5.zip?*** YOUR SAS TOKEN ***'))
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let series_fbprophet_forecast_fl=(tbl:(*), ts_series:string, y_series:string, y_pred_series:string, points:int=0, y_pred_low_series:string='', y_pred_high_series:string='')
{
    let kwargs = bag_pack('ts_series', ts_series, 'y_series', y_series, 'y_pred_series', y_pred_series, 'points', points, 'y_pred_low_series', y_pred_low_series, 'y_pred_high_series', y_pred_high_series);
    let code = ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install("prophet.zip")
        ts_series = kargs["ts_series"]
        y_series = kargs["y_series"]
        y_pred_series = kargs["y_pred_series"]
        points = kargs["points"]
        y_pred_low_series = kargs["y_pred_low_series"]
        y_pred_high_series = kargs["y_pred_high_series"]
        result = df
        sr = pd.Series(df[y_pred_series])
        if y_pred_low_series != '':
            srl = pd.Series(df[y_pred_low_series])
        if y_pred_high_series != '':
            srh = pd.Series(df[y_pred_high_series])
        from prophet import Prophet
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
            sr[i] = list(forecast["yhat"])
            if y_pred_low_series != '':
                srl[i] = list(forecast["yhat_lower"])
            if y_pred_high_series != '':
                srh[i] = list(forecast["yhat_upper"])
        result[y_pred_series] = sr
        if y_pred_low_series != '':
            result[y_pred_low_series] = srl
        if y_pred_high_series != '':
            result[y_pred_high_series] = srh
    ```;
    tbl
     | evaluate python(typeof(*), code, kwargs
, external_artifacts=bag_pack('prophet.zip', 'https://artifactswestusnew.blob.core.windows.net/public/prophet-1.1.5.zip?*** YOUR SAS TOKEN ***'))
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

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

:::image type="content" source="media/series-fbprophet-forecast-fl/fbprophet-example.png" alt-text="Graph showing forecasting few time series." border="false":::

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
