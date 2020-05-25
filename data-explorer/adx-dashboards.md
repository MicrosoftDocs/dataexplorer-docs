---
title: Visualize data with the Azure Data Explorer dashboard
description: Learn how to visualize data with the Azure Data Explorer dashboard
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: conceptual
ms.date: 05/24/2020
---

# Visualize data with Azure Data Explorer dashboards

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data explorer provides a web application that enables you to run queries and build dashboards. Dashboards are available in the stand-alone web application, the [Web UI](web-query-data.md). Azure Data Explorer is also integrated with other dashboard services like [Power BI](power-bi-connector.md) and [Grafana](grafana.md).

Azure Data Explorer dashboards provide two main advantages:

* Natively export queries from the Web UI to Azure Data Explorer dashboards. 
* Explore the data visually in the Web UI.
* Optimized dashboard rendering performance.

## Create a dashboard

1. Use the new navigation bar to move from **Query** to **Dashboards**. 
1. Select the dashboard icon and select **New dashboard**.

    :::image type="content" source="media/adx-dashboards/new-dashboard.png" alt-text="New dashboard":::

1. Select a dashboard name and **Create**.

    :::image type="content" source="media/adx-dashboards/new-dashboard-popup.png" alt-text="Create a dashboard":::

## Add data source

Add the required data sources for the dashboards.

1. Select **Data sources** menu item on the top bar. Select the **+ New data source** button in the right pane.

    :::image type="content" source="media/adx-dashboards/data-source.png" alt-text="Data source":::

1. Enter the **Cluster URI** or partial name including region and select **Connect**. 
1. Select the **Database** from the drop-down list.
1. Use the default or modify the **Data source name**, if needed. 
1. Select **Apply**.

    :::image type="content" source="media/adx-dashboards/data-source-pane.png" alt-text="Data source pane":::

## Use Parameters

Parameters enable using dashboard filters. Parameters significantly improve dashboard rendering performance and enable you to use filter values optimally as early as possible in the query.

1. Select **Parameters** menu item on the top bar. Select the **+ New parameter** button in the right pane.

    :::image type="content" source="media/adx-dashboards/parameters.png" alt-text="Select new parameter":::

1. Enter values for all the mandatory fields and select **Done**. For more information, see [Use parameters]().

    :::image type="content" source="media/adx-dashboards/parameter-pane.png" alt-text="Parameter pane":::

## Use Query

**Query** leverages Kusto query language snippets to retrieve the data that is displayed in the visuals. Each query can support a single visual.

1. Select the new query from the dashboard empty canvas or from the top menu bar.

    :::image type="content" source="media/adx-dashboards/empty-dashboard-new-query.png" alt-text="New query":::

1. In the **Query** pane, select the data source, enter the query, and execute it.

    :::image type="content" source="media/adx-dashboards/initial-query.png" alt-text="Execute query":::

1. Select **+ Add visual** and select the **Query Card** to choose the type of visual.

    :::image type="content" source="media/adx-dashboards/add-visual.png" alt-text="Add visual to query":::

1. Name the visual and select **Done editing** to pin the visual to the dashboard.
You can resize the visual and save the dashboard.

    :::image type="content" source="media/adx-dashboards/dash.png" alt-text="Final dashboard":::

## Next Steps

* [MJ doc]()
* [Query data in Azure Data Explorer](web-query-data.md)