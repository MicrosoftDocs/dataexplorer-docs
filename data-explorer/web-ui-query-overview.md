---
title: Azure Data Explorer web UI query page overview
description: This article describes the query page in Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 05/14/2023
---

# Azure Data Explorer web UI query data overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. One of the ways to interact with Azure Data Explorer is through the [web UI](https://dataexplorer.azure.com).

The web UI provides an end-to-end data exploration experience, from [data ingestion](ingest-data-wizard.md) to data query and [dashboards](azure-data-explorer-dashboards.md). This article provides an overview of the web UI query page and explains how it can be used to access and interact with your data.

## Go to the query page

To open the query page, go to the [Azure Data Explorer web UI](https://dataexplorer.azure.com). From the left menu, select **Query**.

:::image type="content" source="media/web-ui-query/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-query/query-widget.png":::

## Add a cluster connection

The following steps describe how to add a connection to a cluster in the web UI.

1. In the upper left pane, select **Add connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**. To add a free, publicly available sample cluster, use "help" as the **Connection URI**.

1. Select **Add** to add the connection.

Within the left menu, you should see a connection to your cluster with all of the databases associated with that cluster listed underneath it.

:::image type="content" source="media/web-ui-query/help-cluster-web-ui.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-query/help-cluster-web-ui.png":::

## Run a query

The following steps explain how to run a query in the web UI.

1. Select the database on which you want to run the query to set the query context. In the top toolbar, you can see the selected query context.

    :::image type="content" source="media/web-ui-query/query-context.png" alt-text="Screenshot of multiple query tabs and their context." lightbox="media/web-ui-query/query-context.png":::

1. Write a query using the data in the selected database. For example, use the StormEvents table:

    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUShJzE5VMDQwMAAA5fwUfRgAAAA=" target="_blank">Run the query</a>

    ```kusto
    StormEvents
    | take 1000
    ```

1. To return all records matching the query, select **Run** or press Shift + Enter. Alternatively, to see a preview of 50 results, select the dropdown menu from the **Run** button and select **Preview results**.

    :::image type="content" source="media/web-ui-query/preview-results.png" alt-text="Screenshot of preview results button.":::

## Understand the results grid

After you execute a query, the results are displayed in the results grid located below the query editor. The results grid presents the query results in a tabular format, with columns and rows that correspond to the data retrieved from your database. With the results grid, you can interactively sort, filter, group, and visualize the data in various ways. For more information, see [Azure Data Explorer web UI results grid](web-results-grid.md).

## Manage query tabs

The web UI supports multiple query tabs at once, all with different query contexts. The following steps describe how to create and manage multiple tabs.

1. Select the plus icon next to the existing tab to create a new tab.

    :::image type="content" source="media/web-ui-query/add-new-tab.png" alt-text="Screenshot of button to add a new tab." lightbox="media/web-ui-query/add-new-tab.png":::

1. Select the name of the database for the query context. The default name of a query tab is based on the cluster and context database.

    :::image type="content" source="media/web-ui-query/multiple-tabs-context.png" alt-text="Screenshot of multiple tabs with different contexts." lightbox="media/web-ui-query/multiple-tabs-context.png":::

1. To change the name of a tab, select the pencil icon located on the tab and type in the new name for the tab.

1. If you have multiple tabs open and want to manage them, use the tabs list located on the top right corner of the screen. The tabs list helps you to navigate between tabs and identify the current tab with an icon. The tabs list is helpful when you have multiple tabs open and want to focus on, switch between, or remove specific ones.

    :::image type="content" source="media/web-ui-query/manage-tabs-shortcut.png" alt-text="Screenshot of icon for managing tabs." lightbox="media/web-ui-query/manage-tabs-shortcut.png":::

1. In case you accidentally remove a tab, select the back button to reopen a closed tab in the top right of the screen to restore the removed tab.

    :::image type="content" source="media/web-ui-query/undo-remove-tab.png" alt-text="Screenshot of button to restore a removed tab." lightbox="media/web-ui-query/undo-remove-tab.png":::

## Query recall

The recall query button allows you to quickly retrieve a previously executed query. Select the query you want and hit **Recall** to run it again from the data stored in the browser's cache. The results for the last 50 queries are stored in the cache, so if the user clears their browser cache then the results are removed.

:::image type="content" source="media/web-ui-query/recall-button.png" alt-text="Screenshot of query recall button." lightbox="media/web-ui-query/recall-button.png":::

## See also

* [Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md)
