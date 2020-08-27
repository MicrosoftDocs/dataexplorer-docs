---
title: Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer
description: Ingesting (loading) data into a new Azure Data Explorer table simply, using one-click ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 03/29/2020
---

# Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer

[One-click ingestion](ingest-data-one-click.md) enables you to quickly ingest data in JSON, CSV, and other formats into a table and easily create mapping structures. The data can be ingested either from storage, from a local file, or from a container, as a one-time or continuous ingestion process.  

This document describes using the intuitive one-click wizard in a specific use case to ingest **CSV** data from a **container** into a **new table**. You can use the same process with slight adaptations to cover a variety of different use cases.

For an overview of one-click ingestion and a list of prerequisites, see [One-click ingestion](ingest-data-one-click.md).
For information about ingesting data into an existing table in Azure Data Explorer, see [One-click ingestion to an existing table](one-click-ingestion-existing-table.md)

## Ingest new data

1. In the left menu of the Web UI, right-click a *database* and select **Ingest new data (Preview)**.

    :::image type="content" source="media/one-click-ingestion-new-table/one-click-ingestion-in-web-ui.png" alt-text="Ingest new data":::

1. In the **Ingest new data (Preview)** window, the **Source** tab is selected. 

1. Select **Create new table** and enter a name for the new table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters.

    :::image type="content" source="media/one-click-ingestion-new-table/create-new-table.png" alt-text="Create a new table one click ingestion":::

## Select an ingestion type

Under **Ingestion type**, do the following steps:
   
  1. Select **from container** 
  1. In the **Link to storage** field, add the [SAS URL](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) of the container, and optionally enter the sample size.

      :::image type="content" source="media/one-click-ingestion-new-table/from-container.png" alt-text="One-click ingestion from container":::

     > [!TIP] 
     > For ingestion **from file**, see [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](one-click-ingestion-existing-table.md#select-an-ingestion-type)

A sample of the data appears. If you want to, you can filter it to ingest only files that begin end with specific characters. When you adjust the filters, the preview automatically updates.
  
 * For example, you can filter for all files that begin with the word *.csv* extension.

    :::image type="content" source="media/one-click-ingestion-new-table/from-container-with-filter.png" alt-text="One click ingestion filter":::
  
## Edit the schema

Select **Edit schema** to view and edit your table column configuration. The system will select one of the blobs at random and the schema will be generated based on that blob. By looking at the name of the source, the service automatically identifies if it is compressed or not.

### Schema tab

1. In the **Schema** tab:

    * Select **Data format**:

        In this case, the data format is **CSV**

        > [!TIP]
        > If you want to use **JSON** files, see [Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer](one-click-ingestion-existing-table.md#edit-the-schema).

    * You can select the check box **Include column names** to ignore the heading row of the file.

        :::image type="content" source="media/one-click-ingestion-new-table/non-json-format.png" alt-text="Select include column names":::

1. In the **Mapping name** field, enter a mapping name. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

    :::image type="content" source="media/one-click-ingestion-new-table/table-mapping.png" alt-text="Table mapping name One Click Ingestion":::

### Table

In the table: 
 * Double-click the new column name to edit.
 * Select new column headers and do any of the following actions:

    [!INCLUDE [data-explorer-one-click-column-table](includes/data-explorer-one-click-column-table.md)]

  > [!NOTE]
  > For tabular formats, each column can be ingested into one column in Azure Data Explorer.

[!INCLUDE [data-explorer-one-click-command-editor](includes/data-explorer-one-click-command-editor.md)]

## Start ingestion

Select **Start ingestion** to create a table and mapping and to begin data ingestion.

:::image type="content" source="media/one-click-ingestion-new-table/start-ingestion.png" alt-text="Start ingestion One Click Ingestion":::

## Data ingestion completed

In the **Data ingestion completed** window, all three steps will be marked with green check marks when data ingestion finishes successfully.

:::image type="content" source="media/one-click-ingestion-new-table/one-click-data-ingestion-complete.png" alt-text="One click ingestion complete"::: 

[!INCLUDE [data-explorer-one-click-ingestion-query-data](includes/data-explorer-one-click-ingestion-query-data.md)]

## Create continuous ingestion for container

Continuous ingestion enables you to create an event grid that listens for new files in the source container. Any new file that meets the criteria of the pre-defined parameters (prefix, suffix, and so on) will be automatically ingested into the destination table. 

1. Select the **Create continuous ingestion** button on the bottom right corner to open the Azure portal. The data connection page opens with the event grid data connector opened and with source and target parameters already entered (source container, tables, and mappings).
    
    :::image type="content" source="media/one-click-ingestion-new-table/continuous-button.png" alt-text="continuous ingestion button":::

1. Select **Create** to create a data connection which will listen for any changes, updates, or new data in that container. 

    :::image type="content" source="media/one-click-ingestion-new-table/event-hub-create.png" alt-text="Create Event Hub connection":::

## Next steps

* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
