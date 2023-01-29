---
title: Azure Data Explorer web UI query data overview
description: This article describes the elements of Azure Data Explorer web UI related to querying data.
ms.topic: conceptual
ms.date: 01/29/2023
---

# Query data in the Azure Data Explorer web UI

The Azure Data Explorer web UI provides a comprehensive data exploration experience, covering everything from data ingestion to querying data and creating visualizations and dashboards. This overview highlights the areas of the web UI related to querying your data.

## Connect to a cluster

To query data, you'll need a cluster and database. You can use the publicly available [**help** cluster](https://dataexplorer.azure.com/clusters/help/), [create a free cluster](start-for-free-web-ui.md), [create a full cluster](create-cluster-database-portal.md), or[connect to an existing cluster](web-query-data.md#add-clusters).

## Query data

Once you've ingested data or connected to a data source, use the [query page](https://dataexplorer.azure.com/clusters/help) to query data and explore results.

:::image type="content" source="media/web-ui-overviews/query-page.png" alt-text="Screenshot of the results page with the query editor and results grid highlighted.":::

In this page, you can write and run Kusto Query Language (KQL) queries in the query editor window. For help getting started with KQL, see the following articles.

* [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md)
* [Kusto Query Language overview](./kusto/query/index.md).
* Learn module: [Write your first KQL query](/training/modules/write-first-query-kusto-query-language/).

Once you have query results, you can View and manipulate the results in the [results grid](web-results-grid.md).

## Next steps

* [Query sample data](web-ui-samples-query.md)
* [Customize settings](web-customize-settings.md)
* [Share queries](web-share-queries.md)
