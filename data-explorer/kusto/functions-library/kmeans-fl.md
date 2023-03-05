---
title: kmeans_fl() - Azure Data Explorer
description: This article describes the kmeans_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/05/2023
---
# kmeans_fl()

The function `kmeans_fl()` clusterizes a dataset using the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering).

> [!NOTE]
> * `kmeans_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke kmeans_fl(`*k*`,` *features_cols*`,` *cluster_col*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*k*|int|&check;|The number of clusters.|
|*features_cols*|dynamic|&check;|An array containing the names of the features columns to use for clustering.|
|*cluster_col*|string|&check;|The name of the column to store the output cluster ID for each record.|

## Usage

`kmeans_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
let kmeans_fl=(tbl:(*), k:int, features:dynamic, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features', features, 'cluster_col', cluster_col);
    let code = ```if 1:
        
        from sklearn.cluster import KMeans
        
        k = kargs["k"]
        features = kargs["features"]
        cluster_col = kargs["cluster_col"]
        
        km = KMeans(n_clusters=k)
        df1 = df[features]
        km.fit(df1)
        result = df
        result[cluster_col] = km.labels_
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
//
// Clusterize room occupancy from sensors measurements.
//
// Occupancy Detection is an open dataset from UCI Repository at https://archive.ics.uci.edu/ml/datasets/Occupancy+Detection+
// It contains experimental data for binary classification of room occupancy from Temperature, Humidity, Light, and CO2.
//
OccupancyDetection
| extend cluster_id=double(null)
| invoke kmeans_fl(5, pack_array("Temperature", "Humidity", "Light", "CO2", "HumidityRatio"), "cluster_id")
| sample 10
~~~

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
~~~kusto
.create function with (folder = "Packages\\ML", docstring = "K-Means clustering")
kmeans_fl(tbl:(*), k:int, features:dynamic, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features', features, 'cluster_col', cluster_col);
    let code = ```if 1:
        
        from sklearn.cluster import KMeans
        
        k = kargs["k"]
        features = kargs["features"]
        cluster_col = kargs["cluster_col"]
        
        km = KMeans(n_clusters=k)
        df1 = df[features]
        km.fit(df1)
        result = df
        result[cluster_col] = km.labels_
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
~~~

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
//
// Clusterize room occupancy from sensors measurements.
//
// Occupancy Detection is an open dataset from UCI Repository at https://archive.ics.uci.edu/ml/datasets/Occupancy+Detection+
// It contains experimental data for binary classification of room occupancy from Temperature, Humidity, Light, and CO2.
//
OccupancyDetection
| extend cluster_id=double(null)
| invoke kmeans_fl(5, pack_array("Temperature", "Humidity", "Light", "CO2", "HumidityRatio"), "cluster_id")
| sample 10
```

---

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
Timestamp	                Temperature Humidity	Light  CO2         HumidityRatio Occupancy Test	 cluster_id
2015-02-02 14:38:00.0000000	23.64       27.1        473    908.8       0.00489763    TRUE	   TRUE  1
2015-02-03 01:47:00.0000000	20.575      22.125      0      446         0.00330878	 FALSE	   TRUE  0
2015-02-10 08:47:00.0000000	20.42666667 33.56       405    494.3333333 0.004986493	 TRUE	   FALSE 4
2015-02-10 09:15:00.0000000	20.85666667 35.09666667 433    665.3333333 0.005358055	 TRUE	   FALSE 4
2015-02-11 16:13:00.0000000	21.89       30.0225     429    771.75      0.004879358	 TRUE	   TRUE  4
2015-02-13 14:06:00.0000000	23.4175     26.5225     608    599.75      0.004728116	 TRUE	   TRUE  4
2015-02-13 23:09:00.0000000	20.13333333 32.2        0      502.6666667 0.004696278	 FALSE	   TRUE  0
2015-02-15 18:30:00.0000000	20.5        32.79       0      666.5       0.004893459	 FALSE	   TRUE  3
2015-02-17 13:43:00.0000000	21.7        33.9        454    1167        0.005450924	 TRUE	   TRUE  1
2015-02-17 18:17:00.0000000	22.025      34.2225     0      1538.25     0.005614538	 FALSE	   TRUE  2
```

Extract the centroids and size of each cluster, with the function already installed:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
OccupancyDetection
| extend cluster_id=double(null)
| invoke kmeans_fl(5, pack_array("Temperature", "Humidity", "Light", "CO2", "HumidityRatio"), "cluster_id")
| summarize Temperature=avg(Temperature), Humidity=avg(Humidity), Light=avg(Light), CO2=avg(CO2), HumidityRatio=avg(HumidityRatio), num=count() by cluster_id
| order by num

```

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
cluster_id	Temperature        Humidity            Light            CO2                HumidityRatio        num
0	        20.3507186863278   27.1521395395781    10.1995789883291	486.804272186974   0.00400132147662714	11124
4	        20.9247315268427   28.7971160082823    20.7311894656536	748.965771574469   0.00440412568299058	3063
1	        22.0284137970445   27.8953334469889    481.872136037748	1020.70779349773   0.00456692559904535	2514
3	        22.0344177115763   25.1151053429273    462.358969056434	656.310608696507   0.00411782436443015	2176
2	        21.4091216082295   31.8363099552939    174.614816229606	1482.05062388414   0.00504573022875817	1683
```
