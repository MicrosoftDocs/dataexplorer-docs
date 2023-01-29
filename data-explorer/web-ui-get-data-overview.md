---
title: Azure Data Explorer web UI get data overview
description: This article describes the elements of Azure Data Explorer web UI related to data ingestion.
ms.topic: conceptual
ms.date: 01/29/2023
---

# Azure Data Explorer web UI get data overview

The Azure Data Explorer web UI provides a comprehensive data exploration experience, covering everything from data ingestion to querying and creating visualizations and dashboards. This overview highlights the areas of the web UI related to data ingestion and management.

## Data management

In the **[Data management](https://dataexplorer.azure.com/oneclick)** page, you'll find ways to ingest data, create database tables, map the table schema, and set ingestion and retention policies.

:::image type="content" source="media/web-ui-get-data-overview/search-actions.png" alt-text="Screenshot of search actions option in data management page.":::

> [!TIP]
> Use the search box on the right side of the page to filter cards by key terms.

## Quick actions

Select from quick actions to [ingest data](https://dataexplorer.azure.com/oneclick/ingest?sourceType=file), [create tables](https://dataexplorer.azure.com/oneclick/createtable), update [batching policies](https://dataexplorer.azure.com/oneclick/updateTableBatchingPolicy), and [generate a sample app](https://dataexplorer.azure.com/oneclick/generatecode?sourceType=file).

:::image type="content" source="media/web-ui-get-data-overview/quick-actions.png" alt-text="Screenshot of data management quick action options.":::

## More actions

The tabs below the quick actions lead you to more options for data ingestion and management.

:::image type="content" source="media/web-ui-get-data-overview/more-tab-options.png" alt-text="Screenshot of tab options in data management page.":::

Read more about each option by selecting the links in the following table.

|Tab  |Ingestion options  |
|---------|---------|
|**Manage**     | Create [tables](https://dataexplorer.azure.com/oneclick/createtable), [external tables](external-table.md) and update [batching](./kusto/management/batchingpolicy.md) and [retention](./kusto/management/retentionpolicy.md) policies.      |
|**One-time ingestion**    | Ingest from [local files, blob storage](./ingest-data-wizard.md), or a [container](./ingestion-wizard-new-table.md).      |
|**Continuous ingestion**     | Configure continuous ingestion from [Event Hubs](./event-hub-wizard.md) or a blob container.        |
|**Backfill**     |  Ingest data from sources as a one time or [continuous ingestion](./ingestion-wizard-new-table.md).       |
|**SDKs**     |  The [sample app generator wizard](https://dataexplorer.azure.com/oneclick/generatecode?programingLang=Python) is a tool that allows you to create a working app to [ingest and query your data in your preferred programming language](./sample-app-generator-wizard.md). Learn more about connectors to expand and explore the capabilities of Azure Data Explorer.    |

## Next steps

* [Ingest sample data into Azure Data Explorer](ingest-sample-data.md)
