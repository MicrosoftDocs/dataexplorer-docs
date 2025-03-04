---
title:  detect_anomalous_new_entity_fl()
description: Learn how to use the detect_anomalous_new_entity_fl() function to detect the appearance of anomalous new entities.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/03/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# detect_anomalous_new_entity_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Detect the appearance of anomalous new entities in timestamped data.

The function `detect_anomalous_new_entity_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that detects the appearance of anomalous new entities - such as IP addresses or users - in timestamped data, such as traffic logs. In cybersecurity context, such events might be suspicious and indicate a potential attack or compromise.

The  anomaly model is based on a Poisson distribution representing the number of new entities appearing per time bin (e.g., a day) for each scope. Poisson distribution parameter is estimated based on the rate of appearance of new entities in training period, with added decay factor reflecting the fact that recent appearances are more important than old ones. Thus we calculate the probability to encounter a new entity in defined detection period per some scope - such as a subscription or an account. The model output is controlled by several optional parameters, such as minimal threshold for anomaly, decay rate parameter, and others. 

The model's direct output is an anomaly score based on the inverse of estimated probability to encounter a new entity. The score is monotonous in the range of [0, 1]; 1 representing something very anomalous. In addition to the anomaly score, there's a binary flag for detected anomalies (controlled by a minimal threshold parameter), and other explanatory fields.

## Syntax

`detect_anomalous_new_entity_fl(`*entityColumnName*, *scopeColumnName*, *timeColumnName*, *startTraining*, *startDetection*, *endDetection*, [*maxEntitiesThresh*], [*minTrainingDaysThresh*], [*decayParam*], [*anomalyScoreThresh*]`)`

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
| *anomalyScoreThresh* | `real` |   | The minimum value of anomaly score for which an anomaly is detected, a number in range [0, 1]. Higher values mean that only more significant cases are considered anomalous, so fewer anomalies are detected (higher precision, lower recall). The default value is 0.9. |

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
        by scope, firstSeenSetOnScope = firstSeenSet, firstSeenEntityOnScope = firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntityOnScope)
// adding exponentially decaying weights to counts
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability = round(1 - exp(-1.0 * sum(decayingValue)/max(diffInDays)), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntityOnScope), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSetOnScope
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(1 - newEntityProbability, 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
    | join kind = inner (entityData | where firstSeenSet == 'detectSet') on scope, entity, $left.sliceTime == $right.firstSeenEntity
    | project-away scope1, scope2, entity1
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
        by scope, firstSeenSetOnScope = firstSeenSet, firstSeenEntityOnScope = firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntityOnScope)
// adding exponentially decaying weights to counts of 
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability = round(1 - exp(-1.0 * sum(decayingValue)/max(diffInDays)), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntityOnScope), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSetOnScope
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(1 - newEntityProbability, 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
    | join kind = inner (entityData | where firstSeenSet == 'detectSet') on scope, entity, $left.sliceTime == $right.firstSeenEntity
    | project-away scope1, scope2, entity1
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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6VYbW%2FjuBH%2BHiD%2FgVjgICmVY9mb7LW59QLb2z1sUNw2aIK2QFsYtETb3EikINJ2dL3%2B986Q1BvlxDmcsVjHfJkZzvPMC5kzTTKmWaqXVMiC5nKnloIdlkxoruvlOicLEj7chBdRTOzYjzLfFeIrLdiN0hUXm5ioVJZsNH5%2BRl75iYnmxVgACNa00g8V5QJ%2B3mRUM1zoxj8Zu7kUvQkmsvHwbzGkoE%2Bf8ZicqYdtxdT2hgsNPniXwBwXjS2faD2cn13F4MiU1ne0osVNxSh6Lrn803VMrGfr%2B1RWzG3q5qPzs%2F%2Ben02nZcUmZSVTphTRW0a4KHeADdWUrGpCswy04rlFRquMpMZXRICzFMjPSMb33CzR0mxSTKvzsxzgRQ%2FcsYrL7M9c3PNfGOgNMloHP9gzT6fkwAhValfAFwHLlBR0lTOy4oKsZWUkEK5Abg2ul8Y8MHVFVzwHQpBCZizHBasdzzUpGWzZUm32K1Bo7XCHY9knPBOwysLyYL9%2BJexJA3qWS9ayhTvmkq%2FZE1dahR7RYhIEkbffkvSZ%2FT6DjwlQOU%2FZAx4ZBGjZkCj0ZQ0payS1og5bVqHLhNSsKHVtDY8MUr1Ra85ouLXANw2BvWdItxQADruF5MNiGCtGZDf93osYCOZA41KQFrwYHjEZK2nF%2BFoWg%2FiLCfDM%2FDip5fd84CgSGFkFnvcbZwEJw%2B6wcd8m2BH9gMFHgPwFrTA4kNxN1Fku0pZVlzALND%2FwPCcrRnZAZoy3FGJGY%2BxkHBPXamd8I9cNF2lZMsgKAuhPVhQ3wfSaV0oTxZgw6myM2A3DABnETXPEzt5U7oT%2Bmzyoz1bZwo6EALFRcQ8a2inIYD12xSSn%2FgL6NFjQirC0o9VmOZARN26OSAdw47mmYngs9mQ6Ac0iOO43gGdCD7Tu5hxMdLOp2Aad7VxrkMKE00G1wZwHIIpdsYKJBgaOidIAgeEh98zmNev3Vm72I4jgGPP3KHCIRIfOCzCYfbAHpkIPG%2FCnGWkKTLM0s4ix5xfd2sLTruVrt9pHaNGL66hDpL%2FMKUUYPYL0CNGuAj4MSQKLtlR9ZYfGQFjF1%2BvQN2xkVy%2FsyAcC5XQWk6RPmz51juVkdduW39ZzLjkvMzRhVOn8RsF3g5cxnvf7%2B8W4MeiS38iwD4vjvYLZMnTx8Zzqexj6CxsDSFZTbk8x85sEsx85yAJ4hAC2hy%2BRPMKUZGNo6JPn6fVMDHzMMpb1uOGT%2B2UiWljiZwFv85M%2F91xs4YbxRHQsWfWPOkqefiUGvt0KRPZ3sdCFlM1ttsVjT6UU6C2a57VtKXH4wPhmq5UpN3gc5RvkFv7DrAOjSnkIsdigfW1fGrficbg9w6jPcML%2BTvMdayrKENgLT%2BOYDYQIR%2BH6rtcsLkgF0rIQ8%2BNATzRFrHpGxeQqGncNDue%2FCHkQPZq16XZgpstoTSzVWLIAjKJ0zBgnQEuuv4rThJtOp9gcg0NzGHbHO8Uri7S9D%2BC86RK7pqDfVQPSWMqERD%2B2NQyOT%2FN0l2MYQwOC1LiTXEHLPuw%2BwrvwnwtIrws0MJzQ%2FSaKoHHRW%2BQZcxCjSgqVkG78hNtC97F3d2mxMyJnlwmw4BjGPeRagVx9bO6XLRquchzXBYlxfG9yRaPLhTC4y7V6Rcc0bAqHBemFpNkm2y5DHu1UzMzM7%2F%2BPndnkcj9YjjRWF9GpRsr556G2DYeuUqrDoHXnMhhf2aP2Nvp5wNve%2FgfonY7shMa5G8YfB6rEvwPXwoJvgtE7gNvijhCQbGd6L2zOMCpxbhhvbsORDBqoS3JXsT0HX%2Bao%2Flga6Pc7Qdf1HRALtDLuVEMOxM4Qfhe9rpAamyCqC6qX7cXveAYBFTV8Jj%2F%2FPMky8uXLTVEEeK267O4hfTrlbK3lTiOlek3%2B6SrrX2x%2FalaqDrIOk5tj9ntJ7qjhEbJRVvpY2nLEpSodUtZFp8Z2HBPlI1vmkIJC39COx6%2BMIQzuXmCfn%2F3PXdJqAYBpntq2f8MgQilmO5sLbDxb4txjxSWkV5zDeTKfT5KryduEJNc3SQL%2FLhP7abKJ8fpQwFjC20kysxKabfYVZviBAkzTxyWtKlqHbz5mENxvYvLmE9vP3Pccv28fJmpXluD5N400w%2BuvQ5F48wJBy5yJjd6GRmFrNPDRkGmgHa6bG7jMknUlCzLDYjK%2FuniXAGVY2SUgRy083T0GYrN75Ig%2FkNkWsr32NtrOag%2BIK6fW1If5BajPwgi2YYIP9XR%2BFX33%2FYfFNSRw8Dr8f30JxWlCQpj8DiansyS66P0NkTSPQOEsSfCBykGNd2wFVmFQYyk7MPaIddQ%2BWeXjDAk39Apd2bpFS%2Fu0aF34Lw0RqkNjbOf2KPrPuCHag3dus1YONOjbZZFd272Rv56mrTi73rjBLSbvSXI5t68%2BYef692MCR%2BadBvD9LPa8kqIAR%2BMLBkRN1h%2Fy1Y%2BO3fSlVtNiMVYFUr9cpY9vK5DfbD%2FphVeJpas0Y%2BvNln97zAshy0rv9oen%2BpdkNn97df3u%2Bz8GcSu51djkok56xlR6fgacb%2Fh%2BfvYrFOm9fGQnXrBHr37W%2BKA5ZoBvoCWwIuUlzc0CbOxKqaB%2B7FlnnRkWeIWC4dPvWaN6OAjQoMeRVzyO%2BU%2Fkw2gPWj%2B9StTwqXAoyg%2F9V8vrbrADeSNKvEZg%2FxlxOPebBUb%2FB5zA89XjGAAA" target="_blank">Run the query</a>
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
        by scope, firstSeenSetOnScope = firstSeenSet, firstSeenEntityOnScope = firstSeenEntity
    | extend diffInDays = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntityOnScope)
// adding exponentially decaying weights to counts
    | extend decayingWeight = pow(base = decayParam, exponent = diffInDays)
    | extend decayingValue = countAddedEntities * decayingWeight
    | summarize   newEntityProbability =  round(1 - exp(-1.0 * sum(decayingValue)/max(diffInDays)), 4)
                , countKnownEntities = sum(countAddedEntities), lastNewEntityTimestamp = max(firstSeenEntityOnScope), slicesOnScope = max(slicesInTrainingScope)///for explainability
        by scope, firstSeenSetOnScope
// anomaly score is based on probability to get no new entities, calculated using Poisson distribution (P(X=0) = exp(-avg)) with added decay on average
    | extend newEntityAnomalyScore = round(1 - newEntityProbability, 4)
    | extend isAnomalousNewEntity = iff(newEntityAnomalyScore >= anomalyScoreThresh, 1, 0)
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (modelData) on scope
    | join kind = inner (entityData | where firstSeenSet == 'detectSet') on scope, entity, $left.sliceTime == $right.firstSeenEntity
    | project-away scope1, scope2, entity1
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
| invoke detect_anomalous_new_entity_fl(entityColumnName    = 'userName'
                                , scopeColumnName           = 'accountName'
                                , timeColumnName            = 'timeSlice'
                                , startTraining             = trainPeriodStart
                                , startDetection            = detectPeriodStart
                                , endDetection              = detectPeriodStart
                            )
```

---

**Output**

| scope	| entity	| sliceTime	| t	| timeSlice	| countEvents	| userName	| deviceId	| accountName	| dataSet	| firstSeenSetOnScope	| newEntityProbability	| countKnownEntities	| lastNewEntityTimestamp	| slicesOnScope	| newEntityAnomalyScore	| isAnomalousNewEntity	| anomalyType	| anomalyExplainability	| anomalyState |
| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	| ---	|
| prodEnvironment	| H4ck3r	| 2022-04-30 05:00:00.0000000	| 1440	| 2022-04-30 05:00:00.0000000	| 1687	| H4ck3r	| abcdefghijklmnoprtuvwxyz012345678	| prodEnvironment	| detectSet	| trainSet	| 0.0031	| 4	| 2022-03-01 09:00:00.0000000	| 60	| 0.9969	| 1	| newEntity_userName	| The userName H4ck3r wasn't seen on accountName prodEnvironment during the last 60 days. Previously, four entities were seen, the last one of them appearing at 2022-03-01 09:00.	| ["IT-support : 2022-03-01 07:00", "Admin : 2022-03-01 08:00", "Dev2 : 2022-03-01 09:00", "Dev1 : 2022-03-01 14:00"] |


The output of running the function is the first-seen row in test dataset for each entity per scope, filtered for new entities (meaning they didn't appear during the training period) that were tagged as anomalous (meaning that entity anomaly score was above anomalyScoreThresh). Some other fields are added for clarity:

* `dataSet`: current dataset (is always `detectSet`).
* `firstSeenSetOnScope`: dataset in which the scope was first seen (should be 'trainSet').
* `newEntityProbability`: probability to see any new entity based on Poisson model estimation.
* `countKnownEntities`: existing entities on scope.
* `lastNewEntityTimestamp`: last time a new entity was seen before the anomalous one.
* `slicesOnScope`: count of slices per scope.
* `newEntityAnomalyScore`: anomaly score was the new entity in range [0, 1], higher values meaning more anomaly. 
* `isAnomalousNewEntity`: binary flag for anomalous new entities 
* `anomalyType`: shows the type of anomaly (helpful when running several anomaly detection logics together).
* `anomalyExplainability`: textual wrapper for generated anomaly and its explanation.
* `anomalyState`: bag of existing entities on scope with their first seen times.

Running this function on user per account with default parameters detects a previously unseen and anomalous user ('H4ck3r') with high anomaly score of 0.9969, meaning that this is unexpected (due to small numbers of existing users in training period). 

When we run the function with default parameters on deviceId as entity, we won't see an anomaly, due to the large number of existing devices - which makes the appearance of a new one expected. However, if we lower the parameter anomalyScoreThresh to 0.0001 and raise the parameter maxEntitiesThresh to 10000, we'll effectively decrease precision in favor of recall, and detect an anomaly (with a low anomaly score) on device 'abcdefghijklmnoprtuvwxyz012345678'.

The output shows the anomalous entities together with explanation fields in standardized format. These fields are useful for investigating the anomaly and for running anomalous entity detection on several entities or running other algorithms together. 

The suggested usage in cybersecurity context is running the function on meaningful entities - such as usernames or IP addresses - per meaningful scopes - such as subscription on accounts. A detected anomalous new entity means that its appearance isn't expected on the scope, and might be suspicious.
