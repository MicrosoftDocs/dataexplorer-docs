---
title: "Quickstart: Visualize Sample Data Dashboards in Azure Data Explorer Web UI"
description: In this how-to article, you learn how to use the visualized sample data dashboards from the samples gallery in the Azure Data Explorer web UI.
ms.topic: quickstart
ms.date: 02/02/2026
---

# Quickstart: Visualize sample data dashboards

The Azure Data Explorer web UI has a samples gallery where you can view built-in dashboards without the need to [create your own cluster and database](start-for-free-web-ui.md) or [ingest data](ingest-data-overview.md). By using dashboards, you can manipulate different parameters and visuals to gain insights from your data.

In this quickstart, you learn how to access and explore the built-in dashboards in the Azure Data Explorer web UI samples gallery. You don't need knowledge of [Kusto Query Language (KQL)](/kusto/query/index?view=azure-data-explorer&preserve-view=true) to create and modify your dashboards, but it can be used for further customization.

## Prerequisites

A Microsoft account or a Microsoft Entra user identity to sign in to the [**help** cluster](https://dataexplorer.azure.com/clusters/help). An Azure subscription isn't required.

## Explore sample dashboards

1. Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) by using your Microsoft account or Microsoft Entra user identity.

1. In the **Home** page, select **Explore sample dashboards**.

1. In the **Explore sample dashboards** dialog box, choose a sample dashboard, and then select **Explore**. To match the previous example, select the **Metrics sample dashboard**.

    :::image type="content" source="media/adx-dashboards/sample-dashboards.png" alt-text="Screenshot of Explore dashboards samples dialog box showing sample dashboard options.":::

1. The dashboard opens in edit mode and presents various preconfigured tile options for customization.

    :::image type="content" source="media/adx-dashboards/sample-dash-homepage.png" alt-text="Screenshot showing the samples gallery dashboard from the Metrics data database, with a variety of tiles." lightbox="media/adx-dashboards/sample-dash-homepage.png":::

1. Select the edit icon on the **CPU Usage** tile to access the underlying KQL query and formatting options. Explore the various tabs that you can use to adjust the visual display and review the results. Take some time to familiarize yourself with the features and options available.

    :::image type="content" source="media/adx-dashboards/edit-tile.png" alt-text="Screenshot of the CPU usage visualization tile.":::

1. Select **Apply changes** or **Discard changes** to save or discard your changes. You're taken back to the main dashboard.

   :::image type="content" source="media/adx-dashboards/save-changes.png" alt-text="Screenshot of CPU usage tile edit window with options to apply or discard changes.":::

1. Learn how to [view parameters](dashboard-parameters.md#view-parameters-list) and [customize visuals](dashboard-customize-visuals.md#customize-visuals).

## Related content

* [Query data in the web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
