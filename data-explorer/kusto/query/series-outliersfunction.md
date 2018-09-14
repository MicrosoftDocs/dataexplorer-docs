---
title: series_outliers() - Azure Kusto | Microsoft Docs
description: This article describes series_outliers() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# series_outliers()

Scores anomaly points in a series.

Takes an expression containing dynamic numerical array as input and generates a dynamic numeric array of the same length. Each value of the array indicates a score of possible anomaly using [Tukey's test](https://en.wikipedia.org/wiki/Outlier#Tukey.27s_test). A value greater than 1.5 or less than -1.5 indicates a rise or decline anomaly respectively in the same element of the input.   

**Syntax**

`series_outliers(`*x*`, `*kind*`, `*ignore_val*`, `*min_percentile*`, `*max_percentile*`)`

**Arguments**

* *x*: Dynamic array cell which is an array of numeric values
* *kind*: Algorithm of outlier detection. Currently supports `"tukey"` (traditional Tukey) and  `"ctukey"` (custom Tukey). Default is `"ctukey"`
* *ignore_val*: numeric value indicating missing values in the series, default is double(null)
* *min_percentile*: for calulation of the normal inter quantile range, default is 10, custom values supported are in range `[2.0, 98.0]` (`ctukey` only) 
* *max_percentile*: same, default is 90, custom values supported are in range `[2.0, 98.0]` (ctukey only) 

The following table describes differences between `"tukey"` and `"ctukey"`:

| Algorithm | Default quantile range | Supports custom quantile range |
|-----------|----------------------- |--------------------------------|
| `"tukey"` | 25% / 75%              | No                             |
| `"ctukey"`| 10% / 90%              | Yes                            |


> [!TIP]
> The most convenient way of using this function is applying it to the results of [make-series](make-seriesoperator.md) operator.

**Examples**

* For the following input `[30,28,5,27,31,38,29,80,25,37,30]` the series_outliers() returns `[0.0,0.0,-3.206896551724138,-0.1724137931034483,0.0,2.6666666666666667,0.0,16.666666666666669,-0.4482758620689655,2.3333333333333337,0.0]`, meaning the `5` is an anomaly on decline and `80` is an anomaly on rise compared to the rest of the series.

* Suppose you have a time series with some noise that creates outliers and you would like to replace those outliers (noise) with the average value, you could use series_outliers() to detect the outliers then replace them:

```kusto
range x from 1 to 100 step 1 
| extend y=iff(x==20 or x==80, 10*rand()+10+(50-x)/2, 10*rand()+10) // generate a sample series with outliers at x=20 and x=80
| summarize x=makelist(x),series=makelist(y)
| extend series_stats(series), outliers=series_outliers(series)
| mvexpand x to typeof(long), series to typeof(double), outliers to typeof(double)
| project x, series , outliers_removed=iff(outliers > 1.5 or outliers < -1.5, series_stats_series_avg , series ) // replace outliers with the average
| render linechart
``` 

![alt text](./Images/samples/series-outliers.png "series-outliers")