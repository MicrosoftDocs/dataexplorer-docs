---
title: Get data from a file
description: Learn how to get data from a local file in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 08/07/2023
---
# Get data from file

Data ingestion is the process used to load data records from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn you how to get data from an local file into either a new or existing table.

For general information on data ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md)

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

:::image type="content" source="media/get-data-file/inspect-the-data.png" alt-text="Screenshot of the inspect tab." lightbox="media/get-data-file/inspect-the-data.png":::

1. Select **Command viewer** to view and copy the automatic commands generated from your inputs.
1. The schema definition file is used for schema creation. If you are ingesting more than one file, choose the schema definition file from the dropdown.
1. The data format is automatically inferred. You can change the data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
1. Optionally, [Edit columns](#edit-columns).
1. Optionally, explore [Advanced options based on data type](#advanced-options-based-on-data-type).
1. Select **Finish** to complete the ingestion process.

### Edit columns

> [!NOTE]
>
> * For tabular formats, you can't map a column twice. To map to an existing column, first delete the new column.
> * You can't change an existing column type. If you try to map to a column having a different format, you may end up with empty columns.

:::image type="content" source="media/get-data-file/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-file/edit-columns.png":::

The changes you can make in a table depend on the following parameters:

* **Table** type is new or existing
* **Mapping** type is new or existing

Table type | Mapping type | Available adjustments|
|---|---|---|
| New table | New mapping |Rename column, change data type, change data source, [mapping transformation](#mapping-transformations) if relevant, new column, delete column |
| Existing table | New mapping | New column (on which you can then change data type, rename, and update) |
| Existing table | Existing mapping | none

### Mapping transformations

Some data format mappings (Parquet, JSON, and Avro) support simple ingest-time transformations. To apply mapping transformations, create or update a column in the [Edit columns](#edit-columns) window.

Mapping transformations can be performed on a column of type string or datetime, with the source having data type int or long. Supported mapping transformations are:

* DateTimeFromUnixSeconds
* DateTimeFromUnixMilliseconds
* DateTimeFromUnixMicroseconds
* DateTimeFromUnixNanoseconds

### Advanced options based on data type

**Tabular**:

* If you're ingesting tabular formats in an *existing table*, you can select **Advanced** > **Keep current table schema**. Tabular data doesn't necessarily include the column names that are used to map source data to the existing columns. When this option is checked, mapping is done by-order, and the table schema remains the same. If this option is unchecked, new columns are created for incoming data, regardless of data structure.
* To use the first row as column names, select  **Advanced** > **First row is column header**.

    :::image type="content" source="media/get-data-file/advanced-csv.png" alt-text="Screenshot of advanced CSV options.":::

**JSON**:

* To determine column division of JSON data, select **Advanced** > **Nested levels**, from 1 to 100. 
* If you select **Advanced** > **Ignore data format errors**, the data is ingested in JSON format. If you leave this check box unselected, the data is ingested in multijson format.

    :::image type="content" source="media/get-data-file/advanced-json.png" alt-text="Screenshot of advanced JSON options":::

## Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-file/summary.png" alt-text="Screenshot of summary page with successful ingestion completed." lightbox="media/get-data-file/summary.png":::

## Next steps

* Explore the results in the [Azure Data Explorer web UI query](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
* [Use the sample app generator wizard to create code to ingest and query your data](sample-app-generator-wizard.md)
* Drop ingested data using [.drop extents command](kusto/management/drop-extents.md) and [.drop ingestion mapping command](kusto/management/drop-ingestion-mapping-command.md)
