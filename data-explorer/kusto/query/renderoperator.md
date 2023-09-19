---
title:  render operator
description: Learn how to use the render operator to instruct the user agent to render a visualization of the query results.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/07/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# render operator

Instructs the user agent to render a visualization of the query results.  

The render operator must be the last operator in the query, and can only be used with queries that produce a single tabular data stream result.  The render operator doesn't modify data. It injects an annotation ("Visualization") into the result's extended  properties. The annotation contains the information provided by the operator in the query. The interpretation of the visualization information is done by the user agent. Different agents, such as Kusto.Explorer or Azure Data Explorer web UI, may support different visualizations.

The data model of the render operator looks at the tabular data as if it has
three kinds of columns:

* The x axis column (indicated by the `xcolumn` property).
* The series columns (any number of columns indicated by the `series` property.) For each record, the combined values of these columns define a single series, and the chart has as many series as there are distinct combined values.
* The y axis columns (any number of columns indicated by the `ycolumns` property). For each record, the series has as many measurements ("points" in the chart) as there are y-axis columns.

> [!TIP]
>
> * Use `where`, `summarize` and `top` to limit the volume that you display.
> * Sort the data to define the order of the x-axis.
> * User agents are free to "guess" the value of properties that are not specified
  by the query. In particular, having "uninteresting" columns in the schema of
  the result might translate into them guessing wrong. Try projecting-away such
  columns when that happens.

>[!NOTE]
> There are some visualizations which are only available in Azure Data Explorer dashboards. For more information, see [Dashboard-specific visuals](../../dashboard-visuals.md). 

## Syntax

*T* `|` `render` *visualization* [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | Input table name.
| *visualization* | string | &check; | Indicates the kind of [visualization](#visualization) to use. Must be one of the supported values in the following list.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Visualization

::: zone pivot="azuredataexplorer"

| *visualization*| Description| Illustration |
|-----------|------------|---------|
| [`anomalychart`](visualization-anomalychart.md)| Similar to timechart, but [highlights anomalies](./samples.md#get-more-from-your-data-by-using-kusto-with-machine-learning) using [series_decompose_anomalies](./series-decompose-anomaliesfunction.md) function. | :::image type="icon" source="images/renderoperator/anomaly-chart.png" border="false"::: |
| [`areachart`](visualization-areachart.md)               | Area graph.| :::image type="icon" source="images/renderoperator/area-chart.png" border="false"::: |
| [`barchart`](visualization-barchart.md)                 | displayed as horizontal strips.| :::image type="icon" source="images/renderoperator/bar-chart.png" border="false"::: |
| [`card`](visualization-card.md)                         | First result record is treated as set of scalar values and shows as a card.| :::image type="icon" source="images/renderoperator/card.png" border="false":::
| [`columnchart`](visualization-columnchart.md)           | Like `barchart` with vertical strips instead of horizontal strips.| :::image type="icon" source="images/renderoperator/column-chart.png" border="false"::: |
| [`ladderchart`](visualization-ladderchart.md)           | Last two columns are the x-axis, other columns are y-axis.| :::image type="icon" source="images/renderoperator/ladder-chart.png" border="false":::|
| [`linechart`](visualization-linechart.md)               | Line graph. | :::image type="icon" source="images/renderoperator/line-chart.png" border="false"::: |
| [`piechart`](visualization-piechart.md)                 | First column is color-axis, second column is numeric.| :::image type="icon" source="images/renderoperator/pie-chart.png" border="false"::: |
| [`pivotchart`](visualization-pivotchart.md)             | Displays a pivot table and chart. User can interactively select data, columns, rows and various chart types.| :::image type="icon" source="images/renderoperator/pivot-chart.png" border="false"::: |
| [`scatterchart`](visualization-scatterchart.md)         | Points graph.| :::image type="icon" source="images/renderoperator/scatter-chart.png" border="false"::: |
| [`stackedareachart`](visualization-stackedareachart.md) | Stacked area graph.| :::image type="icon" source="images/renderoperator/stacked-area-chart.png" border="false"::: |
| [`table`](visualization-table.md)                       | Default - results are shown as a table.| :::image type="icon" source="images/renderoperator/table-visualization.png" border="false"::: |
| [`timechart`](visualization-timechart.md)               | Line graph. First column is x-axis, and must be datetime. Other (numeric) columns are y-axes. | :::image type="icon" source="images/renderoperator/visualization-timechart.png" border="false"::: |
| [`timepivot`](visualization-timepivot.md)               | Interactive navigation over the events time-line (pivoting on time axis)| :::image type="icon" source="images/renderoperator/visualization-time-pivot.png" border="false"::: |
| [`treemap`](visualization-treemap.md) | Displays hierarchical data as a set of nested rectangles.| :::image type="icon" source="images/renderoperator/tree-map.png" border="false"::: |

> [!NOTE]
> The ladderchart, pivotchart, timepivot, and treemap visualizations can be used in Kusto.Explorer but are not available in the Azure Data Explorer web UI.

::: zone-end

::: zone pivot="azuremonitor"

|*Visualization*     |Description| Illustration |
|--------------------|----------|---------|
| [`areachart`](visualization-areachart.md)| Area graph. First column is the x-axis and should be a numeric column. Other numeric columns are y-axes. |  :::image type="icon" source="images/renderoperator/area-chart.png" border="false"::: |
| [`barchart`](visualization-barchart.md)  | First column is the x-axis and can be text, datetime or numeric. Other columns are numeric, displayed as horizontal strips.| :::image type="icon" source="images/renderoperator/bar-chart.png" border="false"::: |
| [`columnchart`](visualization-columnchart.md)| Like `barchart` with vertical strips instead of horizontal strips.| :::image type="icon" source="images/renderoperator/column-chart.png" border="false"::: |
| [`piechart`](visualization-piechart.md)  | First column is color-axis, second column is numeric. | :::image type="icon" source="images/renderoperator/pie-chart.png" border="false"::: |
| [`scatterchart`](visualization-scatterchart.md)     | Points graph. First column is the x-axis and should be a numeric column. Other numeric columns are y-axes. | :::image type="icon" source="images/renderoperator/scatter-chart.png" border="false"::: |
| [`table`](visualization-table.md)            | Default - results are shown as a table.| :::image type="icon" source="images/renderoperator/table-visualization.png" border="false"::: |
| [`timechart`](visualization-timechart.md)         | Line graph. First column is x-axis, and should be datetime. Other (numeric) columns are y-axes. There's one string column whose values are used to "group" the numeric columns and create different lines in the chart (further string columns are ignored).| :::image type="icon" source="images/renderoperator/visualization-timechart.png" border="false"::: |

::: zone-end

::: zone pivot="fabric"

| *visualization*| Description| Illustration |
|-----------|------------|---------|
| [`anomalychart`](visualization-anomalychart.md)| Similar to timechart, but [highlights anomalies](./samples.md#get-more-from-your-data-by-using-kusto-with-machine-learning) using [series_decompose_anomalies](./series-decompose-anomaliesfunction.md) function. | :::image type="icon" source="images/renderoperator/anomaly-chart.png" border="false"::: |
| [`areachart`](visualization-areachart.md)               | Area graph.| :::image type="icon" source="images/renderoperator/area-chart.png" border="false"::: |
| [`barchart`](visualization-barchart.md)                 | displayed as horizontal strips.| :::image type="icon" source="images/renderoperator/bar-chart.png" border="false"::: |
| [`card`](visualization-card.md)                         | First result record is treated as set of scalar values and shows as a card.| :::image type="icon" source="images/renderoperator/card.png" border="false":::
| [`columnchart`](visualization-columnchart.md)           | Like `barchart` with vertical strips instead of horizontal strips.| :::image type="icon" source="images/renderoperator/column-chart.png" border="false"::: |
| [`linechart`](visualization-linechart.md)               | Line graph. | :::image type="icon" source="images/renderoperator/line-chart.png" border="false"::: |
| [`piechart`](visualization-piechart.md)                 | First column is color-axis, second column is numeric.| :::image type="icon" source="images/renderoperator/pie-chart.png" border="false"::: |
| [`scatterchart`](visualization-scatterchart.md)         | Points graph.| :::image type="icon" source="images/renderoperator/scatter-chart.png" border="false"::: |
| [`stackedareachart`](visualization-stackedareachart.md) | Stacked area graph.| :::image type="icon" source="images/renderoperator/stacked-area-chart.png" border="false"::: |
| [`table`](visualization-table.md)                       | Default - results are shown as a table.| :::image type="icon" source="images/renderoperator/table-visualization.png" border="false"::: |
| [`timechart`](visualization-timechart.md)               | Line graph. First column is x-axis, and must be datetime. Other (numeric) columns are y-axes. | :::image type="icon" source="images/renderoperator/visualization-timechart.png" border="false"::: |

::: zone-end

### Supported properties

*PropertyName*/*PropertyValue* indicate additional information to use when rendering.
  All properties are optional. The supported properties are:

::: zone pivot="azuredataexplorer, fabric"

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`accumulate`  |Whether the value of each measure gets added to all its predecessors. (`true` or `false`)|
|`kind`        |Further elaboration of the visualization kind.  For more information, see [`kind` property](#kind-property).                         |
|`legend`      |Whether to display a legend or not (`visible` or `hidden`).                       |
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`ymin`        |The minimum value to be displayed on Y-axis.                                      |
|`ymax`        |The maximum value to be displayed on Y-axis.                                      |
|`title`       |The title of the visualization (of type `string`).                                |
|`xaxis`       |How to scale the x-axis (`linear` or `log`).                                      |
|`xcolumn`     |Which column in the result is used for the x-axis.                                |
|`xtitle`      |The title of the x-axis (of type `string`).                                       |
|`yaxis`       |How to scale the y-axis (`linear` or `log`).                                      |
|`ycolumns`    |Comma-delimited list of columns that consist of the values provided per value of the x column.|
|`ysplit`      |How to split multiple the visualization. For more information, see [`y-split` property](#ysplit-property).                             |
|`ytitle`      |The title of the y-axis (of type `string`).                                       |
|`anomalycolumns`|Property relevant only for `anomalychart`. Comma-delimited list of columns, which will be considered as anomaly series and displayed as points on the chart|

::: zone-end

::: zone pivot="azuremonitor"

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`kind`        |Further elaboration of the visualization kind. For more information, see [`kind` property](#kind-property).                        |
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`title`       |The title of the visualization (of type `string`).                                |

::: zone-end

#### `kind` property

This visualization can be further elaborated by providing the `kind` property.
The supported values of this property are:

|*Visualization*|`kind`             |Description                        |
|---------------|-------------------|-----------------------------------|
|`areachart`    |`default`          |Each "area" stands on its own.     |
|               |`unstacked`        |Same as `default`.                 |
|               |`stacked`          |Stack "areas" to the right.        |
|               |`stacked100`       |Stack "areas" to the right and stretch each one to the same width as the others.|
|`barchart`     |`default`          |Each "bar" stands on its own.      |
|               |`unstacked`        |Same as `default`.                 |
|               |`stacked`          |Stack "bars".                      |
|               |`stacked100`       |Stack "bars" and stretch each one to the same width as the others.|
|`columnchart`  |`default`          |Each "column" stands on its own.   |
|               |`unstacked`        |Same as `default`.                 |
|               |`stacked`          |Stack "columns" one atop the other.|
|               |`stacked100`       |Stack "columns" and stretch each one to the same height as the others.|
|`scatterchart` |`map`              |Expected columns are [Longitude, Latitude] or GeoJSON point. Series column is optional. For more information, see [Geospatial visualizations](geospatial-visualizations.md). |
|`piechart`     |`map`              |Expected columns are [Longitude, Latitude] or GeoJSON point, color-axis and numeric. Supported in Kusto Explorer desktop. For more information, see [Geospatial visualizations](geospatial-visualizations.md).|

::: zone pivot="azuredataexplorer, fabric"

#### `ysplit` property

Some visualizations support splitting into multiple y-axis values:

|`ysplit`  |Description                                                       |
|----------|------------------------------------------------------------------|
|`none`    |A single y-axis is displayed for all series data. (Default)       |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value (up to some limit).|

## How to render continuous data

Several visualizations are used for rendering sequences of values, for example, `linechart`, `timechart`, and `areachart`.
These visualizations have the following conceptual model:

* One column in the table represents the x-axis of the data. This column can be explicitly defined using the
    `xcolumn` property. If not defined, the user agent picks the first column that is appropriate for the visualization.
  * For example: in the `timechart` visualization, the user agent uses the first `datetime` column.
  * If this column is of type `dynamic` and it holds an array, the individual values in the array will be treated as the values of the x-axis.
* One or more columns in the table represent one or more measures that vary by the x-axis.
    These columns can be explicitly defined using the `ycolumns` property. If not defined, the user agent picks all columns that are appropriate for the visualization.
  * For example: in the `timechart` visualization, the user agent uses all columns with a numeric value that haven't been specified otherwise.
  * If the x-axis is an array, the values of each y-axis should also be an array of a similar length, with each y-axis occurring in a single column.
* Zero or more columns in the table represent a unique set of dimensions that group together the measures. These columns can be specified by the `series` property, or the user agent will pick them automatically from the columns that are otherwise unspecified.

## See also

* [Add a query visualization in the web UI](../../add-query-visualization.md)
* [Customize dashboard visuals](../../dashboard-customize-visuals.md)
* [Rendering examples in the tutorial](tutorials/use-aggregation-functions.md#visualize-query-results)
* [Anomaly detection](./samples.md#get-more-from-your-data-by-using-kusto-with-machine-learning)

::: zone-end

::: zone pivot="azuremonitor"

> [!NOTE]
> The data model of the render operator looks at the tabular data as if it has
three kinds of columns:
>
> * The x axis column (indicated by the `xcolumn` property).
> * The series columns (any number of columns indicated by the `series` property.)
> * The y axis columns (any number of columns indicated by the `ycolumns`
  property).
  For each record, the series has as many measurements ("points" in the chart)
  as there are y-axis columns.

## Example

```kusto
InsightsMetrics
| where Computer == "DC00.NA.contosohotels.com"
| where Namespace  == "Processor" and Name == "UtilizationPercentage"
| summarize avg(Val) by Computer, bin(TimeGenerated, 1h)
| render timechart
```

::: zone-end
