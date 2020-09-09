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
|[quantize_lf()](quantize-lf.md)|Quantize metric columns. |
|[series_fit_poly_lf()](series-fit-poly-lf.md)|Fit a polynomial to series using regression analysis. |
|[series_moving_avg_lf()](series-moving-avg-lf.md)|Applies a moving average filter on a series. |
|[series_rolling_lf()](series-rolling-lf.md)|Applies a rolling aggregation function on a series. |
