---
title: Azure Data Explorer web UI sample dashboards
description: In this how-to article, you learn how to use the samples gallery in the Azure Data Explorer web UI to explore dashboards.
ms.topic: quickstart
ms.date: 01/26/2021
---

# Explore the Azure Data Explorer web UI sample dashboards

The Azure Data Explorer web UI has a samples gallery that allows you to view built-in dashboards using sample data. Exploring the samples gallery dashboards can give you an idea of how Azure Data Explorer dashboards work without the need to create your own cluster, databases, tables, or ingest data.

In this quickstart, you'll learn how to access and explore the built-in dashboards in the samples gallery.

## Prerequisites

A Microsoft account or an Azure Active Directory user identity to sign in to the [**help** cluster](https://dataexplorer.azure.com/clusters/help). An Azure subscription isn't required.

## Explore sample dashboards

Dashboards allow users to visualize information and gain insights from data without using the KQL query language. You can explore data easily by adjusting the parameters and visuals in dashboard editors.

1. In the Azure Data Explorer web UI [Home](https://dataexplorer.azure.com/home) page, select **Explore sample dashboards**.

1. In the **Explore dashboards** dialog box, choose a sample dashboard and then select **Explore**. In keeping with the example above, select the **Metrics sample dashboard**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-dashboards-dialog.png" alt-text="Screenshot of Explore dashboards samples dialog box showing sample dashboard options.":::

    The dashboard window opens in Edit mode, with different types of prepopulated tiles.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-dashboard-full.png" alt-text="Screenshot showing the samples gallery dashboard from the Metrics data database, with a variety of tiles." lightbox="media/web-ui-samples-gallery/web-ui-dashboard-full.png":::

1. Explore dashboard options and individual tiles to [view parameters](dashboard-parameters.md#view-parameters-list) and [customize visuals](dashboard-customize-visuals.md#customize-visuals).

## Next steps

- [Query data in the Azure Data Explorer web UI](web-query-data.md#run-queries)
- [Visualize data with Azure Data Explorer dashboards (Preview)](azure-data-explorer-dashboards.md)
