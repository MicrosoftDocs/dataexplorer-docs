---
title:  kmeans_dynamic_fl()
description: This article describes the kmeans_dynamic_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 07/25/2024
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# kmeans_dynamic_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `kmeans_dynamic_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that clusterizes a dataset using the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering). This function is similar to [kmeans_fl()](kmeans-fl.md) just the features are supplied by a single numerical array column and not by multiple scalar columns

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke kmeans_dynamic_fl(`*k*`,` *features_col*`,` *cluster_col*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*k*| `int` | :heavy_check_mark:|The number of clusters.|
|*features_col*| `string` | :heavy_check_mark:|The name of the column containing the numeric array of features to use for clustering.|
|*cluster_col*| `string` | :heavy_check_mark:|The name of the column to store the output cluster ID for each record.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `kmeans_fl()`, see [Examples](#examples).

~~~kusto
let kmeans_dynamic_fl=(tbl:(*),k:int, features_col:string, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features_col', features_col, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features_col = kargs["features_col"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features_col].apply(np.array)
        matrix = np.vstack(df1.values)
        kmeans = KMeans(n_clusters=k, random_state=0)
        kmeans.fit(matrix)
        result = df
        result[cluster_col] = kmeans.labels_
    ```;
    tbl
    | evaluate python(typeof(*),code, kwargs)
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Examples](#examples).

~~~kusto
.create-or-alter function with (folder = "Packages\\ML", docstring = "K-Means clustering of features passed as a single column containing numerical array")
kmeans_dynamic_fl(tbl:(*),k:int, features_col:string, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features_col', features_col, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features_col = kargs["features_col"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features_col].apply(np.array)
        matrix = np.vstack(df1.values)
        kmeans = KMeans(n_clusters=k, random_state=0)
        kmeans.fit(matrix)
        result = df
        result[cluster_col] = kmeans.labels_
    ```;
    tbl
    | evaluate python(typeof(*),code, kwargs)
}
~~~

---

## Example

The following example use the [invoke operator](../query/invoke-operator.md) to run the function.

### Clustering of artificial data with 3 clusters

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let kmeans_dynamic_fl=(tbl:(*),k:int, features_col:string, cluster_col:string)
{
    let kwargs = bag_pack('k', k, 'features_col', features_col, 'cluster_col', cluster_col);
    let code = ```if 1:

        from sklearn.cluster import KMeans

        k = kargs["k"]
        features_col = kargs["features_col"]
        cluster_col = kargs["cluster_col"]

        df1 = df[features_col].apply(np.array)
        matrix = np.vstack(df1.values)
        kmeans = KMeans(n_clusters=k, random_state=0)
        kmeans.fit(matrix)
        result = df
        result[cluster_col] = kmeans.labels_
    ```;
    tbl
    | evaluate python(typeof(*),code, kwargs)
};
union 
(range x from 1 to 100 step 1 | extend x=rand()+3, y=rand()+2),
(range x from 101 to 200 step 1 | extend x=rand()+1, y=rand()+4),
(range x from 201 to 300 step 1 | extend x=rand()+2, y=rand()+6)
| project Features=pack_array(x, y), cluster_id=int(null)
| invoke kmeans_dynamic_fl(3, "Features", "cluster_id")
| extend x=toreal(Features[0]), y=toreal(Features[1])
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
| project Features=pack_array(x, y), cluster_id=int(null)
| invoke kmeans_dynamic_fl(3, "Features", "cluster_id")
| extend x=toreal(Features[0]), y=toreal(Features[1])
| render scatterchart with(series=cluster_id)
```

---

![Scatterchart of K-Means clustering of artificial data with 3 clusters.](media/kmeans-fl/kmeans-scattergram.png)

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
