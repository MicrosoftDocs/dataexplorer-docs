---
title: Use one click to ingest data from a container or Azure Data Lake Storage into Data Explorer
description: Ingest (load) data into a new Azure Data Explorer table from a container or ADLS, either as a one-time or continuous operation.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 06/22/2022
---

# Ingest data from a container/ADLS into Azure Data Explorer

> [!div class="op_single_selector"]
> * [One-click](one-click-ingestion-new-table.md)
> * [Portal](ingest-data-event-grid.md)
> * [C#](data-connection-event-grid-csharp.md)
> * [Python](data-connection-event-grid-python.md)
> * [Azure Resource Manager template](data-connection-event-grid-resource-manager.md)

[One-click ingestion](ingest-data-one-click.md) enables you to quickly ingest data in JSON, CSV, and other formats into a table and easily create mapping structures. The data can be ingested either from storage, from a local file, or from a container, or as a one-time or continuous ingestion process.

This document describes using the intuitive one-click wizard to ingest **CSV** data from a **container** into a **new table**. Ingestion can be done as a one-time operation, or as a continuous method by [setting up an Event Grid ingestion pipeline](#create-continuous-ingestion) that responds to new files in the source container and ingests qualifying data into your table. This process can be used with slight adaptations to cover a variety of different use cases.

For an overview of one-click ingestion, see [One-click ingestion](ingest-data-one-click.md).
For information about ingesting data into an existing table in Azure Data Explorer, see [One-click ingestion to an existing table](one-click-ingestion-existing-table.md)

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).
* [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
* Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

## Ingest new data

1. In the left menu of the Azure Data Explorer web UI, select **Data**.

1. From the **Quick actions** section, select **Ingest new data**. Alternatively, from the **All actions** section, select **Ingest new data** and then **Ingest**.

    :::image type="content" source="media/one-click-ingestion-new-table/ingest-new-data.png" alt-text="Screenshot for the Azure Data Explorer web U I where you select one-click ingestion for a table.":::

1. In the **Ingest new data** window, the **Destination** tab is selected. The **Cluster** and **Database** fields are automatically populated.

    [!INCLUDE [one-click-cluster](includes/one-click-cluster.md)]

1. In **Table**, check **Create new table** and enter a name for the new table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters.

    :::image type="content" source="media/one-click-ingestion-new-table/create-new-table.png" alt-text="Create a new table one-click ingestion.":::

1. Select **Next: Source**

## Select an ingestion type

Under **Source type**, do the following steps:

  1. Select **From blob container** (blob container, ADLS Gen2 container). You can ingest up to 5000 blobs from a single container.
  1. In the **Link to storage** field, add the [blob URI with SAS token or Account key](kusto/api/connection-strings/generate-sas-token.md) of the container, and optionally enter the sample size. To ingest from a folder within this container, see [Ingest from folder in a container](#ingest-from-folder-in-a-container).

  > [!NOTE]
  > The SAS URL can be created [manually](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) or [automatically](kusto/api/connection-strings/storage-connection-strings.md).

   :::image type="content" source="media/one-click-ingestion-new-table/from-container.png" alt-text="One-click ingestion from container.":::

   > [!TIP]
   > For ingestion **from file**, see [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](one-click-ingestion-existing-table.md#select-an-ingestion-type)

### Ingest from folder in a container

To ingest from a specific folder within a container, [generate a string of the following format](kusto/api/connection-strings/storage-connection-strings.md#storage-connection-string-templates):

*container_path*`/`*folder_path*`;`*access_key_1*

You'll use this string instead of the SAS URL in [select an ingestion type](#select-an-ingestion-type).

1. Navigate to the storage account, and select **Storage Explorer > Select Blob Containers**

    :::image type="content" source="media/one-click-ingestion-new-table/blob-containers.png" alt-text="Screenshot access blob containers in Azure Storage account.":::

1. Browse to the selected folder, and select **Copy URL**. Paste this value into a temporary file and add `;` to the end of this string.

    :::image type="content" source="media/one-click-ingestion-new-table/copy-url.png" alt-text="Screenshot of copy URL in folder in blob container - Azure Storage account.":::

1. On the left menu under **Settings**, select **Access keys**.

    :::image type="content" source="media/one-click-ingestion-new-table/copy-key-1.png" alt-text="screenshot of Access keys storage account copy Key string.":::

1. Under **key 1**, copy the **Key** string. Paste this value at the end of your string from step 2.

### Storage subscription error

If you get the following error message when ingesting from a storage account:

> Couldn't find the storage under your selected subscriptions. Please add the storage account *`storage_account_name`* subscription to your selected subscriptions in the portal.

1. Select the :::image type="icon" source="media/ingest-data-one-click/directory-subscription-icon.png" border="false":::  icon from the top-right menu tray. A **Directory + subscription** pane opens.

1. In the **All subscriptions** dropdown, add your storage account's subscription to the selected list.

    :::image type="content" source="media/ingest-data-one-click/subscription-dropdown.png" alt-text="Screenshot of Directory + subscription pane with subscription dropdown highlighted by a red box.":::

## Filter data

If you want to, filter the data to ingest only files that begin end with specific characters.

For example, filter for all files that begin with the word *.csv* extension.

:::image type="content" source="media/one-click-ingestion-new-table/from-container-with-filter.png" alt-text="One click ingestion filter.":::

The system will select one of the files at random and the schema will be generated based on that  **Schema defining file**. You can select a different file.

## Edit the schema

Select **Next: Schema** to view and edit your table column configuration. The service automatically identifies if the schema is compressed by looking at the name of the source.

In the **Schema** tab:

1. Confirm the format selected in **Data format**:

    In this case, the data format is **CSV**

    > [!TIP]
    > If you want to use **JSON** files, see [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](one-click-ingestion-existing-table.md#edit-the-schema).

1. You can select the check box **Ignore the first record** to ignore the heading row of the file.

    :::image type="content" source="media/one-click-ingestion-new-table/non-json-format.png" alt-text="Select include column names.":::

1. In the **Mapping name** field, enter a mapping name. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

### Edit the table

When ingesting to a new table, alter various aspects of the table when creating the table.

[!INCLUDE [data-explorer-one-click-column-table](includes/data-explorer-one-click-column-table.md)]

> [!NOTE]
> For tabular formats, you can't map a column twice. To map to an existing column, first delete the new column.

[!INCLUDE [data-explorer-one-click-command-editor](includes/data-explorer-one-click-command-editor.md)]

Select **Next: Summary** to create a table and mapping and to begin data ingestion.

## Complete data ingestion

In the **Data ingestion completed** window, all three steps will be marked with green check marks when data ingestion finishes successfully.

:::image type="content" source="media/one-click-ingestion-new-table/one-click-data-ingestion-complete.png" alt-text="One click ingestion complete.":::

[!INCLUDE [data-explorer-one-click-ingestion-query-data](includes/data-explorer-one-click-ingestion-query-data.md)]

## Create continuous ingestion

Continuous ingestion enables you to create an Event Grid that listens for new files in the source container. Any new file that meets the criteria of the pre-defined parameters (prefix, suffix, and so on) will be automatically ingested into the destination table.

1. Select **Event Grid** in the **Continuous ingestion** tile to open the Azure portal. The data connection page opens with the Event Grid data connector opened and with source and target parameters already entered (source container, tables, and mappings).

    :::image type="content" source="media/one-click-ingestion-new-table/continuous-button.png" alt-text="continuous ingestion button.":::

### Data connection: Basics

1. The **Data connection** blade opens with the **Basics** tab selected.
1. Enter the **Storage account**.
1. Choose the **Event type** that will trigger ingestion.
1. Select **Next: Ingest properties**

:::image type="content" source="media/one-click-ingestion-new-table/data-connection-basics-tab.png" alt-text="Screen shot of Data connection blade with Basics tab selected. Fields that should be selected are highlighted by a red box.":::

### Ingest properties

The **Ingest properties** tab opens with pre-filled routing settings. The target table name, format, and mapping name are taken from the table created above.

:::image type="content" source="media/one-click-ingestion-new-table/ingest-properties.png" alt-text="Screen shot of Ingest properties blade.":::

Select **Next: Review + create**

### Review + create

Review the resources, and select **Create**.

:::image type="content" source="media/one-click-ingestion-new-table/review-create.png" alt-text="Screen shot of review and create blade.":::

## Next steps

* [Query data in Azure Data Explorer web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
