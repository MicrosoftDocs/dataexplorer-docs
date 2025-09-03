---
title: "Azure Data Explorer: Explore Sample Data"
description: "Azure Data Explorer: Learn how to query sample data in the free help cluster using Kusto Query Language (KQL). Follow step-by-step tutorials and try queries now."
#customer intent: As a developer, I want to run sample KQL queries in the free help cluster so that I can learn query syntax and see results quickly.
ms.topic: how-to
ms.date: 09/02/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:09/02/2025
  - ai-gen-description
---
# Explore the samples gallery

Use the Azure Data Explorer samples gallery to learn and practice [Kusto Query Language (KQL)](/kusto/query/index?view=azure-data-explorer&preserve-view=true) with curated datasets in the free, public [**help** cluster](https://dataexplorer.azure.com/clusters/help). Run ready-made tutorials, edit queries, and see results immediately—no Azure subscription required. Sign in with a Microsoft account or a Microsoft Entra identity and start exploring sample databases, tables, stored functions, external tables, and materialized views.

## Prerequisites

Sign in to the [**help** cluster](https://dataexplorer.azure.com/clusters/help) with a Microsoft account or a Microsoft Entra user identity. You don't need an Azure subscription.

## Get started

The following diagram is a high-level view of the databases available in the samples gallery.

:::image type="content" source="media/web-ui-samples-gallery/samples-high-level-diagram.png" alt-text="Diagram that shows a flow chart of the databases available in the samples gallery for Azure Data Explorer." border="false":::

## Take action on sample data

Get started learning about KQL queries with a dataset from the samples gallery.

1. Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/home) using your Microsoft account or Microsoft Entra user identity.

1. In the **Home** page, select **Explore sample data with KQL**.

    :::image type="content" source="media/web-ui-samples-gallery/web-ui-home-full-box.png" alt-text="Screenshot of the Azure Data Explorer web U I showing the home page." lightbox="media/web-ui-samples-gallery/web-ui-home-full-box.png":::

1. In the **Explore data samples** dialog box, select a sample dataset, and then select **Explore**.

    :::image type="content" source="media/web-ui-samples-gallery/explore-dashboards-dialog.png" alt-text="Screenshot of Explore data samples dialog box showing sample database options.":::

    In the cluster connections pane, the **help** cluster is displayed with sample databases showing [stored functions](/kusto/query/schema-entities/stored-functions?view=azure-data-explorer&preserve-view=true), [external tables](/kusto/query/schema-entities/external-tables?view=azure-data-explorer&preserve-view=true), [materialized views](/kusto/management/materialized-views/materialized-view-overview?view=azure-data-explorer&preserve-view=true), and database [tables](/kusto/query/schema-entities/tables?view=azure-data-explorer&preserve-view=true). The database selected in the sample data dialogue box is highlighted.

    :::image type="content" source="media/web-ui-samples-gallery/cluster-connection-pane.png" alt-text="Screenshot of Azure Data Explorer U I cluster connection pane showing sample databases and tables in a tree diagram.":::

    This diagram shows a high level view of the architectural data flow, from raw data through ingestion, processing, and materialized views.

    :::image type="content" source="media/web-ui-samples-gallery/high-level-flow-tables.png" alt-text="Flow chart showing a process from raw data ingestion to transformed data and materialized views." border="false":::

## Follow the tutorials

The query editor window, located to the right of the cluster connections pane, provides useful tutorials in the form of commonly used queries along with detailed explanations.

We take a look at the **Metrics** database, labeled as **SampleMetrics** in the cluster connections pane.

The **SampleMetrics** dataset consists of the following tables:

* RawServerMetrics: where raw data is ingested for temporary storage.
* TransformedServerMetrics: where parsed and processed data is stored.
* SQLServersLocation: containing reference data of servers' location.

> [!TIP]
> You can navigate to other tutorials from the query editor window. Select **Open** > **Open tutorials** and then choose the specific tutorial you want to explore.
>
> :::image type="content" source="media/web-ui-samples-gallery/web-ui-tutorials-dropdown.png" alt-text="Screenshot showing Azure Data Explorer web U I dropdown menu to choose sample tutorials in query window.":::

## Run a query

In the query edit window, place your cursor in a query and select **Run** at the top of the window, or press *Shift* + *Enter* to run a query. Results are displayed in the query results pane, directly below the query editor window.

Before running any query or command, take a moment to read the comments above it. The comments include important information. For example, why certain management commands don't work in the **help** cluster due to lack of permissions. The query editor provides suggestions and warnings as you write queries. To customize which suggestions and warnings you receive, see [Set query recommendations](web-customize-settings.md#set-query-recommendations).

:::image type="content" source="media/web-ui-samples-gallery/web-ui-query-window.png" alt-text="Screenshot showing the query editor window with sample tutorials." lightbox="media/web-ui-samples-gallery/web-ui-query-window.png":::

## Learn management commands

Since certain management commands can't be run in the **help** cluster, you can [create your own free cluster](start-for-free-web-ui.md) to further explore these commands. Some examples of these commands are described in the following table.

| Table | Description | Command |
|--|--|--|
| **RawServerMetrics** | The ingestion [batching policy](/kusto/management/batching-policy?view=azure-data-explorer&preserve-view=true) can be configured to reduce the default ingestion latency from 5 minutes to 20 seconds, as described. | `.alter table RawServerMetrics policy ingestionbatching @'{"MaximumBatchingTimeSpan": "00:00:20", "MaximumNumberOfItems": 500,"MaximumRawDataSizeMB": 1024}'` |
| **RawServerMetrics** | The data [retention policy](/kusto/management/retention-policy?view=azure-data-explorer&preserve-view=true) can be configured to 10 days to avoid the duplication of data across raw and transformed tables. If needed, you can keep raw data for longer. For example, if there are any issues with the *TransformedServerMetrics* table, rather than going back to the source data, you can refer to the data in the *RawServerMetrics* table. | `.alter table RawServerMetrics policy retention '{"SoftDeletePeriod": "10.00:00:00", "Recoverability": "Enabled"}'` |
| **TransformedServerMetrics** | The [update policy](/kusto/management/update-policy?view=azure-data-explorer&preserve-view=true) can be applied to transform and parse raw data. | `.alter table TransformedServerMetrics policy update @'[{"IsEnabled": true, "Source": "RawServerMetrics", "Query": "Transform_RawServerMetrics()", "IsTransactional": true, "PropagateIngestionProperties": false}]'` |

## Related content

* [Query data in the web UI](web-ui-query-overview.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
