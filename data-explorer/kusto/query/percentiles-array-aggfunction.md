---
title: percentiles_array() - Azure Data Explorer
description: Learn how to use the percentiles_array() function to calculate estimates for nearest rank percentiles in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/15/2023
---
# percentiles_array() (aggregation function)

Calculates multiple percentile estimates for the specified [nearest-rank percentile](percentiles-aggfunction.md#nearest-rank-percentile) of the population defined by *expr*. The accuracy depends on the density of population in the region of the percentile.

`percentiles_array()` works like [percentiles()](percentiles-aggfunction.md) to calculate percentiles, and `percentilesw_array()` works like [percentilesw()](percentiles-aggfunction.md) to calculate weighted percentiles. However, instead of returning the values in individual columns, they return them in a single array.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`percentiles_array(`*expr*`,` *percentiles*`)`

`percentilesw_array(`*expr*`,` *weightExpr*`,` *percentiles*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | string | &check; | The expression to use for aggregation calculation.|
|*percentiles*| int, long, or dynamic | &check;| One or more comma-separated percentiles or a dynamic array of percentiles. Each percentile can be an integer or long value.|
|*weightExpr*|long|&check;|The weight to give each value.|

## Returns

Returns an estimate for *expr* of the specified percentiles in the group as a single array.

## Examples

### Comma-separated percentiles

Multiple percentiles can be obtained as an array in a single dynamic column, instead of in multiple columns as with [percentiles()](percentiles-aggfunction.md).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAAwspSswrTssvyk1NCU7NK84vKnZJLEnk5apRKC7NzU0syqxKVShILUpOzSvJzEktjk8sKkqs1AhLzClN1VEw1VEwAmJTAx0FcyBtaaqpo5BYlg6R1lRIqlSAmOmXmJsKANY0tLFpAAAA" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| summarize percentiles_array(Value, 5, 25, 50, 75, 95), avg(Value) by SensorName
```

**Output**

The results table displays only the first 10 rows.

|SensorName|percentiles_Value|avg_Value |
|--|--|--|
|sensor-82|["0.048141473520867069","0.24407515500271132","0.48974511106780577","0.74160998970950343","0.94587903204190071"]|0.493950914|
|sensor-130|["0.049200214398937764","0.25735850440187535","0.51206374010048239","0.74182335059053839","0.95210342463616771"]|0.505111463|
|sensor-56|["0.04857779335488676","0.24709868149337144","0.49668762923789589","0.74458470404241883","0.94889104840865857"]|0.497955018|
|sensor-24|["0.051507199150534679","0.24803904945640423","0.50397070213183581","0.75653888126010793","0.9518782718727431"]|0.501084379|
|sensor-47|["0.045991246974755672","0.24644331118208851","0.48089197707088743","0.74475142784472248","0.9518322864959039"]|0.49386228|
|sensor-135|["0.05132897529660399","0.24204987641954018","0.48470113942206461","0.74275730068433621","0.94784079559229406"]|0.494817619|
|sensor-74|["0.048914714739047828","0.25160926036445724","0.49832498850160978","0.75257887767110776","0.94932261924236094"]|0.501627252|
|sensor-173|["0.048333149363009836","0.26084250046756496","0.51288012531934613","0.74964772791583412","0.95156058795294"]|0.505401226|
|sensor-28|["0.048511161184567046","0.2547387968731824","0.50101318228599656","0.75693845702682039","0.95243122486483989"]|0.502066244|
|sensor-34|["0.049980293859462954","0.25094722564949412","0.50914023067384762","0.75571549713447961","0.95176564809278674"]|0.504309494|
|...|...|...|

### Dynamic array percentiles

Percentiles for `percentiles_array` can be specified in a dynamic array of integer or floating-point numbers. The array must be constant but doesn't have to be literal.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAAwspSswrTssvyk1NCU7NK84vKnZJLEnkqlEoLs3NTSzKrEpVKEgtSk7NK8nMSS2OTywqSqzUCEvMKU3VUUipzEvMzUzWiDbVUTACYlMDHQVzIG1pGqupqaOQWJYOUampkFSpADHdLzE3FQAgg+RhcwAAAA==" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| summarize percentiles_array(Value, dynamic([5, 25, 50, 75, 95])), avg(Value) by SensorName
```

**Output**

The results table displays only the first 10 rows.

|SensorName|percentiles_Value|avg_Value |
|--|--|--|
|sensor-82|["0.048141473520867069","0.24407515500271132","0.48974511106780577","0.74160998970950343","0.94587903204190071"]|0.493950914|
|sensor-130|["0.049200214398937764","0.25735850440187535","0.51206374010048239","0.74182335059053839","0.95210342463616771"]|0.505111463|
|sensor-56|["0.04857779335488676","0.24709868149337144","0.49668762923789589","0.74458470404241883","0.94889104840865857"]|0.497955018|
|sensor-24|["0.051507199150534679","0.24803904945640423","0.50397070213183581","0.75653888126010793","0.9518782718727431"]|0.501084379|
|sensor-47|["0.045991246974755672","0.24644331118208851","0.48089197707088743","0.74475142784472248","0.9518322864959039"]|0.49386228|
|sensor-135|["0.05132897529660399","0.24204987641954018","0.48470113942206461","0.74275730068433621","0.94784079559229406"]|0.494817619|
|sensor-74|["0.048914714739047828","0.25160926036445724","0.49832498850160978","0.75257887767110776","0.94932261924236094"]|0.501627252|
|sensor-173|["0.048333149363009836","0.26084250046756496","0.51288012531934613","0.74964772791583412","0.95156058795294"]|0.505401226|
|sensor-28|["0.048511161184567046","0.2547387968731824","0.50101318228599656","0.75693845702682039","0.95243122486483989"]|0.502066244|
|sensor-34|["0.049980293859462954","0.25094722564949412","0.50914023067384762","0.75571549713447961","0.95176564809278674"]|0.504309494|
|...|...|...|

### Weighted percentiles

Assume you repetitively measure the time (Duration) it takes an action to complete. Instead of recording every value of the measurement, you record each value of Duration, rounded to 100 msec, and how many times the rounded value appeared (BucketSize).

Use `summarize percentilesw_array(Duration, BucketSize, ...)` to calculate the given percentiles in a "weighted" way. Treat each value of Duration as if it was repeated BucketSize times in the input, without actually needing to materialize those records.

The following example shows weighted percentiles. Using the following set of latency values in milliseconds: `{ 1, 1, 2, 2, 2, 5, 7, 7, 12, 12, 15, 15, 15, 18, 21, 22, 26, 35 }`.

To reduce bandwidth and storage, do pre-aggregation to the following buckets: `{ 10, 20, 30, 40, 50, 100 }`. Count the number of events in each bucket to produce the following table:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHISSxJzUuuDElMyklVsFVISSwBQhBbIyi10Dm/NK/EKic/L11HwQei0Kk0OTsVIqapwBWtwKUABBY6CoYGOhC2mY6CEYxtrKNgDGMb6iiYGChwxVpzIVsJAGDD8KqDAAAA" target="_blank">Run the query</a>

```kusto
let latencyTable = datatable (ReqCount:long, LatencyBucket:long) 
[ 
    8, 10, 
    6, 20, 
    3, 30, 
    1, 40 
];
latencyTable
```

The table displays:

* Eight events in the 10-ms bucket (corresponding to subset `{ 1, 1, 2, 2, 2, 5, 7, 7 }`)
* Six events in the 20-ms bucket (corresponding to subset `{ 12, 12, 15, 15, 15, 18 }`)
* Three events in the 30-ms bucket (corresponding to subset `{ 21, 22, 26 }`)
* One event  in the 40-ms bucket (corresponding to subset `{ 35 }`)

At this point, the original data is no longer available. Only the number of events in each bucket. To compute percentiles from this data, use the `percentilesw()` function. For the 50, 75, and 99.9 percentiles, use the following query:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAA1WOQQuCQBCF7/sr3lFhCM2sLLrUtVN0i4hpG0Ja11pXwujHZ8hCzVw+Ho/5xoiHYS9Wd3s+G8EKF/b9fjnayWNTt9YvTG2vhO1QXLf6JkMWQx2g0M+ckCY08JQwDpwRssApYZJAHZfqV6neaNqqYle+BHdxWqwvjTTPEzvHXfRnJYSfCHl/d5YTimJUxB+W4nlIyQAAAA==" target="_blank">Run the query</a>

```kusto
let latencyTable = datatable (ReqCount:long, LatencyBucket:long) 
[ 
    8, 10, 
    6, 20, 
    3, 30, 
    1, 40 
];
latencyTable
| summarize percentilesw_array(LatencyBucket, ReqCount, 50, 75, 99.9)
```

**Output**

| percentile_LatencyBucket |
|---|---|---|
| [20, 20, 40] |
