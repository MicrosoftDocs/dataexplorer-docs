---
title: Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer
description: Ingesting (loading) data into an existing Azure Data Explorer table simply, using one-click ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 03/29/2020
---

# Use one-click ingestion to ingest JSON data from a local file to an existing table in Azure Data Explorer


> [!div class="op_single_selector"]
> * [Ingest CSV data from a container to a new table](one-click-ingestion-new-table.md)
> * [Ingest JSON data from a local file to an existing table](one-click-ingestion-existing-table.md)

[One-click ingestion](ingest-data-one-click.md) enables you to quickly ingest data in JSON, CSV, and other formats into a table and easily create mapping structures. The data can be ingested either from storage, from a local file, or from a container, as a one-time or continuous ingestion process.  

This document describes using the intuitive one-click wizard in a specific use case to ingest **JSON** data from a **local file** into an **existing table**. Use the same process with slight adaptations to cover a variety of different use cases.

For an overview of one-click ingestion and a list of prerequisites, see [One-click ingestion](ingest-data-one-click.md).
For different types or sources of data, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md).

## Ingest new data

In the left menu of the Web UI, right-click a *database* or *table* and select **Ingest new data**.

   :::image type="content" source="media/one-click-ingestion-existing-table/one-click-ingestion-in-webui.png" alt-text="Select one-click ingestion in the web UI":::
 
## Select an ingestion type

1. In the **Ingest new data** window, the **Source** tab is selected.

1. If the **Cluster** and **Database** fields aren't automatically filled, select an existing cluster and database name from the drop-down menu.
    
    [!INCLUDE [one-click-cluster](includes/one-click-cluster.md)]

1. If the **Table** field isn't automatically filled, select an existing table name from the drop-down menu.

1. Under **Source type**, do the following steps:

   1. Select **from file**  
   1. Select **Browse** to locate up to 10 files, or drag the files into the field. The schema-defining file can be chosen using the blue star.
    
      :::image type="content" source="media/one-click-ingestion-existing-table/from-file.png" alt-text="One-click ingestion from file":::

## Edit the schema

Select **Edit schema** to view and edit your table column configuration. In the **Schema** tab:

   * **Compression type** will be selected automatically by the source file name. In this case, the compression type is **JSON**
        
   * When you select  **JSON**, you must also select **Nested levels**, from 1 to 10. The levels determine the table column data division.

        :::image type="content" source="media/one-click-ingestion-existing-table/json-levels.png" alt-text="Select Nested levels":::
    
       > [!TIP]
       > If you want to use **CSV** files, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md#edit-the-schema)

### Add nested JSON data 

To add columns from JSON levels that are different than the main **Nested levels** selected above, do the following steps:

1. Click on the arrow next to any column name, and select **New column**.

    :::image type="content" source="media/one-click-ingestion-existing-table/new-column.png" alt-text="Screenshot of options to add a new column - schema tab during one click ingestion process - Azure Data Explorer":::

1. Enter a new **Column Name** and select the **Column Type** from the dropdown menu.
1. Under **Source**, select **Create new**.

    :::image type="content" source="media/one-click-ingestion-existing-table/create-new-source.png" alt-text="Screenshot - create new source for adding nested JSON data in one click ingestion process - Azure Data Explorer":::

1. Enter the new source for this column and click **OK**. This source can come from any JSON level.

    :::image type="content" source="media/one-click-ingestion-existing-table/name-new-source.png" alt-text="Screenshot - popout window to name the new data source for the added column - Azure Data Explorer one click ingestion":::

1. Select **Create**. Your new column will be added at the end of the table.

    :::image type="content" source="media/one-click-ingestion-existing-table/create-new-column.png" alt-text="Screenshot - create a new column during one click ingestion in Azure Data Explorer":::

### Edit the table 

[!INCLUDE [data-explorer-one-click-column-table](includes/data-explorer-one-click-column-table.md)]

> [!NOTE]
> * For tabular formats, you can’t map a column twice. To map to an existing column, first delete the new column.
> * You can’t change an existing column type. If you try to map to a column having a different format, you may end up with empty columns.

[!INCLUDE [data-explorer-one-click-command-editor](includes/data-explorer-one-click-command-editor.md)]

## Start ingestion

Select **Start ingestion** to create a table and mapping and to begin data ingestion.

:::image type="content" source="media/one-click-ingestion-existing-table/start-ingestion.png" alt-text="Start ingestion":::

## Complete data ingestion

In the **Data ingestion completed** window, all three steps will be marked with green check marks when data ingestion finishes successfully.

:::image type="content" source="media/one-click-ingestion-existing-table/one-click-data-ingestion-complete.png" alt-text="One click ingestion completed":::

> [!IMPORTANT]
> To set up continuous ingestion from a container, see [Use one-click ingestion to ingest CSV data from a container to a new table in Azure Data Explorer](one-click-ingestion-new-table.md#create-continuous-ingestion-for-container)

[!INCLUDE [data-explorer-one-click-ingestion-query-data](includes/data-explorer-one-click-ingestion-query-data.md)]

## Next steps

* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)
