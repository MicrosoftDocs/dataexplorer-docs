---
title: Azure Data Explorer web UI query data overview
description: This article describes the elements of Azure Data Explorer web UI related to querying data.
ms.topic: conceptual
ms.date: 01/29/2023
---

# Query data in the Azure Data Explorer web UI

The Azure Data Explorer web UI provides a comprehensive data exploration experience, covering everything from data ingestion to querying data and creating visualizations and dashboards. This overview highlights the areas of the web UI related to querying your data.

## Query data

To start querying data, you have a few options:

* Connect to the free and publicly accessible [**help** cluster](https://dataexplorer.azure.com/clusters/help/)
* [Create a free cluster](start-for-free-web-ui.md)
* [Create a full cluster](create-cluster-database-portal.md)
* [Connect to an existing cluster](web-query-data.md#add-clusters)

Once you've connected to a data source, you can write and run [Kusto Query Language (KQL)](kusto/query/index.md) queries on the **Query** page. Select the database you want to run the query on in the left menu. The highlighted database will provide the context for your query.

:::image type="content" source="media/web-ui-overviews/query-page.png" alt-text="Screenshot of the results page with the query editor and results grid highlighted.":::

## Next steps

* Learn module: [Write your first KQL query](/training/modules/write-first-query-kusto-query-language/)
* [Query sample data](web-ui-samples-query.md) in the Azure Data Explorer web UI
* Learn how to view results using the [Results grid](web-results-grid.md)
