---
title: Create a table in Azure Data Explorer
description: Learn how to easily create a table in Azure Data Explorer with the one-click experience.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/06/2020
---

# Create a table in Azure Data Explorer (preview)

Creating a table is an important step in the process of [data ingestion](ingest-data-overview.md) and [query](write-queries.md) in Azure Data Explorer. After you have [created a cluster and database in Azure Data Explorer](create-cluster-database-portal.md), you can create a table. The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer Web UI. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Sign in to the [Azure Data Explorer Web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create a table

1. In the left menu of the Web UI, right-click **ExampleDB** which is your database name and select **Create table (preview)**.

    :::image type="content" source="./media/one-click-table/create-table.png" alt-text="Create a table in the Azure Data Explorer Web UI":::

The **Create table** window opens with the **Source** tab selected.
1. The **Database** field is auto-populated with your database. You may select a different database from the drop-down menu.
1. In **Table name**, enter a name for your table. 
    > [!TIP]
    >  Table names can be up to 1024 characters including alphanumeric, hyphens, and underscores. Special characters aren't supported.

### Select source type

1. In **Source type**, select the data source you'll use to create your table mapping. Choose from the following options: **From blob**, **From file**, or **From container**.
   
    
    * If you're using a **blob**:
        * Enter the storage url of your blob, and optionally enter the sample size. 
        * Filter your files using the **File Filters**. 
        * Select a file that will be used in the next step to define the schema.

        :::image type="content" source="media/one-click-table/blob.png" alt-text="Create table using blob to create schema mapping":::
    
    * If you're using a **local file**:
        * Select **Browse** to locate the file, or drag the file into the field.

        :::image type="content" source="./media/one-click-table/data-from-file.png" alt-text="Create a table based on data from a local file ":::

    * If you're using a **container**:
        * In the **Link to storage** field, add the [SAS URL](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) of the container and optionally enter the sample size. 

1. Select **Edit Schema** to continue to the **Schema** tab.

### Edit Schema

In the **Schema** tab, your [data format](ingest-data-one-click.md#file-formats) and compression are automatically identified in the left-hand pane. If incorrectly identified, use the **Data format** dropdown menu to select the correct format.

   * If your data format is JSON, you must also select JSON levels, from 1 to 10. The levels determine the table column data division.
   * If your data format is CSV, select the check box **Includes column names** to ignore the heading row of the file.

        :::image type="content" source="./media/one-click-table/schema-tab.png" alt-text="Edit schema tab in create table in one-click experience in Azure Data Explorer":::
 
1. In **Mapping**, enter a name for this table's schema mapping. 
    > [!TIP]
    >  Table names can include alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.
1. Select **Create**.

## Create table completed window

In the **Create table completed** window, both steps will be marked with green check marks when table creation finishes successfully.

* Select **View command** to open the editor for each step. 
    * In the editor, you can view and copy the automatic commands generated from your inputs.
    
    :::image type="content" source="./media/one-click-table/table-completed.png" alt-text="Table creation completed in create a table in one click experience - Azure Data Explorer":::
 
In the tiles below the **Create table** progress, explore **Quick queries** or **Tools**:

* **Quick queries** includes links to the Web UI with example queries.

* **Tools** includes links to **Undo** the running the relevant .drop commands.

> [!NOTE]
> You might lose data when you use .drop commands.<br>
> The drop commands in this workflow will only revert the changes that were made by the create table process (new table and schema mapping).

## Next steps

* [Data ingestion overview](ingest-data-overview.md)
* [One-click ingestion](ingest-data-one-click.md)
* [Write queries for Azure Data Explorer](write-queries.md)  
