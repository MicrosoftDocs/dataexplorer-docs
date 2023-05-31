---
ms.topic: include
ms.date: 12/14/2022
---

## Customize visuals

To make any changes in your dashboard, you'll first need to switch from viewing to editing mode.

1. On the top menu, select **Viewing** and toggle to **Editing** mode.

    :::image type="content" source="../media/dashboard-customize-visuals/enter-editing-mode.png" alt-text="Screenshot of entering editing mode in dashboards in Azure Data Explorer web UI.":::

1. Browse to the tile you wish to change. Select the **Edit** icon.

    :::image type="content" source="../media/dashboard-customize-visuals/edit-tile.png" alt-text="Screenshot of how to edit a tile in dashboards in Azure Data Explorer web UI.":::

1. Once you've finished making changes in the visual pane, select **Apply changes** to return to the dashboard and view your changes.

    :::image type="content" source="../media/dashboard-customize-visuals/save-changes-dashboard.png" alt-text="Screenshot of how to save the changes to your dashboard tile in Azure Data Explorer web UI.":::

### Select properties to customize visuals

Use the following properties to customize visuals.

:::image type="content" source="media/dashboard-customize-visuals/visual-customization-sidebar.png" alt-text="Visual customization sidebar.":::

|Section  |Description | Visual types
|---------|---------|-----|
|**General**    |    Select the **stacked** or **non stacked** chart format  | [Bar](../kusto/query/visualization-barchart.md), [Column](../kusto/query/visualization-columnchart.md), and [Area charts](../kusto/query/visualization-areachart.md) |
|**Data**    |   Select source data **Y and X Columns** for your visual. Keep the selection as **Infer** if you want the platform to automatically select a column based on the query result    |[Bar](../kusto/query/visualization-barchart.md), [Column](../kusto/query/visualization-columnchart.md), [Scatter](../kusto/query/visualization-scatterchart.md), and [Anomaly charts](../kusto/query/visualization-anomalychart.md)|
|**Legend**    |   Toggle to show or hide the display of legends on your visuals   |[Bar](../kusto/query/visualization-barchart.md), [Column](../kusto/query/visualization-columnchart.md), [Area](../kusto/query/visualization-areachart.md), [Line](../kusto/query/visualization-linechart.md), [Scatter](../kusto/query/visualization-scatterchart.md), [Anomaly chart](../kusto/query/visualization-anomalychart.md) and [Time charts](../kusto/query/visualization-timechart.md) |
|**Y Axis**     |   Allows customization of Y-Axis properties: <br>**Label**: Text for a custom label. <br>**Maximum Value**: Change the maximum value of the Y axis.  <br>**Minimum Value**: Change the minimum value of the Y axis.        |[Bar](../kusto/query/visualization-barchart.md), [Column](../kusto/query/visualization-columnchart.md), [Area](../kusto/query/visualization-areachart.md), [Line](../kusto/query/visualization-linechart.md), [Scatter](../kusto/query/visualization-scatterchart.md), [Anomaly](../kusto/query/visualization-anomalychart.md), and [Time charts](../kusto/query/visualization-timechart.md) |
|**X Axis**     |    Allows customization of X-axis properties. <br>**Label**: Text for a custom label.    | [Bar](../kusto/query/visualization-barchart.md), [Column](../kusto/query/visualization-columnchart.md), [Area](../kusto/query/visualization-areachart.md), [Line](../kusto/query/visualization-linechart.md), [Scatter](../kusto/query/visualization-scatterchart.md), [Anomaly](../kusto/query/visualization-anomalychart.md), and [Time charts](../kusto/query/visualization-timechart.md)|
|**Render links**     |    Toggle to make links that start with "https://" in tables, clickable. <br>**Apply on columns**: Select columns containing URL.   | [Table](../kusto/query/visualization-table.md)|
|**Layout**     |    Select the layout configuration for multi stat visual. <br>**Apply on columns**: Select columns containing URL.     | Multi stat|