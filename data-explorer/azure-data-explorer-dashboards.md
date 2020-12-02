---
title: Visualize data with the Azure Data Explorer dashboard
description: Learn how to visualize data with the Azure Data Explorer dashboard
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 05/26/2020
ms.localizationpriority: high 
---

# Visualize data with Azure Data Explorer dashboards(Preview)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer provides a web application that enables you to run queries and build dashboards. Dashboards are available in the stand-alone web application, the [Web UI](web-query-data.md). Azure Data Explorer is also integrated with other dashboard services like [Power BI](power-bi-connector.md) and [Grafana](grafana.md).

Azure Data Explorer dashboards provide three main advantages:

* Natively export queries from the Web UI to Azure Data Explorer dashboards. 
* Explore the data in the Web UI.
* Optimized dashboard rendering performance.

The following image depicts an Azure Data Explorer dashboard.

:::image type="content" source="media/adx-dashboards/dash.png" alt-text="Final dashboard":::

> [!IMPORTANT]
> Your data is secure. Dashboards and dashboard-related metadata about users is encrypted at rest.

## Create a dashboard

1. In the navigation bar, select **Dashboards** and select **New dashboard**.

    :::image type="content" source="media/adx-dashboards/new-dashboard.png" alt-text="New dashboard":::

1. Select a dashboard name and **Create**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-popup.png" alt-text="Create a dashboard":::

## Add data source

Add the required data sources for the dashboards.

1. Select **Data sources** menu item on the top bar. Select the **+ New data source** button in the **Data sources** pane.

    :::image type="content" source="media/adx-dashboards/data-source.png" alt-text="Data source":::

1. In the **Create new data source** pane:
    1. Enter the **Cluster URI** or partial name including region and select **Connect**. 
    1. Select the **Database** from the drop-down list.
    1. Use the default or modify the **Data source name**, if needed. 
    1. Select **Apply**.

    :::image type="content" source="media/adx-dashboards/data-source-pane.png" alt-text="Data source pane":::

## Use Parameters

Parameters enable using dashboard filters. Parameters significantly improve dashboard rendering performance and enable you to use filter values as early as possible in the query. For more information about using parameters, see [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md).

1. Select **Parameters** on the top bar. Select the **+ New parameter** button in the **Parameters** pane.

    :::image type="content" source="media/adx-dashboards/parameters.png" alt-text="Select new parameter":::

1. Enter values for all the mandatory fields and select **Done**.

    :::image type="content" source="media/adx-dashboards/parameter-pane.png" alt-text="Parameter pane":::

|Field  |Description |
|---------|---------|
|**Parameter display name**    |   The name of the parameter shown on the dashboard or the edit card.      |
|**Parameter type**    |One of the following:<ul><li>**Single selection**: Only one value can be selected in the filter as input for the parameter.</li><li>**Multiple selection**: One or more values can be selected in the filter as input(s) for the parameter.</li><li>**Time range**: Allows creating additional parameters to filter the queries and dashboards based on time.Every dashboard has a time range picker by default.</li></ul>    |
|**Variable name**     |   The name of the parameter to be used in the query.      |
|**Data type**    |    The data type of the parameter values.     |
|**Pin as dashboard filter**   |   Pin the parameter-based filter to the dashboard or unpin from the dashboard.       |
|**Source**     |    The source of the parameter values: <ul><li>**Fixed values**: Manually introduced static filter values. </li><li>**Query**: Dynamically introduced values using a KQL query.  </li></ul>    |
|**Add a “Select all” value**    |   Applicable only to single selection and multiple selection parameter types. Used to retrieve data for all the parameter values.      |

## Add Query

**Add Query** uses Kusto query language snippets to retrieve data and render visuals. Each query can support a single visual.

1. Select **Add Query** from the dashboard canvas or the top menu bar.

    :::image type="content" source="media/adx-dashboards/empty-dashboard-new-query.png" alt-text="New query":::

1. In the **Query** pane, 
    1. Select the data source from the drop-down
    1. Type the query, and select **Run** 
    1. Select **+ Add visual**

    :::image type="content" source="media/adx-dashboards/initial-query.png" alt-text="Execute query":::

1. In the **Visual formatting** pane, select **Chart type** to choose the type of visual. 
1. Name the visual and select **Apply changes** to pin the visual to the dashboard.

    :::image type="content" source="media/adx-dashboards/add-visual.png" alt-text="Add visual to query":::

1. You can resize the visual and **Save changes** to save the dashboard.

    :::image type="content" source="media/adx-dashboards/save-dashboard.png" alt-text="save dashboard":::

## Share dashboards

Use the share menu to [grant permissions](#grant-permissions) to the dashboard, [change a user's permission level](#change-a-user-permission-level), and [share the dashboard link](#share-the-dashboard-link).

> [!IMPORTANT]
> To access the dashboard, a dashboard viewer needs the following:
> * Dashboard link for access
> * Dashboard permissions
> * Access to the underlying database in the Azure Data Explorer cluster  

1. Select the **Share** menu item in the top bar of the dashboard.
1. Select **Manage permissions** from the drop-down. 

    :::image type="content" source="media/adx-dashboards/share-dashboard.png" alt-text="Share dashboard drop-down":::

### Grant permissions

To grant permissions to a user in the **Dashboard permissions** pane:
1. Write the user's name or email in **Add new members** box.
1. Select the **Permission** level as **Can view** or **Can edit** and then click **Add**.

:::image type="content" source="media/adx-dashboards/dashboard-permissions.png" alt-text="Manage dashboard permissions":::

### Change a user permission level

To change a user permission level in the **Dashboard permissions** pane:
1. Use the search box or scroll the user list to find the user.
1. Change the **Permission** level as needed.

### Share the dashboard link

To share the dashboard link:
* Select **Share** drop-down and then select **Copy link**
Or
* In the **Dashboard permissions** window, select **Copy link**. 

## Enable auto refresh 

1. Select **Edit** in dashboard menu to switch to edit mode.
1. Select **Auto refresh**. 
 
    :::image type="content" source="media/adx-dashboards/auto-refresh.png" alt-text="Select auto refresh":::

1. Toggle the option so auto refresh is **Enabled**. 
1. Select values for **Minimum time interval** and **Default refresh rate**. 

    :::image type="content" source="media/adx-dashboards/auto-refresh-toggle.png" alt-text="Enable auto refresh":::

1. Select **Apply** and **Save** the dashboard.

> [!NOTE]
> * Select the smallest minimum time interval to reduce unnecessary load on the cluster. 
> * A dashboard viewer: 
>    * Can change the minimum time intervals for personal use only. 
>    * Can't select a value which is smaller than the **Minimum time interval** specified by the editor.

## Next Steps

* [Use parameters in Azure Data Explorer dashboards](dashboard-parameters.md)
* [Customize dashboard visuals](dashboard-customize-visuals.md)
* [Query data in Azure Data Explorer](web-query-data.md)
