---
title: predict_fl() - Azure Data Explorer
description: This article describes the predict_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 09/09/2020
---
# predict_fl()

The function `predict_fl()` predicts using an existing trained machine learning model. This model was built using [Scikit-learn](https://scikit-learn.org/stable/), serialized to string, and saved in a standard Azure Data Explorer table.

> [!NOTE]
> * `predict_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke predict_fl(`*models_tbl*`,` *model_name*`,` *features_cols*`,` *pred_col*`)`

## Arguments

* *models_tbl*: The name of the table containing all serialized models. This table must contain the following columns:
    * *name*: the model name
    * *timestamp*: time of model training
    * *model*: string representation of the serialized model
* *model_name*: The name of the specific model to use.
* *features_cols*: Dynamic array containing the names of the features columns that are used by the model for prediction.
* *pred_col*: The name of the column that stores the predictions.

## Usage

`predict_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function) to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed the code using the [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
let predict_fl=(samples:(*), models_tbl:(name:string, timestamp:datetime, model:string), model_name:string, features_cols:dynamic, pred_col:string)
{
    let model_str = toscalar(models_tbl | where name == model_name | top 1 by timestamp desc | project model);
    let kwargs = pack('smodel', model_str, 'features_cols', features_cols, 'pred_col', pred_col);
    let code =
    '\n'
    'import pickle\n'
    'import binascii\n'
    '\n'
    'smodel = kargs["smodel"]\n'
    'features_cols = kargs["features_cols"]\n'
    'pred_col = kargs["pred_col"]\n'
    'bmodel = binascii.unhexlify(smodel)\n'
    'clf1 = pickle.loads(bmodel)\n'
    'df1 = df[features_cols]\n'
    'predictions = clf1.predict(df1)\n'
    '\n'
    'result = df\n'
    'result[pred_col] = pd.DataFrame(predictions, columns=[pred_col])'
    '\n'
    ;
    samples
    | evaluate python(typeof(*), code, kwargs)
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
| extend pred_Occupancy=false
| invoke predict_fl(ML_Models, 'Occupancy', pack_array('Temperature', 'Humidity', 'Light', 'CO2', 'HumidityRatio'), 'pred_Occupancy')
| summarize n=count() by Occupancy, pred_Occupancy
```

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
.create function with (folder = "Packages\\ML", docstring = "Predict using ML model, build by Scikit-learn")
predict_fl(samples:(*), models_tbl:(name:string, timestamp:datetime, model:string), model_name:string, features_cols:dynamic, pred_col:string)
{
    let model_str = toscalar(models_tbl | where name == model_name | top 1 by timestamp desc | project model);
    let kwargs = pack('smodel', model_str, 'features_cols', features_cols, 'pred_col', pred_col);
    let code =
    '\n'
    'import pickle\n'
    'import binascii\n'
    '\n'
    'smodel = kargs["smodel"]\n'
    'features_cols = kargs["features_cols"]\n'
    'pred_col = kargs["pred_col"]\n'
    'bmodel = binascii.unhexlify(smodel)\n'
    'clf1 = pickle.loads(bmodel)\n'
    'df1 = df[features_cols]\n'
    'predictions = clf1.predict(df1)\n'
    '\n'
    'result = df\n'
    'result[pred_col] = pd.DataFrame(predictions, columns=[pred_col])'
    '\n'
    ;
    samples
    | evaluate python(typeof(*), code, kwargs)
}
```

### Usage

<!-- csl: https://help.kusto.windows.net:443/Samples -->
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
| extend pred_Occupancy=false
| invoke predict_fl(ML_Models, 'Occupancy', pack_array('Temperature', 'Humidity', 'Light', 'CO2', 'HumidityRatio'), 'pred_Occupancy')
| summarize n=count() by Occupancy, pred_Occupancy
```

---

Confusion matrix:
<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
Occupancy	pred_Occupancy	n
TRUE	    TRUE	        3006
FALSE	    TRUE	        112
TRUE	    FALSE	        15
FALSE	    FALSE	        9284
```
