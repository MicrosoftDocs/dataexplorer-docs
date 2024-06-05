---
title:  Functions library
description: This article describes user-defined functions that extend Azure Data Explorer capabilities.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/07/2022
---
# Functions library

The following article contains a categorized list of [UDF (user-defined functions)](../query/functions/user-defined-functions.md).

The user-defined functions code is given in the articles.  It can be used within a let statement embedded in a query or can be persisted in a database using [`.create function`](../management/create-function.md).

## General functions

| Function Name | Description |
|--|--|
| [geoip_fl()](geoip-fl.md) | Retrieves geographic information of ip address. |
| [get_packages_version_fl()](get-packages-version-fl.md) | Returns version information of the Python engine and the specified packages. |

## Machine learning functions

| Function Name | Description |
|--|--|
| [kmeans_fl()](kmeans-fl.md) | Clusterize using the k-means algorithm. |
| [predict_fl()](predict-fl.md) | Predict using an existing trained machine learning model. |
| [predict_onnx_fl()](predict-onnx-fl.md) | Predict using an existing trained machine learning model in ONNX format. |

## Plotly functions

The following section contains functions for rendering interactive [Plotly charts](https://plotly.com/python/).

| Function Name | Description |
|--|--|
| [plotly_anomaly_fl()](plotly-anomaly-fl.md) | Render anomaly chart using a Plotly template. |
| [plotly_scatter3d_fl()](plotly-scatter3d-fl.md) | Render 3D scatter chart using a Plotly template. |

## PromQL functions

The following section contains common [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) functions. These functions can be used for analysis of metrics ingested to your cluster by the [Prometheus](https://prometheus.io/) monitoring system. All functions assume that metrics in your cluster are structured using the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/).

| Function Name | Description |
|--|--|
| [series_metric_fl()](series-metric-fl.md) | Select and retrieve time series stored with the Prometheus data model. |
| [series_rate_fl()](series-rate-fl.md) | Calculate the average rate of counter metric increase per second. |

## Series processing functions

| Function Name | Description |
|--|--|
| [quantize_fl()](quantize-fl.md) | Quantize metric columns. |
| [series_clean_anomalies_fl()](series-clean-anomalies-fl.md) | Replace anomalies in a series by interpolated value. |
| [series_cosine_similarity_fl()](series-cosine-similarity-fl.md) | Calculate the cosine similarity of two numerical vectors. |
| [series_dbl_exp_smoothing_fl()](series-dbl-exp-smoothing-fl.md) | Apply a double exponential smoothing filter on series. |
| [series_dot_product_fl()](series-dot-product-fl.md) | Calculate the dot product of two numerical vectors. |
| [series_downsample_fl()](series-downsample-fl.md) | Downsample time series by an integer factor. |
| [series_exp_smoothing_fl()](series-exp-smoothing-fl.md) | Apply a basic exponential smoothing filter on series. |
| [series_fit_lowess_fl()](series-fit-lowess-fl.md) | Fit a local polynomial to series using LOWESS method. |
| [series_fit_poly_fl()](series-fit-poly-fl.md) | Fit a polynomial to series using regression analysis. |
| [series_fbprophet_forecast_fl()](series-fbprophet-forecast-fl.md) | Forecast time series values using the Prophet algorithm. |
| [series_lag_fl()](series-lag-fl.md) | Apply a lag filter on series. |
| [series_monthly_decompose_anomalies_fl()](series-monthly-decompose-anomalies-fl.md) | Detect anomalies in a series with monthly seasonality. |
| [series_moving_avg_fl()](series-moving-avg-fl.md) | Apply a moving average filter on series. |
| [series_moving_var_fl()](series-moving-var-fl.md) | Apply a moving variance filter on series. |
| [series_mv_ee_anomalies_fl()](series-mv-ee-anomalies-fl.md) | Multivariate Anomaly Detection for series using elliptical envelope model. |
| [series_mv_if_anomalies_fl()](series-mv-if-anomalies-fl.md) | Multivariate Anomaly Detection for series using isolation forest model. |
| [series_mv_oc_anomalies_fl()](series-mv-oc-anomalies-fl.md) | Multivariate Anomaly Detection for series using one class SVM model. |
| [series_rolling_fl()](series-rolling-fl.md) | Apply a rolling aggregation function on series. |
| [series_shapes_fl()](series-shapes-fl.md) | Detects positive/negative trend or jump in series. |
| [series_uv_anomalies_fl()](series-uv-anomalies-fl.md) | Detect anomalies in time series using the Univariate Anomaly Detection Cognitive Service API. |
| [series_uv_change_points_fl()](series-uv-change-points-fl.md) | Detect change points in time series using the Univariate Anomaly Detection Cognitive Service API. |
| [time_weighted_avg_fl()](time-weighted-avg-fl.md) | Calculates the time weighted average of a metric. |
| [time_window_rolling_avg_fl()](time-window-rolling-avg-fl.md) | Calculates the rolling average of a metric over a constant duration time window. |

## Statistical and probability functions

| Function Name | Description |
|--|--|
| [bartlett_test_fl()](bartlett-test-fl.md) | Perform the Bartlett test. |
| [binomial_test_fl()](binomial-test-fl.md) | Perform the binomial test. |
| [comb_fl()](comb-fl.md) | Calculate *C(n, k)*, the number of combinations for selection of k items out of n. |
| [factorial_fl()](factorial-fl.md) | Calculate *n!*, the factorial of n. |
| [ks_test_fl()](ks-test-fl.md) | Perform a Kolmogorov Smirnov test. |
| [levene_test_fl()n](levene-test-fl.md) | Perform a Levene test. |
| [normality_test_fl()](normality-test-fl.md) | Performs the Normality Test. |
| [mann_whitney_u_test_fl()](mann-whitney-u-test-fl.md) | Perform a Mann-Whitney U Test. |
| [pair_probabilities_fl()](pair-probabilities-fl.md) | Calculate various probabilities and related metrics for a pair of categorical variables. |
|[pairwise_dist_fl()](pairwise-dist-fl.md)| Calculate pairwise distances between entities based on multiple nominal and numerical variables. |
| [percentiles_linear_fl()](percentiles-linear-fl.md) | Calculate percentiles using linear interpolation between closest ranks |
| [perm_fl()](perm-fl.md) | Calculate *P(n, k)*, the number of permutations for selection of k items out of n. |
| [two_sample_t_test_fl()](two-sample-t-test-fl.md) | Perform the two sample t-test. |
| [wilcoxon_test_fl()](wilcoxon-test-fl.md) | Perform the Wilcoxon Test. |

## Text analytics

| Function Name | Description |
|--|--|
| [log_reduce_fl()](log-reduce-fl.md) | Find common patterns in textual logs and output a summary table. |
| [log_reduce_full_fl()](log-reduce-full-fl.md) | Find common patterns in textual logs and output a full table. |
| [log_reduce_predict_fl()](log-reduce-predict-fl.md) | Apply a trained model to find common patterns in textual logs and output a summary table. |
| [log_reduce_predict_full_fl()](log-reduce-predict-full-fl.md) | Apply a trained model to find common patterns in textual logs and output a full table. |
| [log_reduce_train_fl()](log-reduce-train-fl.md) | Find common patterns in textual logs and output a model. |
