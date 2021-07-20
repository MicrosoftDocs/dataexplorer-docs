---
title: Auto-generate a LightIngest command to ingest data to Azure Data Explorer.
description: Learn about how to auto-generate an ingest command for LightIngest, a command-line utility for ad-hoc data ingestion into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 07/20/2021
---
# Auto-generate a Lightingest command


## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [A cluster and database](create-cluster-database-portal.md).
* [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

## Ingest new data

1. In the left menu of the Web UI, right-click a *database* and select **Ingest new data**.
1. In the **Ingest new data** window, the **Destination** tab is selected. The **Cluster** and **Database** fields are automatically populated.
1. In **Table**, check either **Existing table** or **Create new table**. When creating a new table, enter a name for the new table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters.

    :::image type="content" source="media/generate-lightingest-command/ingest-new-data.png" alt-text="Screenshot of Azure Data Explorer WebUI with Data tab selected on the lefthand menu, and Ingest new data dialog open to the right.":::

1. Select **Next: Source**

## Select an ingestion type

Under **Source type**, do the following steps:

:::image type="content" source="media/generate-lightingest-command/source-tab-lightingest.png" alt-text="Screenshot of Source tab in Ingest new table window. ":::

   
  1. Select **From blob container** (blob container, ADLS Gen2 container). You can ingest up to 5000 blobs from a single container.
  1. You can either **Add URL** manually by copying the Account Key/SAS URL to source, or **Select container** from your storage account.
      > [!NOTE]
      > The SAS URL can be created [manually](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) or [automatically](kusto/api/connection-strings/storage.md). 
  1. When selecting from your storage account, 

:::image type="content" source="media/generate-lightingest-command/source-tab-container-from-subscription.png" alt-text="Screenshot of dialog box for selecting container from storage subscription and account.":::

## Filter data

If you want to, filter the data to ingest only files that begin end with specific characters.

For example, filter for all files that begin with the word *.csv* extension.

:::image type="content" source="media/generate-lightingest-command/filter-data-lightingest.png" alt-text="Screenshot of filtering data in the source tab of the Ingest new data screen.":::

The system will select one of the files at random and the schema will be generated based on that  **Schema defining file**. You can select a different file.

Select **Next: Schema** to view and edit your table column configuration.  By looking at the name of the source, the service automatically identifies if it is compressed or not.

## Edit the schema

In the **Schema** tab:

   1. Confirm the format selected in **Data format**:

        In this case, the data format is **CSV**
   1. You can select the check box **Ignore the first record** to ignore the heading row of the file.
   1. 
1. In the **Mapping name** field, enter a mapping name. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

:::image type="content" source="media/generate-lightingest-command/schema-tab-lightingest.png" alt-text="Screenshot of the schema tab in the Ingest new data dialog in Azure Data Explorer WebUI.":::

### Edit the table

When ingesting to a new table, alter various aspects of the table when creating the table.

[!INCLUDE [data-explorer-one-click-column-table](includes/data-explorer-one-click-column-table.md)]

> [!NOTE]
> For tabular formats, you can’t map a column twice. To map to an existing column, first delete the new column.

[!INCLUDE [data-explorer-one-click-command-editor](includes/data-explorer-one-click-command-editor.md)]

Select **Next: Summary** to generate the LightIngest command.

## Generate LightIngest command

In the **Data ingestion completed** window, all three steps will be marked with green check marks.
