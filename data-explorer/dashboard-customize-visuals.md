---
title: Customize Azure Data Explorer dashboard visuals
description: Easily customize your Azure Data Explorer dashboard visuals
ms.reviewer: gabil
ms.topic: how-to
ms.date: 11/16/2022
---

# Customize Azure Data Explorer dashboard visuals

Visuals are essential part of any Azure Data Explorer Dashboard. This document details different visual types and how to customize these visuals.

> [!NOTE]
> You must have dashboard editing permissions to customize dashboards.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## Types of visuals

Azure Data Explorer supports several different types of visuals. This section describes the different types of visuals and the data columns needed in your result set to plot these visuals.

### Table

:::image type="content" source="media/dashboard-customize-visuals/table.png" alt-text="table visual type.":::

By default, results are shown as a table. The table visual is best for presenting detailed or complicated data.

### Bar chart

:::image type="content" source="media/dashboard-customize-visuals/bar-chart.png" alt-text="bar chart visual type.":::

The bar chart visual needs a minimum of two columns in the query result. By default, the first column is used as the y-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the x-axis and contain numeric data types to be displayed as horizontal lines. Bar charts are used mainly for comparing numeric and nominal discrete values, where the length of each line represents its value.

### Column chart

:::image type="content" source="media/dashboard-customize-visuals/column-chart.png" alt-text="column chart visual type.":::

The column chart visual needs a minimum of two columns in the query result. By default, the first column is used as the x-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the y-axis and contain numeric data types to be displayed as vertical lines. Column charts are used for comparing specific sub category items in a main category range, where the length of each line represents its value.

### Area chart

:::image type="content" source="media/dashboard-customize-visuals/area-chart.png" alt-text="area chart visual type.":::

The area chart visual shows a time-series relationship. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Unlike line charts, area charts also visually represent volume. Area charts are ideal for indicating the change among different data sets.

### Line chart

:::image type="content" source="media/dashboard-customize-visuals/line-chart.png" alt-text="line chart visual type.":::

The line chart visual is the most basic type of chart. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Line charts track changes over short and long periods of time. When smaller changes exist, line graphs are more useful than bar graphs.

### Stat

:::image type="content" source="media/dashboard-customize-visuals/stat.png" alt-text="stat visual type.":::

The stat visual only shows one element. If there are multiple columns and rows in the output, stat shows the first element of the first column. Stat tiles are useful to highlight KPIs on the Dashboard.

### Multi stat

:::image type="content" source="media/dashboard-customize-visuals/multistat.png" alt-text="multi stat visual type.":::

The multi stat visual shows multiple stat tiles in a group using a single query result. This requires two columns, one for the label and the other for the value. Users can use a visual formatting option to customize the output layout for display by selecting the number of rows and columns. In addition to being more convenient, this formatting option will reduce cluster load where customers are using similar queries to build multiple stats.

### Pie chart

:::image type="content" source="media/dashboard-customize-visuals/pie-chart.png" alt-text="pie chart visual type.":::

The pie chart visual needs a minimum of two columns in the query result. By default, the first column is used as the color axis. This column can contain text, datetime, or numeric data types. Other columns will be used to determine the size of each slice and contain numeric data types. Pie charts are used for presenting a composition of categories and their proportions out of a total.

### Scatter chart

:::image type="content" source="media/dashboard-customize-visuals/scatter-chart.png" alt-text="scatter chart visual type.":::

In a scatter chart visual, the first column is the x-axis and should be a numeric column. Other numeric columns are y-axes. Scatter plots are used to observe relationships between variables.

### Time chart 

:::image type="content" source="media/dashboard-customize-visuals/time-chart.png" alt-text="time chart visual type.":::

A time chart visual is a type of line graph. the first column of the query is the x-axis, and should be datetime. Other numeric columns are y-axes. One string column values are used to group the numeric columns and create different lines in the chart. Other string columns are ignored. The time chart visual is similar to a [line chart](#line-chart) except the x-axis is always time.

### Anomaly chart 

:::image type="content" source="media/dashboard-customize-visuals/anomaly-chart.png" alt-text="anomaly chart visual type.":::

An anomaly chart visual is similar to [time chart](#time-chart), but highlights anomalies using the `series_decompose_anomalies` function.

### Map

:::image type="content" source="media/dashboard-customize-visuals/map.png" alt-text="map visual type.":::

To render the map visual, you must first select the type of location you're going to use.
Under **Define location by**, you can choose from the following options:

- Use two columns: Latitude and Longitude
- Use one column: Geospatial coordinates

In addition, you can specify the following options:

- Label column
- Size column: The integer values in this column are used to set the size of bubbles. The visual calculates the min and max values in the selected size column and then organizes sets the bubble size for all the other values in between.

Maps are useful to visualize data with geo coordinates. The Map visual also has a built-in zoom functionality.

### Funnel

:::image type="content" source="media/dashboard-customize-visuals/funnel.png" alt-text="Screenshot of the funnel map visual type.":::

To render the funnel visual, select a category column and value column.

Funnels are useful to visualize usage or acquisition data across different stages to evaluate the progress between one stage and the next one.

## Customize visuals

To make any changes in your dashboard, you'll first need to switch from viewing to editing mode. 
1. On the top menu, select **Viewing** and toggle to **Editing** mode.

    :::image type="content" source="media/dashboard-customize-visuals/enter-editing-mode.png" alt-text="Screenshot of entering editing mode in dashboards in Azure Data Explorer web UI.":::

1. Browse to the tile you wish to change. Select the **Edit** icon 

    :::image type="content" source="media/dashboard-customize-visuals/edit-tile.png" alt-text="Screenshot of how to edit a tile in dashboards in Azure Data Explorer web UI.":::

1. Once you've finished making changes in the visual pane, select **Apply changes** to return to the dashboard and view your changes.

    :::image type="content" source="media/dashboard-customize-visuals/save-changes-dashboard.png" alt-text="Screenshot of how to save the changes to your dashboard tile in Azure Data Explorer web UI.":::

### Select properties to customize visuals

Use the following properties to customize visuals.

:::image type="content" source="media/dashboard-customize-visuals/visual-customization-sidebar.png" alt-text="Visual customization sidebar.":::

|Section  |Description | Visual types
|---------|---------|-----|
|**General**    |    Select the **stacked** or **non stacked** chart format  | Bar, Column, and Area charts |
|**Data**    |   Select **Y and X Columns** for your visual. Keep the selection as **Infer** if you want the platform to automatically select a column based on the query result    |Bar, Column, Scatter, and Anomaly charts|
|**Legend**    |   Toggle to show or hide the display of legends on your visuals   |Bar, Column, Area, Line, Scatter, Anomaly, and Time charts |
|**Y Axis**     |   Allows customization of Y-Axis properties: <ul><li>**Label**: Text for a custom label. </li><li>**Maximum Value**: Change the maximum value of the Y axis.  </li><li>**Minimum Value**: Change the minimum value of the Y axis.  </li></ul>      |Bar, Column, Area, Line, Scatter, Anomaly, and Time charts |
|**X Axis**     |    Allows customization of X-axis properties. <li>**Label**: Text for a custom label. </li>     | Bar, Column, Area, Line, Scatter, Anomaly, and Time charts|
|**Render links**     |    Toggle to make links that start with "https://" in tables, clickable. <li>**Apply on columns**: Select columns containing URL. </li>     | Table|
|**Layout**     |    Select the layout configuration for multi stat visual. <li>**Apply on columns**: Select columns containing URL. </li>     | Multi stat|

### Conditional formatting

> [!NOTE]
> This feature is supported for table, stat and multi stat visuals.

Conditional formatting is used to format the visual data points by their values using colors, tags, and icons.  Conditional formatting can be applied to a specific set of cells in a predetermined column or to entire rows.
Each visual can have one or more conditional formatting rules defined. When multiple rules conflict, the last rule will override previous rules.

1. Enter the editing mode of the table, stat, or multi stat visual you wish to conditionally format.
1. In the **Visual formatting** pane, scroll to the bottom and toggle **Conditional formatting** to **Show**.
    
    :::image type="content" source="media/dashboard-customize-visuals/add-conditional-formatting.png" alt-text="Screenshot of adding conditional formatting in dashboards in Azure Data Explorer web UI.":::

1. Select **Add rule**. A new rule appears with default values.

    :::image type="content" source="media/dashboard-customize-visuals/edit-new-rule.png" alt-text="Screenshot of editing new rule in dashboards in Azure Data Explorer.":::

1. Select the **Edit** icon. 
1. For each rule you can define a name in the **Rule name** control. In case you don't define a rule name the default rule name would be the selected column with some other properties of the rule.
In the formatting section of each rule, you can define the formatting of the data points. The formatting can be applied to an entire row or to a specific column.

#### Color by condition

Select **Column** to set the condition column, **Operator** to set the operator and **Value** to define the value of the rule.
You can define another rule using the **+Add condition** option. The second condition can use the column selected in the first condition or any other column.
In the formatting section, select **Apply options** to apply the formatting to entire rows or to cells in a specific column. When selecting **Apply to rows**, you can format only the color of the row. When selecting **Apply to cells** once can set the color, tag and icon to a specific cell in a defined column. with this option it's also possible to hide the text of the column.

#### Color by value

Select **Column** to set the rule column and **column** to select the column use for coloring the visual.
In case the column selected is of numeric type, the **Theme** definition will be enabled. The theme is applied according to the range of values in the selected column. The min and max values of the value range are either retrieved by default from the selected column or explicitly defined in the **Min value** and **Max value** controls.
In case the column selected is nonnumeric, selecting the theme is disabled and the colors are set by the rule automatically according to the values in the selected column.
Select **Apply options** to apply the formatting to entire rows or to cells in a specific column. 

## Next steps

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Query data in Azure Data Explorer](web-query-data.md) 
