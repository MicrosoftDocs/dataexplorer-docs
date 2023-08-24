---
title: Get data from Azure storage
description: Learn how to get data from Azure storage in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 08/21/2023
---

# Get data from Azure storage

Data ingestion is the process used to load data records from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn how to get data from Azure storage (ADLS Gen2 container or individual blobs) into either a new or existing table.

Ingestion can be done as a one-time operation in the [new get data](azure/data-explorer/get-data-storage?tabs=get-data) experience, or as a continuous method by setting up an [Event Grid ingestion pipeline](#create-continuous-ingestion) in the ingestion wizard that responds to new files in the source container and ingests qualifying data into your table. Select the tab that corresponds with your desired ingestion method.

For general information on data ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

### [New - Get data](#tab/get-data)

### Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Get data**.

    :::image type="content" source="media/get-data-storage/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-storage/get-data.png":::

## Select a data source

1. In the **Get data** window, the **Source** tab is selected.

1. Select the data source from the available list. In this example, you're ingesting data from **Azure storage**.

    :::image type="content" source="media/get-data-storage/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-storage/select-data-source.png":::

### Configure tab

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

    1. If you selected **Add URI**, paste your storage connection string in the **URI** field, and then select **+**.

        > [!NOTE]
        >
        > * You can add up to 10 individual blobs. Each blob can be a max of 1 GB uncompressed.
        > * You can ingest up to 5000 blobs from a single container.

        :::image type="content" source="media/get-data-storage/add-uri.png" alt-text="Screenshot of configure tab with the connection string pasted in the URI field."  lightbox="media/get-data-storage/add-uri.png":::

1. Select **Next**

## Inspect the data

The **Inspect** tab opens with a preview of the data.

:::image type="content" source="media/get-data-storage/inspect-data.png" alt-text="Screenshot of the inspect tab." lightbox="media/get-data-storage/inspect-data.png":::

1. Select **Command viewer** to view and copy the automatic commands generated from your inputs.
1. The schema definition file is used for schema creation. If you're ingesting more than one blob, choose the schema definition file from the dropdown.
1. The data format is automatically inferred. You can change the data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
1. Optionally, [Edit columns](#edit-columns).
1. Optionally, explore [Advanced options based on data type](#advanced-options-based-on-data-type).
1. Select **Finish** to complete the ingestion process.
[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-storage/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-storage/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]

## Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-storage/summary.png" alt-text="Screenshot of summary page with successful ingestion completed." lightbox="media/get-data-storage/summary.png":::

### [Wizard](#tab/wizard)

### Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A [storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). An Event Grid notification subscription can be set on Azure Storage accounts for `BlobStorage`, `StorageV2`, or [Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-introduction).

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Ingest data**.

    :::image type="content" source="media/ingest-data-wizard/ingest-data-from-query-page.png" alt-text="Screenshot of selection of the ingestion wizard in the Azure Data Explorer web UI." lightbox="media/ingest-data-wizard/ingest-data-from-query-page.png":::

1. In the **Ingest data** window, the **Destination** tab is selected. The **Cluster** and **Database** fields are automatically populated.

    [!INCLUDE [ingestion-wizard-cluster](includes/ingestion-wizard-cluster.md)]

1. In **Table**, check **New table** and enter a name for the new table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters.

    :::image type="content" source="media/ingestion-wizard-new-table/create-new-table.png" alt-text="Screenshot of Azure Data Explorer to create a new table to ingest data":::

1. Select **Next: Source**

## Select an ingestion type

Under **Source type**, do the following steps:

1. Select **From blob container** (blob container, ADLS Gen2 container). You can ingest up to 5000 blobs from a single container.

1. For **Select source**, select **Add URL**.

   > [!NOTE]
   > Alternatively, you can select **Select container** and choose information from the dropdown menus to connect to the container.

1. In the **Link to source** field, add the [blob URI with SAS token or Account key](kusto/api/connection-strings/generate-sas-token.md) of the container, and optionally enter the sample size. A list is populated with files from the container.

   > [!NOTE]
   > The SAS URL can be created [manually](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) or [automatically](kusto/api/connection-strings/storage-connection-strings.md).

   :::image type="content" source="media/ingestion-wizard-new-table/from-container.png" alt-text="Screenshot selecting ingestion from container in the ingestion wizard.":::

   > [!TIP]
   > For ingestion **from file**, see [Use the ingestion wizard to ingest JSON data from a local file to an existing table in Azure Data Explorer](/azure/data-explorer/ingest-from-local-file#select-an-ingestion-type)

## Filter data

Optionally, you can filter data to be ingested with **File filters**. You can filter by file extension, file location, or both.

### Filter by file extension

You can filter data to ingest only files with a specific file extension.

* For example, filter for all files with a **CSV** extension.

  :::image type="content" source="media/ingestion-wizard-new-table/from-container-with-filter.png" alt-text="Screenshot of Ingest data tab showing the ingestion filter.":::

  The system will select one of the files at random and the schema will be generated based on that **Schema defining file**. You can select a different file.

### Filter by folder path

You can also filter files with the full or partial **Folder path**.

* You can enter a partial folder path, or folder name.

  :::image type="content" source="media/ingestion-wizard-new-table/filter-folder-path-search.png" alt-text="Screenshot of the folder path search to filter files when ingesting data with the ingestion wizard.":::

* Alternatively, enter the full folder path.

    1. Go to the storage account, and select **Storage Explorer > Blob Containers**

       :::image type="content" source="media/ingestion-wizard-new-table/storage-browser-blob-containers.png" alt-text="Screenshot access blob containers in Azure Storage account.":::

    1. Browse to the selected folder, and select full folder path.

       :::image type="content" source="media/ingestion-wizard-new-table/copy-path.png" alt-text="Screenshot of a folder path to folder in blob container - Azure Storage account.":::

    1. Copy the full folder path and paste it into a temporary file.
    1. Insert `/` in between each folder to create the folder path and enter this path into the **Folder path** field to select this folder.

## Edit the schema

Select **Next: Schema** to view and edit your table column configuration. The service automatically identifies if the schema is compressed by looking at the name of the source.

In the **Schema** tab:

1. Confirm the format selected in **Data format**:

    In this case, the data format is **CSV**

    > [!TIP]
    > If you want to use **JSON** files, see [Use the ingestion wizard to ingest JSON data from a local file to an existing table in Azure Data Explorer](/azure/data-explorer/ingest-from-local-file#edit-the-schema).

1. You can select the check box **Ignore the first record** to ignore the heading row of the file.

    :::image type="content" source="media/ingestion-wizard-new-table/non-json-format.png" alt-text="Screenshot showing how to select the option not to include column names in the ingestion wizard.":::

1. In the **Mapping name** field, enter a mapping name. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

### Edit the table

When ingesting to a new table, alter various aspects of the table when creating the table.

> [!NOTE]
> For tabular formats, you can't map a column twice. To map to an existing column, first delete the new column.

Select **Next: Summary** to create a table and mapping and to begin data ingestion.

## Complete data ingestion

In the **Data ingestion completed** window, all three steps will be marked with green check marks when data ingestion finishes successfully.

:::image type="content" source="media/ingestion-wizard-new-table/one-click-data-ingestion-complete.png" alt-text="Screenshot showing ingested complete dialog box with data preview.":::

[!INCLUDE [data-explorer-ingestion-wizard-query-data](includes/data-explorer-ingestion-wizard-query-data.md)]

## Create continuous ingestion

Continuous ingestion enables you to create an Event Grid that listens for new files in the source container. Any new file that meets the criteria of the pre-defined parameters (prefix, suffix, and so on) will be automatically ingested into the destination table.

1. Select **Event Grid** in the **Continuous ingestion** tile to open the Azure portal. The data connection page opens with the Event Grid data connector opened and with source and target parameters already entered (source container, tables, and mappings).

    :::image type="content" source="media/ingestion-wizard-new-table/continuous-button.png" alt-text="Screenshot showing the continuous ingestion button.":::

### Data connection: Basics

1. The **Data connection** blade opens with the **Basics** tab selected.
1. Enter the **Storage account**.
1. Choose the **Event type** that will trigger ingestion.
1. Select **Next: Ingest properties**

:::image type="content" source="media/ingestion-wizard-new-table/data-connection-basics-tab.png" alt-text="Screenshot of Data connection blade with Basics tab selected. Fields that should be selected are highlighted by a red box.":::

### Ingest properties

The **Ingest properties** tab opens with pre-filled routing settings. The target table name, format, and mapping name are taken from the table created above.

:::image type="content" source="media/ingestion-wizard-new-table/ingest-properties.png" alt-text="Screenshot of Ingest properties blade.":::

Select **Next: Review + create**

### Review + create

Review the resources, and select **Create**.

:::image type="content" source="media/ingestion-wizard-new-table/review-create.png" alt-text="Screenshot of review and create blade.":::

---

## Next steps

* Explore the results in the [Azure Data Explorer web UI query](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Use the sample app generator wizard to create code to ingest and query your data](sample-app-generator-wizard.md)
* Drop ingested data using [.drop extents command](kusto/management/drop-extents.md) and [.drop ingestion mapping command](kusto/management/drop-ingestion-mapping-command.md)
