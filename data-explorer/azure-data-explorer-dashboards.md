---
title: Visualize data with the Azure Data Explorer dashboard
description: Learn how to visualize data with the Azure Data Explorer dashboard
ms.reviewer: gabil
ms.topic: how-to
ms.date: 08/25/2025
---

# Visualize data with Azure Data Explorer dashboards

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Explore your data from end-to-end in the Azure Data Explorer web application, starting with [data ingestion](ingest-data-overview.md), running [queries](web-query-data.md), and ultimately building dashboards.

A dashboard is a collection of tiles, optionally organized in pages, where each tile has an underlying query and a visual representation. Using the web UI, you can natively export Kusto Query Language (KQL) queries to a dashboard as visuals and later modify their underlying queries and visual formatting as needed. In addition to ease of data exploration, this fully integrated Azure Data Explorer dashboard experience provides improved query and visualization performance.

> [!IMPORTANT]
> Your data is secure. Dashboards and dashboard-related metadata about users are encrypted at rest using Microsoft-managed keys.

The following image shows a sample Azure Data Explorer dashboard:

:::image type="content" source="media/adx-dashboards/dash.png" alt-text="Screenshot showing an Azure Data Explorer web UI dashboard." lightbox="media/adx-dashboards/dash.png":::

To interactively explore sample dashboards, see [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Create [an Azure Data Explorer cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a new dashboard

1. In the navigation bar, select **Dashboards** > **New dashboard**.

    :::image type="content" source="media/adx-dashboards/new-dashboard.png" alt-text="New dashboard.":::

1. Enter a dashboard name and select **Create**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-popup.png" alt-text="Create a dashboard.":::

## Add data source

A single dashboard can show visuals from one or more clusters.

1. In the upper toolbar, select **Data sources**.

    :::image type="content" source="media/adx-dashboards/data-source.png" alt-text="Screenshot of adding a data source through the more menu.":::

1. In the **Data sources** pane, select **+ Add**.
1. In the **Create new data source** pane:
    1. Enter a **Data source name**.
    1. Enter the **Cluster URI** region and then select **Connect**.
    1. Select the **Database** from the dropdown list.
    1. Enter a value for  **Query results cache max age** to enable query results cache on all queries of this data source. The max age can be in units of seconds, hours, or days.
    1. Select **Create**.

    :::image type="content" source="media/adx-dashboards/data-source-pane.png" alt-text="Data source pane.":::

## Add tile

Dashboard tiles use Kusto Query Language snippets to retrieve data and render visuals. Each tile/query can support a single visual.

1. Select **Add tile** from the dashboard canvas or the upper toolbar.

    :::image type="content" source="media/adx-dashboards/add-tile.png" alt-text="New query.":::

1. In the **Query** pane,
    1. Select the data source from the dropdown menu.
    1. Type the query, and the select **Run**. For more information about generating queries that use parameters, see [Use parameters in your query](dashboard-parameters.md#use-parameters-in-your-query).

         :::image type="content" source="media/adx-dashboards/run-query.png" alt-text="Execute query.":::

    1. Select **Visual**.
    1. In the visual pane, select **Visual type** to choose the type of visual.
    1. Select **Apply changes** to pin the visual to the dashboard.

    :::image type="content" source="media/adx-dashboards/visual.png" alt-text="Add visual to query.":::

1. You can resize the visual and then select the **Save** icon.

    :::image type="content" source="media/adx-dashboards/resize-and-save.png" alt-text="Resize and save dashboard.":::

## Pin tile from query

You can also pin a query from the [query tab of the web UI](web-query-data.md).

To pin a query:

1. Create and run the query whose output you want to visualize in the dashboard.
1. Select **Share** > **Pin to dashboard**.
1. In the **Pin to dashboard** pane:
    1. Provide a **Tile name**.
    1. The **Data source name** is auto populated from the query data source.
    1. Select **Use existing data source if possible**.
    1. Select **Create new**.
    1. Enter **Dashboard name**.
    1. Select the **View dashboard after creation** checkbox (if it's a new dashboard).
    1. Select **Pin**

    :::image type="content" source="media/web-query-data/pin-to-dashboard.png" alt-text="Screenshot of the Pin to dashboard pane.":::

## Use parameters

Parameters significantly improve dashboard rendering performance, and enable you to use filter values as early as possible in the query. Filtering is enabled when the parameter is included in the query associated with a tile. For more information about how to set up and use different kinds of parameters, see [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md).

## Tile legend

You can change the position of the legend in your tiles and use the legend to interact with the data.

### Change the legend location

If you have edit rights on a dashboard, you can change the location of the legend in your tile. Toggle to **Edit** mode and select the **Edit tile** pencil icon. In the **Visual formatting** pane, under **Legend**, you can select your location preference.

:::image type="content" source="media/adx-dashboards/legend.png" alt-text="Screenshot of the legend settings in the Visual Formatting pane":::


### Interact with your data

You can use the legend to interact with the data in your tile. You can change what data you view by selecting the specific item in the legend. Use <kbd>Ctrl</kbd> to add or remove items from the selection, hold <kbd>shift</kbd> to select a range. Items not selected are greyed out.

The **Search** button allows you to search and filter items.

Use the **Invert** button to invert your selection.

The **Up** and **Down** arrows navigate through the list in the following ways:
* When one item is selected, the up and down arrows select the previous or next item.
* When more than one item is selected, the up and down arrows change which item is highlighted on the tile. 

:::image type="content" source="media/adx-dashboards/interactive-tile.png" alt-text="Screenshot showing the buttons to use the legend to interact with your data.":::

## View query

You can view the query in either editing or viewing mode. Editing the underlying query of a tile is only possible in editing mode. In viewing mode, you can modify the query in a new query tab, without changing the underlying query of the dashboard tile.

1. Browse to your dashboard.
1. On the tile you want to explore, select the **More menu [...]** > **View query**.

:::image type="content" source="media/adx-dashboards/view-query.png" alt-text="Screenshot of the tile's dropdown menu with the View query option highlighted.":::

1. In the **View Area** pane, select **New query tab** to edit the query in the [Azure Data Explorer web UI query pane](web-ui-query-overview.md). To edit the query within the tile, select the **Edit tile** button.

:::image type="content" source="media/adx-dashboards/edit-query-pane.png" alt-text="Screenshot of view query pane with the query in the top half of the screen and results in the bottom half.":::

> [!NOTE]
> Any edits made to the query using this flow won't be reflected in the original dashboard.

## Export dashboards

Use the file menu to export a dashboard to a JSON file. Exporting dashboard can be useful in the following scenarios:

* **Version control**: You can use the file to restore the dashboard to a previous version.
* **Dashboard template**: You can use the file as template for creating new dashboards.
* **Manual editing**: You can edit the file to modify the dashboard. The file can be imported back to the dashboard.

To export a dashboard, in the upper toolbar, select **File** > **Download dashboard to file**.

:::image type="content" source="media/adx-dashboards/export-dashboard.png" alt-text="Screenshot of dashboard, showing the export to file option.":::

The file contains the dashboard data in JSON format, an outline of which is shown in the following snippet.

```json
{
  "id": "{GUID}",
  "eTag": "{TAG}",
  "title": "Dashboard title",
  "tiles": [
    {
      "id": "{GUID}",
      "title": "Tile title",
      "query": "{QUERY}",
      "layout": { "x": 0, "y": 7, "width": 6, "height": 5 },
      "pageId": "{GUID}",
      "visualType": "line",
      "dataSourceId": "{GUID}",
      "visualOptions": {
        "xColumn": { "type": "infer" },
        "yColumns": { "type": "infer" },
        "yAxisMinimumValue": { "type": "infer" },
        "yAxisMaximumValue": { "type": "infer" },
        "seriesColumns": { "type": "infer" },
        "hideLegend": false,
        "xColumnTitle": "",
        "yColumnTitle": "",
        "horizontalLine": "",
        "verticalLine": "",
        "xAxisScale": "linear",
        "yAxisScale": "linear",
        "crossFilterDisabled": false,
        "crossFilter": { "dimensionId": "dragX-timeRange", "parameterId": "{GUID}" },
        "multipleYAxes": {
          "base": { "id": "-1", "columns": [], "label": "", "yAxisMinimumValue": null, "yAxisMaximumValue": null, "yAxisScale": "linear", "horizontalLines": [] },
          "additional": []
        },
        "hideTileTitle": false
      },
      "usedParamVariables": [ "{PARAM}" ]
    }
  ],
  "dataSources": [ {} ],
  "$schema": "https://dataexplorer.azure.com/static/d/schema/20/dashboard.json",
  "autoRefresh": { "enabled": true, "defaultInterval": "15m", "minInterval": "5m" },
  "parameters": [ {} ],
  "pages": [ { "name": "Primary", "id": "{GUID}" } ],
  "schema_version": "20"
}
```

### To create new dashboard from a file

You can use a dashboard file to create a new dashboard, as follows:

1. In the main **Dashboards** page, select **New dashboard** > **Import dashboard from file**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-from-file.png" alt-text="Screenshot of dashboard, showing the import from file option.":::

1. Select the file to import.
1. Enter a dashboard name, and then select **Create**.

### To update or restore an existing dashboard from a file

You can update an existing dashboard, or restore a previous version, as follows:

1. In the upper toolbar, select **File** > **Replace dashboard with file**.

    :::image type="content" source="media/adx-dashboards/existing-dashboard-from-file.png" alt-text="Screenshot of dashboard, showing the option to replace with file.":::

1. Select the file to update the dashboard.
1. Select **Save changes**.

## Add page

Pages are optional containers for tiles. You can use pages to organize tiles into logical groups, such as by data source or by subject area. You can also use pages to create a dashboard with multiple views, such as a dashboard with a drillthrough from a summary page to a details page.

1. On the left **Pages** pane, select **+ Add page**.

:::image type="content" source="media/adx-dashboards/add-page.png" alt-text="Screenshot of the add page button.":::

1. To name the page, select the vertical **More menu [...]** > **Rename page**.

1. [Add tiles](#add-tile) to the page.

## Enable Auto Refresh

Auto refresh keeps your dashboard data up-to-date without requiring manual updates. Database editors can configure a default refresh rate and set a minimum refresh interval to manage cluster load. Dashboard viewers can adjust the refresh rate within the allowed range to suit their needs.

1. In the upper toolbar, select **Settings** > **Auto refresh**.

    :::image type="content" source="media/adx-dashboards/auto-refresh.png" alt-text="Select auto refresh.":::

1. Toggle the option so auto refresh is **Enabled**.
1. Select values for **Minimum time interval** and **Default refresh rate**.
1. Select **Apply** and then **Save** the dashboard.

    :::image type="content" source="media/adx-dashboards/enable-auto-refresh.png" alt-text="Screenshot showing enable auto refresh.":::

## Related content

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
* [Explore data in dashboard tiles (preview)](dashboard-explore-data.md)
* [Share dashboards](azure-data-explorer-dashboard-share.md)