---
title: Azure Data Explorer Web UI overview
description: This article describes the Azure Data Explorer Web UI and the home page properties. 
ms.reviewer: mibar
ms.topic: conceptual
ms.date: 06/15/2022
ms.custom: mode-portal
---

# Azure Data Explorer Web UI overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. The [Azure Data Explorer Web UI](https://dataexplorer.azure.com) is a web application that provides an end-to-end experience of Azure Data Explorer, including streamlined processes to ingest data, query using Kusto Query Language (KQL), and view dashboard visualizations. You can start by accessing the free sample data available from the Azure Data Explorer Web UI, or by [ingesting](ingest-data-overview.md) your own data.

The following image shows the Azure Data Explorer Web UI home page and left pane for accessing the core elements of the Web UI.

:::image type="content" source="media/web-ui-overview/web-ui-home-full-numbered.png" alt-text="Screenshot of Azure Data Explorer Web U I with numbered sections." lightbox="media/web-ui-overview/web-ui-home-full-numbered.png":::

1. Left pane
1. Help, feedback, and settings
1. Quick actions to help you get started with data exploration
1. Recommendations for additional resources and training
1. Documentation

## Experience data exploration using the Web UI

Azure Data Explorer provides a web experience that enables you to connect to your Azure Data Explorer clusters and manage data with several streamlined processes.

- From the Azure Data Explorer Web UI **Home** page, start with the [samples gallery](web-ui-samples-gallery.md) to access query tutorials and built-in sample dashboards prepopulated with data from the **help** cluster, or connect to your own cluster.
- Select **My Cluster** to create a [free Azure Data Explorer cluster](start-for-free-web-ui.md) using your own data.
- Continue with the tabs in the left pane to guide your data analytics journey.

    | Tab | Description  |
    |---------|----------|
    | **Data** |  Ingest data from different sources, create database tables, and map the table schema. Learn about the different ways to ingest data with the fast and intuitive [one click ingestion](ingest-data-one-click.md) wizard.   |
    | **Query** |  Open the [query editor window](https://dataexplorer.azure.com)to [write](write-queries.md) and run queries, or learn from descriptive tutorials in the [samples gallery](https://dataexplorer.azure.com/clusters/help).        |
    | **Dashboards** | [Visualize](azure-data-explorer-dashboards.md) and explore either your own data or built-in dashboards from the samples gallery.        |

## Explore the home page

In the **[Home](https://dataexplorer.azure.com/home)** page, query the sample data provided or explore your own data.

- **Explore sample data with KQL**:  choose a dataset from the [samples gallery](web-ui-samples-gallery.md) that is most relevant to your needs. Next, review the provided hands-on tutorials to learn KQL and run queries.
- **Explore sample dashboards**:  explore data visualization with [sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards).
- [**Create a free cluster**](https://dataexplorer.azure.com/freecluster) or [My Cluster](https://dataexplorer.azure.com/freecluster): ingest your own data and analyze it for free.
- **Connect to your org clusters**: connect to an existing [cluster](web-query-data.md#add-clusters).
- Review **Recommended** learning modules and **Basic** and **Advanced documentation** to build your skills.

## Manage your data

In the **[Data management](https://dataexplorer.azure.com/oneclick)** page, ingest data and set policies to optimize data ingestion and management.

- Select from quick actions to [ingest data](https://dataexplorer.azure.com/oneclick/ingest?sourceType=file), [create tables](https://dataexplorer.azure.com/oneclick/createtable), update [batching policies](https://dataexplorer.azure.com/oneclick/updateTableBatchingPolicy), and [generate a sample app](https://dataexplorer.azure.com/oneclick/generatecode?sourceType=file).
- Explore different ingestion options by topic:

    |Tab  |Ingestion options  |
    |---------|---------|
    |**Manage**     | Create [database tables](https://dataexplorer.azure.com/oneclick/createtable), [external tables](external-table.md) and update [batching](/azure/data-explorer/kusto/management/batchingpolicy) and [retention](/azure/data-explorer/kusto/management/retentionpolicy) policies.      |
    |**One-time ingestion**    | Ingest from [local files, blob storage](/azure/data-explorer/ingest-data-one-click), or a [container](/azure/data-explorer//one-click-ingestion-new-table).      |
    |**Continuous ingestion**     | Configure continuous ingestion from [Event Hubs](/azure/data-explorer/one-click-event-hub) or a blob container.        |
    |**Backfill**     |  Ingest data from sources as a one time or continuous ingestion.       |
    |**SDKs**     |  The [one-click sample app generator](https://dataexplorer.azure.com/oneclick/generatecode?programingLang=Python) is a tool that allows you to create a working app to [ingest and query your data in your preferred programming language](sample-app-generator-one-click.md). Learn more about connectors to expand and explore the capabilities of Azure Data Explorer.    |

- Use the search box on the right side of the page to filter cards by key terms.

## Query your data

 In the [query editor window](https://dataexplorer.azure.com/), write and run KQL queries to process data with the Azure Data Explorer.

- [Add the help cluster](web-query-data.md#add-clusters) to ingest sample data and access the samples gallery.
- Explore the [samples gallery](web-ui-samples-gallery.md) to query prepopulated tables using [KQL tutorials](web-ui-samples-gallery.md#explore-sample-data-with-kql-tutorials).
- Read more about [Kusto Query Language](/azure/data-explorer/kusto/query/).
- Learn how to [write your first KQL query](/learn/modules/write-first-query-kusto-query-language/).

## Visualize your data

In the [dashboard editor](https://dataexplorer.azure.com/dashboards), visualize data and develop insights through sample dashboards, or by building new dashboards and viewing dashboards shared by others.

- Gain insights and [visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).
- From the Home page, select **Explore sample dashboards** to [view sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards) with data from the **help** cluster.
- [Create a dashboard](azure-data-explorer-dashboards.md#create-a-dashboard) in the Web UI or by [importing a dashboard file](azure-data-explorer-dashboards.md#to-create-new-dashboard-from-a-file).
- Use dashboard parameters to explore and [interact with your data](dashboard-parameters.md#interact-with-your-data-using-cross-filter).
- [Customize](dashboard-customize-visuals.md#customize-azure-data-explorer-dashboard-visuals) visuals in dashboard tiles.

## Next steps

- [Ingest sample data into Azure Data Explorer](ingest-sample-data.md)
- [Query data in Azure Data Explorer Web UI](web-query-data.md)
- [Explore Azure Data Explorer Web UI samples gallery](web-ui-samples-gallery.md)
