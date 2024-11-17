---
title:  detect_anomalous_new_entity_fl()
description: Learn how to use the detect_anomalous_new_entity_fl() function to detect the appearance of anomalous new entities.
ms.reviewer: andkar
ms.topic: reference
ms.date: 11/17/2024
---
# detect_anomalous_new_entity_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Detect the appearance of anomalous new entities in timestamped data.

The function `detect_anomalous_new_entity_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that detects the appearance of anomalous new entities - such as IP addresses or users - in timestamped data, such as traffic logs.

The  anomaly model is based on a Poisson distribution representing the number of new entities appearing per time bin (such as day) for each scope. Poisson distribution parameter is estimated based on the rate of appearance of new entities in training period, with added decay factor reflecting the fact that recent appearances are more important than old ones. Thus we calculate the probability to encounter a new entity in defined detection period per some scope - such as a subscription or an account. The model output is controlled by several optional parameters, such as minimal threshold for anomaly, decay rate parameter, and others. 

The model's direct output is an anomaly score based on the inverse of probability to encounter a new entity and normalized to the range of [0, 1], with 100 representing something very anomalous. In addition to the anomaly score, there's a binary flag for detected anomaly (controlled by a minimal threshold parameter), and other explanatory fields.

## Syntax

`detect_anomalous_new_entity_fl(`*entity*, *partition*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *entityColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the names or IDs of the entities for which anomaly model is calculated. |
| *scopeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the partition or scope, so that a different anomaly model is built for each scope. |
| *timeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the timestamps, that are used to define the training and detection periods. |
| *startTraining* | `datetime` |  :heavy_check_mark: | The beginning of the training period for the anomaly model. Its end is defined by the beginning of detection period. |
| *startDetection* | `datetime` |  :heavy_check_mark: | The beginning of the detection period for anomaly detection. |
| *endDetection* | `datetime` |  :heavy_check_mark: | The end of the detection period for anomaly detection. |
| *maxEntitiesThresh* | `int` |   | The maximum number of existing entities in scope to calculate anomalies. If the number of entities is above the threshold, the scope is considered too noisy and anomalies aren't calculated. The default value is 60.|
| *minTrainingDaysThresh* | `int` |   | The minimum number of days in training period that a scope exists to calculate anomalies. If it is below threshold, the scope is considered too new and unknown, so anomalies aren't calculated. The default value is 14. |
| *decayParam* | `real` |   | The decay rate parameter for anomaly model, a number in range (0,1]. Lower values mean faster decay, so more importance is given to later appearances in training period. A value of 1 means no decay, so a simple average is used for Poisson distribution parameter estimation. The default value is 0.95. |
| *anomalyScoreThresh* | `real` |   | The minimum value of anomaly score for which an anomaly is detected, a number in range [0, 1]. Higher values mean that only more significant cases are considered anomalous, so fewer anomalies are detected (higher precision, lower recall). A value of 0 means that all entities that first appear in detection period will be tagged as anomaly (without taking probability into account). The default value is 0.9. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `detect_anomalous_new_entity_fl()`, see [Example](#example).

```kusto
let detect_anomalous_new_entity_fl = (T:(*), entityColumnName:string, scopeColumnName:string
                                        , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                        , maxEntitiesThresh:int = 60, minTrainingDaysThresh:int = 14, decayParam:real = 0.95, anomalyScoreThresh:real = 0.9)
{
//pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day, so the probability model is built per that bin size
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// summarize the data by scope and entity. this will be used to create a distribution of entity appearances based on first seen data
let entityData = (
    processedData
    | summarize countRowsEntity = count(), firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime), firstSeenSet = arg_min(sliceTime, dataSet) 
        by scope, entity
    | extend firstSeenSet = dataSet
    | project-away dataSet
);
// aggregate entity data per scope and get the number of entities appearing over time
let aggregatedCandidateScopeData = (
    entityData
    | summarize countRowsScope = sum(countRowsEntity), countEntitiesScope = dcount(entity), countEntitiesScopeInTrain = dcountif(entity, firstSeenSet == 'trainSet')
        , firstSeenScope = min(firstSeenEntity), lastSeenScope = max(lastSeenEntity), hasNewEntities = iff(dcountif(entity,firstSeenSet == 'detectSet') > 0, 1, 0) 
            by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where countEntitiesScopeInTrain <= maxEntitiesThresh and slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection and hasNewEntities == 1
);
let modelData = (
    entityData
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | where firstSeenSet == 'trainSet'
    | summarize countAddedEntities = dcount(entity), firstSeenScope = min(firstSeenScope), slicesInTrainingScope = max(slicesInTrainingScope), countEntitiesScope = max(countEntitiesScope)
        by scope, firstSeenSet, firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
// adding exponentially decaying weights to counts
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability = round(sum(decayingValue)/max(diffInDays), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntity), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSet
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(exp(-1.0 * newEntityProbability), 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
	| project-away scope1
    | where isAnomalousNewEntity == 1
    | summarize arg_min(sliceTime, *) by scope, entity
    | extend anomalyType = strcat('newEntity_', entityColumnName), anomalyExplainability = strcat('The ', entityColumnName, ' ', entity, ' wasn\'t seen on ', scopeColumnName, ' ', scope, ' during the last ',  slicesOnScope, ' ', timePeriodBinSize, 's. Previously, ', countKnownEntities
        , ' entities were seen, the last one of them appearing at ', format_datetime(lastNewEntityTimestamp, 'yyyy-MM-dd HH:mm'), '.')
    | join kind = leftouter (entityData | where firstSeenSet == 'trainSet' | extend entityFirstSeens = strcat(entity, ' : ', format_datetime(firstSeenEntity, 'yyyy-MM-dd HH:mm')) | sort by scope, firstSeenEntity asc | summarize anomalyState = make_list(entityFirstSeens) by scope) on scope
    | project-away scope1
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
.create-or-alter function with (docstring = "Detect new and anomalous entity (such as username or IP) per scope (such as subscription or account)", skipvalidation = "true", folder = 'KCL') 
    detect_anomalous_new_entity_fl(T:(*), entityColumnName:string, scopeColumnName:string
                                        , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                        , maxEntitiesThresh:int = 60, minTrainingDaysThresh:int = 14, decayParam:real = 0.95, anomalyScoreThresh:real = 0.9)
{
//pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day, so the probability model is built per that bin size
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// summarize the data by scope and entity. this will be used to create a distribution of entity appearances based on first seen data
let entityData = (
    processedData
    | summarize countRowsEntity = count(), firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime), firstSeenSet = arg_min(sliceTime, dataSet) 
        by scope, entity
    | extend firstSeenSet = dataSet
    | project-away dataSet
);
// aggregate entity data per scope and get the number of entities appearing over time
let aggregatedCandidateScopeData = (
    entityData
    | summarize countRowsScope = sum(countRowsEntity), countEntitiesScope = dcount(entity), countEntitiesScopeInTrain = dcountif(entity, firstSeenSet == 'trainSet')
        , firstSeenScope = min(firstSeenEntity), lastSeenScope = max(lastSeenEntity), hasNewEntities = iff(dcountif(entity,firstSeenSet == 'detectSet') > 0, 1, 0) 
            by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where countEntitiesScopeInTrain <= maxEntitiesThresh and slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection and hasNewEntities == 1
);
let modelData = (
    entityData
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | where firstSeenSet == 'trainSet'
    | summarize countAddedEntities = dcount(entity), firstSeenScope = min(firstSeenScope), slicesInTrainingScope = max(slicesInTrainingScope), countEntitiesScope = max(countEntitiesScope)
        by scope, firstSeenSet, firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
// adding exponentially decaying weights to counts of 
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability = round(sum(decayingValue)/max(diffInDays), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntity), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSet
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(exp(-1.0 * newEntityProbability), 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
    | project-away scope1
    | where isAnomalousNewEntity == 1
    | summarize arg_min(sliceTime, *) by scope, entity
    | extend anomalyType = strcat('newEntity_', entityColumnName), anomalyExplainability = strcat('The ', entityColumnName, ' ', entity, ' wasn\'t seen on ', scopeColumnName, ' ', scope, ' during the last ',  slicesOnScope, ' ', timePeriodBinSize, 's. Previously, ', countKnownEntities
        , ' entities were seen, the last one of them appearing at ', format_datetime(lastNewEntityTimestamp, 'yyyy-MM-dd HH:mm'), '.')
    | join kind = leftouter (entityData | where firstSeenSet == 'trainSet' | extend entityFirstSeens = strcat(entity, ' : ', format_datetime(firstSeenEntity, 'yyyy-MM-dd HH:mm')) | sort by scope, firstSeenEntity asc | summarize anomalyState = make_list(entityFirstSeens) by scope) on scope
    | project-away scope1
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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=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" target="_blank">Run the query</a>
::: moniker-end

```kusto
let detect_anomalous_new_entity_fl = (T:(*), entityColumnName:string, scopeColumnName:string
                                        , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime
                                        , maxEntitiesThresh:int = 60, minTrainingDaysThresh:int = 14, decayParam:real = 0.95, anomalyScoreThresh:real = 0.9)
{
//pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day, so the probability model is built per that bin size
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(entity) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
// summarize the data by scope and entity. this will be used to create a distribution of entity appearances based on first seen data
let entityData = (
    processedData
    | summarize countRowsEntity = count(), firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime), firstSeenSet = arg_min(sliceTime, dataSet) 
        by scope, entity
    | extend firstSeenSet = dataSet
    | project-away dataSet
);
// aggregate entity data per scope and get the number of entities appearing over time
let aggregatedCandidateScopeData = (
    entityData
    | summarize countRowsScope = sum(countRowsEntity), countEntitiesScope = dcount(entity), countEntitiesScopeInTrain = dcountif(entity, firstSeenSet == 'trainSet')
        , firstSeenScope = min(firstSeenEntity), lastSeenScope = max(lastSeenEntity), hasNewEntities = iff(dcountif(entity,firstSeenSet == 'detectSet') > 0, 1, 0) 
            by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where countEntitiesScopeInTrain <= maxEntitiesThresh and slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection and hasNewEntities == 1
);
let modelData = (
    entityData
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | where firstSeenSet == 'trainSet'
    | summarize countAddedEntities = dcount(entity), firstSeenScope = min(firstSeenScope), slicesInTrainingScope = max(slicesInTrainingScope), countEntitiesScope = max(countEntitiesScope)
        by scope, firstSeenSet, firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
// adding exponentially decaying weights to counts
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability = round(sum(decayingValue)/max(diffInDays), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntity), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSet
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(exp(-1.0 * newEntityProbability), 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
    | project-away scope1
    | where isAnomalousNewEntity == 1
    | summarize arg_min(sliceTime, *) by scope, entity
    | extend anomalyType = strcat('newEntity_', entityColumnName), anomalyExplainability = strcat('The ', entityColumnName, ' ', entity, ' wasn\'t seen on ', scopeColumnName, ' ', scope, ' during the last ',  slicesOnScope, ' ', timePeriodBinSize, 's. Previously, ', countKnownEntities
        , ' entities were seen, the last one of them appearing at ', format_datetime(lastNewEntityTimestamp, 'yyyy-MM-dd HH:mm'), '.')
    | join kind = leftouter (entityData | where firstSeenSet == 'trainSet' | extend entityFirstSeens = strcat(entity, ' : ', format_datetime(firstSeenEntity, 'yyyy-MM-dd HH:mm')) | sort by scope, firstSeenEntity asc | summarize anomalyState = make_list(entityFirstSeens) by scope) on scope
    | project-away scope1
);
resultsData
};
// synthetic data generation
let detectPeriodStart   = datetime(2022-04-30 05:00:00.0000000);
let trainPeriodStart    = datetime(2022-03-01 05:00);
let names               = pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          = array_length(names);
let testData            = range t from 1 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend countEvents    = round(2*rand() + iff((t/24)%7>=5, 10.0, 15.0) - (((t%24)/10)*((t%24)/10)), 2) * 100 // generate a series with weekly seasonality
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = hash_md5(rand())
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == detectPeriodStart, 'abcdefghijklmnoprtuvwxyz012345678', deviceId)
    | sort by timeSlice desc
;
testData
| invoke detect_anomalous_new_entity_fl(entityColumnName    = 'userName'  //principalName for positive, deviceId for negative
                                , scopeColumnName           = 'accountName'
                                , timeColumnName            = 'timeSlice'
                                , startTraining             = trainPeriodStart
                                , startDetection            = detectPeriodStart
                                , endDetection              = detectPeriodStart
                            )
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let detectPeriodStart   = datetime(2022-04-30 05:00:00.0000000);
let trainPeriodStart    = datetime(2022-03-01 05:00);
let names               = pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          = array_length(names);
let testData            = range t from 1 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend countEvents    = round(2*rand() + iff((t/24)%7>=5, 10.0, 15.0) - (((t%24)/10)*((t%24)/10)), 2) * 100 // generate a series with weekly seasonality
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = hash_md5(rand())
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend deviceId       = iff(timeSlice == detectPeriodStart, 'abcdefghijklmnoprtuvwxyz012345678', deviceId)
    | sort by timeSlice desc
;
testData
| invoke detect_anomalous_new_entity_fl(entityColumnName    = 'userName'  //principalName for positive, deviceId for negative
                                , scopeColumnName           = 'accountName'
                                , timeColumnName            = 'timeSlice'
                                , startTraining             = trainPeriodStart
                                , startDetection            = detectPeriodStart
                                , endDetection              = detectPeriodStart
                            )
```

---

**Output**

| scope	| entity	| sliceTime	| t	| timeSlice	| countEvents	| userName	| deviceId	| accountName	| dataSet	| firstSeenSet	| newEntityProbability	| countKnownEntities	| lastNewEntityTimestamp	| slicesOnScope	| newEntityAnomalyScore	| isAnomalousNewEntity	| anomalyType	| anomalyExplainability	| anomalyState |
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	|
| prodEnvironment	| H4ck3r	| 2022-04-30 05:00:00.0000000	| 1440	| 2022-04-30 05:00:00.0000000	| 1687	| H4ck3r	| abcdefghijklmnoprtuvwxyz012345678	| prodEnvironment	| detectSet	| trainSet	| 0.0031	| 4	| 2022-03-01 09:00:00.0000000	| 60	| 0.9969	| 1	| newEntity_userName	| The userName H4ck3r wasn't seen on accountName prodEnvironment during the last 60 days. Previously, four entities were seen, the last one of them appearing at 2022-03-01 09:00.	| ["IT-support : 2022-03-01 07:00", "Admin : 2022-03-01 08:00", "Dev2 : 2022-03-01 09:00", "Dev1 : 2022-03-01 14:00"] |


The output of running the function is the first-seen row in test dataset for each entity per scope, filtered for entities that were tagged as anomalous (meaning that entity anomaly score was above anomalyScoreThresh). Some other fields are added for clarity:

* `dataSet`: current dataset (is always `detectSet`).
* `firstSeenSet`: dataset in which the entity was first seen per scope.
* `newEntityProbability`: probability to see any new entity based on Poisson model estimation.
* `countKnownEntities`: existing entities on scope.
* `lastNewEntityTimestamp`: last time a new entity was seen before the anomalous one.
* `slicesOnScope`: count of slices per scope.
* `newEntityAnomalyScore`: anomaly score was the new entity in range [0, 1], higher values meaning more anomaly. 
* `isAnomalousNewEntity`: binary flag for anomalous new entities 
* `anomalyType`: shows the type of anomaly (helpful when running several anomaly detection logics together).
* `anomalyExplainability`: textual wrapper for generated anomaly and its explanation.
* `anomalyState`: bag of existing entities on scope with their first seen times.

The output surfaces the anomalous entities together with fields that explain it in standardized format. These fields are useful for investigating the anomaly and for running anomalous entity detection on several entities, or running other algorithms together.
