---
title: Get data from Azure storage
description: Learn how to get data from Azure storage in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 12/04/2023
---

# Get data from Azure storage

Data ingestion is the process used to load data from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn how to get data from Azure storage (ADLS Gen2 container, blob container, or individual blobs) into either a new or existing table.

Ingestion can be done as a one-time operation, or as a continuous method. Continuous ingestion can be configured via portal only.

For general information on data ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

[!INCLUDE [get-data-flow](includes/get-data-flow.md)]

## Get data

Select the tab that corresponds with your desired ingestion method.

### [Get data](#tab/get-data)

### Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Get data**.

    :::image type="content" source="media/get-data-storage/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-storage/get-data.png":::

## Source

In the **Get data** window, the **Source** tab is selected.

Select the data source from the available list. In this example, you're ingesting data from **Azure storage**.

:::image type="content" source="media/get-data-storage/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-storage/select-data-source.png":::

## Configure

1. Select a target database and table. If you want to ingest data into a new table, select **+ New table** and enter a table name.

    > [!NOTE]
    > Table names can be up to 1024 characters including spaces, alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. To add your source, select **Select container** or **Add URI**.

    1. If you selected **Select container**, fill in the following fields:

        :::image type="content" source="media/get-data-storage/configure-tab.png" alt-text="Screenshot of configure tab with new table entered and one sample data file selected." lightbox="media/get-data-storage/configure-tab.png":::

        | **Setting**                | **Field description**  |
        |--------------------------|----------|
        | Subscription               | The subscription ID where the storage account is located.     |
        | Storage account      | The name that identifies your storage account.    |
        | Container                  | The storage container you want to ingest.   |
        | **File filters (optional)**       | |
        | Folder path| Filters data to ingest files with a specific folder path. |
        | File extension| Filters data to ingest files with a specific file extension only.|

    1. If you selected **Add URI**, paste your storage connection string for a blob container or individual files in the **URI** field, and then select **+**.

        > [!NOTE]
        >
        > * You can add up to 10 individual blobs. Each blob can be a max of 1 GB uncompressed.
        > * You can ingest up to 5000 blobs from a single container.

        :::image type="content" source="media/get-data-storage/add-uri.png" alt-text="Screenshot of configure tab with the connection string pasted in the URI field."  lightbox="media/get-data-storage/add-uri.png":::

1. Select **Next**

## Inspect

The **Inspect** tab opens with a preview of the data.

To complete the ingestion process, select **Finish**.

:::image type="content" source="media/get-data-storage/inspect-data.png" alt-text="Screenshot of the inspect tab." lightbox="media/get-data-storage/inspect-data.png":::

Optionally:

* Select **Command viewer** to view and copy the automatic commands generated from your inputs.
* Use the **Schema definition file** dropdown to change the file that the schema is inferred from.
* Change the automatically inferred data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
* [Edit columns](#edit-columns).
* Explore [Advanced options based on data type](#advanced-options-based-on-data-type).

[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-storage/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-storage/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]

## Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-storage/summary.png" alt-text="Screenshot of summary page with successful ingestion completed." lightbox="media/get-data-storage/summary.png":::

## Related content

* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
