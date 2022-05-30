---
title: Azure Data Explorer Web samples gallery
description: In this how-to article, you learn how to use the samples gallery in Azure Data Explorer Web UI.
ms.reviewer: miwalia
ms.topic: quickstart
ms.date: 05/26/2022
ms.custom: mode-portal
---
# Explore the Azure Data Explorer Web UI samples gallery

The samples gallery provides an easy way to experience Azure Data Explorer and learn about Kusto Query Language (KQL) commands, queries, and built in dashboards using sample data in a free, publicly available [**help** cluster](https://dataexplorer.azure.com/clusters/help).

Exploring the samples gallery in the Azure Data Explorer Web UI eliminates the need to create a cluster, databases, tables, or [ingest data](/azure/data-explorer/ingest-data-overview). When you choose a dataset from the gallery, everything you need to explore the sample is immediately available in prepopulated tables and dashboards. Follow the tutorials to learn basic [KQL](write-queries.md), or start by exploring the built in dashboards.

## Prerequisites

A Microsoft account or an Azure Active Directory user identity to access the [**help** cluster](https://dataexplorer.azure.com/clusters/help). You don't require an Azure subscription or a credit card.

## Get started

The samples gallery includes datasets with guided tutorials and sample dashboards. The following diagram is a high-level view of the databases available in the samples gallery.

:::image type="content" source="media/web-ui-samples-gallery/samples-hi-level-diagram.png" alt-text="Flow chart showing the Azure Data Explorer divided into sample databases.":::

## Take action on sample data

Get started learning about KQL queries with a dataset from the samples gallery.

1. In the Azure Data Explorer Web UI [Home](https://dataexplorer.azure.com/home) page, select **Explore sample data with KQL**.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-home-full-box.png" alt-text="Screenshot of the Azure Data Explorer Web U I showing the home page." lightbox="media/web-ui-samples-gallery/ade-web-ui-home-full-box.png":::

1. In the **Explore data samples** dialog box, select a sample dataset and then select **Explore**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-data-samples-dialog-fl.png" alt-text="Screenshot of Explore data samples dialog box showing sample database options.":::

    In the cluster connections pane, the **help** cluster is displayed with sample databases showing [stored functions](kusto/query/schema-entities/stored-functions.md), [external tables](kusto/query/schema-entities/externaltables.md), [materialized views](kusto/management/materialized-views/materialized-view-overview.md), and database [tables](kusto/query/schema-entities/tables.md). The database selected in the sample data dialogue box is highlighted.

    :::image type="content" source="media/web-ui-samples-gallery/cluster-connection-pane.png" alt-text="Screenshot of Azure Data Explorer U I cluster connection pane showing sample databases and tables in a tree diagram.":::

This diagram shows a high level view of the architectural data flow, from raw data through ingestion, processing, and materialized views.

:::image type="content" source="media/web-ui-samples-gallery/high-level-flow-tables.png" alt-text="Flow chart showing a process from raw data ingestion to transformed data and materialized views.":::

## Explore sample data with KQL tutorials

To the right of the cluster connections pane, the query editor window contains explanatory tutorials in the form of commonly used queries with detailed descriptions. In our example we explore the Metrics database, listed in the cluster connections pane as **SampleMetrics**. A similar set of tutorials and queries are available for each of the sample datasets.

Tables in the **SampleMetrics** dataset include:

- **RawServerMetrics**: a staging table where raw data is ingested.
- **TransformedServerMetrics**: a destination table for storing parsed and processed data.
- **SQLServersLocation**: a table for servers' location reference data.

To explore data in the tables, review and run the tutorials of KQL queries in the query editor window.

:::image type="content" source="media/web-ui-samples-gallery/web-ui-query-window-1200px.png" alt-text="Screenshot showing the query editor window with sample tutorials." lightbox="media/web-ui-samples-gallery/web-ui-query-window-1200px.png":::

1. In the query edit window, place your cursor in a query and select **Run** at the top of the window, or press *Shift* + *Enter* to run a query.

    Results are displayed in the query results pane, directly below the query editor window.

1. Learn about table policies with tutorials of the following commands:

    | Table | Description | Command |
    |--|--|--|
    | **RawServerMetrics** | The ingestion [batching policy](kusto/management/batchingpolicy.md) can be configured to reduce the default ingestion latency from 5 minutes to 20 seconds, as described. | `.alter table RawServerMetrics policy ingestionbatching @'{"MaximumBatchingTimeSpan": "00:00:20", "MaximumNumberOfItems": 500,"MaximumRawDataSizeMB": 1024}'` |
    | **RawServerMetrics** | The data [retention policy](kusto/management/retentionpolicy.md) can be configured to 10 days to avoid the duplication of data across raw and transformed tables. If needed, you can keep raw data for longer. For example, if there are any issues with the *TransformedServerMetrics* table, rather than going back to the source data, you can refer to the data in the *RawServerMetrics* table. | `.alter table RawServerMetrics policy retention '{"SoftDeletePeriod": "10.00:00:00", "Recoverability": "Enabled"}'` |
    | **TransformedServerMetrics** | The [update policy](kusto/management/updatepolicy.md) can be applied to transform and parse raw data. | `.alter table TransformedServerMetrics policy update @'[{"IsEnabled": true, "Source": "RawServerMetrics", "Query": "Transform_RawServerMetrics()", "IsTransactional": true, "PropagateIngestionProperties": false}]'` |

1. Run more tutorials on the other sample datasets to:
    - Learn how to use the parse operator, bin function, mv-expand operator to parse complex json payloads with nested arrays, and join tables.
    - Use SQL when querying and quickly transform SQL to KQL. For more information on SQL to KQL conversions, see the [SQL to Kusto cheat sheet](kusto/query/sqlcheatsheet.md).
    - Create [materialized views](kusto/management/materialized-views/materialized-view-overview.md) for deduplication of data, down sampling, and getting the last known or latest value.

    > [!TIP]
    > You can navigate to other tutorials from the query editor window. Select **File** > **Open tutorials** and then choose the specific tutorial you want to explore.
    >
    > :::image type="content" source="media/web-ui-samples-gallery/web-ui-tutorials-dropdown-300px.png" alt-text="Screenshot showing Azure Data Explorer web U I dropdown menu to choose sample tutorials in query window.":::

## Explore sample dashboards

Dashboards allow users to visualize information and gain insights from data without using the KQL query language. You can explore data easily by adjusting the parameters and visuals in dashboard editors.

1. In the Azure Data Explorer Web UI [Home](https://dataexplorer.azure.com/home) page, select **Explore sample dashboards**.

1. In the **Explore dashboards** dialog box, choose a sample dashboard and then select **Explore**. In keeping with the example above, select the **Metrics sample dashboard**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-dashboards-dialog-fl.png" alt-text="Screenshot of Explore dashboards samples dialog box showing sample dashboard options.":::

    The dashboard window opens in Edit mode, with different types of prepopulated tiles.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-dashboard-full.png" alt-text="Screenshot showing the samples gallery dashboard from the Metrics data database, with a variety of tiles." lightbox="media/web-ui-samples-gallery/web-ui-dashboard-full.png":::

1. Explore dashboard options and individual tiles to [view parameters](dashboard-parameters.md#view-parameters-list) and [customize visuals](dashboard-customize-visuals.md#customize-visuals).

## Next steps

- [Query data in Azure Data Explorer Web UI](web-query-data.md#run-queries)
- [Samples for Kusto Queries](kusto/query/samples.md)
- [Visualize data with Azure Data Explorer dashboards(Preview)](azure-data-explorer-dashboards.md)
