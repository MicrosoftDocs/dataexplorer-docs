---
title: 'Share queries from Azure Data Explorer web UI'
description: In this guide, you'll learn how to share queries from the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 01/15/2023
---

## Share queries from Azure Data Explorer web UI

Many times, you want to share the queries you create.

1. In the query window, select the first query you copied in.

1. At the top of the query window, select **Share**.

    :::image type="content" source="media/web-query-data/share-menu.png" alt-text="Screenshot of the query editor showing the share dropdown menu.":::

The following options are available in the drop-down:

* Link to clipboard
* [Link query to clipboard](#provide-a-deep-link)
* Link, query, results to clipboard
* [Pin to dashboard](#pin-to-dashboard)
* [Query to Power BI](power-bi-data-connector.md)

### Provide a deep link

You can provide a deep link so that other users with access to the cluster can run the queries.

1. In **Share**, select **Link, query to clipboard**.

1. Copy the link and query to a text file.

1. Paste the link into a new browser window. The result should look like the following

    :::image type="content" source="media/web-query-data/shared-query.png" alt-text="Screenshot of a shared query deep link.":::

### Pin to dashboard

When you complete data exploration using queries in the Azure Data Explorer web UI and find the data you need, you can pin it to a dashboard for continuous monitoring.

To pin a query:

1. In **Share**, select **Pin to dashboard**.

1. In the **Pin to dashboard** pane:
    1. Provide a **Query name**.
    1. Select **Use existing** or **Create new**.
    1. Provide **Dashboard name**
    1. Select the **View dashboard after creation** checkbox (if it's a new dashboard).
    1. Select **Pin**

    :::image type="content" source="media/web-query-data/pin-to-dashboard.png" alt-text="Screenshot of the Pin to dashboard pane.":::

> [!NOTE]
> **Pin to dashboard** only pins the selected query. To create the dashboard data source and translate render commands to a visual in the dashboard, the relevant database must be selected in the database list.

## Export query results

To export the query results to a CSV file, select **File** > **Export to CSV**.

:::image type="content" source="media/web-query-data/export-results.png" alt-text="Screenshot of the query editor with the file dropdown menu highlighted to show the Export results to CSV file option.":::
