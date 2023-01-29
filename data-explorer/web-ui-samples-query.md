---
title: Query data in the Azure Data Explorer web UI samples gallery
description: In this how-to article, you learn how to query data in the samples gallery in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 06/22/2022
---
# Query data in the Azure Data Explorer web UI samples gallery

The Azure Data Explorer web UI has a samples gallery for learning all about Kusto Query Language (KQL) queries and commands. The samples gallery provides sample data in a free, publicly available [**help** cluster](https://dataexplorer.azure.com/clusters/help) so that you can get started without needing to create a cluster, database, table, or [ingest data](./ingest-data-overview.md).

## Prerequisites

A Microsoft account or an Azure Active Directory user identity to sign in to the [**help** cluster](https://dataexplorer.azure.com/clusters/help). An Azure subscription isn't required.

## Get started

The samples gallery includes datasets with guided tutorials and sample dashboards. The following diagram is a high-level view of the databases available in the samples gallery.

:::image type="content" source="media/web-ui-samples-gallery/samples-high-level-diagram.png" alt-text="Flow chart showing the Azure Data Explorer divided into sample databases." border="false":::

## Take action on sample data

Get started learning about KQL queries with a dataset from the samples gallery.

1. In the Azure Data Explorer web UI [Home](https://dataexplorer.azure.com/home) page, select **Explore sample data with KQL**.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-home-full-box.png" alt-text="Screenshot of the Azure Data Explorer web U I showing the home page." lightbox="media/web-ui-samples-gallery/web-ui-home-full-box.png":::

1. In the **Explore data samples** dialog box, select a sample dataset and then select **Explore**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-dashboards-dialog.png" alt-text="Screenshot of Explore data samples dialog box showing sample database options.":::

    In the cluster connections pane, the **help** cluster is displayed with sample databases showing [stored functions](kusto/query/schema-entities/stored-functions.md), [external tables](kusto/query/schema-entities/externaltables.md), [materialized views](kusto/management/materialized-views/materialized-view-overview.md), and database [tables](kusto/query/schema-entities/tables.md). The database selected in the sample data dialogue box is highlighted.

    :::image type="content" source="media/web-ui-samples-gallery/cluster-connection-pane.png" alt-text="Screenshot of Azure Data Explorer U I cluster connection pane showing sample databases and tables in a tree diagram.":::

This diagram shows a high level view of the architectural data flow, from raw data through ingestion, processing, and materialized views.

:::image type="content" source="media/web-ui-samples-gallery/high-level-flow-tables.png" alt-text="Flow chart showing a process from raw data ingestion to transformed data and materialized views." border="false":::

## Explore sample data with KQL tutorials

To the right of the cluster connections pane, the query editor window contains explanatory tutorials in the form of commonly used queries with detailed descriptions. In our example we explore the Metrics database, listed in the cluster connections pane as **SampleMetrics**. A similar set of tutorials and queries are available for each of the sample datasets.

Tables in the **SampleMetrics** dataset include:

- **RawServerMetrics**: a staging table where raw data is ingested.
- **TransformedServerMetrics**: a destination table for storing parsed and processed data.
- **SQLServersLocation**: a table for servers' location reference data.

To explore data in the tables, review and run the tutorials of KQL queries in the query editor window.

:::image type="content" source="media/web-ui-samples-gallery/web-ui-query-window.png" alt-text="Screenshot showing the query editor window with sample tutorials." lightbox="media/web-ui-samples-gallery/web-ui-query-window.png":::

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
    > :::image type="content" source="media/web-ui-samples-gallery/web-ui-tutorials-dropdown.png" alt-text="Screenshot showing Azure Data Explorer web U I dropdown menu to choose sample tutorials in query window.":::

## Next steps

- [Query data in the Azure Data Explorer web UI](web-query-data.md#run-queries)
- [Visualize data with Azure Data Explorer dashboards (Preview)](azure-data-explorer-dashboards.md)
