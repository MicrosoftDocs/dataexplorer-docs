---
title:  predict_onnx_fl()
description: This article describes the predict_onnx_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 05/01/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# predict_onnx_fl()

::: zone pivot="azuredataexplorer, fabric"

The function `predict_onnx_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that predicts using an existing trained machine learning model. This model has been converted to [ONNX](https://onnx.ai/) format, serialized to string, and saved in a standard table.

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke predict_onnx_fl(`*models_tbl*`,` *model_name*`,` *features_cols*`,` *pred_col*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*models_tbl*|string| :heavy_check_mark:|The name of the table that contains all serialized models. The table must have the following columns:<br/> `name`: the model name<br/>`timestamp`: time of model training<br/>`model`: string representation of the serialized model|
|*model_name*|string| :heavy_check_mark:|The name of the specific model to use.|
|*features_cols*|synamic| :heavy_check_mark:|An array containing the names of the features columns that are used by the model for prediction.|
|*pred_col*|string| :heavy_check_mark:|The name of the column that stores the predictions.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `predict_onnx_fl()`, see [Example](#example).

~~~kusto
let predict_onnx_fl=(samples:(*), models_tbl:(name:string, timestamp:datetime, model:string), model_name:string, features_cols:dynamic, pred_col:string)
{
    let model_str = toscalar(models_tbl | where name == model_name | top 1 by timestamp desc | project model);
    let kwargs = bag_pack('smodel', model_str, 'features_cols', features_cols, 'pred_col', pred_col);
    let code = ```if 1:
    
    import binascii
    
    smodel = kargs["smodel"]
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    bmodel = binascii.unhexlify(smodel)
    
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    
    import onnxruntime as rt
    sess = rt.InferenceSession(bmodel)
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    df1 = df[features_cols]
    predictions = sess.run([label_name], {input_name: df1.values.astype(np.float32)})[0]
    
    result = df
    result[pred_col] = pd.DataFrame(predictions, columns=[pred_col])
    
    ```;
    samples | evaluate python(typeof(*), code, kwargs)
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\ML", docstring = "Predict using ONNX model")
predict_onnx_fl(samples:(*), models_tbl:(name:string, timestamp:datetime, model:string), model_name:string, features_cols:dynamic, pred_col:string)
{
    let model_str = toscalar(models_tbl | where name == model_name | top 1 by timestamp desc | project model);
    let kwargs = bag_pack('smodel', model_str, 'features_cols', features_cols, 'pred_col', pred_col);
    let code = ```if 1:
    
    import binascii
    
    smodel = kargs["smodel"]
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    bmodel = binascii.unhexlify(smodel)
    
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    
    import onnxruntime as rt
    sess = rt.InferenceSession(bmodel)
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    df1 = df[features_cols]
    predictions = sess.run([label_name], {input_name: df1.values.astype(np.float32)})[0]
    
    result = df
    result[pred_col] = pd.DataFrame(predictions, columns=[pred_col])
    
    ```;
    samples | evaluate python(typeof(*), code, kwargs)
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let predict_onnx_fl=(samples:(*), models_tbl:(name:string, timestamp:datetime, model:string), model_name:string, features_cols:dynamic, pred_col:string)
{
    let model_str = toscalar(models_tbl | where name == model_name | top 1 by timestamp desc | project model);
    let kwargs = bag_pack('smodel', model_str, 'features_cols', features_cols, 'pred_col', pred_col);
    let code = ```if 1:
    
    import binascii
    
    smodel = kargs["smodel"]
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    bmodel = binascii.unhexlify(smodel)
    
    features_cols = kargs["features_cols"]
    pred_col = kargs["pred_col"]
    
    import onnxruntime as rt
    sess = rt.InferenceSession(bmodel)
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    df1 = df[features_cols]
    predictions = sess.run([label_name], {input_name: df1.values.astype(np.float32)})[0]
    
    result = df
    result[pred_col] = pd.DataFrame(predictions, columns=[pred_col])
    
    ```;
    samples | evaluate python(typeof(*), code, kwargs)
};
//
// Predicts room occupancy from sensors measurements, and calculates the confusion matrix
//
// Occupancy Detection is an open dataset from UCI Repository at https://archive.ics.uci.edu/ml/datasets/Occupancy+Detection+
// It contains experimental data for binary classification of room occupancy from Temperature,Humidity,Light and CO2.
// Ground-truth labels were obtained from time stamped pictures that were taken every minute
//
OccupancyDetection 
| where Test == 1
| extend pred_Occupancy=bool(0)
| invoke predict_onnx_fl(ML_Models, 'ONNX-Occupancy', pack_array('Temperature', 'Humidity', 'Light', 'CO2', 'HumidityRatio'), 'pred_Occupancy')
| summarize n=count() by Occupancy, pred_Occupancy
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
//
// Predicts room occupancy from sensors measurements, and calculates the confusion matrix
//
// Occupancy Detection is an open dataset from UCI Repository at https://archive.ics.uci.edu/ml/datasets/Occupancy+Detection+
// It contains experimental data for binary classification of room occupancy from Temperature,Humidity,Light and CO2.
// Ground-truth labels were obtained from time stamped pictures that were taken every minute
//
OccupancyDetection 
| where Test == 1
| extend pred_Occupancy=bool(0)
| invoke predict_onnx_fl(ML_Models, 'ONNX-Occupancy', pack_array('Temperature', 'Humidity', 'Light', 'CO2', 'HumidityRatio'), 'pred_Occupancy')
| summarize n=count() by Occupancy, pred_Occupancy
```

---

**Output**

| Occupancy | pred_Occupancy | n |
|---|---|---|
| TRUE | TRUE | 3006 |
| FALSE | TRUE | 112 |
| TRUE | FALSE | 15 |
| FALSE | FALSE | 9284 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
