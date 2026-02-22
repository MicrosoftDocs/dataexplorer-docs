---
title: Customize Azure Data Explorer Dashboard Visuals
description: Easily customize your Azure Data Explorer dashboard visuals
ms.reviewer: gabil
ms.topic: how-to
ms.date: 02/22/2026
---

# Customize Azure Data Explorer dashboard visuals

Azure Data Explorer dashboards are a collection of tiles that feature a visual representation supported by an underlying Kusto Query Language (KQL) query. This article explains how to edit the visualizations and queries of a dashboard tile and provides an overview of customization properties specific to each visualization type.

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

## Related content

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
