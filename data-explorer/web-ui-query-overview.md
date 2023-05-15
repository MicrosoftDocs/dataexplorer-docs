---
title: Azure Data Explorer web UI query page overview
description: This article describes the query page in Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 05/14/2023
---

# Azure Data Explorer web UI query data overview

The [Azure Data Explorer web UI](https://dataexplorer.azure.com) provides an end-to-end data exploration experience from [data ingestion](ingest-data-wizard.md) to data query and [dashboards](azure-data-explorer-dashboards.md). This article provides an overview of the web UI query page and explains how it can be used to access and interact with your data.

The query page provides the following features:

* [Cluster and database navigation](#cluster-and-database-navigation): A navigation panel to browse and switch between different clusters and databases.
* [Query editor](#use-the-query-editor): A text editor with intellisense and auto-completion to write queries to interact with your data.
* [Query tabs](#manage-query-tabs): Manage different queries in different contexts simultaneously with query tabs.
* [Results grid](#work-with-the-results-grid): A table-like display of query results that can be sorted, filtered, grouped, and visualized.
* [Query statistics](#review-query-statistics): Information about query performance, including query duration, CPU and memory usage, and data scanned to help you optimize your queries.
* [Query recall](#query-recall): A feature that allows you to recall and reuse previously executed queries.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Go to the query page

To open the query page, select **Query** from the main menu.

:::image type="content" source="media/web-ui-query/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-query/query-widget.png":::

## Cluster and database navigation

To browse and switch between clusters and databases, use the navigation panel on the left of the query page. Queries are executed within the context of a selected database. To select a database for your query, select the desired resource in the left panel. If you need to add a cluster connection, follow these steps:

1. In the upper left corner, select **Add connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**. Use "help" for the **Connection URI** to add a free sample cluster.

1. Select **Add** to add the connection. Your clusters and databases should now be visible in the left panel. For example, the following image shows the `help` cluster connection.

    :::image type="content" source="media/web-ui-query/help-cluster-web-ui.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-query/help-cluster-web-ui.png":::

> [!TIP]
> Add clusters and databases to your favorites list with the star icon next to the resource name. To view only your favorite resources, select the star icon next to the filter text box.

## Use the query editor

The following steps explain how to use the query editor in the web UI.

1. Select the database on which you want to run the query to set the query context. The query context is displayed in the top toolbar.

    :::image type="content" source="media/web-ui-query/query-context.png" alt-text="Screenshot of multiple query tabs and their context." lightbox="media/web-ui-query/query-context.png":::

1. Write a query using the data in the selected database. The following example takes a sample of 1000 records from the `StormEvents` table in the `help` cluster.

    ```kusto
    StormEvents
    | take 1000
    ```

1. To return all records matching the query, select **Run** or press *Shift + Enter*. To see a preview of 50 results, select the dropdown menu on the **Run** button and select **Preview results**.

## Manage query tabs

The web UI supports multiple query tabs at once, all with different query contexts. The following steps describe how to create and manage multiple tabs.

1. Select the plus icon next to the existing tab to create a new tab.

    :::image type="content" source="media/web-ui-query/add-new-tab.png" alt-text="Screenshot of button to add a new tab." lightbox="media/web-ui-query/add-new-tab.png":::

1. Select the database to use for the query context.

    > [!NOTE]
    > The default name of a query tab is based on the cluster and context database.

1. To change the name of a tab, select the pencil icon located on the tab and type in the new name for the tab.

1. If you have multiple tabs open and want to manage them, use the tabs list located on the top right corner of the screen. The tabs list helps you to navigate between tabs and identify the current tab with an icon. The tabs list is helpful when you have multiple tabs open and want to focus on, switch between, or remove specific ones.

    :::image type="content" source="media/web-ui-query/manage-tabs-shortcut.png" alt-text="Screenshot of icon for managing tabs." lightbox="media/web-ui-query/manage-tabs-shortcut.png":::

1. In case you accidentally remove a tab, select the back button to reopen a closed tab in the top right of the screen to restore the removed tab.

    :::image type="content" source="media/web-ui-query/undo-remove-tab.png" alt-text="Screenshot of button to restore a removed tab." lightbox="media/web-ui-query/undo-remove-tab.png":::

## Work with the results grid

After you execute a query, the results are displayed in the results grid located below the query editor. The results grid presents query results in a tabular format. With the results grid, you can interactively sort, filter, group, and visualize the data in various ways. For more information, see [Azure Data Explorer web UI results grid](web-results-grid.md).

## Review query statistics

## Query recall

The recall query button allows you to quickly retrieve a previously executed query. Select the query you want and hit **Recall** to run it again from the data stored in the browser's cache. The results for the last 50 queries are stored in the cache, so if the user clears their browser cache then the results are removed.

:::image type="content" source="media/web-ui-query/recall-button.png" alt-text="Screenshot of query recall button." lightbox="media/web-ui-query/recall-button.png":::

## See also

* [Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md)
