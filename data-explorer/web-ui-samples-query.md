---
title: Explore sample data in the Azure Data Explorer web UI samples gallery
description: In this how-to article, you learn how to query data in the samples gallery in the Azure Data Explorer web UI.
ms.topic: how-to
ms.date: 05/17/2023
---
# Explore the samples gallery

The Azure Data Explorer web UI has a samples gallery for you to practice writing [Kusto Query Language (KQL)](kusto/query/index.md) queries and commands. This gallery provides sample data with guided tutorials in a free and publicly accessible [**help** cluster](https://dataexplorer.azure.com/clusters/help).

## Prerequisites

A Microsoft account or an Azure Active Directory user identity to sign in to the [**help** cluster](https://dataexplorer.azure.com/clusters/help). An Azure subscription isn't required.

## Get started

The following diagram is a high-level view of the databases available in the samples gallery.

:::image type="content" source="media/web-ui-samples-gallery/samples-high-level-diagram.png" alt-text="Flow chart showing the Azure Data Explorer divided into sample databases." border="false":::

## Take action on sample data

Get started learning about KQL queries with a dataset from the samples gallery.

1. Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) using your Microsoft account or Azure Active Directory user identity.

1. In the **Home** page, select **Explore sample data with KQL**.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-home-full-box.png" alt-text="Screenshot of the Azure Data Explorer web U I showing the home page." lightbox="media/web-ui-samples-gallery/web-ui-home-full-box.png":::

1. In the **Explore data samples** dialog box, select a sample dataset and then select **Explore**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-dashboards-dialog.png" alt-text="Screenshot of Explore data samples dialog box showing sample database options.":::

    In the cluster connections pane, the **help** cluster is displayed with sample databases showing [stored functions](kusto/query/schema-entities/stored-functions.md), [external tables](kusto/query/schema-entities/externaltables.md), [materialized views](kusto/management/materialized-views/materialized-view-overview.md), and database [tables](kusto/query/schema-entities/tables.md). The database selected in the sample data dialogue box is highlighted.

    :::image type="content" source="media/web-ui-samples-gallery/cluster-connection-pane.png" alt-text="Screenshot of Azure Data Explorer U I cluster connection pane showing sample databases and tables in a tree diagram.":::

    This diagram shows a high level view of the architectural data flow, from raw data through ingestion, processing, and materialized views.

    :::image type="content" source="media/web-ui-samples-gallery/high-level-flow-tables.png" alt-text="Flow chart showing a process from raw data ingestion to transformed data and materialized views." border="false":::

## Follow the tutorials

The query editor window, located to the right of the cluster connections pane, provides useful tutorials in the form of commonly used queries along with detailed explanations.

We'll take a look at the **Metrics** database, labeled as **SampleMetrics** in the cluster connections pane.

The **SampleMetrics** dataset consists of the following tables:

* RawServerMetrics: where raw data is ingested for temporary storage.
* TransformedServerMetrics: where parsed and processed data is stored.
* SQLServersLocation: containing reference data of servers' location.

> [!TIP]
> You can navigate to other tutorials from the query editor window. Select **File** > **Open tutorials** and then choose the specific tutorial you want to explore.
>
> :::image type="content" source="media/web-ui-samples-gallery/web-ui-tutorials-dropdown.png" alt-text="Screenshot showing Azure Data Explorer web U I dropdown menu to choose sample tutorials in query window.":::

## Run a query

In the query edit window, place your cursor in a query and select **Run** at the top of the window, or press *Shift* + *Enter* to run a query. Results are displayed in the query results pane, directly below the query editor window.

Before running any query or command, take a moment to read the comments above it. The comments include important information. For example, why certain management commands won't work in the **help** cluster due to lack of permissions. The query editor provides suggestions and warnings as you write queries. To customize which suggestions and warnings you receive, see [Set query recommendations](web-customize-settings.md#set-query-recommendations).

:::image type="content" source="media/web-ui-samples-gallery/web-ui-query-window.png" alt-text="Screenshot showing the query editor window with sample tutorials." lightbox="media/web-ui-samples-gallery/web-ui-query-window.png":::

## Learn management commands

Since certain management commands can't be run in the **help** cluster, you can [create your own free cluster](start-for-free-web-ui.md) to further explore these commands. Some examples of these commands are described in the following table.

| Table | Description | Command |
|--|--|--|
| **RawServerMetrics** | The ingestion [batching policy](kusto/management/batchingpolicy.md) can be configured to reduce the default ingestion latency from 5 minutes to 20 seconds, as described. | `.alter table RawServerMetrics policy ingestionbatching @'{"MaximumBatchingTimeSpan": "00:00:20", "MaximumNumberOfItems": 500,"MaximumRawDataSizeMB": 1024}'` |
| **RawServerMetrics** | The data [retention policy](kusto/management/retentionpolicy.md) can be configured to 10 days to avoid the duplication of data across raw and transformed tables. If needed, you can keep raw data for longer. For example, if there are any issues with the *TransformedServerMetrics* table, rather than going back to the source data, you can refer to the data in the *RawServerMetrics* table. | `.alter table RawServerMetrics policy retention '{"SoftDeletePeriod": "10.00:00:00", "Recoverability": "Enabled"}'` |
| **TransformedServerMetrics** | The [update policy](kusto/management/updatepolicy.md) can be applied to transform and parse raw data. | `.alter table TransformedServerMetrics policy update @'[{"IsEnabled": true, "Source": "RawServerMetrics", "Query": "Transform_RawServerMetrics()", "IsTransactional": true, "PropagateIngestionProperties": false}]'` |

## Next steps

* [Query data in the web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards (Preview)](azure-data-explorer-dashboards.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
