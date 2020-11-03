---
title: Customize Azure Data Explorer dashboard visuals
description: Easily customize your Azure Data Explorer dashboard visuals
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 08/25/2020
---

# Customize Azure Data Explorer dashboard visuals

Visuals are essential part of any Azure Data Explorer Dashboard. This document details the different visual types and describes various options that are available to dashboard users to customize their visuals.

> [!NOTE]
> Visual customization is available in edit mode to dashboard editors.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## Types of visuals

Azure Data Explorer supports several different types of visuals. This section describes the different types of visuals and the data columns needed in your result set to plot these visuals.

### Table

:::image type="content" source="media/dashboard-customize-visuals/table.png" alt-text="table visual type":::

By default, results are shown as a table. The table visual is best for presenting detailed or complicated data.

### Bar chart

:::image type="content" source="media/dashboard-customize-visuals/bar-chart.png" alt-text="bar chart visual type":::

The bar chart visual needs a minimum of two columns in the query result. By default, the first column is used as the y-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the x-axis and contain numeric data types to be displayed as horizontal lines. Bar charts are used mainly for comparing numeric and nominal discrete values, where the length of each line represents its value.

### Column chart

:::image type="content" source="media/dashboard-customize-visuals/column-chart.png" alt-text="column chart visual type":::

The column chart visual needs a minimum of two columns in the query result. By default, the first column is used as the x-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the y-axis and contain numeric data types to be displayed as vertical lines. Column charts are used for comparing specific sub category items in a main category range, where the length of each line represents its value.

### Area chart

:::image type="content" source="media/dashboard-customize-visuals/area-chart.png" alt-text="area chart visual type":::

The area chart visual shows a time-series relationship. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Unlike line charts, area charts also visually represent volume. Area charts are ideal for indicating the change among different data sets.

### Line chart

:::image type="content" source="media/dashboard-customize-visuals/line-chart.png" alt-text="line chart visual type":::

The line chart visual is the most basic type of chart. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Line charts track changes over short and long periods of time. When smaller changes exist, line graphs are more useful than bar graphs.

### Stat

:::image type="content" source="media/dashboard-customize-visuals/stat.png" alt-text="stat visual type":::

The stat visual only shows one element. If there are multiple columns and rows in the output, stat shows the first element of the first column. Stat cards are useful to highlight KPIs on the Dashboard.

### Multi stat

:::image type="content" source="media/dashboard-customize-visuals/multistat.png" alt-text="multi stat visual type":::

The multi stat visual shows multiple stat cards in a group using a single query result. This requires 2 columns, one for the label and the other for the value. Users can use a visual formatting option to customize the the output layout for display by selecting the number of rows and columns. In addition to being more convenient, this formatting option will reduce cluster load where customers are using similar queries to build multiple stats.

### Pie chart

:::image type="content" source="media/dashboard-customize-visuals/pie-chart.png" alt-text="pie chart visual type":::

The pie chart visual needs a minimum of two columns in the query result. By default, the first column is used as the color axis. This column can contain text, datetime, or numeric data types. Other columns will be used to determine the size of each slice and contain numeric data types. Pie charts are used for presenting a composition of categories and their proportions out of a total.

### Scatter chart

:::image type="content" source="media/dashboard-customize-visuals/scatter-chart.png" alt-text="scatter chart visual type":::

In a scatter chart visual, the first column is the x-axis and should be a numeric column. Other numeric columns are y-axes. Scatter plots are used to observe relationships between variables.

### Time chart 

:::image type="content" source="media/dashboard-customize-visuals/time-chart.png" alt-text="time chart visual type":::

A time chart visual is a type of line graph. the first column of the query is the x-axis, and should be datetime. Other numeric columns are y-axes. One string column values are used to group the numeric columns and create different lines in the chart. Other string columns are ignored. The time chart visual is similar to a [line chart](#line-chart) except the x-axis is always time.

### Anomaly chart 

:::image type="content" source="media/dashboard-customize-visuals/anomaly-chart.png" alt-text="anomaly chart visual type":::

An anomaly chart visual is similar to [time chart](#time-chart), but highlights anomalies using the `series_decompose_anomalies` function.

### Map

:::image type="content" source="media/dashboard-customize-visuals/map.png" alt-text="map visual type":::

To render the map visual, four columns are needed in the query:
* String (first column) used for hover label
* Longitude (real)
* Latitude (real)
* Bubble size (int). This column can be constant one if different sizes aren't required.

Maps are useful to visualize data with geo coordinates. The Map visual also has a built-in zoom functionality.

## Customize visuals

1. Select **Edit** in dashboard menu to switch to edit mode.
1. To access the visual customization dialogue on a card, click the drop-down menu > **Edit Card**. Alternatively, when you create a new card using **Add Query**, select **Edit Card**.

:::image type="content" source="media/dashboard-customize-visuals/edit-card.png" alt-text="edit card for visual customization":::

### Select properties to customize visuals

Use the following properties to customize visuals.

:::image type="content" source="media/dashboard-customize-visuals/visual-customization-sidebar.png" alt-text="Visual customization sidebar":::

|Section  |Description | Visual types
|---------|---------|-----|
|**General**    |    Select the **stacked** or **non stacked** chart format  | Bar, Column, and Area charts |
|**Data**    |   Select **Y and X Columns** for your visual. Keep the selection as **Infer** if you want the platform to automatically select a column based on the query result    |Bar, Column, Scatter, and Anomaly charts|
|**Legend**    |   Toggle to show or hide the display of legends on your visuals   |Bar, Column, Area, Line, Scatter, Anomaly, and Time charts |
|**Y Axis**     |   Allows customization of Y-Axis properties: <ul><li>**Label**: Text for a custom label. </li><li>**Maximum Value**: Change the maximum value of the Y axis.  </li><li>**Minimum Value**: Change the minimum value of the Y axis.  </li></ul>      |Bar, Column, Area, Line, Scatter, Anomaly, and Time charts |
|**X Axis**     |    Allows customization of X-axis properties: <ul><li>**Label**: Text for a custom label. </li>     | Bar, Column, Area, Line, Scatter, Anomaly, and Time charts|
|**Render links**     |    Toggle to make links that start with "https://" in tables, clickable. <li>**Apply on columns**: Select columns containing URL. </li>     | Table|
|**Layout**     |    Select the layout configuration for multi stat visual <ul><li>**Apply on columns**: Select columns containing URL. </li>     | Multi stat|

## Next steps

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Query data in Azure Data Explorer](web-query-data.md) 
