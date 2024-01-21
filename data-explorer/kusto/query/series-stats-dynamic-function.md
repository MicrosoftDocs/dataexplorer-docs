---
title:  series_stats_dynamic()
description: Learn how to use the series_stats_dynamic() function to calculate the statistics for a series in a dynamic object.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# series_stats_dynamic()

Returns statistics for a series in a dynamic object.  

## Syntax

`series_stats_dynamic(`*series* [`,` *ignore_nonfinite* ]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | dynamic |  :heavy_check_mark: | An array of numeric values.|
| *ignore_nonfinite* | bool | | Indicates whether to calculate the statistics while ignoring non-finite values, such as *null*, *NaN*, *inf*, and so on. The default is `false`, which returns `null` if non-finite values are present in the array.|

## Returns

A dynamic property bag object with the following content:

* `min`: The minimum value in the input array.
* `min_idx`: The first position of the minimum value in the input array.
* `max`: The maximum value in the input array.
* `max_idx`: The first position of the maximum value in the input array.
* `avg`: The average value of the input array.
* `variance`: The sample variance of input array.
* `stdev`: The sample standard deviation of the input array.
* `sum`: The sum of the values in the input array.
* `len`: The length of the input array.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUaiwTanMS8zNTNaINjLWUTAx01EA0RbmQDaQ0lEAcsxNgYI6CqZAOUMo1xjINwSptYzVVOCqUSgoys9KTS5RKC5JLCm2LU4tykwtjgdz4mHmV2gCANNsjChyAAAA" target="_blank">Run the query</a>

```kusto
print x=dynamic([23, 46, 23, 87, 4, 8, 3, 75, 2, 56, 13, 75, 32, 16, 29]) 
| project stats=series_stats_dynamic(x)
```

**Output**

|stats|
|---|
|{"min": 2.0, "min_idx": 8, "max": 87.0, "max_idx": 3, "avg": 32.8, "stdev": 28.503633853548269, "variance": 812.45714285714291, "sum": 492.0, "len": 15}|


The following query creates a series of the average taxi fare per minute, and then calculates statistics on these average fares:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXMMQ6DMAxA0b2n8AgDQw/AKTiAZSVu5SI7UeygInF4Spm+/vJsTxj0lccBSitPzk3YYflnpu09vKgxkpZuMUIxqJLWXjFTcIgyeHCFp4r9iNrKh1PAEhQ+3xb6NZh3I5U03PJ4AhN2sX94AAAA" target="_blank">Run the query</a>

```kusto
nyc_taxi
| make-series Series=avg(fare_amount) on pickup_datetime step 1min
| project Stats=series_stats_dynamic(Series)
```

**Output**

| Stats |
|---|
|{"min":0,"min_idx":96600,"max":"31.779069767441861","max_idx":481260,"avg":"13.062685479531414","stdev":"1.7730590207741219","variance":"3.1437382911484884","sum":"6865747.488041711","len":525600}
