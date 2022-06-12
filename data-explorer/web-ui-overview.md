---
title: Azure Data Explorer Web UI overview
description: This article describes the Azure Data Explorer Web UI and the home page properties. 
ms.reviewer: mibar
ms.topic: conceptual
ms.date: 06/07/2022
ms.custom: mode-portal
---

# Azure Data Explorer Web UI overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. The Azure Data Explorer [Web UI](https://dataexplorer.azure.com) is a web application that provides an end-to-end experience of Azure Data Explorer, including streamlined processes to ingest data, query using Kusto Query Language (KQL), and view dashboard visualizations. You can start by accessing the free sample data available from the Web UI, or by [ingesting](ingest-data-overview.md) your own data.

The following image shows the Azure Data Explorer Web UI **Home** page and navigation pane for accessing the core elements of the Web UI.

:::image type="content" source="media/web-ui-overview/web-ui-home-full-numbered.png" alt-text="Screenshot of Azure Data Explorer Web U I with numbered sections." lightbox="media/web-ui-overview/web-ui-home-full-numbered.png":::

1. Navigation pane
1. Help, feedback, and settings
1. Quick actions to help you get started with data exploration
1. Recommendations for additional resources and training
1. Documentation

## Experience data exploration using the Web UI

Use the navigation pane to guide your data analytics journey.

- Get started quickly with the [**Home** page](https://dataexplorer.azure.com/home), which provides free and immediate access to the **help** cluster and the [samples gallery](web-ui-samples-gallery.md), complete with sample data, query tutorials, and built-in dashboards. From the home page, you can also easily create a [free cluster](start-for-free.md) or connect to your own clusters.
- In the **Data** tab, explore the [**Data Management**](https://dataexplorer.azure.com/oneclick) page, to ingest and organize data. The [one click ingestion](ingest-data-one-click.md) wizard makes data ingestion fast and intuitive.
- Once you've connected to data, select the **Query** tab on the left menu to open the [query editor window](https://dataexplorer.azure.com). In the query pane, you can [write](write-queries.md) or learn from descriptive tutorials in the [samples gallery](https://dataexplorer.azure.com/clusters/help).
- In [**Dashboards**](https://dataexplorer.azure.com/dashboards), you can [visualize](azure-data-explorer-dashboards.md) and explore either your own data or built-in dashboards from the samples gallery.
- [**MyCluster**](https://dataexplorer.azure.com/freecluster) allows you to experience the capabilities of Azure Data Explorer for [free](start-for-free-web-ui.md) using your own data.

## Explore the home page

In the **[Home](https://dataexplorer.azure.com/home)** page, take action on the sample data provided or explore your own data.

- Get started by exploring sample data, dashboards, and connecting to clusters.
  - Choose a dataset from the [samples gallery](web-ui-samples-gallery.md) that is most relevant to your needs, and review the provided hands-on tutorials to learn KQL and run queries.
  - Visualize data with [sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards).
  - Ingest your own data and analyze it for free using [My Cluster](https://dataexplorer.azure.com/freecluster), or connect to an existing [cluster](web-query-data.md#add-clusters).

## Manage your data

In **[Data management](https://dataexplorer.azure.com/oneclick)**, ingest data and make it available for queries.

- Begin with quick actions such as [ingest data](https://dataexplorer.azure.com/oneclick/ingest?sourceType=file), [create tables](https://dataexplorer.azure.com/oneclick/createtable), explore [batching policies](https://dataexplorer.azure.com/oneclick/updateTableBatchingPolicy), and [generate a sample app](https://dataexplorer.azure.com/oneclick/generatecode?sourceType=file).
- Review different ingestion options or search for available actions.
  - Manage data with [external tables](external-table.md) and learn about [batching](/azure/data-explorer/kusto/management/batchingpolicy) and [retention](/azure/data-explorer/kusto/management/retentionpolicy) policies.
  - Use one-time ingestion from various sources including [local files and blob storage](/azure/data-explorer/ingest-data-one-click), or a [container](/azure/data-explorer//one-click-ingestion-new-table)
  - Configure continuous ingestion from [Event Hubs](/azure/data-explorer/one-click-event-hub) or a blob container.
  - Backfill from data storage or learn more about SDKs and connectors, to expand your data analytics options.

## Query your data

 In the query editor window, write and run queries to process data with the Azure Data Explorer.

- Explore the [samples gallery](web-ui-samples-gallery.md) to query pre-populated tables using [KQL tutorials](web-ui-samples-gallery.md#explore-sample-data-with-kql-tutorials).
- Learn about query statements in Kusto Query Language (KQL) with this [overview](/azure/data-explorer/kusto/query/).
- Familiarize yourself with Kusto Query Language with a [tutorial that runs queries](/azure/data-explorer/kusto/query/samples?pivots=azuredataexplorer) on sample data.
- Expand your knowledge with a [KQL learning module](/learn/modules/write-first-query-kusto-query-language/).

## Visualize your data

Visualize and develop insights through sample dashboards or using your own data.

- [Explore sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards) with sample data from the [**help** cluster](https://dataexplorer.azure.com/clusters/help).
- Gain insights and [visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md).
- Use dashboard parameters to explore and [interact with your data](dashboard-parameters.md#interact-with-your-data-using-cross-filter).
- [Customize](dashboard-customize-visuals.md#customize-azure-data-explorer-dashboard-visuals) visuals in dashboard tiles.

## Next steps

- [Ingest sample data into Azure Data Explorer](ingest-sample-data.md)
- [Query data in Azure Data Explorer Web UI](web-query-data.md)
- [Explore Azure Data Explorer Web UI samples gallery](web-ui-samples-gallery.md)
