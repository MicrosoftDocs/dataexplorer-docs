---
title: Get data from a file
description: Learn how to get data from a local file in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 08/07/2023
---
# Get data from file

In this article, you learn you how to get data from an local file into either a new or existing table in an existing database.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Get data

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Get data**.

    :::image type="content" source="media/get-data-file/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-file/get-data.png":::

## Select a data source

1. In the **Get data** window, the **Source** tab is selected.

1. Select the data source from the available list. In this example, you are ingesting data from a **Local file**.

    :::image type="content" source="media/get-data-file/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-file/select-data-source.png":::

### Configure tab

1. Select a target database and table. If you want to ingest data into a new table, select **+ New table** and enter a table name.

    > [!NOTE]
    > Table names can be up to 1024 characters including spaces, alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. Either drag files into the window, or select **Browse for files**. 

    > [!NOTE]
    > You can add up to 1,000 files. Each file can be a max of 1 GB uncompressed.

    :::image type="content" source="media/get-data-file/configure-tab.png" alt-text="Screenshot of configure tab with new table entered and one sample data file selected." lightbox="media/get-data-file/configure-tab.png":::

1. Select **Next**

## Inspect the data

The **Inspect** tab opens with a preview of the data.

:::image type="content" source="media/get-data-file/inspect-the-data.png" alt-text="Screenshot of the inspect tab.":::

1. Select **Command viewer** to view and copy the automatic commands generated from your inputs.

1. The schema definition file is used for schema creation. If you are ingesting more than one file, choose the schema definition file from the dropdown.
1. The data format is automatically inferred. You can change the data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
    

### Advanced options based on data type

**JSON**:
* If you select **JSON**, you can also select **Advanced** > **Nested levels**, from 1 to 100. The levels determine the table column data division.
* If you select **Advanced** >**Ignore data format errors**, the data is ingested in JSON format. If you leave this check box unselected, the data is ingested in multijson format.

**Tabular**
* For ingesting tabular formats in an *existing table*, you can select **Advanced** > **Keep current table schema**. Tabular data doesn't necessarily include the column names that are used to map source data to the existing columns. When this option is checked, mapping is done by-order, and the table schema remains the same. If this option is unchecked, new columns are created for incoming data, regardless of data structure.


### Add nested JSON data

To add columns from JSON levels that are different than the main **Nested levels**, do the following steps:

1. Select on the arrow next to any column name, and select **New column**.

    :::image type="content" source="media/ingestion-wizard-existing-table/new-column.png" alt-text="Screenshot of options in the schema tab to add a new column using the ingestion wizard for Azure Data Explorer.":::

1. Enter a new **Column Name** and select the **Column Type** from the dropdown menu.
1. Under **Source**, select **Create new**.

    :::image type="content" source="media/ingestion-wizard-existing-table/create-new-source.png" alt-text="Screenshot to create a new source for adding nested JSON data in the ingestion process for Azure Data Explorer.":::

1. Enter the new source for this column and select **OK**. This source can come from any JSON level.

    :::image type="content" source="media/ingestion-wizard-existing-table/name-new-source.png" alt-text="Screenshot showing a window to name the new data source for the added column.":::

1. Select **Create**. Your new column will be added at the end of the table.

    :::image type="content" source="media/ingestion-wizard-existing-table/create-new-column.png" alt-text="Screenshot to create a new column using the ingestion wizard in Azure Data Explorer.":::

### Edit the table

[!INCLUDE [data-explorer-ingestion-wizard-column-table](includes/data-explorer-ingestion-wizard-column-table.md)]

> [!NOTE]
>
> * For tabular formats, you can't map a column twice. To map to an existing column, first delete the new column.
> * You can't change an existing column type. If you try to map to a column having a different format, you may end up with empty columns.

## Deploy ingestion

Select **Next: Start ingestion** to begin data ingestion.

## Complete data ingestion

In the **Data ingestion completed** window, all three steps are marked with green check marks when data ingestion finishes successfully.


## Next steps

To get started querying data, see the following articles:

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
