---
title: series_mv_oc_anomalies_fl() - Azure Data Explorer
description: This article describes the series_mv_oc_anomalies_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/20/2022
---
# series_mv_oc_anomalies_fl()

The function `series_mv_oc_anomalies_fl()` detects multivariate anomalies in series by applying the [One Class SVM model from scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.svm.OneClassSVM.html). The function accepts a set of series as numerical dynamic arrays, the names of the features columns and the expected percentage of anomalies out of the whole series. The function trains one class SVM for each series and marks the points that fall outside the hyper sphere as anomalies.

> [!NOTE]
>
> * `series_mv_oc_anomalies_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke series_mv_oc_anomalies_fl(`*features_cols*`,` *anomaly_col*`,` *anomalies_pct*`)`
  
## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *features_cols* | dynamic | &check; | Dynamic array containing the names of the columns that are used for the multivariate anomaly detection model. |
| *anomaly_col* | string | &check; | The name of the column to store the detected anomalies. |
| *anomalies_pct* | real | | A real number in the range [0-50] specifying the expected percentage of anomalies in the data. Default value: 4% |

## Usage

`series_mv_oc_anomalies_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

### [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
//Define function
let series_mv_oc_anomalies_fl=(tbl:(*), features_cols:dynamic, anomaly_col:string, anomalies_pct:real=4.0)
{
    let kwargs = bag_pack('features_cols', features_cols, 'anomaly_col', anomaly_col, 'anomalies_pct', anomalies_pct);
    let code = ```if 1:
        from sklearn.svm import OneClassSVM
        features_cols = kargs['features_cols']
        anomaly_col = kargs['anomaly_col']
        anomalies_pct = kargs['anomalies_pct']
        dff = df[features_cols]
        svm = OneClassSVM(nu=anomalies_pct/100.0)
        for i in range(len(dff)):
            dffi = dff.iloc[[i], :]
            dffe = dffi.explode(features_cols)
            svm.fit(dffe)
            df.loc[i, anomaly_col] = (svm.predict(dffe) < 0).astype(int).tolist()
        result = df
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
;
// Usage
normal_2d_with_anomalies
| extend anomalies=dynamic(null)
| invoke series_mv_oc_anomalies_fl(pack_array('x', 'y'), 'anomalies', anomalies_pct=6)
| extend anomalies=series_multiply(80, anomalies)
| render timechart
```

### [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md).  Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Series", docstring = "Anomaly Detection for multi dimensional data using One Class SVM model")
series_mv_oc_anomalies_fl(tbl:(*), features_cols:dynamic, anomaly_col:string, anomalies_pct:real=4.0)
{
    let kwargs = bag_pack('features_cols', features_cols, 'anomaly_col', anomaly_col, 'anomalies_pct', anomalies_pct);
    let code = ```if 1:
        from sklearn.svm import OneClassSVM
        features_cols = kargs['features_cols']
        anomaly_col = kargs['anomaly_col']
        anomalies_pct = kargs['anomalies_pct']
        dff = df[features_cols]
        svm = OneClassSVM(nu=anomalies_pct/100.0)
        for i in range(len(dff)):
            dffi = dff.iloc[[i], :]
            dffe = dffi.explode(features_cols)
            svm.fit(dffe)
            df.loc[i, anomaly_col] = (svm.predict(dffe) < 0).astype(int).tolist()
        result = df
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
normal_2d_with_anomalies
| extend anomalies=dynamic(null)
| invoke series_mv_oc_anomalies_fl(pack_array('x', 'y'), 'anomalies', anomalies_pct=6)
| extend anomalies=series_multiply(80, anomalies)
| render timechart
```

---

The table normal_2d_with_anomalies contains a set of 3 time series. Each time series has two-dimensional normal distribution with daily anomalies added at midnight, 8am, and 4pm respectively. You can create this sample data set using [an example query](series-mv-ee-anomalies-fl.md#create-a-sample-data-set).

![Graph showing multivariate anomalies on a time chart.](images/series-mv-oc-anomalies-fl/mv-oc-anomalies-time-chart.png)

To view the data as a scatter chart, replace the usage code with the following:

```kusto
normal_2d_with_anomalies
| extend anomalies=dynamic(null)
| invoke series_mv_oc_anomalies_fl(pack_array('x', 'y'), 'anomalies')
| where name == 'TS1'
| project x, y, anomalies
| mv-expand x to typeof(real), y to typeof(real), anomalies to typeof(string)
| render scatterchart with(series=anomalies)
```

![Graph showing multivariate anomalies on a scatter chart.](images/series-mv-oc-anomalies-fl/mv-oc-anomalies-scatter-chart.png)

You can see that on TS1 most of the anomalies occurring at midnights were detected using this multivariate model.
