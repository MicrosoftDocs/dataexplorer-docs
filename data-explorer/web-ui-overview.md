---
title: Azure Data Explorer Web UI overview
description: This article describes the Azure Data Explorer Web UI and the home page properties. 
ms.reviewer: mibar
ms.topic: conceptual
ms.date: 05/26/2022
ms.custom: mode-portal
---

# Azure Data Explorer Web UI overview

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. The Azure Data Explorer [Web UI](https://dataexplorer.azure.com) is a web application that provides an end to end experience of Azure Data Explorer, including streamlined processes to ingest data, query using Kusto Query Language (KQL), and view dashboard visualizations. You can start by accessing the free sample data available from the Web UI, or by [ingesting](ingest-data-overview.md) your own data.

The following image shows the Azure Data Explorer Web UI **Home** page and navigation pane for accessing the core elements of the Web UI.

:::image type="content" source="media/web-ui-overview/web-ui-home-full-numbered.png" alt-text="Screenshot of Azure Data Explorer Web U I with numbered sections." lightbox="media/web-ui-overview/web-ui-home-full-numbered.png":::

1. Navigation pane
1. Help, feedback, and settings
1. Quick actions to help you get started with data exploration
1. Recommendations for additional resources and training
1. Documentation

## Experience data exploration using the Web UI

Use the navigation pane to guide your data analytics journey.

- Get started quickly with the [**Home** page](https://dataexplorer.azure.com/home), which provides free and immediate access to the **help** cluster and the [samples gallery](web-ui-samples-gallery.md), complete with sample data, query tutorials, and built in dashboards. From the **Home** page, you can also easily create a [free cluster](start-for-free.md) or connect to your own clusters. To help you on your journey, check out additional information including **Recommended** reading and basic and advanced **Documentation**.
- In the **Data** tab, explore the [**Data Management**](https://dataexplorer.azure.com/oneclick) page, to ingest and organize data. The [one click ingestion](ingest-data-one-click.md) wizard makes data ingestion fast and intuitive.
- Once you've ingested either your own data or accessed the **help** cluster, check out the **Query** tab to open the [query editor window](https://dataexplorer.azure.com). From here you can [write](write-queries.md) and run your own KQL commands and queries, or learn from descriptive tutorials in the [samples gallery](https://dataexplorer.azure.com/clusters/help) to help you get started.
- [**Dashboards**](https://dataexplorer.azure.com/dashboards) allow you to [visualize](azure-data-explorer-dashboards.md) and explore either your own data or built in dashboards from the samples gallery.
- [**MyCluster**](https://dataexplorer.azure.com/freecluster) allows you to explore the capabilities of Azure Data Explorer for free [using](start-for-free-web-ui.md) your own data.

## Explore the Home page

Take action on the sample data provided or explore your own data.

- Explore sample data with KQL. Choose a dataset from the [samples gallery](web-ui-samples-gallery.md) that is most relevant to your needs. Then explore the provided hands-on tutorials to learn KQL and run queries.
- Explore [sample dashboards](web-ui-samples-gallery.md#explore-sample-dashboards) to visualize data and gain insights.
- Explore your own data. Connect to an existing cluster or bring your own data and [analyze it for free using My Cluster](start-for-free.md).

## Manage your data

Ingest and organize your data to explore data in a variety of ways.

- After you've created a [cluster and database in Azure Data Explorer](create-cluster-database-portal.md), [create a table](one-click-table.md) to ingest and query your data.
- Create an [external table](external-table.md) to reference data stored outside the Azure Data Explorer database.
- Configure [streaming ingestion](ingest-data-streaming.md) on your Azure Data Explorer cluster.
- Create a [working app](sample-app-generator-one-click.md) to ingest and query data in your preferred programming language.

## Run queries on your data

 Write and run queries on to analyze diverse data with the Azure Data Explorer Web UI.

-[Query data in Azure Data Explorer Web UI](web-query-data.md#run-queries)
- 
- 


## Next steps

- [Ingest sample data into Azure Data Explorer](ingest-sample-data.md)
- 
- [Explore Azure Data Explorer Web UI samples gallery](web-ui-samples-gallery.md)
