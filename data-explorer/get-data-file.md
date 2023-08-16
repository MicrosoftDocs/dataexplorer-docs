---
title: Get data from a file
description: Learn how to get data from a local file in Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 08/07/2023
---
# Get data from file

Data ingestion is the process used to load data records from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn you how to get data from a local file into either a new or existing table.

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

:::image type="content" source="media/get-data-file/inspect-data.png" alt-text="Screenshot of the inspect tab." lightbox="media/get-data-file/inspect-data.png":::

1. Select **Command viewer** to view and copy the automatic commands generated from your inputs.
1. The schema definition file is used for schema creation. If you are ingesting more than one file, choose the schema definition file from the dropdown.
1. The data format is automatically inferred. You can change the data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
1. Optionally, [Edit columns](#edit-columns).
1. Optionally, explore [Advanced options based on data type](#advanced-options-based-on-data-type).
1. Select **Finish** to complete the ingestion process.


[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-file/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-file/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]


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
