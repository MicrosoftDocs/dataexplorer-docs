---
title:  detect_anomalous_spike_fl()
description: Learn how to use the detect_anomalous_spike_fl() function to detect anomalous spikes in numeric variables.
ms.reviewer: andkar
ms.topic: reference
ms.date: 12/16/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# detect_anomalous_spike_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Detect the appearance of anomalous spikes in numeric variables in timestamped data.

The function `detect_anomalous_spike_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that detects the appearance of anomalous spikes in numeric variables - such as amount of exfiltrated data or failed sign in attempts - in timestamped data, such as traffic logs. In cybersecurity context, such events might be suspicious and indicate a potential attack or compromise.

The anomaly model is based on a combination of two scores: Z-score (the number of standard deviations above average) and Q-score (the number of interquantile ranges above a high quantile). Z-score is a straightforward and common outlier metric; Q-score is based on Tukey's fences - but we extend the definition to any quantiles for more control. Choosing different quantiles (by default, 95th and 25th quantiles are used) allows to detect more significant outliers, thus improving precision. The model is built on top of some numeric variable and is calculated per scope - such as subscription or account - and per entity - such as user or device.

After calculating the scores for a single-variate numeric datapoint and checking other requirements (for example, the number of active days in training period on scope is above a predefined threshold), we check whether each of the scores is above its predefined threshold. If so, a spike is detected and the datapoint is flagged as anomalous. Two models are built: one for entity level (defined by entityColumnName parameter) - such as user or device per scope (defined by scopeColumnName parameter) - such as account or subscription. The second model is built for the whole scope. The anomaly detection logic is executed for each model and if anomaly is detected in one of them - it is shown. By default, upward spikes are detected; downward spikes ('dips') can also be interesting in some contexts and can be detected by adapting the logic.

The model's direct output is an anomaly score based on the scores. The score is monotonous in the range of [0, 1], with 1 representing something anomalous. In addition to the anomaly score, there's a binary flag for detected anomaly (controlled by a minimal threshold parameter), and other explanatory fields.

Note that the function disregards the temporal structure of the variable (mainly for scalability and explainability). If the variable has significant temporal components - such as trend and seasonalities - we suggest considering either the [series_decompose_anomalies()](../query/series-decompose-anomalies-function.md) function, or use [series_decompose()](../query/series-decompose-function.md) in order to calculate the residual and execute `detect_anomalous_spike_fl()` on top of it.

## Syntax

`detect_anomalous_spike_fl(`*numericColumnName*, *entityColumnName*, *scopeColumnName*, *timeColumnName*, *startTraining*, *startDetection*, *endDetection*, [*minTrainingDaysThresh*], [*lowPercentileForQscore*], [*highPercentileForQscore*], [*minSlicesPerEntity*], [*zScoreThreshEntity*], [*qScoreThreshEntity*], [*minNumValueThreshEntity*], [*minSlicesPerScope*], [*zScoreThreshScope*], [*qScoreThreshScope*], [*minNumValueThreshScope*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *numericColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing numeric variable for which anomaly models are calculated. |
| *entityColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the names or IDs of the entities for which anomaly model is calculated. |
| *scopeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the partition or scope, so that a different anomaly model is built for each scope. |
| *timeColumnName* | `string` |  :heavy_check_mark: | The name of the input table column containing the timestamps, that are used to define the training and detection periods. |
| *startTraining* | `datetime` |  :heavy_check_mark: | The beginning of the training period for the anomaly model. Its end is defined by the beginning of detection period. |
| *startDetection* | `datetime` |  :heavy_check_mark: | The beginning of the detection period for anomaly detection. |
| *endDetection* | `datetime` |  :heavy_check_mark: | The end of the detection period for anomaly detection. |
| *minTrainingDaysThresh* | `int` |   | The minimum number of days in training period that a scope exists to calculate anomalies. If it is below threshold, the scope is considered too new and unknown, so anomalies aren't calculated. The default value is 14.|
| *lowPercentileForQscore* | `real` |   | A number in range [0.0,1.0] representing the percentile to be calculated as low limit for Q-score. In Tukey's fences, 0.25 is used. The default value is 0.25. Choosing a lower percentile improves precision as more significant anomalies are detected. |
| *highPercentileForQscore* | `real` |   | A number in range [0.0,1.0] representing the percentile to be calculated as high limit for Q-score. In Tukey's fences, 0.75 is used. The default value is 0.9. Choosing a higher percentile improves precision as more significant anomalies are detected. |
| *minSlicesPerEntity* | `int` |   | The minimum threshold of 'slices' (for example, days) to exist on an entity before anomaly model is built for it. If the number is below the threshold, the entity is considered too new and unstable. The default value is 20. |
| *zScoreThreshEntity* | `real` |   | The minimum threshold for entity-level Z-score (number of standard deviations above average) to be flagged as anomaly. When choosing higher values, only more significant anomalies are detected. The default value is 3.0. |
| *qScoreThreshEntity* | `real` |   | The minimum threshold for entity-level Q-score (number of interquantile ranges above high quantile) to be flagged as anomaly. When choosing higher values, only more significant anomalies are detected. Default value is 2.0. |
| *minNumValueThreshEntity* | `long` |   | The minimum threshold for numeric variable to be flagged as anomaly for an entity. This is useful for filtering cases when a value is anomalous statistically (high Z-score and Q-score), but the value itself is too small to be interesting. The default value is 0. |
| *minSlicesPerScope* | `int` |   | The minimum threshold of 'slices' (for example, days) to exist on a scope before anomaly model is built for it. If the number is below the threshold, the scope is considered too new and unstable. The default value is 20. |
| *zScoreThreshScope* | `real` |   | The minimum threshold for scope-level Z-score (number of standard deviations above average) to be flagged as anomaly. When choosing higher values, only more significant anomalies are detected. The default value is 3.0. |
| *qScoreThreshScope* | `real` |   | The minimum threshold for scope-level Q-score (number of interquantile ranges above high quantile) to be flagged as anomaly. When choosing higher values, only more significant anomalies are detected. The default value is 2.0. |
| *minNumValueThreshScope* | `long` |   | The minimum threshold for numeric variable to be flagged as anomaly for a scope. This is useful for filtering cases when a value is anomalous statistically (high Z-score and Q-score), but the value itself is too small to be interesting. The default value is 0. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `detect_anomalous_spike_fl()`, see [Example](#example).

```kusto
let detect_anomalous_spike_fl = (T:(*), numericColumnName:string, entityColumnName:string, scopeColumnName:string
                            , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime, minTrainingDaysThresh:int = 14
                            , lowPercentileForQscore:real = 0.25, highPercentileForQscore:real = 0.9
                            , minSlicesPerEntity:int = 20, zScoreThreshEntity:real = 3.0, qScoreThreshEntity:real = 2.0, minNumValueThreshEntity:long = 0
                            , minSlicesPerScope:int = 20, zScoreThreshScope:real = 3.0, qScoreThreshScope:real = 2.0, minNumValueThreshScope:long = 0)
{
// pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend numVec     = tolong(column_ifexists(numericColumnName, 0))
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
let aggregatedCandidateScopeData = (
    processedData
    | summarize firstSeenScope = min(sliceTime), lastSeenScope = max(sliceTime) by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection
);
let entityModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesEntity = dcount(sliceTime), avgNumEntity = avg(numVec), sdNumEntity = stdev(numVec)
            , lowPrcNumEntity = percentile(numVec, lowPercentileForQscore), highPrcNumEntity = percentile(numVec, highPercentileForQscore)
            , firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime)
        by scope, entity
    | extend slicesInTrainingEntity = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
);
let scopeModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesScope = dcount(sliceTime), avgNumScope = avg(numVec), sdNumScope = stdev(numVec)
            , lowPrcNumScope = percentile(numVec, lowPercentileForQscore), highPrcNumScope = percentile(numVec, highPercentileForQscore)
        by scope
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | join kind = leftouter (entityModelData) on scope, entity 
    | join kind = leftouter (scopeModelData) on scope
    | extend zScoreEntity       = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - avgNumEntity)/(sdNumEntity + 1), 2), 0.0)
            , qScoreEntity      = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - highPrcNumEntity)/(highPrcNumEntity - lowPrcNumEntity + 1), 2), 0.0)
            , zScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - avgNumScope)/(sdNumScope + 1), 2), 0.0)
            , qScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - highPrcNumScope)/(highPrcNumScope - lowPrcNumScope + 1), 2), 0.0)
    | extend isSpikeOnEntity    = iff((slicesInTrainingEntity >= minTrainingDaysThresh and zScoreEntity > zScoreThreshEntity and qScoreEntity > qScoreThreshEntity and numVec >= minNumValueThreshEntity), 1, 0)
            , entityHighBaseline= round(max_of((avgNumEntity + sdNumEntity), highPrcNumEntity), 2)
            , isSpikeOnScope    = iff((countSlicesScope >= minTrainingDaysThresh and zScoreScope > zScoreThreshScope and qScoreScope > qScoreThreshScope and numVec >= minNumValueThreshScope), 1, 0)
            , scopeHighBaseline = round(max_of((avgNumEntity + 2 * sdNumEntity), highPrcNumScope), 2)
    | extend entitySpikeAnomalyScore = iff(isSpikeOnEntity  == 1, round(1.0 - 0.25/(max_of(zScoreEntity, qScoreEntity)),4), 0.00)
            , scopeSpikeAnomalyScore = iff(isSpikeOnScope == 1, round(1.0 - 0.25/(max_of(zScoreScope, qScoreScope)), 4), 0.00)
    | where isSpikeOnEntity == 1 or isSpikeOnScope == 1
    | extend avgNumEntity   = round(avgNumEntity, 2), sdNumEntity = round(sdNumEntity, 2)
            , avgNumScope   = round(avgNumScope, 2), sdNumScope = round(sdNumScope, 2)
   | project-away entity1, scope1, scope2, scope3
   | extend anomalyType = iff(isSpikeOnEntity == 1, strcat('spike_', entityColumnName), strcat('spike_', scopeColumnName)), anomalyScore = max_of(entitySpikeAnomalyScore, scopeSpikeAnomalyScore)
   | extend anomalyExplainability = iff(isSpikeOnEntity == 1
        , strcat('The value of numeric variable ', numericColumnName, ' for ', entityColumnName, ' ', entity, ' is ', numVec, ', which is abnormally high for this '
            , entityColumnName, ' at this ', scopeColumnName
            , '. Based on observations from last ' , slicesInTrainingEntity, ' ', timePeriodBinSize, 's, the expected baseline value is below ', entityHighBaseline, '.')
        , strcat('The value of numeric variable ', numericColumnName, ' on ', scopeColumnName, ' ', scope, ' is ', numVec, ', which is abnormally high for this '
            , scopeColumnName, '. Based on observations from last ' , slicesInTrainingScope, ' ', timePeriodBinSize, 's, the expected baseline value is below ', scopeHighBaseline, '.'))
   | extend anomalyState = iff(isSpikeOnEntity == 1
        , bag_pack('avg', avgNumEntity, 'stdev', sdNumEntity, strcat('percentile_', lowPercentileForQscore), lowPrcNumEntity, strcat('percentile_', highPercentileForQscore), highPrcNumEntity)
        , bag_pack('avg', avgNumScope, 'stdev', sdNumScope, strcat('percentile_', lowPercentileForQscore), lowPrcNumScope, strcat('percentile_', highPercentileForQscore), highPrcNumScope))
   | project-away lowPrcNumEntity, highPrcNumEntity, lowPrcNumScope, highPrcNumScope
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
.create-or-alter function with (docstring = "Detect anomalous high spikes in a numeric variable (such as amount of extracted data or failed logins) per scope (such as subscription or account) or per entity (such as user or device) on scope", skipvalidation = "true", folder = 'Cybersecurity') 
    detect_anomalous_spike_fl(T:(*), numericColumnName:string, entityColumnName:string, scopeColumnName:string
                            , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime, minTrainingDaysThresh:int = 14
                            , lowPercentileForQscore:real = 0.25, highPercentileForQscore:real = 0.9
                            , minSlicesPerEntity:int = 20, zScoreThreshEntity:real = 3.0, qScoreThreshEntity:real = 2.0, minNumValueThreshEntity:long = 0
                            , minSlicesPerScope:int = 20, zScoreThreshScope:real = 3.0, qScoreThreshScope:real = 2.0, minNumValueThreshScope:long = 0)
{
// pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend numVec     = tolong(column_ifexists(numericColumnName, 0))
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
let aggregatedCandidateScopeData = (
    processedData
    | summarize firstSeenScope = min(sliceTime), lastSeenScope = max(sliceTime) by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection
);
let entityModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesEntity = dcount(sliceTime), avgNumEntity = avg(numVec), sdNumEntity = stdev(numVec)
            , lowPrcNumEntity = percentile(numVec, lowPercentileForQscore), highPrcNumEntity = percentile(numVec, highPercentileForQscore)
            , firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime)
        by scope, entity
    | extend slicesInTrainingEntity = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
);
let scopeModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesScope = dcount(sliceTime), avgNumScope = avg(numVec), sdNumScope = stdev(numVec)
            , lowPrcNumScope = percentile(numVec, lowPercentileForQscore), highPrcNumScope = percentile(numVec, highPercentileForQscore)
        by scope
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | join kind = leftouter (entityModelData) on scope, entity 
    | join kind = leftouter (scopeModelData) on scope
    | extend zScoreEntity       = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - avgNumEntity)/(sdNumEntity + 1), 2), 0.0)
            , qScoreEntity      = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - highPrcNumEntity)/(highPrcNumEntity - lowPrcNumEntity + 1), 2), 0.0)
            , zScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - avgNumScope)/(sdNumScope + 1), 2), 0.0)
            , qScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - highPrcNumScope)/(highPrcNumScope - lowPrcNumScope + 1), 2), 0.0)
    | extend isSpikeOnEntity    = iff((slicesInTrainingEntity >= minTrainingDaysThresh and zScoreEntity > zScoreThreshEntity and qScoreEntity > qScoreThreshEntity and numVec >= minNumValueThreshEntity), 1, 0)
            , entityHighBaseline= round(max_of((avgNumEntity + sdNumEntity), highPrcNumEntity), 2)
            , isSpikeOnScope    = iff((countSlicesScope >= minTrainingDaysThresh and zScoreScope > zScoreThreshScope and qScoreScope > qScoreThreshScope and numVec >= minNumValueThreshScope), 1, 0)
            , scopeHighBaseline = round(max_of((avgNumEntity + 2 * sdNumEntity), highPrcNumScope), 2)
    | extend entitySpikeAnomalyScore = iff(isSpikeOnEntity  == 1, round(1.0 - 0.25/(max_of(zScoreEntity, qScoreEntity)),4), 0.00)
            , scopeSpikeAnomalyScore = iff(isSpikeOnScope == 1, round(1.0 - 0.25/(max_of(zScoreScope, qScoreScope)), 4), 0.00)
    | where isSpikeOnEntity == 1 or isSpikeOnScope == 1
    | extend avgNumEntity   = round(avgNumEntity, 2), sdNumEntity = round(sdNumEntity, 2)
            , avgNumScope   = round(avgNumScope, 2), sdNumScope = round(sdNumScope, 2)
   | project-away entity1, scope1, scope2, scope3
   | extend anomalyType = iff(isSpikeOnEntity == 1, strcat('spike_', entityColumnName), strcat('spike_', scopeColumnName)), anomalyScore = max_of(entitySpikeAnomalyScore, scopeSpikeAnomalyScore)
   | extend anomalyExplainability = iff(isSpikeOnEntity == 1
        , strcat('The value of numeric variable ', numericColumnName, ' for ', entityColumnName, ' ', entity, ' is ', numVec, ', which is abnormally high for this '
            , entityColumnName, ' at this ', scopeColumnName
            , '. Based on observations from last ' , slicesInTrainingEntity, ' ', timePeriodBinSize, 's, the expected baseline value is below ', entityHighBaseline, '.')
        , strcat('The value of numeric variable ', numericColumnName, ' on ', scopeColumnName, ' ', scope, ' is ', numVec, ', which is abnormally high for this '
            , scopeColumnName, '. Based on observations from last ' , slicesInTrainingScope, ' ', timePeriodBinSize, 's, the expected baseline value is below ', scopeHighBaseline, '.'))
   | extend anomalyState = iff(isSpikeOnEntity == 1
        , bag_pack('avg', avgNumEntity, 'stdev', sdNumEntity, strcat('percentile_', lowPercentileForQscore), lowPrcNumEntity, strcat('percentile_', highPercentileForQscore), highPrcNumEntity)
        , bag_pack('avg', avgNumScope, 'stdev', sdNumScope, strcat('percentile_', lowPercentileForQscore), lowPrcNumScope, strcat('percentile_', highPercentileForQscore), highPrcNumScope))
   | project-away lowPrcNumEntity, highPrcNumEntity, lowPrcNumScope, highPrcNumScope
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
let detect_anomalous_spike_fl = (T:(*), numericColumnName:string, entityColumnName:string, scopeColumnName:string
                            , timeColumnName:string, startTraining:datetime, startDetection:datetime, endDetection:datetime, minTrainingDaysThresh:int = 14
                            , lowPercentileForQscore:real = 0.25, highPercentileForQscore:real = 0.9
                            , minSlicesPerEntity:int = 20, zScoreThreshEntity:real = 3.0, qScoreThreshEntity:real = 2.0, minNumValueThreshEntity:long = 0
                            , minSlicesPerScope:int = 20, zScoreThreshScope:real = 3.0, qScoreThreshScope:real = 2.0, minNumValueThreshScope:long = 0)
{
// pre-process the input data by adding standard column names and dividing to datasets
let timePeriodBinSize = 'day';      // we assume a reasonable bin for time is day
let processedData = (
    T
    | extend scope      = column_ifexists(scopeColumnName, '')
    | extend entity     = column_ifexists(entityColumnName, '')
    | extend numVec     = tolong(column_ifexists(numericColumnName, 0))
    | extend sliceTime  = todatetime(column_ifexists(timeColumnName, ''))
    | where isnotempty(scope) and isnotempty(sliceTime)
    | extend dataSet = case((sliceTime >= startTraining and sliceTime < startDetection), 'trainSet'
                           , sliceTime >= startDetection and sliceTime <= endDetection,  'detectSet'
                                                                                       , 'other')
    | where dataSet in ('trainSet', 'detectSet')
);
let aggregatedCandidateScopeData = (
    processedData
    | summarize firstSeenScope = min(sliceTime), lastSeenScope = max(sliceTime) by scope
    | extend slicesInTrainingScope = datetime_diff(timePeriodBinSize, startDetection, firstSeenScope)
    | where slicesInTrainingScope >= minTrainingDaysThresh and lastSeenScope >= startDetection
);
let entityModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesEntity = dcount(sliceTime), avgNumEntity = avg(numVec), sdNumEntity = stdev(numVec)
            , lowPrcNumEntity = percentile(numVec, lowPercentileForQscore), highPrcNumEntity = percentile(numVec, highPercentileForQscore)
            , firstSeenEntity = min(sliceTime), lastSeenEntity = max(sliceTime)
        by scope, entity
    | extend slicesInTrainingEntity = datetime_diff(timePeriodBinSize, startDetection, firstSeenEntity)
);
let scopeModelData = (
    processedData
    | join kind = inner (aggregatedCandidateScopeData) on scope
    | where dataSet == 'trainSet'
    | summarize countSlicesScope = dcount(sliceTime), avgNumScope = avg(numVec), sdNumScope = stdev(numVec)
            , lowPrcNumScope = percentile(numVec, lowPercentileForQscore), highPrcNumScope = percentile(numVec, highPercentileForQscore)
        by scope
);
let resultsData = (
    processedData
    | where dataSet == 'detectSet'
    | join kind = inner (aggregatedCandidateScopeData) on scope 
    | join kind = leftouter (entityModelData) on scope, entity 
    | join kind = leftouter (scopeModelData) on scope
    | extend zScoreEntity       = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - avgNumEntity)/(sdNumEntity + 1), 2), 0.0)
            , qScoreEntity      = iff(countSlicesEntity >= minSlicesPerEntity, round((toreal(numVec) - highPrcNumEntity)/(highPrcNumEntity - lowPrcNumEntity + 1), 2), 0.0)
            , zScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - avgNumScope)/(sdNumScope + 1), 2), 0.0)
            , qScoreScope       = iff(countSlicesScope >= minSlicesPerScope, round((toreal(numVec) - highPrcNumScope)/(highPrcNumScope - lowPrcNumScope + 1), 2), 0.0)
    | extend isSpikeOnEntity    = iff((slicesInTrainingEntity >= minTrainingDaysThresh and zScoreEntity > zScoreThreshEntity and qScoreEntity > qScoreThreshEntity and numVec >= minNumValueThreshEntity), 1, 0)
            , entityHighBaseline= round(max_of((avgNumEntity + sdNumEntity), highPrcNumEntity), 2)
            , isSpikeOnScope    = iff((countSlicesScope >= minTrainingDaysThresh and zScoreScope > zScoreThreshScope and qScoreScope > qScoreThreshScope and numVec >= minNumValueThreshScope), 1, 0)
            , scopeHighBaseline = round(max_of((avgNumEntity + 2 * sdNumEntity), highPrcNumScope), 2)
    | extend entitySpikeAnomalyScore = iff(isSpikeOnEntity  == 1, round(1.0 - 0.25/(max_of(zScoreEntity, qScoreEntity)),4), 0.00)
            , scopeSpikeAnomalyScore = iff(isSpikeOnScope == 1, round(1.0 - 0.25/(max_of(zScoreScope, qScoreScope)), 4), 0.00)
    | where isSpikeOnEntity == 1 or isSpikeOnScope == 1
    | extend avgNumEntity   = round(avgNumEntity, 2), sdNumEntity = round(sdNumEntity, 2)
            , avgNumScope   = round(avgNumScope, 2), sdNumScope = round(sdNumScope, 2)
   | project-away entity1, scope1, scope2, scope3
   | extend anomalyType = iff(isSpikeOnEntity == 1, strcat('spike_', entityColumnName), strcat('spike_', scopeColumnName)), anomalyScore = max_of(entitySpikeAnomalyScore, scopeSpikeAnomalyScore)
   | extend anomalyExplainability = iff(isSpikeOnEntity == 1
        , strcat('The value of numeric variable ', numericColumnName, ' for ', entityColumnName, ' ', entity, ' is ', numVec, ', which is abnormally high for this '
            , entityColumnName, ' at this ', scopeColumnName
            , '. Based on observations from last ' , slicesInTrainingEntity, ' ', timePeriodBinSize, 's, the expected baseline value is below ', entityHighBaseline, '.')
        , strcat('The value of numeric variable ', numericColumnName, ' on ', scopeColumnName, ' ', scope, ' is ', numVec, ', which is abnormally high for this '
            , scopeColumnName, '. Based on observations from last ' , slicesInTrainingScope, ' ', timePeriodBinSize, 's, the expected baseline value is below ', scopeHighBaseline, '.'))
   | extend anomalyState = iff(isSpikeOnEntity == 1
        , bag_pack('avg', avgNumEntity, 'stdev', sdNumEntity, strcat('percentile_', lowPercentileForQscore), lowPrcNumEntity, strcat('percentile_', highPercentileForQscore), highPrcNumEntity)
        , bag_pack('avg', avgNumScope, 'stdev', sdNumScope, strcat('percentile_', lowPercentileForQscore), lowPrcNumScope, strcat('percentile_', highPercentileForQscore), highPrcNumScope))
   | project-away lowPrcNumEntity, highPrcNumEntity, lowPrcNumScope, highPrcNumScope
);
resultsData
};
let detectPeriodStart   	= datetime(2022-04-30 05:00:00.0000000);
let trainPeriodStart    	= datetime(2022-03-01 05:00);
let names               	= pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          	= array_length(names);
let testData            	= range t from 1 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend countEvents    = round(2*rand() + iff((t/24)%7>=5, 10.0, 15.0) - (((t%24)/10)*((t%24)/10)), 2) * 100
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = hash_md5(rand())
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend countEvents 	= iff(timeSlice == detectPeriodStart, 3*countEvents, countEvents)
    | sort by timeSlice desc
;    
testData
| invoke detect_anomalous_spike_fl(numericColumnName        = 'countEvents'
                                , entityColumnName          = 'userName'
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
let detectPeriodStart   	= datetime(2022-04-30 05:00:00.0000000);
let trainPeriodStart    	= datetime(2022-03-01 05:00);
let names               	= pack_array("Admin", "Dev1", "Dev2", "IT-support");
let countNames          	= array_length(names);
let testData            	= range t from 1 to 24*60 step 1
    | extend timeSlice      = trainPeriodStart + 1h * t
    | extend countEvents    = round(2*rand() + iff((t/24)%7>=5, 10.0, 15.0) - (((t%24)/10)*((t%24)/10)), 2) * 100
    | extend userName       = tostring(names[toint(rand(countNames))])
    | extend deviceId       = hash_md5(rand())
    | extend accountName    = iff(((rand() < 0.2) and (timeSlice < detectPeriodStart)), 'testEnvironment', 'prodEnvironment')
    | extend userName       = iff(timeSlice == detectPeriodStart, 'H4ck3r', userName)
    | extend countEvents    = iff(timeSlice == detectPeriodStart, 3*countEvents, countEvents)
    | sort by timeSlice desc
;    
testData
| invoke detect_anomalous_spike_fl(numericColumnName        = 'countEvents'
                                , entityColumnName          = 'userName'
                                , scopeColumnName           = 'accountName'
                                , timeColumnName            = 'timeSlice'
                                , startTraining             = trainPeriodStart
                                , startDetection            = detectPeriodStart
                                , endDetection              = detectPeriodStart
                            )
```

---

**Output**

| t	| timeSlice | countEvents | userName | deviceId | accountName | scope	| entity | numVec	| sliceTime	| dataSet | firstSeenScope | lastSeenScope	| slicesInTrainingScope	| countSlicesEntity	| avgNumEntity	| sdNumEntity	| firstSeenEntity | lastSeenEntity	| slicesInTrainingEntity	| countSlicesScope	| avgNumScope | sdNumScope	| zScoreEntity	| qScoreEntity | zScoreScope | qScoreScope | isSpikeOnEntity | entityHighBaseline | isSpikeOnScope | scopeHighBaseline | entitySpikeAnomalyScore | scopeSpikeAnomalyScore | anomalyType	| anomalyScore | anomalyExplainability | anomalyState |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---	| --- | ---	| --- | --- | --- | ---	| --- | ---	| --- | --- | --- | --- | --- | --- | ---	| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1440 | 2022-04-30 05:00:00.0000000 | 5079 | H4ck3r | 9e8e151aced5a64938b93ee0c13fe940 | prodEnvironment | prodEnvironment | H4ck3r | 5079 | 2022-04-30 05:00:00.0000000	| detectSet | 2022-03-01 08:00:00.0000000 | 2022-04-30 05:00:00.0000000 | 60 | | | | | | | 1155 | 1363.22 | 267.51 | 0 | 0 | 13.84 | 185.46 | 0 | | 1 | 628 | 0 | 0.9987 | spike_accountName | 0.9987 | The value of numeric variable countEvents on accountName prodEnvironment is 5079, which is abnormally high for this accountName. Based on observations from last 60 days, the expected baseline value is below 628.0.	| {"avg": 1363.22,"stdev": 267.51,"percentile_0.25": 605,"percentile_0.9": 628} | 

The output of running the function is the rows in detection dataset that were tagged as anomalous spikes either at scope or entity levels. Some other fields are added for clarity:

* `dataSet`: current dataset (is always `detectSet`).
* `firstSeenScope`: timestamp when the scope was first seen.
* `lastSeenScope`: timestamp when the scope was last seen.
* `slicesInTrainingScope`: number of slices (for example, days) that the scope exists in training dataset.
* `countSlicesEntity`: number of slices (for example, days) that the entity exists on scope.
* `avgNumEntity`: average of the numeric variable in training set per entity on scope.
* `sdNumEntity`: standard deviation of the numeric variable in training set per entity on scope.
* `firstSeenEntity`: timestamp when the entity was first seen on scope.
* `lastSeenEntity`: timestamp when the entity was last seen on scope.
* `slicesInTrainingEntity`: number of slices (for example, days) that the entity exists on scope in training dataset.
* `countSlicesScope`: number of slices (for example, days) that the scope exists.
* `avgNumScope`: average of the numeric variable in training set per scope.
* `sdNumScope`: standard deviation of the numeric variable in training set per scope.
* `zScoreEntity`: Z-score for the current value of numeric variable based on entity model.
* `qScoreEntity`: Q-score for the current value of numeric variable based on entity model.
* `zScoreScope`: Z-score for the current value of numeric variable based on scope model.
* `qScoreScope`: Q-score for the current value of numeric variable based on scope model.
* `isSpikeOnEntity`: binary flag for anomalous spike based on entity model.
* `entityHighBaseline`: expected high baseline for numeric variable values based on entity model.
* `isSpikeOnScope`: binary flag for anomalous spike based on scope model.
* `scopeHighBaseline`: expected high baseline for numeric variable values based on scope model.
* `entitySpikeAnomalyScore`: anomaly score for the spike based on entity model; a number in range [0,1], higher values meaning more anomaly.
* `scopeSpikeAnomalyScore`: anomaly score for the spike based on scope model; a number in range [0,1], higher values meaning more anomaly.
* `anomalyType`: shows the type of anomaly (helpful when running several anomaly detection logics together).
* `anomalyScore`: anomaly score for the spike based on the chosen model.
* `anomalyExplainability`: textual wrapper for generated anomaly and its explanation.
* `anomalyState`: bag of metrics from the chosen model (average, standard deviation and percentiles) describing the model.

Running this function on countEvents variable using user as entity and account as scope with default parameters detect a spike on scope level. Since he user H4ck3r doesnt have enough data in training period, the anomaly isn't calculated for entity level, so all relevant fields are empty. The scope level anomaly has an anomaly score of 0.998, meaning that this spike is anomalous for the scope.

If we raise any of the minimum thresholds high enough, no anomaly will be detected since requirements would be too high.

The output shows the rows with anomalous spikes together with explanation fields in standardized format. These fields are useful for investigating the anomaly and for running anomalous spike detection on several numeric variables or running other algorithms together. 

The suggested usage in cybersecurity context is running the function on meaningful numeric variables (amounts of downloaded data, counts of uploaded files or failed sign in attempts) per meaningful scopes (such as subscription on accounts) and entities (such as users or devices). A detected anomalous spike means that the numeric value is higher than what is expected on that scope or entity, and might be suspicious.
