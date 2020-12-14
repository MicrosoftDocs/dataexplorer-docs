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
|[series_metric_fl()](series-metric-fl.md)|Selects and retrieves time series stored with the Prometheus data model. |
|[series_rate_fl()](series-rate-fl.md)|Calculates the average rate of counter metric increase per second. |

## Series processing functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[quantize_fl()](quantize-fl.md)|Quantize metric columns. |
|[series_dot_product_fl()](series-dot-product-fl.md)|Calculates the dot product of two numerical vectors. |
|[series_downsample_fl()](series-downsample-fl.md)|Downsample a time series by an integer factor. |
|[series_exp_smoothing_fl()](series-exp-smoothing-fl.md)|Applies a basic exponential smoothing filter on a series. |
|[series_fit_lowess_fl()](series-fit-lowess-fl.md)|Fits a local polynomial to series using LOWESS method. |
|[series_fit_poly_fl()](series-fit-poly-fl.md)|Fits a polynomial to series using regression analysis. |
|[series_moving_avg_fl()](series-moving-avg-fl.md)|Applies a moving average filter on a series. |
|[series_rolling_fl()](series-rolling-fl.md)|Applies a rolling aggregation function on a series. |
