---
title: detect_anomalous_access_cf_fl()
description: Learn how to use the detect_anomalous_access_cf_fl() function to detect anomalous access using collaborative filtering.
ms.reviewer: shaysakazi
ms.topic: reference
ms.date: 05/26/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# detect_anomalous_access_cf_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Detect anomalous access using a collaborative filtering (CF) model that identifies anomalous access patterns in timestamped data.

The `detect_anomalous_access_cf_fl()` function is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that applies a collaborative filtering (CF) model to detect anomalous interactions, such as entity-resource. For example, a User Principal Name (UPN) accessing a Storage account, based on timestamped data like access logs. In a cybersecurity context, this function helps detect abnormal or unauthorized access patterns.

The CF-based model predicts access scores using item similarity, leveraging historical access patterns and the cosine similarity between entities and resources. It estimates the probability of an entity accessing a resource during a defined detection period within a given scope, such as a subscription or an account. Several optional parameters, including a minimal threshold, allow customization of the model’s behavior.

The model outputs an access anomaly score in the range [0, 1], where 0 indicates a high likelihood of legitimate access and 1 indicates a highly anomalous access. Alongside the access anomaly score, the function also returns a binary anomaly flag (based on the defined threshold) and additional explanatory fields.

## Syntax

`detect_anomalous_access_cf_fl(`*entityColumnName*, *resourceColumnName*, *scopeColumnName*, *timeColumnName*, *startTraining*, *startDetection*, *endDetection*, [*anomalyScoreThresh*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *entityColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing entity names or IDs for which the cf model is calculated. |
| *resourceColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing resource names or IDs for which the model is calculated. |
| *scopeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the partition or scope, so that a different anomaly model is built for each scope. |
| *timeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the timestamps that are used to define the training and detection periods. |
| *startTraining* | `datetime` |  :heavy_check_mark: | The beginning of the training period for the anomaly model. Its end is defined by the beginning of detection period. |
| *startDetection* | `datetime` |  :heavy_check_mark: | The beginning of the detection period for anomaly detection. |
| *endDetection* | `datetime` |  :heavy_check_mark: | The end of the detection period for anomaly detection. |
| *anomalyScoreThresh* | `real` |   | The maximum value of anomaly score for which an anomaly is detected, a number in range [0, 1]. Higher values mean that only more significant cases are considered anomalous, so fewer anomalies are detected (higher precision, lower recall). The default value is 0.9. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `detect_anomalous_access_cf_fl()`, see [Example](#example).

```kusto
let detect_anomalous_access_cf_fl = (T:(*), entityColumnName:string, resourceColumnName:string, scopeColumnName:string
                                          , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                          , anomalyScoreThresh:real = 0.9)
{
//pre-process the input data by adding standard column names and dividing to datasets
let processedData = (
    T
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend resource   = column_ifexists(resourceColumnName, '')
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(resource) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection ,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// Create all possible pairs (entity, resource) with the same scope
let entities = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by entity, scope
    | extend temp = 1
);
let resources = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by resource, scope
    | extend temp = 1
);
let potentialAccessTrainData = (
    entities
    | join kind=inner resources on temp
    | distinct  entity, resource, scope
);
let accessTrainData = (
    potentialAccessTrainData
    | join kind=leftouter hint.strategy=broadcast (processedData | where dataSet =='trainSet') on entity, resource, scope
    | extend usedOperation = iff(isempty(resource1), 0, 1)
    | distinct entity, resource, scope, usedOperation
);
// Aggregate interaction scores per item into a list to prepare for similarity calculations
// Add a temporary key for self-joining later in the process
let ItemUserInteractions = (
    accessTrainData
    | summarize interactList = make_list(usedOperation) by resource, scope
    | extend tempKey=1
);
// Compute item-to-item similarity using cosine similarity
let ItemSimilarities = (
    ItemUserInteractions
    | join kind=inner (ItemUserInteractions) on tempKey
    | where scope == scope1
    | extend similarity = series_cosine_similarity(interactList, interactList1)
    | extend similarity = iff(isnan(similarity), 0.0, similarity)
    | project resource, resource1, scope, similarity
);
// Predict user-item interactions based on item similarities
let Predictions = (
    accessTrainData
    | join kind=inner (ItemSimilarities) on scope and $left.resource == $right.resource1
    | project entity, resource=resource2, usedOperation, similarity
    | summarize accessAnomalyScore = sum(usedOperation * similarity) / sum(abs(similarity)) by entity, resource
    | extend accessAnomalyScore = iff(isnan(accessAnomalyScore), 0.0, accessAnomalyScore)
    | extend accessAnomalyScore = 1 - accessAnomalyScore
    | extend accessAnomalyScore = round(accessAnomalyScore, 4)
    | join kind=inner accessTrainData on entity, resource
    | project entity, resource, scope, usedOperation, accessAnomalyScore
    | extend accessAnomalyScore = iff(usedOperation == 0.0, accessAnomalyScore, todouble(usedOperation))
    | order by entity asc, resource
);
let resultsData = (
    processedData
    | where dataSet == "detectSet"
    | join kind=leftouter Predictions on entity, resource, scope
    | extend isAnomalousAccess = iff(accessAnomalyScore > anomalyScoreThresh, 1, 0)
    | project-away sliceTime, entity1, resource1, scope1, usedOperation
);
resultsData
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "KCL", docstring = "Detect anomalous access using collaborative filtering model", skipvalidation = "true") 
detect_anomalous_access_cf_fl(T:(*), entityColumnName:string, resourceColumnName:string, scopeColumnName:string
                                   , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                   , anomalyScoreThresh:real=0.9) 
{
//pre-process the input data by adding standard column names and dividing to datasets
let processedData = (
    T
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend resource   = column_ifexists(resourceColumnName, '')
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(resource) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// Create all possible pairs (entity, resource) with the same scope
let entities = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by entity, scope
    | extend temp = 1
);
let resources = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by resource, scope
    | extend temp = 1
);
let potentialAccessTrainData = (
    entities
    | join kind=inner resources on temp
    | distinct  entity, resource, scope
);
let accessTrainData = (
    potentialAccessTrainData
    | join kind=leftouter hint.strategy=broadcast (processedData | where dataSet =='trainSet') on entity, resource, scope
    | extend usedOperation = iff(isempty(resource1), 0, 1)
    | distinct entity, resource, scope, usedOperation
);
// Aggregate interaction scores per item into a list to prepare for similarity calculations
// Add a temporary key for self-joining later in the process
let ItemUserInteractions = (
    accessTrainData
    | summarize interactList = make_list(usedOperation) by resource, scope
    | extend tempKey=1
);
// Compute item-to-item similarity using cosine similarity
let ItemSimilarities = (
    ItemUserInteractions
    | join kind=inner (ItemUserInteractions) on tempKey
    | where scope == scope1
    | extend similarity = series_cosine_similarity(interactList, interactList1)
    | extend similarity = iff(isnan(similarity), 0.0, similarity)
    | project resource, resource1, scope, similarity
);
// Predict user-item interactions based on item similarities
let Predictions = (
    accessTrainData
    | join kind=inner (ItemSimilarities) on scope and $left.resource == $right.resource1
    | project entity, resource=resource2, usedOperation, similarity
    | summarize accessAnomalyScore = sum(usedOperation * similarity) / sum(abs(similarity)) by entity, resource
    | extend accessAnomalyScore = iff(isnan(accessAnomalyScore), 0.0, accessAnomalyScore)
    | extend accessAnomalyScore = 1 - accessAnomalyScore
    | extend accessAnomalyScore = round(accessAnomalyScore, 4)
    | join kind=inner accessTrainData on entity, resource
    | project entity, resource, scope, usedOperation, accessAnomalyScore
    | extend accessAnomalyScore = iff(usedOperation == 0.0, accessAnomalyScore, todouble(usedOperation))
    | order by entity asc, resource
);
let resultsData = (
    processedData
    | where dataSet == "detectSet"
    | join kind=leftouter Predictions on entity, resource, scope
    | extend isAnomalousAccess = iff(accessAnomalyScore > anomalyScoreThresh, 1, 0)
    | project-away sliceTime, entity1, resource1, scope1, usedOperation
);
resultsData
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA61YXW%2FbNhR9968gjAKWOjm13HTA0qpA0AxYsKErkOxpGAxGom02EmmQVFpv3X%2Ff5ZckSnKjrPVD7FDk4b3n3A9SJVGoIIrkaoMZr3DJa7nBeU6k3OTbzbZEGYpuL6LncYIIU1Qd3%2FGyrth7XJELqQRluwQJInktcjLySOb8MByfocmfBClajSIrLNStwJTBvxcFVkRPdONXxiXKWecBYcVw%2BEmWWIaONzkX5HYPXu8vBMGaotXZT%2FHsn9mLFwdBlgfBNX9I7Qmi7FADw1hhdHdEuCjAWG0iK7AoUG7cQgz8koBeoII%2BUDNFcbNIEiVnJWjkMElxpaFAE2P4rfn7BZHPCrxzAhljM4e9oVvymUolo756CVos4nC913F0%2FVDkEQQjNzphQS8WxpaXNCe3IIterrgXKeojhSFhgDzSpz0RQLtkXJHqoI5219iw2xm1bAyGvZODB41lPYu1SDegD3gLYkXtPPQ2C0PUILaP3%2FQCFfJrofRUQFt8LSoTNNyjQelvkgVRD2vRwmb7Y7t8ywc84RD7YhFq4qmiDEWtq0nXongWv4YkQu8grRRBuCzRgUtJ70qCDpgKiZxwbc2J0Seq9ibXJMSCjUCTMmYmhcTy2RLk0KhpWdYX4QuSdVVhQf8mOoH97naXIBJ0oMBWqXZBb%2B8N%2FK77e9BJFhwgeMFeXF6aem4CMSgfniEH85GDNPeUFRlljIiOBxA6GtzNKyAHKcsVQn0xvFnOAHxi31OGDewoyVbxWoEte8rUGZR%2BCIvdMbsTHBeQcApFYWEcEtryGWs3TlkcEFkD3O8HApvppMkQ3W4jKsMKkULCrhKUxn1STuyQhKgu0C93O0F2OtbBP3hk01TqBiMRzEUUeNfPOMKohC10Y4Aec8Dg5JYLJGlFSwgPKPs5LvO6NOjSYBcFLNK6cYHFEd2To11Cyu1Sc6yLEszXuzCTQI5Lo901LPxDEnHd2tVGMh7VrY1U78xv2uIMVfiebLT1UcBBPCmifyXHLPV1gVfQTolhZan40rDToaCW2qecwxfpjDcO3fihblkY8%2FRERkRjc2OfHmBpkNW2GUJOmx9pr9W1VsMEIsCijTV80z6KukQmAa1pv3V28WzAMsyidljH6xlEbGfEIYDsH6EAd6RogrwJ3g6ZVooPghQUFoGiYumjtI2UO%2BiGhSYmlEgXGy2GWz0hqEYl6Opo6LdU6%2Bb3TNeMs%2BYkA%2Bw%2FE3S3b4fSntf9fM38j3UvZQMS%2BhFvjb%2FsHBC1rHUVRjx63qUfvTAz8J3syhR3%2B4y3JdR6dLNW8%2BFjr%2F3IkwnIKVqOPJiwUPCaFSPmJOg8PiFvv2WMlOxH9Buvt2O%2BTyS11w2yU1Qm%2BsTKazir9Mqc95WLAjxs1EVY5h2v2mNDXSoZ9sspB4d5c4yaf6WPdhNvajukzk24GtqG7YgZYeztyB0JmiSEX6%2FYLPEnfGxPqv5ymQ5rTzrSOTskzf415UgeGXQwRXN719oR5qeXzQ33A1RZXtzoAzPSF4zmerFerdfL1fny5QqtXl2sVk4Kc3IIFw1XvVyu0mCVvcyFnwxOr%2Fn9BguBj9H8sqgomydofkUeUve91t%2FXt0tZH6Bdq7kDyyGD1PsQMUMGZ1MStlP7yOznphfkgea93fVFSsLZAItIYLYjbtKGFmgreAXZDUeKVylcJMgB%2FmlvNmaarmJK5FhFczsw12Fu7%2BBRgwRFq1sMnRnW36D%2F2ydx17ur0Oaedw4qXqZOEyKVyY3AQ%2BuYsg6ttEPr8%2Bc%2FrpxPvTMFaHej466hpy%2FzDyjdQ6VWg0Oh0Ep0abU0GAX%2BVJBtSlNcRK1qcfxX%2F8JoHLouhjDO1QGQI2gIBfnnN7JQOikjuzKGC%2BbqbG3vsVHr85thLsTm6gm8%2FsweqOCsglTU1zLI1KI7FD%2FCh9693SgbEguYv5zn9y%2FFImlWP8bOFFC7KAVUv3wKUY%2Bh9t1PujBP5mLA%2BnchYwzVrnq1%2BhY6xnAn8SGhdukO16IVROaz1zOft7MvcE584Pfk628dB2%2BrrKELz9TUdxdj7yY1jmdmOk7v5ZWzp0PBdKjw7ZXTdtFQ9gSbgvdLDqgfyk9Da98VWbRBJEyGC148eeP%2BD1z8H0aqGr%2BkFgAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let detect_anomalous_access_cf_fl = (T:(*), entityColumnName:string, resourceColumnName:string, scopeColumnName:string
                                                , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                                , anomalyScoreThresh:real = 0.9)
{
//pre-process the input data by adding standard column names and dividing to datasets
let processedData = (
    T
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend resource = column_ifexists(resourceColumnName, '')
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(resource) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// Create all possible pairs (entity, resource) with the same scope
let entities = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by entity, scope
    | extend temp = 1
);
let resources = (
    processedData
    | where dataSet == 'trainSet'
    | summarize by resource, scope
    | extend temp = 1
);
let potentialAccessTrainData = (
    entities
    | join kind=inner resources on temp
    | distinct  entity, resource, scope
);
let accessTrainData = (
    potentialAccessTrainData
    | join kind=leftouter hint.strategy=broadcast (processedData | where dataSet =='trainSet') on entity, resource, scope
    | extend usedOperation = iff(isempty(resource1), 0, 1)
    | distinct entity, resource, scope, usedOperation
);
// Aggregate interaction scores per item into a list to prepare for similarity calculations
// Add a temporary key for self-joining later in the process
let ItemUserInteractions = (
    accessTrainData
    | summarize interactList = make_list(usedOperation) by resource, scope
    | extend tempKey=1
);
// Compute item-to-item similarity using cosine similarity
let ItemSimilarities = (
    ItemUserInteractions
    | join kind=inner (ItemUserInteractions) on tempKey
    | where scope == scope1
    | extend similarity = series_cosine_similarity(interactList, interactList1)
    | extend similarity = iff(isnan(similarity), 0.0, similarity)
    | project resource, resource1, scope, similarity
);
// Predict user-item interactions based on item similarities
let Predictions = (
    accessTrainData
    | join kind=inner (ItemSimilarities) on scope and $left.resource == $right.resource1
    | project entity, resource=resource2, usedOperation, similarity
    | summarize accessAnomalyScore = sum(usedOperation * similarity) / sum(abs(similarity)) by entity, resource
    | extend accessAnomalyScore = iff(isnan(accessAnomalyScore), 0.0, accessAnomalyScore)
    | extend accessAnomalyScore = 1 - accessAnomalyScore
    | extend accessAnomalyScore = round(accessAnomalyScore, 4)
    | join kind=inner accessTrainData on entity, resource
    | project entity, resource, scope, usedOperation, accessAnomalyScore
    | extend accessAnomalyScore = iff(usedOperation == 0.0, accessAnomalyScore, todouble(usedOperation))
    | order by entity asc, resource
);
let resultsData = (
    processedData
    | where dataSet == "detectSet"
    | join kind=leftouter Predictions on entity, resource, scope
    | extend isAnomalousAccess = iff(accessAnomalyScore > anomalyScoreThresh, 1, 0)
    | project-away sliceTime, entity1, resource1, scope1, usedOperation
);
resultsData
};
// synthetic data generation
let detectPeriodStart   = datetime(2022-04-30 05:00);
let trainPeriodStart    = datetime(2022-03-01 05:00);
let names               = pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          = array_length(names);
let devices             = toscalar(range device_id from 1 to 51 step 1 | extend device = strcat("device", tostring(device_id)) | summarize devices_array = make_list(device));
let countDevices          = array_length(devices)-1;
let testData            = range t from 0 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = tostring(devices[toint(rand(countDevices))])
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == trainPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == trainPeriodStart, 'device1', deviceId)
    | extend accountName    = iff(timeSlice == trainPeriodStart, 'prodEnvironment', accountName)
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == detectPeriodStart, 'device50', deviceId)
    | extend accountName    = iff(timeSlice == detectPeriodStart, 'prodEnvironment', accountName)
    | sort by timeSlice desc
;
testData
| invoke detect_anomalous_access_cf_fl(entityColumnName    = 'userName'
                                      , resourceColumnName = 'deviceId'
                                      , scopeColumnName    = 'accountName'
                                      , timeColumnName     = 'timeSlice'
                                      , startTraining      = trainPeriodStart
                                      , startDetection     = detectPeriodStart
                                      , endDetection       = detectPeriodStart
                                  )
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
// synthetic data generation
let detectPeriodStart   = datetime(2022-04-30 05:00);
let trainPeriodStart    = datetime(2022-03-01 05:00);
let names               = pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          = array_length(names);
let devices             = toscalar(range device_id from 1 to 51 step 1 | extend device = strcat("device", tostring(device_id)) | summarize devices_array = make_list(device));
let countDevices          = array_length(devices)-1;
let testData            = range t from 0 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = tostring(devices[toint(rand(countDevices))])
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == trainPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == trainPeriodStart, 'device1', deviceId)
    | extend accountName    = iff(timeSlice == trainPeriodStart, 'prodEnvironment', accountName)
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == detectPeriodStart, 'device50', deviceId)
    | extend accountName    = iff(timeSlice == detectPeriodStart, 'prodEnvironment', accountName)
    | sort by timeSlice desc
;
testData
| invoke detect_anomalous_access_cf_fl(entityColumnName    = 'userName'
                                      , resourceColumnName = 'deviceId'
                                      , scopeColumnName    = 'accountName'
                                      , timeColumnName     = 'timeSlice'
                                      , startTraining      = trainPeriodStart
                                      , startDetection     = detectPeriodStart
                                      , endDetection       = detectPeriodStart
                                  )
```

---

**Output**

| t    | timeSlice                   | userName | deviceId | accountName     | entity | resource | scope            | dataSet      | accessAnomalyScore  | isAnomalousAccess  |
|------|-----------------------------|----------|----------|-----------------|--------|----------|------------------|--------------|---------------------|--------------------|
| 1440 | 2022-04-30 05:00:00.0000000 | H4ck3r   | device50 | prodEnvironment | H4ck3r | device50 | prodEnvironment  | detectSet    | 0.982               | 1                  |


The output of running the function shows each anomalous entity-resource access event during the detection period, filtered for cases where the predicted access probability (based on collaborative filtering) was higher than the defined anomaly threshold (by default, 0.9). Additional fields are added for clarity:

* `dataSet`: current dataset (is always `detectSet`).
* `accessAnomalyScore`: the predicted access anomaly score of this access, based on collaborative filtering modeling. The value is in range [0, 1], higher values signify a higher degree of anomaly. 
* `isAnomalousAccess`: binary flag for anomalous accesses 

Running the function with default parameters flags the access attempt by the user 'H4ck3r' to device 'device50' within the 'prodEnvironment' account. The predicted access anomaly score is 0.982, which is very high, indicating that this access is unexpected according to the trained model based on historical patterns.

In the training period, the collaborative filtering model learned access patterns between users and devices within scopes. Since 'H4ck3r' accessing 'device50' was not observed and considered unlikely in the historical data, it was flagged as anomalous.

The output table presents these anomalous accesses together with the predicted access score. These fields are useful for further investigation, alerting, or integration with broader detection workflows.

The suggested usage in a cybersecurity context is to monitor important entities, such as usernames or IPs, accessing important resources like devices, databases, or applications within their corresponding scopes (e.g., account or subscription).
