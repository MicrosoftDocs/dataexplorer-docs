---
title:  kmeans_fl()
description: This article describes the kmeans_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# kmeans_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `kmeans_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that clusterizes a dataset using the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering).

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke kmeans_fl(`*k*`,` *features*`,` *cluster_col*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*k*| `int` | :heavy_check_mark:|The number of clusters.|
|*features*| `dynamic` | :heavy_check_mark:|An array containing the names of the features columns to use for clustering.|
|*cluster_col*| `string` | :heavy_check_mark:|The name of the column to store the output cluster ID for each record.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `kmeans_fl()`, see [example](#example).

~~~kusto
let kmeans_fl=(tbl:(*), k:int, features:dynamic, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features', features, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features = kargs["features"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features]
        km = KMeans(n_clusters=k, random_state=0)
        km.fit(df1)
        result = df
        result[cluster_col] = km.labels_
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\ML", docstring = "K-Means clustering")
kmeans_fl(tbl:(*), k:int, features:dynamic, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features', features, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features = kargs["features"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features]
        km = KMeans(n_clusters=k, random_state=0)
        km.fit(df1)
        result = df
        result[cluster_col] = km.labels_
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### Clustering of artificial dataset with three clusters

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let kmeans_fl=(tbl:(*), k:int, features:dynamic, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features', features, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features = kargs["features"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features]
        km = KMeans(n_clusters=k, random_state=0)
        km.fit(df1)
        result = df
        result[cluster_col] = km.labels_
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs)
};
union 
(range x from 1 to 100 step 1 | extend x=rand()+3, y=rand()+2),
(range x from 101 to 200 step 1 | extend x=rand()+1, y=rand()+4),
(range x from 201 to 300 step 1 | extend x=rand()+2, y=rand()+6)
| extend cluster_id=int(null)
| invoke kmeans_fl(3, bag_pack("x", "y"), "cluster_id")
| render scatterchart with(series=cluster_id)
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
union 
(range x from 1 to 100 step 1 | extend x=rand()+3, y=rand()+2),
(range x from 101 to 200 step 1 | extend x=rand()+1, y=rand()+4),
(range x from 201 to 300 step 1 | extend x=rand()+2, y=rand()+6)
| extend cluster_id=int(null)
| invoke kmeans_fl(3, bag_pack("x", "y"), "cluster_id")
| render scatterchart with(series=cluster_id)
```

---

![Screenshot of scatterchart of K-Means clustering of artificial dataset with three clusters.](media/kmeans-fl/kmeans-scattergram.png)

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
