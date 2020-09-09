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

The following article contains a categorized list of user-defined functions.

## Machine learning functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[predict_lf()](predict-lf.md)|Predict using an existing trained machine learning model. |
|[predict_onnx_lf()](predict-onnx-lf.md)| Predict using an existing trained machine learning model in ONNX format. |

## Series processing functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[quantize_udf()](quantize-udf.md)|Quantize metric columns. |
|[series_fit_poly_udf()](series-fit-poly-udf.md)|Fit a polynomial to series using regression analysis. |
|[series_moving_avg_udf()](series-moving-avg-udf.md)|Apply a moving average filter on a series. |
|[series_rolling_udf()](series-rolling-udf.md)|Apply a rolling aggregation function on a series. |
