---
title: predict_onnx_fl() - Azure Data Explorer
description: This article describes the predict_onnx_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 09/09/2020
---
# predict_onnx_fl()

The function `predict_onnx_fl()` predicts using an existing trained machine learning model. This model has been converted to [ONNX](https://onnx.ai/) format, serialized to string, and saved in a standard Azure Data Explorer table.

> [!NOTE]
> * `predict_onnx_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke predict_onnx_fl(`*models_tbl*`,` *model_name*`,` *features_cols*`,` *pred_col*`)`

## Arguments

* *models_tbl*: The name of the table containing all serialized models. This table must contain the following columns:
    * *name*: the model name
    * *timestamp*: time of model training
    * *model*: string representation of the serialized model
* *model_name*: The name of the specific model to use.
* *features_cols*: Dynamic array containing the names of the features columns that are used by the model for prediction.
* *pred_col*: The name of the column that stores the predictions.

## Usage

`predict_onnx_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

<!-- csl: https://help.kusto.windows.net/Samples -->
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

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
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

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
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

Confusion matrix:
<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
Occupancy	pred_Occupancy	n
TRUE	    TRUE	        3006
FALSE	    TRUE	        112
TRUE	    FALSE	        15
FALSE	    FALSE	        9284
```
