---
title: Add a Query Visualization in the Web UI - Azure Data Explorer
description: Learn how to add a query visualization in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: how-to
ms.date: 04/12/2026
---
# Add and modify a query visualization in the web UI

In this article, you learn how to create and customize visuals from query results by using the UI, such as the one found in Azure Data Explorer Dashboards. You can further manipulate these visuals and pin them in a [dashboard](azure-data-explorer-dashboards.md). You don't need to rerun the query to add or modify these visuals. This feature is especially useful for heavy queries.

For a full list of available visuals, see [Visualization](/kusto/query/render-operator?view=azure-data-explorer&preserve-view=true#visualization). For visuals that are only available in the web UI or dashboards, see [Dashboard-specific visuals](dashboard-visuals.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. You don't need an Azure subscription.
* An Azure Data Explorer cluster and database. Use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-and-database.md).

## Add a visual to a query

1. [Run a query](web-ui-query-overview.md#write-and-run-queries) in the Azure Data Explorer web UI. For example, you can use the following query:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLElVsLVVUPd29At2DFYHyhSX5uYmFmVWpYJYGi6JuYnpqQFF+QWpRSWVmgpJlQpgM0IqC1IBD28nVFIAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | where State == 'KANSAS'
    | summarize sum(DamageProperty) by EventType
    ```

1. In the results grid, select **+ Add visual**.

    :::image type="content" source="media/add-query-visualization/add-visual.png" alt-text="Screenshot of query results with add visual button highlighted in a red box.":::

    A pane opens on the right side, with the **Visual Formatting** tab selected.

1. Select the **Visual type** from the dropdown. For a list of available visualizations, see [Visualizations](/kusto/query/render-operator?view=azure-data-explorer&preserve-view=true#visualization). 

    :::image type="content" source="media/add-query-visualization/select-visual-type.png" alt-text="Screenshot of visual type dropdown in Azure Data Explorer web UI.":::

[!INCLUDE [customize-visuals](includes/customize-visuals.md)]

## Change an existing visualization

Use the visual formatting pane to change an existing visualization.

### Visual created with UI

If you add a visual through the UI, you can change this visual by selecting the **Edit visual** tab in the results grid.

:::image type="content" source="media/add-query-visualization/edit-visual.png" alt-text="Screenshot of edit visual tab in the results grid in Azure Data Explorer web UI.":::

### Visual created in query

If you create a visual by using the [render operator](/kusto/query/render-operator?view=azure-data-explorer&preserve-view=true), select **Visual** in the results grid to edit the visual.

:::image type="content" source="media/add-query-visualization/change-rendered-visual.png" alt-text="Screenshot of rendered visual as a bar chart that has been changed to a column chart in the visual formatting pane in Azure Data Explorer web UI." lightbox="media/add-query-visualization/change-rendered-visual.png":::

> [!IMPORTANT]
> The visual formatting pane changes the visual representation, but doesn't modify the original query.

## Pin to dashboard

After you format your visual, pin it to a new or existing dashboard.

1. From the visual formatting pane, select **Pin to dashboard**.

    :::image type="content" source="media/add-query-visualization/pin-to-dashboard.png" alt-text="Screenshot of pin to dashboard tab in Azure Data Explorer web UI.":::

1. The pin to dashboard dialog opens. Enter a **Tile name** for this visual and select a new or existing dashboard.

    :::image type="content" source="media/add-query-visualization/pin-to-dashboard-menu.png" alt-text="Screenshot of dialog for pinning visual to dashboard in Azure Data Explorer web UI.":::

1. Select **Pin**.

## Related content

* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
