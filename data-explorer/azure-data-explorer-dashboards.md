---
title: Visualize data with the Azure Data Explorer dashboard
description: Learn how to visualize data with the Azure Data Explorer dashboard
ms.reviewer: gabil
ms.topic: how-to
ms.date: 01/31/2023
---

# Visualize data with Azure Data Explorer dashboards (Preview)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer provides a web application that enables you to run queries and build dashboards. Dashboards are available in the stand-alone web application, the [Azure Data Explorer web UI](web-query-data.md). Azure Data Explorer is also integrated with other dashboard services like [Power BI](power-bi-data-connector.md?tabs=connector) and [Grafana](grafana.md).

Azure Data Explorer dashboards provide three main advantages:

* Natively export queries from the Azure Data Explorer web UI to Azure Data Explorer dashboards.
* Explore the data in the Azure Data Explorer web UI.
* Optimized dashboard rendering performance.

The following image depicts an Azure Data Explorer dashboard.

:::image type="content" source="media/adx-dashboards/dash.png" alt-text="Screenshot showing an Azure Data Explorer web UI dashboard.":::

> [!IMPORTANT]
> Your data is secure. Dashboards and dashboard-related metadata about users is encrypted at rest using Microsoft-managed keys.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a dashboard

You can create a dashboard in the Azure Data Explorer web UI using the following steps. Alternatively, you can create a dashboard by [importing a dashboard file](#to-create-new-dashboard-from-a-file).

1. In the navigation bar, select **Dashboards (Preview)** and then select **New dashboard**.

    :::image type="content" source="media/adx-dashboards/new-dashboard.png" alt-text="New dashboard.":::

1. Enter a dashboard name and then select **Create**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-popup.png" alt-text="Create a dashboard.":::

## Add data source

Add a data source for the dashboard.

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

## Use Parameters

Parameters significantly improve dashboard rendering performance, and enable you to use filter values as early as possible in the query. Filtering is enabled when the parameter is included in the query associated with your tile(s).  For more information about how to set up and use different kinds of parameters, see [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md).

1. Select **Parameters** on the top bar.
1. Select the **+ New parameter** button in the **Parameters** pane.

    :::image type="content" source="media/adx-dashboards/parameters.png" alt-text="Select new parameter.":::

1. Enter values for all the mandatory fields and select **Done**. In this example, we're using a query-based parameter that allows you to select one or more states and see events associated with this selection.

    :::image type="content" source="media/adx-dashboards/parameter-pane.png" alt-text="Parameter pane.":::

|Field|Description|
|---------|---------|
|**Parameter type**|One of the following:<br>- **Single Selection**: Only one value can be selected in the filter as input for the parameter.<br>- **Multiple Selection**: One or more values can be selected in the filter as input(s) for the parameter.<br>- **Time Range**: Allows creating additional parameters to filter the queries and dashboards based on time. Every dashboard has a time range picker by default.<br>- The parameter type you select will affect the way you write any query that's based on this parameter.|
|**Variable name**|The name of the parameter to be used in the query.|
|**Data type**|The data type of the parameter values.|
|**Pin as dashboard filter**|The option to pin the parameter-based filter to the dashboard.|
|**Source**|The source of the parameter values:<br>- **Fixed values**: Manually introduced static filter values.<br>- **Query**: Dynamically introduced values using a KQL query.|
|**Value column**|Results column to be used as parameter values. Only applicable for query-based parameters.|
|**Label column**|Results column to be used for parameter labels. Only applicable for query-based parameters.|
|**Add empty "Select all" value**|Applicable only to single selection and multiple selection parameter types. Used to retrieve data for all the parameter values.|
|**Display name**|The name of the parameter shown on the dashboard or the edit card.|
|**Default value**|The default parameter value.|

### Parameter query

The following is an example of a query using the parameter defined in [Use parameters](azure-data-explorer-dashboards.md#use-parameters).

:::image type="content" source="media/adx-dashboards/parameter-query.png" alt-text="Screenshot of query used to generate parameters.":::

1. Select the source data from the drop-down bar.
1. Enter your query and then select **Run**.

1. Select **Apply changes**.

> [!NOTE]
> The parameter query is used to generate dynamically introduced values as parameters using a KQL query. It's not the query used for generating the dashboard visual.

For more information about generating parameter queries, see [Create a parameter](dashboard-parameters.md#create-a-parameter).

## Add tile

**Add tile** uses Kusto Query Language snippets to retrieve data and render visuals. Each tile/query can support a single visual.

1. Select **Add tile** from the dashboard canvas or the top menu bar.

    :::image type="content" source="media/adx-dashboards/empty-dashboard-new-query.png" alt-text="New query.":::

1. In the **Query** pane,
    1. Select the data source from the drop-down menu.
    1. Type the query, and the select **Run**. For more information about generating queries that use parameters, see [Use parameters in your query](dashboard-parameters.md#use-parameters-in-your-query).

    1. Select **+ Add visual**.

    :::image type="content" source="media/adx-dashboards/initial-query.png" alt-text="Execute query.":::

1. In the **Visual formatting** pane, select **Visual type** to choose the type of visual.
1. Select **Apply changes** to pin the visual to the dashboard.

    :::image type="content" source="media/adx-dashboards/add-visual.png" alt-text="Add visual to query.":::

1. You can resize the visual and then **Save changes** to save the dashboard.

    :::image type="content" source="media/adx-dashboards/save-dashboard.png" alt-text="save dashboard.":::

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

1. Write the user's name or email in **Add new members** box.
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

1. Select **Edit** in dashboard menu to switch to edit mode.
1. Select **Auto refresh**.

    :::image type="content" source="media/adx-dashboards/auto-refresh.png" alt-text="Select auto refresh.":::

1. Toggle the option so auto refresh is **Enabled**.
1. Select values for **Minimum time interval** and **Default refresh rate**.

    :::image type="content" source="media/adx-dashboards/auto-refresh-toggle.png" alt-text="Enable auto refresh.":::

1. Select **Apply** and then **Save** the dashboard.

> [!NOTE]
>
> * Select the smallest minimum time interval to reduce unnecessary load on the cluster.
> * A dashboard viewer:
>   * Can change the minimum time intervals for personal use only.
>   * Can't select a value which is smaller than the **Minimum time interval** specified by the editor.

## Next Steps

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Customize dashboard visuals](dashboard-customize-visuals.md)
* [Query data in Azure Data Explorer](web-query-data.md)
