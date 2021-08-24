---
title: Functions library - Azure Data Explorer
description: This article describes user-defined functions that extend Azure Data Explorer capabilities.
author: orspod
ms.author: orspodek
ms.reviewer: adieldar
ms.service: data-explorer
ms.topic: reference
ms.date: 09/08/2020
---
# Functions library

The following article contains a categorized list of [UDF (user-defined functions)](../query/functions/user-defined-functions.md).

The user-defined functions code is given in the articles.  It can be used within a let statement embedded in a query or can be persisted in a database using [`.create function`](../management/create-function.md).

## Machine learning functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[kmeans_fl()](kmeans-fl.md)|Clusterize using the k-means algorithm. |
|[predict_fl()](predict-fl.md)|Predict using an existing trained machine learning model. |
|[predict_onnx_fl()](predict-onnx-fl.md)| Predict using an existing trained machine learning model in ONNX format. |

## PromQL functions

The following section contains common [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) functions. These functions can be used for analysis of metrics ingested to Azure Data Explorer by the [Prometheus](https://prometheus.io/) monitoring system. All functions assume that metrics in Azure Data Explorer are structured using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/).


|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[series_metric_fl()](series-metric-fl.md)|Select and retrieve time series stored with the Prometheus data model. |
|[series_rate_fl()](series-rate-fl.md)|Calculate the average rate of counter metric increase per second. |

## Series processing functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[quantize_fl()](quantize-fl.md)|Quantize metric columns. |
|[series_dbl_exp_smoothing_fl()](series-dbl-exp-smoothing-fl.md)|Apply a double exponential smoothing filter on a series. |
|[series_dot_product_fl()](series-dot-product-fl.md)|Calculate the dot product of two numerical vectors. |
|[series_downsample_fl()](series-downsample-fl.md)|Downsample a time series by an integer factor. |
|[series_exp_smoothing_fl()](series-exp-smoothing-fl.md)|Apply a basic exponential smoothing filter on a series. |
|[series_fit_lowess_fl()](series-fit-lowess-fl.md)|Fit a local polynomial to series using LOWESS method. |
|[series_fit_poly_fl()](series-fit-poly-fl.md)|Fit a polynomial to series using regression analysis. |
|[series_fbprophet_forecast_fl()](series-fbprophet-forecast-fl.md)|Forecast time series values using the Prophet algorithm. |
|[series_moving_avg_fl()](series-moving-avg-fl.md)|Apply a moving average filter on a series. |
|[series_rolling_fl()](series-rolling-fl.md)|Apply a rolling aggregation function on a series. |
|[time_weighted_avg_fl()](time-weighted-avg-fl.md)|Calculates the time weighted average of a metric. |

## Statistical and probability functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[bartlett_test_fl()](bartlett-test-fl.md)| Perform the Bartlett test. | 
|[binomial_test_fl()](binomial-test-fl.md)|Perform the binomial test. |
|[comb_fl()](comb-fl.md)|Calculate *C(n, k)*, the number of combinations for selection of k items out of n. |
|[factorial_fl()](factorial-fl.md)|Calculate *n!*, the factorial of n. |
|[ks_test_fl()](ks-test-fl.md)| Perform a Kolmogorov Smirnov test. |
|[levene_test_fl()n](levene-test-fl.md)| Perform a Levene test. | 
|[normality_test_fl()](normality-test-fl.md) | Performs the Normality Test.|
|[mann_whitney_u_test_fl()](mann-whitney-u-test-fl.md)| Perform a Mann-Whitney U Test. | 
|[pair_probabilities_fl()](pair-probabilities-fl.md)|Calculate various probabilities and related metrics for a pair of categorical variables. |
|[perm_fl()](perm-fl.md)|Calculate *P(n, k)*, the number of permutations for selection of k items out of n. |
|[two_sample_t_test_fl()](two-sample-t-test-fl.md)| Perform the two sample t-test. |
|[wilcoxon_test_fl()](wilcoxon-test-fl.md)| Perform the Wilcoxon Test. |
