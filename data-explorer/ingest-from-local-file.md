---
title: Ingest JSON data from a local file to an existing table in Azure Data Explorer using the ingestion wizard
description: Ingesting (loading) data into an existing Azure Data Explorer table simply, using the ingestion wizard.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 06/05/2023
---
# Use the ingestion wizard to ingest JSON data from a local file to an existing table in Azure Data Explorer

[The ingestion wizard](./ingest-data-wizard.md) allows you to ingest data in various formats and create mapping structures, as a one-time or continuous ingestion process.

This document describes using the ingestion wizard to ingest JSON data from a local file into an existing table. Use the same process with slight adaptations to cover different use cases.

> [!NOTE]
> To enable access between a cluster and a storage account without public access (restricted to private endpoint/service endpoint), see [Create a Managed Private Endpoint](security-network-managed-private-endpoint-create.md).

## Ingest data

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Ingest data**.

    :::image type="content" source="media/ingest-data-wizard/ingest-data-from-query-page.png" alt-text="Screenshot of selection of the ingestion wizard in the Azure Data Explorer web UI." lightbox="media/ingest-data-wizard/ingest-data-from-query-page.png":::

## Select an ingestion type

1. In the **Ingest data** window, the **Destination** tab is selected.

1. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus.

    [!INCLUDE [ingestion-wizard-cluster](includes/ingestion-wizard-cluster.md)]

1. If the **Table** field isn't automatically filled, select an existing table name from the drop-down menu.

1. Select **Next: Source**

### Source tab

1. Under **Source type**, do the following steps:

   1. Select **from file**
   1. Select **Browse** to locate up to 10 files, or drag the files into the field. The schema-defining file can be chosen using the blue star.
   1. Select **Next: Schema**

      :::image type="content" source="media/ingestion-wizard-existing-table/from-file.png" alt-text="Screenshot to ingest from file with the ingestion wizard.":::

## Edit the schema

The **Schema** tab opens.

* **Compression type** is selected automatically by the source file name. In this case, the compression type is **JSON**

* If you select **Ignore data format errors**, the data is ingested in JSON format. If you leave this check box unselected, the data is ingested in multijson format.

* When you select  **JSON**, you must also select **Nested levels**, from 1 to 100. The levels determine the table column data division.

    :::image type="content" source="media/ingestion-wizard-existing-table/json-levels.png" alt-text="Screenshot completing ingestion information for ingesting a JSON file.":::

    > [!TIP]
    > If you want to use **CSV** files, see [Ingest data from a container or Azure Data Lake Storage into Azure Data Explorer](/azure/data-explorer/ingest-from-container#edit-the-schema)

* For tabular formats, you can select **Keep current table schema**.
Tabular data doesn't necessarily include the column names that are used to map source data to the existing columns. When this option is checked, mapping is done by-order, and the table schema remains the same. If this option is unchecked, new columns are created for incoming data, regardless of data structure.

    :::image type="content" source="media/ingestion-wizard-existing-table/keep-table-schema.png" alt-text="Screenshot showing the 'keep current table schema' option checked when using tabular data format.":::

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

[!INCLUDE [data-explorer-ingestion-wizard-command-editor](includes/data-explorer-ingestion-wizard-command-editor.md)]

## Start ingestion

Select **Next: Start ingestion** to begin data ingestion.

:::image type="content" source="media/ingestion-wizard-existing-table/start-ingestion.png" alt-text="Screenshot of ingestion wizard fields completed to start ingestion.":::

## Complete data ingestion

In the **Data ingestion completed** window, all three steps are marked with green check marks when data ingestion finishes successfully.

:::image type="content" source="media/ingestion-wizard-existing-table/one-click-data-ingestion-complete.png" alt-text="Screenshot of ingestion wizard summary when ingestion is completed.":::

> [!IMPORTANT]
> To set up continuous ingestion from a container, see [Ingest data from a container or Azure Data Lake Storage into Azure Data Explorer](/azure/data-explorer/ingest-from-container#create-continuous-ingestion)

[!INCLUDE [data-explorer-ingestion-wizard-query-data](includes/data-explorer-ingestion-wizard-query-data.md)]

## Next steps

For another ingestion scenario, see the following article:

* [Ingest data from a container or Azure Data Lake Storage into Azure Data Explorer](/azure/data-explorer/ingest-from-container)

To get started querying data, see the following articles:

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
