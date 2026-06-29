---
title: Customize Azure Data Explorer Dashboard Visuals
description: Easily customize your Azure Data Explorer dashboard visuals
ms.reviewer: mibar
ms.topic: how-to
ms.date: 05/31/2026
---

# Customize Azure Data Explorer dashboard visuals

Azure Data Explorer dashboards are a collection of tiles that feature a visual representation supported by an underlying Kusto Query Language (KQL) query. This article explains how to edit the visualizations and queries of a dashboard tile. It also provides an overview of customization properties specific to each visualization type.

All visualizations that you create in the context of the [render operator](/kusto/query/render-operator?view=azure-data-explorer&preserve-view=true#visualization) are available in dashboard visualizations. Along with these visualizations, you can use some [dashboard-specific visuals](dashboard-visuals.md).

## Prerequisites

Review Visualize data with Azure Data Explorer dashboards.

* Ensure that you have the editor permission on an Azure Data Explorer dashboard.
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* Editor permissions on an Azure Data Explorer dashboard

## Customize visuals

To make changes to your dashboard:

1. In the top menu, select **Viewing** and toggle to **Editing** mode.

    :::image type="content" source="media/dashboard-parameters/edit-dashboard.png" alt-text="Screenshot of entering editing mode in dashboards in Azure Data Explorer web UI.":::

1. On the tile that you want to customize, select the **Edit** icon. Edit the underlying query or the visualization properties.

    :::image type="content" source="media/dashboard-customize-visuals/edit-tile-button.png" alt-text="Screenshot of how to edit a tile in dashboards in Azure Data Explorer web UI.":::

1. Select **Apply changes** to save your changes and return to the dashboard.

    :::image type="content" source="media/dashboard-customize-visuals/save-changes.png" alt-text="Screenshot of how to save the changes to your dashboard tile in Azure Data Explorer web UI.":::

[!INCLUDE [customize-visuals](includes/customize-visuals.md)]

## Data series colors

Data series colors give you direct control over how colors are applied to your visuals. Instead of relying on automatic color assignments, assign specific colors to each data series to convey meaning and maintain consistency across your dashboards.

By using data series colors, you can:

* Assign colors directly to each data series.

* Override system defaults with intentional choices.

* Maintain color consistency across visuals and dashboards.

This feature is supported for the following visual types: Anomaly chart, Area chart, Bar chart, Column chart, Line chart, Pie chart, Scatter chart, and Time chart.

To configure data series colors:

1. In the top menu, select **Viewing** and toggle to **Editing** mode.

1. On the tile you want to customize, select the **Edit** icon.

1. In the **Visual** tab of the formatting pane, expand the **Data series colors** section.

1. Select a color for each data series in your visual.

1. Select **Apply changes** to save your settings.

:::image type="content" source="media/dashboard-customize-visuals/data-color-series.png" alt-text="Screenshot of dashboard showing data series colors configuration in the visuals side pane." lightbox="media/dashboard-customize-visuals/data-color-series.png":::

When you assign colors intentionally, viewers can interpret visuals at a glance without needing to read legends or labels. Consider using colors that align with your organization's standards or that naturally convey the meaning of each series, such as red for critical states or green for healthy metrics.

## Time series visual (Preview)

Use the Time series visual to display time-based data across multiple measures and categories. It plots numeric values over time, making it easier to identify trends, patterns, and anomalies.

### Create a Time series visual

> [!IMPORTANT]
> Ensure your data includes a timestamp column and at least one numeric value column to visualize trends over time.

To create and configure a Time series visual in your Azure Data Explorer dashboard:

1. In the top menu, select **Viewing** and toggle to **Editing** mode.

1. Select the **Edit** icon on the visual you want to customize.

1. In the **Visual formatting** pane, open **Visual type** and select **Time series**.

    :::image type="content" source="media/dashboard-customize-visuals/visual-type-list.png" alt-text="Screenshot of the Visualization pane showing the Time series option." lightbox="media/dashboard-customize-visuals/visual-type-list.png":::

1. In the **Data** section, configure the following properties:

    * **Time column (X-axis)**: Select the timestamp column that represents time intervals on the horizontal axis.

    * **Measured data (Y-axis)**: Select one or more numeric fields to plot over time on the vertical axis.

    * **Entities and Measures** (optional): Select categorical fields to group your data into multiple series.

    :::image type="content" source="media/dashboard-customize-visuals/data-configuration.png" alt-text="Screenshot of the time series configuration pane." lightbox="media/dashboard-customize-visuals/data-configuration.png":::

1. Customize your chart further by configuring properties such as:
    * **Y-axis scaling:**
        * Global (shared scale across charts)
        * Separate (independent scales per chart)
        * Adaptive (reduces the impact of outliers)

    * **Colors:** Assign colors from a palette or per series.

    * **Axis scale:** Switch between linear and logarithmic scale for different data distributions.

    * **Zoom behavior:** Enable pan and zoom for interactive exploration.

1. Select **Done** to save your settings and return to the dashboard.

1. In the visual on the dashboard, you can interact with the Time series visual to explore your data:
    * Use the **Entities and Measures** panel to control which data appears:
        * Search for a specific series by name.
        * Expand or collapse groups in the entity hierarchy.
        * Select or clear checkboxes to show or hide series.
        * Reorder series to control display and legend order.

        This selection doesn't modify the underlying query.

    * Adjust the time range using the timeline controls:
       * Drag the time slider to zoom in or out on specific intervals.
       * Enter start and end times to define a precise range.

       When multiple measures are displayed, all charts remain synchronized to the selected time range.

        :::image type="content" source="media/dashboard-customize-visuals/timeline.png" alt-text="Screenshot of the timeline controls in a Time series chart." lightbox="media/dashboard-customize-visuals/timeline.png":::

## Embed images

You can embed images in your dashboard tiles by using Markdown text.

For more information on GitHub Flavored Markdown, see [GitHub Flavored Markdown Spec](https://github.github.com/gfm/).

1. Open a [dashboard](azure-data-explorer-dashboards.md#create-a-new-dashboard).
1. In the top menu, select **+ Add** > **Add text** to open a text tile.

    :::image type="content" source="media/dashboard-customize-visuals/add-tile.png" alt-text="Screenshot of dashboard ribbon showing the dropdown menu of the Add button.":::

1. In the query pane, paste the URL of an image located in an image hosting service by using the following syntax:

    ```md
    ![](URL)
    ```

    The image renders in the tile's preview.

    :::image type="content" source="media/dashboard-customize-visuals/embed-image.png" alt-text="Screenshot of dashboard query pane showing image syntax in markdown text. ":::

1. In the top menu, select **Apply changes** to save the tile.

    :::image type="content" source="media/dashboard-customize-visuals/image.png" alt-text="Screenshot of dashboard query pane showing the rendered image. ":::

For more information on image syntax in GitHub Flavored Markdown, see [Images](https://github.github.com/gfm/#images).

## Related content

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
