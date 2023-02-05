---
title: Azure Data Explorer dashboard visuals
description: Learn about the different types of visuals supported in Azure Data Explorer dashboards.
ms.reviewer: gabil
ms.topic: reference
ms.date: 02/02/2023
---

# Azure Data Explorer dashboard visuals

Azure Data Explorer dashboards support several different types of visuals. This article describes the different types of visuals and the data columns needed in your result set to plot these visuals.
For more information on dashboards, see [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).

## Table

:::image type="content" source="media/dashboard-customize-visuals/table.png" alt-text="table visual type.":::

By default, results are shown as a table. The table visual is best for presenting detailed or complicated data.

## Bar chart

:::image type="content" source="media/dashboard-customize-visuals/bar-chart.png" alt-text="bar chart visual type.":::

The bar chart visual needs a minimum of two columns in the query result. By default, the first column is used as the y-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the x-axis and contain numeric data types to be displayed as horizontal lines. Bar charts are used mainly for comparing numeric and nominal discrete values, where the length of each line represents its value.

## Column chart

:::image type="content" source="media/dashboard-customize-visuals/column-chart.png" alt-text="column chart visual type.":::

The column chart visual needs a minimum of two columns in the query result. By default, the first column is used as the x-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the y-axis and contain numeric data types to be displayed as vertical lines. Column charts are used for comparing specific sub category items in a main category range, where the length of each line represents its value.

## Area chart

:::image type="content" source="media/dashboard-customize-visuals/area-chart.png" alt-text="area chart visual type.":::

The area chart visual shows a time-series relationship. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Unlike line charts, area charts also visually represent volume. Area charts are ideal for indicating the change among different data sets.

## Line chart

:::image type="content" source="media/dashboard-customize-visuals/line-chart.png" alt-text="line chart visual type.":::

The line chart visual is the most basic type of chart. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Line charts track changes over short and long periods of time. When smaller changes exist, line graphs are more useful than bar graphs.

## Stat

:::image type="content" source="media/dashboard-customize-visuals/stat.png" alt-text="stat visual type.":::

The stat visual only shows one element. If there are multiple columns and rows in the output, stat shows the first element of the first column. Stat tiles are useful to highlight KPIs on the Dashboard.

## Multi stat

:::image type="content" source="media/dashboard-customize-visuals/multistat.png" alt-text="multi stat visual type.":::

The multi stat visual shows multiple stat tiles in a group using a single query result. This requires two columns, one for the label and the other for the value. Users can use a visual formatting option to customize the output layout for display by selecting the number of rows and columns. In addition to being more convenient, this formatting option will reduce cluster load where customers are using similar queries to build multiple stats.

## Pie chart

:::image type="content" source="media/dashboard-customize-visuals/pie-chart.png" alt-text="pie chart visual type.":::

The pie chart visual needs a minimum of two columns in the query result. By default, the first column is used as the color axis. This column can contain text, datetime, or numeric data types. Other columns will be used to determine the size of each slice and contain numeric data types. Pie charts are used for presenting a composition of categories and their proportions out of a total.

## Scatter chart

:::image type="content" source="media/dashboard-customize-visuals/scatter-chart.png" alt-text="scatter chart visual type.":::

In a scatter chart visual, the first column is the x-axis and should be a numeric column. Other numeric columns are y-axes. Scatter plots are used to observe relationships between variables.

## Time chart 

:::image type="content" source="media/dashboard-customize-visuals/time-chart.png" alt-text="time chart visual type.":::

A time chart visual is a type of line graph. the first column of the query is the x-axis, and should be datetime. Other numeric columns are y-axes. One string column values are used to group the numeric columns and create different lines in the chart. Other string columns are ignored. The time chart visual is similar to a [line chart](#line-chart) except the x-axis is always time.

## Anomaly chart 

:::image type="content" source="media/dashboard-customize-visuals/anomaly-chart.png" alt-text="anomaly chart visual type.":::

An anomaly chart visual is similar to [time chart](#time-chart), but highlights anomalies using the `series_decompose_anomalies` function.

## Map

:::image type="content" source="media/dashboard-customize-visuals/map.png" alt-text="map visual type.":::

To render the map visual, you must first select the type of location you're going to use.
Under **Define location by**, you can choose from the following options:

- Use two columns: Latitude and Longitude
- Use one column: Geospatial coordinates

In addition, you can specify the following options:

- Label column
- Size column: The integer values in this column are used to set the size of bubbles. The visual calculates the min and max values in the selected size column and then organizes sets the bubble size for all the other values in between.

Maps are useful to visualize data with geo coordinates. The Map visual also has a built-in zoom functionality.

## Funnel

:::image type="content" source="media/dashboard-customize-visuals/funnel.png" alt-text="Screenshot of the funnel map visual type.":::

To render the funnel visual, select a category column and value column.

Funnels are useful to visualize usage or acquisition data across different stages to evaluate the progress between one stage and the next one.

## Plotly (preview)

:::image type="content" source="media/dashboard-customize-visuals/plotly-scatter3d.png" alt-text="Screenshot of plotly visual type.":::

To render a Plotly visual, the query must generate a table with a single string cell containing [Plotly JSON](https://plotly.com/chart-studio-help/json-chart-schema/). This Plotly JSON string can be generated by one of the following methods:
* Dynamically create the string in Python using the [Plotly package](https://plotly.com/python/getting-started/). This process uses the [python() plugin](kusto/query/pythonplugin.md).
* Retrieve the string from a table that stores pre-cooked Plotly JSON templates. Update the required data fields using KQL string manipulation functions.

The following KQL query uses inline Python to create the 3D scatter chart above:

~~~kusto
OccupancyDetection
| project Temperature, Humidity, CO2, Occupancy
| where rand() < 0.1
| evaluate python(typeof(plotly:string),
```if 1:
    import plotly.express as px
    fig = px.scatter_3d(df, x='Temperature', y='Humidity', z='CO2', color='Occupancy')
    fig.update_layout(title=dict(text="Occupancy detection, plotly 5.11.0"))
    plotly_obj = fig.to_json()
    result = pd.DataFrame(data = [plotly_obj], columns = ["plotly"])
```)
~~~

> [!NOTE]
> For best performance, make sure that the python plugin image contains the latest versions of both the Python engine (currently 3.10.8) and Plotly package (currently 5.11.0). These versions can be checked with the [get_packages_version_fl()](kusto/functions-library/get-packages-version-fl.md) function. If you need to upgrade the image please contact us (shortly it would be self service).

Plotly visuals are useful for advanced charting including geographic, scientific, machine learning, 3d, animation and many other chart types. For more information, see [Plotly](https://plotly.com/python/).

## See also

* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)