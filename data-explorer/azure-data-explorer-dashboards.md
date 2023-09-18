---
title: Visualize data with the Azure Data Explorer dashboard
description: Learn how to visualize data with the Azure Data Explorer dashboard
ms.reviewer: gabil
ms.topic: how-to
ms.date: 05/16/2023
---

# Visualize data with Azure Data Explorer dashboards 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Explore your data from end-to-end in the Azure Data Explorer web application, starting with [data ingestion](ingest-data-wizard.md), running [queries](web-query-data.md), and ultimately building dashboards. 

A dashboard is a collection of tiles, optionally organized in pages, where each tile has an underlying query and a visual representation. Using the web UI, you can natively export Kusto Query Language (KQL) queries to a dashboard as visuals and later modify their underlying queries and visual formatting as needed. In addition to ease of data exploration, this fully integrated Azure Data Explorer dashboard experience provides improved query and visualization performance.

> [!IMPORTANT]
> Your data is secure. Dashboards and dashboard-related metadata about users are encrypted at rest using Microsoft-managed keys.

The following image shows a sample Azure Data Explorer dashboard:

:::image type="content" source="media/adx-dashboards/dash.png" alt-text="Screenshot showing an Azure Data Explorer web UI dashboard." lightbox="media/adx-dashboards/dash.png":::

To interactively explore sample dashboards, see [Quickstart: Visualize sample data dashboards](web-ui-samples-dashboards.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Create [an Azure Data Explorer cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a new dashboard

1. In the navigation bar, select **Dashboards** > **New dashboard**.

    :::image type="content" source="media/adx-dashboards/new-dashboard.png" alt-text="New dashboard.":::

1. Enter a dashboard name and select **Create**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-popup.png" alt-text="Create a dashboard.":::

## Add data source

A single dashboard can show visuals from one or more clusters.

1. Select the **More menu** [...] > **Data sources**

    :::image type="content" source="media/adx-dashboards/data-source-more-menu.png" alt-text="Screenshot of adding a data source through the more menu.":::

1. In the **Data sources** pane, select **+ New data source**.
1. In the **Create new data source** pane:
    1. Enter a **Data source name**.
    1. Enter the **Cluster URI** region and then select **Connect**.
    1. Select the **Database** from the drop-down list.
    1. Enter a value for  **Query results cache max age** to enable query results cache on all queries of this data source. The max age can be in units of seconds, hours, or days.
    1. Select **Create**.

    :::image type="content" source="media/adx-dashboards/data-source-pane.png" alt-text="Data source pane.":::

## Add tile

Dashboard tiles use Kusto Query Language snippets to retrieve data and render visuals. Each tile/query can support a single visual.

1. Select **Add tile** from the dashboard canvas or the top menu bar.

    :::image type="content" source="media/adx-dashboards/empty-dashboard-new-query.png" alt-text="New query.":::

1. In the **Query** pane,
    1. Select the data source from the drop-down menu.
    1. Type the query, and the select **Run**. For more information about generating queries that use parameters, see [Use parameters in your query](dashboard-parameters.md#use-parameters-in-your-query).

    1. Select **Visual**.

    :::image type="content" source="media/adx-dashboards/initial-query.png" alt-text="Execute query.":::

1. In the visual tab, select **Visual type** to choose the type of visual.
1. Select **Apply changes** to pin the visual to the dashboard.

    :::image type="content" source="media/adx-dashboards/add-visual.png" alt-text="Add visual to query.":::

1. You can resize the visual and then select the **Save** icon.

    :::image type="content" source="media/adx-dashboards/save-dashboard.png" alt-text="save dashboard.":::

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

Parameters significantly improve dashboard rendering performance, and enable you to use filter values as early as possible in the query. Filtering is enabled when the parameter is included in the query associated with your tile(s).  For more information about how to set up and use different kinds of parameters, see [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md).

## Share dashboards

Use the share menu to [grant permissions](#grant-permissions) for an Azure Active Directory (Azure AD) user or Azure AD group to access the dashboard, [change a user's permission level](#change-a-user-permission-level), and [share the dashboard link](#share-the-dashboard-link).

> [!IMPORTANT]
> To access the dashboard, a dashboard viewer needs the following:
>
> * Dashboard link for access
> * Dashboard permissions
> * Access to the underlying database in the Azure Data Explorer cluster

### Manage permissions

1. Select the **Share** menu item in the top bar of the dashboard.
1. Select **Manage permissions** from the drop-down.

    :::image type="content" source="media/adx-dashboards/share-dashboard.png" alt-text="Share dashboard drop-down.":::

### Grant permissions

To grant permissions to a user in the **Dashboard permissions** pane:
 
1. Enter the Azure AD user or Azure AD group in **Add new members**.
1. In the **Permission** level, select one of the following values: **Can view** or **Can edit**.
1. Select **Add**.

:::image type="content" source="media/adx-dashboards/dashboard-permissions.png" alt-text="Manage dashboard permissions.":::

### Change a user permission level

To change a user permission level in the **Dashboard permissions** pane:

1. Either use the search box or scroll the user list to find the user.
1. Change the **Permission** level as needed.

### Share the dashboard link

To share the dashboard link, do one of the following:

* Select **Share** and then select **Copy link**
* In the **Dashboard permissions** window, select **Copy link**.

## Export dashboards

Use the file menu to export a dashboard to a JSON file. Exporting dashboard can be useful in the following scenarios:

* **Version control**: You can use the file to restore the dashboard to a previous version.
* **Dashboard template**: You can use the file as template for creating new dashboards.
* **Manual editing**: You can edit the file to modify the dashboard. The file can be imported back to the dashboard.

To export a dashboard, in the dashboard, select **File** > **Export to file**.

:::image type="content" source="media/adx-dashboards/export-dashboard-file.png" alt-text="Screenshot of dashboard, showing the export to file option.":::

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

1. In the main dashboard page, select **New dashboard** > **Import from file**.

    :::image type="content" source="media/adx-dashboards/import-dashboard-file.png" alt-text="Screenshot of dashboard, showing the import from file option.":::

1. Select the file to import.
1. Enter a dashboard name, and then select **Create**.

### To update or restore an existing dashboard from a file

You can update an existing dashboard, or restore a previous version, as follows:

1. In the dashboard, select **File** > **Replace with file**.

    :::image type="content" source="media/adx-dashboards/replace-dashboard-file.png" alt-text="Screenshot of dashboard, showing the option to replace with file.":::

1. Select the file to update the dashboard.
1. Select **Save changes**.

## Enable auto refresh

Auto refresh is a feature that allows you to automatically update the data on a dashboard without manually reloading the page or clicking a refresh button.

The default auto refresh rate can be set by a database editor. Both editors and viewers can change the actual rate of auto refresh while viewing a dashboard. 

:::image type="content" source="media/adx-dashboards/auto-refresh-times.png" alt-text="Screenshot of the different time intervals available in auto refresh in dashboards.":::

However, database editors may want to limit the minimum refresh rate that any viewer can set so as to reduce the cluster load. When the minimum refresh rate is set, database users can't set a refresh rate lower than the minimum.

1. Select the **More menu [...]** > **Auto refresh**.

    :::image type="content" source="media/adx-dashboards/auto-refresh.png" alt-text="Select auto refresh.":::

1. Toggle the option so auto refresh is **Enabled**.
1. Select values for **Minimum time interval** and **Default refresh rate**.

    :::image type="content" source="media/adx-dashboards/auto-refresh-toggle.png" alt-text="Enable auto refresh.":::

1. Select **Apply** and then **Save** the dashboard.

## Next Steps

* Get data with the [ingestion wizard](ingest-data-wizard.md)
* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
