---
title: Azure Data Explorer web UI query page overview
description: This article describes the query page in Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 05/14/2023
---

NOTE: SHOULDN'T BE STEPS. MAKE A GIF. MOVE ADD CONN TO OWN DOC.

# Azure Data Explorer web UI query data overview

The [Azure Data Explorer web UI](https://dataexplorer.azure.com) provides an end-to-end data exploration experience from [data ingestion](ingest-data-wizard.md) to data query and [dashboards](azure-data-explorer-dashboards.md). This article provides an overview of the web UI query page and explains how it can be used to access and interact with your data.

The query page allows you to:

> [!div class="checklist"]
>
> * [Navigate between clusters and databases](#navigate-between-clusters-and-databases)
> * [Write and run queries](#write-and-run-queries)
> * [Manage queries in multiple contexts](#manage-queries-in-multiple-contexts)
> * [View and manipulate results](#view-and-manipulate-results)
> * [Monitor query statistics](#monitor-query-statistics)
> * [Recall previous queries](#recall-previous-queries)
> * [Share and export queries](#share-and-export-queries)

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Go to the query page

To open the query page, select **Query** from the main menu.

:::image type="content" source="media/web-ui-query/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-query/query-widget.png":::

## Navigate between clusters and databases

To browse and switch between clusters and databases, use the navigation panel on the left of the query page. Queries are executed within the context of a selected database. To select a database for your query, select the desired resource in the left panel.

To learn how to add a connection to your cluster, see [Add a cluster connection in the Azure Data Explorer web UI](add-cluster-connection.md).

> [!TIP]
> Add clusters and databases to your favorites list with the star icon next to the resource name. To view only your favorite resources, select the star icon next to the filter text box.

## Write and run queries

Use the query editor in the query page to interact with your data, with the support of Intellisense and auto-completion. First, select the database on which to run your query, and the query context will be displayed in the top toolbar.

:::image type="content" source="media/web-ui-query/query-context.png" alt-text="Screenshot of multiple query tabs and their context." lightbox="media/web-ui-query/query-context.png":::

The editor provides suggestions and auto-completion options as you write your query. The editor will alert you if you attempt to access data that isn't in the selected database as well as make suggestions to optimize your queries.

To return all records matching the query, select **Run** or press *Shift + Enter*. To see a preview of 50 results, select the dropdown menu on the **Run** button and select **Preview results**. If you have multiple queries in the same tab, make sure to select the query you want to run before running the query.

:::image type="content" source="media/web-ui-query/run-button-dropdown.png" alt-text="Screenshot of the web UI run button dropdown options." lightbox="media/web-ui-query/run-button-dropdown.png":::

## Manage queries in multiple contexts

The web UI supports multiple query tabs at once, all with different query contexts. The following steps describe how to create and manage multiple tabs.

1. Select the plus icon next to the existing tab to create a new tab.

    :::image type="content" source="media/web-ui-query/add-new-tab.png" alt-text="Screenshot of button to add a new tab." lightbox="media/web-ui-query/add-new-tab.png":::

    > [!NOTE]
    > The default name of a query tab is based on the cluster and context database.

1. To change the name of a tab, select the pencil icon located on the tab and type in the new name for the tab.

1. Use the tabs list located in the top right corner to clearly view and manage all tabs.

    :::image type="content" source="media/web-ui-query/manage-tabs-shortcut.png" alt-text="Screenshot of icon for managing tabs." lightbox="media/web-ui-query/manage-tabs-shortcut.png":::

1. To restore a removed tab, select the **Reopen closed tab** button in the top right of the screen.

    :::image type="content" source="media/web-ui-query/undo-remove-tab.png" alt-text="Screenshot of button to restore a removed tab." lightbox="media/web-ui-query/undo-remove-tab.png":::

## View and manipulate results

After you execute a query, the results are displayed in the results grid located below the query editor. The results grid presents query results in a tabular format. With the results grid, you can interactively sort, filter, group, and visualize the data in various ways. For more information, see [Azure Data Explorer web UI results grid](web-results-grid.md).

## Monitor query statistics

Select **Stats** next to the results grid table to view query performance information such as query duration, CPU and memory usage, and data scanned to optimize your queries.

:::image type="content" source="media/web-ui-query/query-stats.png" alt-text="Screenshot of the query statistics window.":::

## Recall previous queries

The recall query button allows you to quickly retrieve a previously executed query. Select the query you want and hit **Recall** to run it again from the data stored in the browser's cache.

:::image type="content" source="media/web-ui-query/recall-button.png" alt-text="Screenshot of query recall button." lightbox="media/web-ui-query/recall-button.png":::

> [!NOTE]
> The results for the last 50 queries are stored in the cache, so if the user clears their browser cache then the results are removed.

## Share and export queries

In the query page toolbar, there are several options to manage your queries and query results. You can pin a query to a dashboard, copy queries, copy query results, and export data to Power BI, Excel, and CSV formats. For more information, see [Share queries from Azure Data Explorer web UI](web-share-queries.md).

## See also

* [Azure Data Explorer web UI keyboard shortcuts](web-ui-query-keyboard-shortcuts.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
