---
title: render operator - Azure Data Explorer | Microsoft Docs
description: This article describes render operator in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# render operator

Renders results in as graphical output.

```kusto
T | render timechart
```

The render operator should be the last operator in the query expression.

**Syntax**

*T* `|` `render` *Visualization* [`with` (

  [`title` `=` *Title*],

  [`xcolumn` `=` *xColumn*],

  [`xaxis` `=` *xAxis*],

  [`yaxis` `=` *yAxis*],

  [`series` `=` *Series*],

  [`ycolumns` `=` *yColumns*],

  [`kind` `=` *VisualizationKind*],

  [`xtitle` `=` *xTitle*],

  [`ytitle` `=` *yTitle*],

  [`legend` `=` *Legend*],

  [`ysplit` `=` *ySplit*],

  [`accumulate` `=` *Accumulate*]
)]

Where:
* *Visualization* indicates the kind of visualization to perform. Supported values are:

|*Visualization*     |Description|
|--------------------|-|
| `anomalychart`     | Similar to timechart, but [highlights anomalies](./samples.md#get-more-out-of-your-data-in-kusto-using-machine-learning) using an external machine-learning service. |
| `areachart`        | Area graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `barchart`         | First column is x-axis, and can be text, datetime or numeric. Other columns are numeric, displayed as horizontal strips.|
| `columnchart`      | Like `barchart`, with vertical strips instead of horizontal strips.|
| `ladderchart`      | Last two columns are the x-axis, other columns are y-axis.|
| `linechart`        | Line graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `piechart`         | First column is color-axis, second column is numeric. |
| `pivotchart`       | Displays a pivot table and chart. User can interactively select data, columns, rows and various chart types. |
| `scatterchart`     | Points graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `stackedareachart` | Stacked area graph. First column is x-axis, and should be a numeric column. Other numeric columns are y-axes. |
| `table`            | Default - results are shown as a table.|
| `timechart`        | Line graph. First column is x-axis, and should be datetime. Other columns are y-axes.|
| `timepivot`        | Interactive navigation over the events time-line (pivoting on time axis)|

* *title* is an optional `string` value that holds the title for the results.

* *xColumn* is an optional column identifier, that defines data from which column will be used as x-axis.

* *xAxis* is an optional parameter which defines scale type for axis X - linear or logarithmic (can be set to either `linear` (the default) or `log`)

* *yAxis* is an optional parameter which defines scale type for axis Y - linear or logarithmic (can be set to either `linear` (the default) or `log`)

* *series* is an optional list of columns to control which "axis" is driven by which column in the data.

* *yColumns* is an optional list of columns, data from which will be used as y-values.

* *kind* is an optional identifier that chooses between the available kinds of the
  chosen *Visualization* (such as `barchart` and `columnchart`), if more than one kind is supported:

|*Visualization*|*kind*|Description                     |
|---------------|-------------------|--------------------------------|
|`areachart`    |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each "area" to its own          |
|               |`stacked`          |"Areas" are stacked to the right|
|               |`stacked100`       |"Areas" are stacked to the right, and stretched to the same width|
|`barchart`     |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each bar to its own             |
|               |`stacked`          |Bars are stacked to the right   |
|               |`stacked100`       |Bars are stacked to the right, and stretched to the same width|
|`columnchart`  |`default`          |Default, same as `unstacked`    |
|               |`unstacked`        |Each column to its own          |
|               |`stacked`          |Columns are stacked upwards     |
|               |`stacked100`       |Columns are stacked upwards, and stretched to the same height|

* *xTitle* is an optional `string` value that holds the title for the X-Axis.

* *yTitle* is an optional `string` value that holds the title for the Y-Axis.

* *legend* is an optional value that can be set to either `visible` (the default) or `hidden`, which defines whether to display chart legend or not.

* *ySplit* is an optional identifier that chooses between the available options of Y-Axis visualization:

|*ySplit*|Description               |
|---------------|-------------------|
|`none`         |Default, chart displayed with single Y-Axis for all series |
|`axes`         |Displayed single chart with separate Y-Axis for each serie |
|`panels`       |For every column, defined as Y, generated separate panel, with binding to the same X-Axis (maximal panels amount is 5)|

* *accumulate* is an optional value that can be set to either `true` or `false` (the default),
  and indicates whether to accumulate y-axis numeric values for presentation.

**Tips**

* Only positive values are displayed.
* Use `where`, `summarize` and `top` to limit the volume that you display.
* Sort the data to define the order of the x-axis.

**Examples**

[Rendering examples in the tutorial](./tutorial.md#render-display-a-chart-or-table).

[Anomaly detection](./samples.md#get-more-out-of-your-data-in-kusto-using-machine-learning)