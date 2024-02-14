---
title: Azure Data Explorer web UI query overview
description: This article describes the query page in Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 12/18/2023
---

# Azure Data Explorer web UI query overview

The [Azure Data Explorer web UI](https://dataexplorer.azure.com) provides an end-to-end data exploration experience from [data ingestion](ingest-data-wizard.md) to data query and [customizable dashboards](azure-data-explorer-dashboards.md) to visualize data and insights. This article provides an overview of the web UI query page and explains how it can be used to interact with your data.

In the query page, you can:

> [!div class="checklist"]
>
> * [View clusters and databases](#view-clusters-and-databases)
> * [Write and run queries](#write-and-run-queries)
> * [Manage queries in multiple contexts](#manage-queries-in-multiple-contexts)
> * [Explore and transform query results](#explore-and-transform-query-results)
> * [Recall previous queries](#recall-previous-queries)
> * [Share and export queries](#share-and-export-queries)

:::image type="content" source="media/web-ui-query/query-page-overview.gif" alt-text="Moving image of query page overview." lightbox="media/web-ui-query/query-page-overview.gif":::

On the Azure Data Explorer web UI home page, there are guides to help get you started querying different types of data. To learn more, see [Explore the samples gallery](web-ui-samples-query.md).

## View clusters and databases

The connection pane on the left-hand side of the query page allows you to browse and switch between your clusters and databases. Under each cluster, you can see the databases included in that cluster. Under each database, you can see the tables, functions, external tables, and materialized views included in that database.

From the connection pane, right-click on a database to open a menu with options to **Ingest data**, **Create table**, and more.

:::image type="content" source="media/web-ui-query/connection-pane.png" alt-text="Screenshot of the connection pane." lightbox="media/web-ui-query/connection-pane.png":::

To learn how to add a connection, see [Add a cluster connection in the Azure Data Explorer web UI](add-cluster-connection.md).

> [!TIP]
> Add clusters and databases to your favorites list with the star icon next to the resource name. To view only your favorite resources, select the star icon next to the filter text box.

## Gain quick insights into table data

The data profile feature provides quick access to column names, types, essential statistics, and top values within each column.

:::image type="content" source="media/web-ui-query/data-profile-storms.png" alt-text="Screenshot of a data profile for the storm events table.":::

For more information, see [Gain quick insights into table data](data-profile.md).

## Write and run queries

Use the query editor to interact with your data by running queries in the context of a specific database. To set the query context, select the relevant database from the left panel. The query context is displayed in the top toolbar.

:::image type="content" source="media/web-ui-query/switch-query-context.gif" alt-text="Screenshot of multiple query tabs and their context." lightbox="media/web-ui-query/switch-query-context.gif":::

The editor offers [Kusto Query Language (KQL)](kusto/query/index.md) Intellisense and autocompletion, providing helpful suggestions as you write your query. The editor also alerts you when accessing data outside the selected database and suggests query optimizations. To return all records matching the query, select **Run** or press *Shift + Enter*. To see a preview of 50 results, select the dropdown menu on the **Run** button and select **Preview results** or press *Alt + Shift + Enter*.

:::image type="content" source="media/web-ui-query/run-button-dropdown.png" alt-text="Screenshot of the web UI run button dropdown options." lightbox="media/web-ui-query/run-button-dropdown.png":::

## Manage queries in multiple contexts

With the use of query tabs, you can work on multiple queries simultaneously, all with their own query context. The query tabs allow you to switch between different databases and clusters without losing your work. To rename a query tab, double-click on the tab title or click the pencil icon on the tab. To get a comprehensive view of all existing tabs, use the tabs list located in the top right corner.

:::image type="content" source="media/web-ui-query/tabs-management.gif" alt-text="Moving screenshot of multiple tabs." lightbox="media/web-ui-query/tabs-management.gif":::

> [!NOTE]
> The default name of a query tab is based on the cluster and context database.

## Explore and transform query results

After you execute a query, the results are displayed in the results grid located below the query editor. The results grid presents query results in a tabular format, and provides functionality to sort, filter, group, and visualize the data in various ways. For more information, see [Azure Data Explorer web UI results grid](web-results-grid.md).

You can also view query statistics such as query duration, CPU and memory usage, and data scanned. These statistics can be useful when trying to optimize your queries. For information on potential optimizations, see [Query best practices](kusto/query/best-practices.md).

:::image type="content" source="media/web-ui-query/results-grid-with-stats.gif" alt-text="Moving screenshot of the results grid with statistics." lightbox="media/web-ui-query/results-grid-with-stats.gif":::

## Recall previous queries

The recall query button allows you to quickly retrieve a previously executed query. Select the query you want and select **Recall** to run it again from the data stored in the browser's cache.

:::image type="content" source="media/web-ui-query/recall-button.png" alt-text="Screenshot of query recall button." lightbox="media/web-ui-query/recall-button.png":::

> [!NOTE]
> The results for the last 50 queries are stored in the cache, so if the browser cache is cleared then the results are removed.

## Share and export queries

In the query page toolbar, there are several options to manage your queries and query results. You can pin a query to a dashboard, copy queries, copy query results, and export data to Power BI, Excel, and CSV formats. For more information, see [Share queries from Azure Data Explorer web UI](web-share-queries.md).

:::image type="content" source="media/web-ui-query/toolbar-options.png" alt-text="Screenshot of extended toolbar options." lightbox="media/web-ui-query/toolbar-options.png":::

## Related content

* Explore query results with the [web UI results grid](web-results-grid.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Customize settings in the web UI](web-customize-settings.md)
