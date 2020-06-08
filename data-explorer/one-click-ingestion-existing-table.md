---
title: Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer
description: Ingesting (loading) data into an existing Azure Data Explorer table simply, using one-click ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: overview
ms.date: 03/29/2020
---

# Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer

[One-click ingestion](ingest-data-one-click.md) enables you to quickly ingest data in JSON, CSV, and other formats into a table. Using the Azure Data Explorer Web UI, you can ingest data from storage, from a local file, or from a container. 

This document describes using the intuitive one-click wizard in a specific use case to ingest JSON data from a file into an existing table. You can then edit the table and run queries with the Azure Data Explorer Web UI.

For an overview of one-click ingestion and a list of prerequisites, see [One-click ingestion](ingest-data-one-click.md).
For different types or sources of data, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md).

## Ingest new data

1. In the left menu of the Web UI, right-click a *database* or *table* and select **Ingest new data (Preview)**.

    :::image type="content" source="media/one-click-ingestion-existing-table/one-click-ingestion-in-webui.png" alt-text="Select one-click ingestion in the web UI":::
 
1. In the **Ingest new data (Preview)** window, the **Source** tab is selected.

1. If the **Table** field isn't automatically filled, select an existing table name from the drop-down menu.
    > [!TIP]
    > If you select **Ingest new data (Preview)** on a *table* row, the selected table name will appear in the **Project Details**.

## Select an ingestion type

For **Ingestion type**, select the following option:

  * **from file** - select **Browse** to locate the file, or drag the file into the field.
  
      :::image type="content" source="media/one-click-ingestion-existing-table/from-file.png" alt-text="One-click ingestion from file":::
      
 > [!NOTE]
 > For ingestion **from container**, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md#select-an-ingestion-type)

  A sample of the data appears. If you want to, you can filter it to show only files that begin end with specific characters. When you adjust the filters, the preview automatically updates.
  
  For example, you can filter for all files that begin with the word *data* and end with a *.csv.gz* extension.

  :::image type="content" source="media/one-click-ingestion-existing-table/from-container-with-filter.png" alt-text="One-click ingestion filter":::

## Edit the schema

Select **Edit schema** to view and edit your table column configuration.

1. The **Map columns** dialog opens and you can map source data columns to target table columns. 
    * In the **Source columns** fields, enter column names to map with the **Target columns**.
    * To delete a column from mapping, select the trash can icon.

    :::image type="content" source="media/one-click-ingestion-existing-table/map-columns.png" alt-text="Map columns window"::: 
    
1. Select **Update**.
1. In the **Schema** tab:
    * **Compression type** will be selected automatically by the source file name. In this case, the compression type is **JSON**
        
    * When you select  **JSON**, you must also select **JSON levels**, from 1 to 10. The levels determine the table column data depiction.

    :::image type="content" source="media/one-click-ingestion-existing-table/json-levels.png" alt-text="Select JSON levels":::
    
    > [!NOTE]
    > If you want to use **CSV** files, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md#edit-the-schema)

    * New mappings are set automatically, but you can change it to use an existing one. 
    * Select the **Map columns** button to open the **Map columns** window. In the **Map columns** window you can attach one or more source columns or attributes to your Azure Data Explorer columns.

## Copy and paste queries - TODO: RENAME THIS SECTION

1. Above the **Editor** pane, select the **v** button to open the editor. In the editor, you can view and copy the automatic commands generated from your inputs. 
1. In the table: 
    * Select new column headers to add a **New column**, **Delete column**, **Sort ascending**, or **Sort descending**. On existing columns, only data sorting is available.

    > [!NOTE]
    > * You can't update the name and datatype for existing tables.
    > * Drop commands will only revert the changes that were made by this ingestion flow (new extents and columns). Nothing else will be dropped.

TODO: is the table on adding columns, changing data types, etc relevant here? at the very least the sort ascending/descending is

:::image type="content" source="media/one-click-ingestion-existing-table/edit-view.png" alt-text="One click ingestion edit view":::

## Start ingestion

Select **Start ingestion** to create a table and mapping and to begin data ingestion.

TODO: get image (below) with correct use case

:::image type="content" source="media/one-click-ingestion-existing-table/start-ingestion.png" alt-text="Start ingestion":::

## Data ingestion completed

In the **Data ingestion completed** window, all three steps will be marked with green check marks when data ingestion finishes successfully.
 
:::image type="content" source="media/one-click-ingestion-existing-table/one-click-data-ingestion-complete.png" alt-text="One click ingestion completed":::

[!INCLUDE [data-explorer-one-click-ingestion-query-data](includes/data-explorer-one-click-ingestion-query-data.md)]

> [!NOTE]
> If you want to set up continuous ingestion from a container, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md#continuous-ingestion---container-only)

## Next steps

* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
