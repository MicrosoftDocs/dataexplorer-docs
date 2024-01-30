---
title: Customize Azure Data Explorer dashboard visuals
description: Easily customize your Azure Data Explorer dashboard visuals
ms.reviewer: gabil
ms.topic: how-to
ms.date: 01/30/2024
---

# Customize Azure Data Explorer dashboard visuals

Azure Data Explorer dashboards are a collection of tiles that feature a visual representation supported by an underlying Kusto Query Language (KQL) query. This article explains how to edit the visualizations and queries of a dashboard tile and provides an overview of customization properties specific to each visualization type.

All visualizations that are created in the context of the [render operator](kusto/query/render-operator.md#visualization) are available in dashboard visualizations, along with some [dashboard-specific visuals](dashboard-visuals.md).

## Prerequisites

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* Editor permissions on an Azure Data Explorer dashboard

## Customize visuals

To make changes in your dashboard:

1. In the top menu, select **Viewing** and toggle to **Editing** mode.

    :::image type="content" source="media/dashboard-customize-visuals/enter-editing-mode.png" alt-text="Screenshot of entering editing mode in dashboards in Azure Data Explorer web UI.":::

1. On the tile that you'd like to customize, select the **Edit** icon. Edit the underlying query or the visualization properties.

    :::image type="content" source="media/dashboard-customize-visuals/edit-tile.png" alt-text="Screenshot of how to edit a tile in dashboards in Azure Data Explorer web UI.":::

1. To save your changes and return to the dashboard, select **Apply changes**.

    :::image type="content" source="media/dashboard-customize-visuals/save-changes-dashboard.png" alt-text="Screenshot of how to save the changes to your dashboard tile in Azure Data Explorer web UI.":::

[!INCLUDE [customize-visuals](includes/customize-visuals.md)]

## Imbed images

You can imbed images in your dashboard tiles using Markdown text.

For more information on GitHub Flavored Markdown, see [GitHub Flavored Markdown Spec](https://github.github.com/gfm/).

### Copy image URL

1. Open your desired image in your browser of choice.
1. Copy the image URL and paste it somewhere, like a notepad, to use in a later step.

### Imbed image in dashboard

1. Open a [dashboard](azure-data-explorer-dashboards.md#create-a-new-dashboard).
1. In the top menu, select **+Add** > **Add text** to open a text tile.

    :::image type="content" source="media/dashboard-customize-visuals/add-tile.png" alt-text="Screenshot of dashboard ribbon showing the drop-down menu of the Add button.":::

1. In the query pane, paste the [image URL](#copy-image-url) that you copied in a previous step using the following syntax:

    ```md
    ![](URL)
    ```

    The image renders in the tile's preview.

    :::image type="content" source="media/dashboard-customize-visuals/imbed-image.png" alt-text="Screenshot of dashboard query pane showing image syntax in markdown text. ":::

1. In the top menu, select **Apply changes** to save the tile.

For more information on image syntax in GitHub Flavored Markdown, see [Images](https://github.github.com/gfm/#images).

## Related content

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
