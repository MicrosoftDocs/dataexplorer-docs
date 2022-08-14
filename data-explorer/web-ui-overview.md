---
title: Azure Data Explorer web UI overview
description: This article describes the elements of Azure Data Explorer web UI home page and the data analytics journey.
ms.reviewer: mibar
ms.topic: conceptual
ms.date: 08/14/2022
ms.custom: mode-portal
---

# Azure Data Explorer web UI overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. You can interact with Azure Data Explorer through a number of routes, including:

* Azure Data Explorer [web UI](https://dataexplorer.azure.com).
* The desktop application [Kusto.Explorer](kusto/tools/kusto-explorer.md)
* [Kusto CLI](kusto/tools/kusto-cli.md)
* A variety of [APIs](kusto/api/index.md)

In this article, you'll see how the web UI option offers an end-to-end data exploration experience, from data ingestion to data query and dashboards. You don't need an Azure account to use the web UI. All you need is a Microsoft-linked email account.

## Web UI at a glance

The following image shows the Azure Data Explorer web UI **Home** page and navigation pane for accessing the core elements.

:::image type="content" source="media/web-ui-overview/web-ui-home-full-numbered.png" alt-text="Screenshot of Azure Data Explorer web UI." lightbox="media/web-ui-overview/web-ui-home-full-numbered.png":::

There are five tabs on the left pane: 

* [Home](#where-do-i-start)
* [Data](#data)
* [Query](#query)
* [Dashboards](#dashboards-preview)
* [My cluster](#my-cluster-preview)

Access help, feedback, and settings by selecting one of the icons in the top right corner of the menu bar. 

## Where do I start?

In the **[Home](https://dataexplorer.azure.com/home)** page, you can get started on different workflows.

* Explore the service using publicly available data: 
    * **Explore sample data with KQL**:  choose a dataset from the [samples gallery](web-ui-samples-gallery.md) that is most relevant to your needs. Next, review the provided hands-on tutorials to learn KQL and run queries.
    * **Explore sample dashboards**:  Explore data visualization with [sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards).
* Work on your own data without committing resources: 
    * [**Create a free cluster**](https://dataexplorer.azure.com/freecluster) or [**My Cluster**](https://dataexplorer.azure.com/freecluster): Ingest your own data and analyze it for free.
* **Connect to an existing cluster in your org**: [Add clusters](web-query-data.md#add-clusters). You'll need the cluster URI and permission to access this data.

At the bottom of the home page, you'll find links to some general documentation and Learn modules to help you learn more about Kusto Query Language.

## Data

The **[Data management](https://dataexplorer.azure.com/oneclick)** page is where you ingest data and set policies on ingestion and retention.

> [!NOTE] 
> Use the search box on the right side of the page to filter cards by key terms.

:::image type="content" source="media/web-ui-overview/data-management-page.png" alt-text="Screenshot of data management homepage":::

* Select from quick actions to [ingest data](https://dataexplorer.azure.com/oneclick/ingest?sourceType=file), [create tables](https://dataexplorer.azure.com/oneclick/createtable), update [batching policies](https://dataexplorer.azure.com/oneclick/updateTableBatchingPolicy), and [generate a sample app](https://dataexplorer.azure.com/oneclick/generatecode?sourceType=file).
* Read more about these actions in the documentation:

    |Tab  |Ingestion options  |
    |---------|---------|
    |**Manage**     | Create [tables](https://dataexplorer.azure.com/oneclick/createtable), [external tables](external-table.md) and update [batching](/azure/data-explorer/kusto/management/batchingpolicy) and [retention](/azure/data-explorer/kusto/management/retentionpolicy) policies.      |
    |**One-time ingestion**    | Ingest from [local files, blob storage](/azure/data-explorer/ingest-data-one-click), or a [container](/azure/data-explorer//one-click-ingestion-new-table).      |
    |**Continuous ingestion**     | Configure continuous ingestion from [Event Hubs](/azure/data-explorer/one-click-event-hub) or a blob container.        |
    |**Backfill**     |  Ingest data from sources as a one time or [continuous ingestion](one-click-ingestion-new-table.md).       |
    |**SDKs**     |  The [one-click sample app generator](https://dataexplorer.azure.com/oneclick/generatecode?programingLang=Python) is a tool that allows you to create a working app to [ingest and query your data in your preferred programming language](sample-app-generator-one-click.md). Learn more about connectors to expand and explore the capabilities of Azure Data Explorer.    |

## Query

Once you've ingested data or connected to a data source, you'll use the [query page](https://dataexplorer.azure.com/clusters/help) to query data and explore results.

:::image type="content" source="media/web-ui-overview/query-page.png" alt-text="Screenshot of the results page with the query editor and results grid highlighted.":::

* Write and run Kusto Query Language (KQL) queries in the query editor window. For help getting started with KQL, see: 
    * [Quickstart: Query data in the Azure Data Explorer web UI](web-query-data.md)
    * [Kusto Query Language overview](./kusto/query/index.md).
    * Learn module: [Write your first KQL query](/learn/modules/write-first-query-kusto-query-language/).
* View and manipulate results in the results grid.

## Dashboards (preview)

[Dashboards](https://dataexplorer.azure.com/dashboards) tell a story through visualizations, and are an interactive way to monitor your data and see all of your most important insights at a glance. See a sample dashboard below for example.

:::image type="content" source="media/adx-dashboards/dash.png" alt-text="Screenshot of sample dashboard.":::

* [View sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards) with data from the **help** cluster.
* Create your own dashboards using the following guidance:
    * [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).
    * [Create a dashboard](azure-data-explorer-dashboards.md#create-a-dashboard) 
    * [Use dashboard parameters](dashboard-parameters.md)
    * [Customize dashboard visuals](dashboard-customize-visuals.md)

## My cluster (preview)

Manage your [free cluster](https://dataexplorer.azure.com/freecluster) with the following options:
* Upgrade to Azure Cluster
* View cluster URI, data ingestion URI, and cluster policies
* Create a database in your free cluster

## Next steps

* [Ingest sample data into Azure Data Explorer](ingest-sample-data.md)
* [Query data in the Azure Data Explorer web UI](web-query-data.md#run-queries)
* [Explore the Azure Data Explorer web UI samples gallery](web-ui-samples-gallery.md)
