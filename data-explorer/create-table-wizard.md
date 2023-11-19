---
title: Create a table in Azure Data Explorer
description: Learn how to easily create a table in Azure Data Explorer with the table creation wizard.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 06/05/2023
---

# Create a table in Azure Data Explorer

Creating a table is an important step in the process of [data ingestion](ingest-data-overview.md) and [query](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) in Azure Data Explorer. The following article shows how to create a table and schema mapping quickly and easily using the Azure Data Explorer web UI.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

## Create a table

1. In the left menu, select **Query**.

1. Right-click on the database where you want to create the table. Select **Create table**.

    :::image type="content" source="media/create-table-wizard/query-create-table.png" alt-text="Screenshot of the option to create a table from the query page." lightbox="media/external-table/query-create-external-table.png":::

### Destination tab

The **Create table** window opens with the **Destination** tab selected.

1. The **Cluster** and **Database** fields are prepopulated. You may select different values from the drop-down menu.
1. In **Table name**, enter a name for your table.
    > [!TIP]
    >  Table names can be up to 1024 characters including alphanumeric, hyphens, and underscores. Special characters aren't supported.

    :::image type="content" source="media/create-table-wizard/destination-tab.png" alt-text="Screen capture of Destination tab in the Create table window. Cluster, Database, and Table name fields must be filled out before continuing on to Next- Source.":::

1. Select **Next: Source**

### Source tab

In **Source type**, select the data source you'll use to create your table mapping. To proceed to the **Schema** page and map the table schema manually, select **None**.

### [Define schema from a source](#tab/source)

1. Choose from the following options: **From blob**, **From file**, **From blob container**, **From ADLS Gen2 container**, and **Reference to Event Hub (Preview)**.

    * If you're using **From blob container**:
        * Enter the storage url of your blob, and optionally enter the sample size.
        * Filter your files using the **File Filters**.
        * Select a file that will be used in the next step to define the schema.

        :::image type="content" source="media/create-table-wizard/source-blob-container-storage-select.png" alt-text="Screenshot of wizard to create table using blob to create schema mapping.":::

    * If you're using a **local file**:
        * Select **Browse** to locate the file, or drag the file into the field.

        :::image type="content" source="./media/create-table-wizard/data-from-file.png" alt-text="Screenshot of wizard to create a table based on data from a local file.":::

    * If you're using a **blob**:
        * In the **Link to storage** field, add the [SAS URL](kusto/api/connection-strings/generate-sas-token.md) of the container and optionally enter the sample size.

1. Select **Next: Schema** to continue to the **Schema** tab.

### [Define schema manually](#tab/manually)

1. In **Source type**, select **None**.

    :::image type="content" source="media/create-table-wizard/create-new-table-source-none.png" alt-text="Screenshot of wizard to create a table without using a source.":::

1. Select **Next: Schema** to continue to the **Schema** tab.

---

### Edit schema

### [Edit schema from a source](#tab/source)

In the **Schema** tab, your [data format](./ingest-data-wizard.md#file-formats) and compression are automatically identified in the left-hand pane. If incorrectly identified, use the **Data format** dropdown menu to select the correct format.

* If your data format is JSON, you must also select JSON levels, from 1 to 10. The levels determine the table column data division.
* If your data format is CSV, select the check box **Ignore the first record** to ignore the heading row of the file.

    :::image type="content" source="media/create-table-wizard/schema-tab-plug-in-selected.png" alt-text="Screenshot of table schema in create table wizard of the Azure Data Explorer web UI.":::

* If **Ingest data** is selected, in addition to creating the table, the wizard also ingests the data from the source selected in the **Source** tab.

    :::image type="content" source="media/create-table-wizard/ingest-data-checkbox.png" alt-text="Screenshot of the ingest data checkbox selected to ingest data into table created from the wizard.":::

1. In **Mapping**, enter a name for this table's schema mapping.

    > [!TIP]
    > Names can include alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

1. Select **Next: Create table**.

### [Edit schema manually](#tab/manually)

In the **Schema** tab, the **Create table** window opens.

:::image type="content" source="media/create-table-wizard/create-new-table-selected.png" alt-text="Screenshot of the window to define schema manually.":::

1. Select **Add new column** and the **Edit columns** panel opens.

    :::image type="content" source="media/create-table-wizard/edit-columns-panel.png" alt-text="Screenshot of the Edit columns fields to define the schema manually.":::

1. For each column, enter **Column name** and **Data type**. Create more columns by selecting **Add column**.
1. Select **Save**. The schema is displayed.

    :::image type="content" source="media/create-table-wizard/new-table-schema.png" alt-text="Screenshot of the new table with schema defined manually.":::

    To insert a new column, select the plus icon at the top right of the schema.

1. Select **Next: Create table**.

---

### Create table completed window

In the **Create table completed** window, both steps will be marked with green check marks when table creation finishes successfully.

* Select **View command** to open the editor for each step.
  * In the editor, you can view and copy the automatic commands generated from your inputs.

    :::image type="content" source="./media/create-table-wizard/table-completed.png" alt-text="Screenshot of table creation completed in create a table wizard.":::

In the tiles below the **Create table** progress, explore **Quick queries** or **Tools**:

* **Quick queries** includes links to the Azure Data Explorer web UI with example queries.

* **Tools** includes links to **Undo** the table creation by running the relevant `.drop` commands, or **Show schema** of the newly created table.

> [!NOTE]
> You might lose data when you use `.drop` commands.
>
> The drop commands in this workflow will only revert the changes that were made by the create table process (new table and schema mapping).

## Related content

* [Data ingestion overview](ingest-data-overview.md)
* [Write queries for Azure Data Explorer](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
