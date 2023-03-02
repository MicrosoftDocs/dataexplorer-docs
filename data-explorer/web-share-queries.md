---
title: 'Share queries from Azure Data Explorer web UI'
description: In this guide, you'll learn how to share queries from the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 02/13/2023
---

# Share queries from Azure Data Explorer web UI

This article will walk you through the process of sharing queries from the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home). By the end of this article, you'll know how to share a query with a colleague, pin it to a dashboard, or even connect it to Power BI.

To learn how to run queries, see [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Access to an Azure Data Explorer cluster and database. You may use the publicly available [**help** cluster](https://dataexplorer.azure.com/help) or [create a cluster and database](create-cluster-database-portal.md).

## Get started

1. In the query window, select the query you want to share.

1. At the top of the query window, select **Share**.

    :::image type="content" source="media/web-share-query/share-query-menu.png" alt-text="Screenshot of the query editor showing the share dropdown menu.":::

The following options are available in the drop-down:

* Link to clipboard
* [Link, query to clipboard](#provide-a-deep-link)
* Link, query, results to clipboard
* [Pin to dashboard](#pin-to-dashboard)
* [Query to Power BI](power-bi-data-connector.md)
* Open in Excel

## Provide a deep link

You can provide a deep link so that other users with access to the cluster can run the queries.

1. In **Share**, select **Link, query to clipboard**.

1. Copy the link and query to a text file.

1. Paste the link into a new browser window to run the query.

## Pin to dashboard

When you complete data exploration using queries in the Azure Data Explorer web UI and find the data you need, you can pin it to a dashboard for continuous monitoring.

To pin a query:

1. In **Share**, select **Pin to dashboard**.

1. In the **Pin to dashboard** pane:
    1. Provide a **Tile name**.
    1. Select **Use existing** or **Create new**.
    1. Provide **Dashboard name**
    1. Select the **View dashboard after creation** checkbox (if it's a new dashboard).
    1. Select **Pin**

> [!NOTE]
> **Pin to dashboard** only pins the selected query. To create the dashboard data source and translate render commands to a visual in the dashboard, the relevant database must be selected in the database list.

## Export query results

To export the query results to a CSV file, select **File** > **Export to CSV**.

:::image type="content" source="media/web-share-query/export-to-csv.png" alt-text="Screenshot of the query editor with the file dropdown menu highlighted to show the Export results to CSV file option.":::
