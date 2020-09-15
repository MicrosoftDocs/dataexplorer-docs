---
title: How to create a table in Azure Data Explorer
description: Learn how to easily create a table in Azure Data Explorer with the one-click experience.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/06/2020
---

# Create a table (preview)

Before you ingest or query data in Azure Data Explorer, you first must create a table. The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer Web UI. After creating a table, you can then [ingest data](ingest-data-overview.md) using one of the many available ingestion options.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a table

1. In the left menu of the Web UI, right-click a *database* and select **Create table**.

    :::image type="content" source="./media/one-click-table/create-table.png" alt-text="Create a table in the Azure Data Explorer Web UI":::

1. In the **Create table** window, the **Source** tab is selected.
1. The **Database** field is automatically filled with the database you've selected. You may select a different database from the dropdown menu.
1. In **Table name**, enter a name for your table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.
    > [!NOTE]
    >  Table names must be between 1 and 1024 characters.

1. In **Source type**, select the data source you'll use to create your table mapping. Choose from the following options: *From blob*, *From file*, or *From container*.
   

    * If you're using a container, in the Link to storage field, add the [SAS URL](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) of the container and optionally enter the sample size. 
    * If you're using a blob, enter the storage url of your blob, and optionally enter the sample size. Filter your files using the **File Filters**. Select a file that will be used in the next step to define the schema.

        :::image type="content" source="media/one-click-table/blob.png" alt-text="Create table using blob to create schema mapping":::
    
    * If you're using a local file, select **Browse** to locate the file, or drag the file into the field.

        :::image type="content" source="./media/one-click-table/data-from-file.png" alt-text="Create a table based on data from a local file ":::
    

1. Select **Edit Schema** to continue to the **Schema** tab.

1. Your [data format](ingest-data-one-click.md#file-formats) and compression are automatically identified in the left-hand pane. If incorrectly identified, use the **Data format** dropdown menu to select the correct format.

    * If your data format is JSON, you must also select JSON levels, from 1 to 10. The levels determine the table column data division.
    * If your data format is CSV, select the check box **Includes column names** to ignore the heading row of the file.

        :::image type="content" source="./media/one-click-table/schema-tab.png" alt-text="Edit schema tab in create table in one-click experience in Azure Data Explorer":::

   

1. In **Mapping**, enter a name for this table's schema mapping. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.
1. Select **Create**.
1. In the **Create table completed** window, both steps will be marked with green check marks when table creation finishes successfully.
1. Select **View command** to open the editor for each step. In the editor, you can view and copy the automatic commands generated from your inputs.
    
    :::image type="content" source="./media/one-click-table/table-completed.png" alt-text="Table creation completed in create a table in one click experience - Azure Data Explorer":::
 

## Next steps

* [Data ingestion overview](ingest-data-overview.md)
* [One-click ingestion](ingest-data-one-click.md)
  
