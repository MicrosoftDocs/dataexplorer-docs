---
title: Create an external table using the Azure Data Explorer web UI wizard in Azure Data Explorer
description: Use the wizard experience to create an external table.
ms.reviewer: ohbitton
ms.topic: how-to
ms.date: 08/25/2022
---

# Create an external table using the Azure Data Explorer web UI wizard

An external table is a schema entity that references data stored outside the Azure Data Explorer database. Azure Data Explorer web UI can create external tables by taking sample files from a storage container and creating schema based on these samples. You can then analyze and query data in external tables without ingestion into Azure Data Explorer. For a brief overview, see [external tables](kusto/query/schema-entities/external-tables.md). For information about different ways to create external tables, see [create and alter Azure Storage external tables](kusto/management/external-tables-azurestorage-azuredatalake.md). This article shows you how to create an external table using the creation wizard experience.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) and [add a connection to your cluster](web-query-data.md#add-clusters).

## Create an external table

1. In the left menu, select **Query**.

1. Right-click on the database where you want to create the external table. Select **Create external table**.

    :::image type="content" source="media/external-table/query-create-external-table.png" alt-text="Screenshot of the option to create an external table from the query page." lightbox="media/external-table/query-create-external-table.png":::

The **Create external table** window opens with the **Destination** tab selected.

### Destination tab

1. The **Cluster** and **Database** fields are prepopulated. You may select a different destination from the drop-down menu.
1. In **Table name**, enter a name for your table.
    > [!TIP]
    >  Table names can be up to 1024 characters including alphanumeric, hyphens, and underscores. Special characters aren't supported.
1. Select **Next: Source**

:::image type="content" source="media/external-table/destination-tab.png" alt-text="Screen capture of the Destination tab with Cluster, Database, and Table name fields.":::

### Source tab

In **Link to containers**, there are two ways to add a container: [Add a container with the **Select container** button](#add-a-container-with-the-select-container-button) and [Add a container with the **Add URL or Add container** button](#add-a-container-with-the-add-url-or-add-container-button).

You can add up to 10 source containers.

#### Add a container with the **Select container** button

1. Select **Select container**.

    :::image type="content" source="media/external-table/select-container.png" alt-text="Screenshot of select container button in source tab.":::

1. Choose the relevant subscription and storage account associated with your container.

    :::image type="content" source="media/select-container-window.png" alt-text="Screenshot of select container window.":::

1. Select the **Add** button. When verification has completed, a green check will appear to the right of the container link.

    :::image type="content" source="media/external-table/container-verified.png" alt-text="Screenshot of verified container link.":::

#### Add a container with the **Add URL or Add container** button

1. Select the **Add URL** or **Add container** button.

    :::image type="content" source="media/external-table/add-url-button.png" alt-text="Screenshot of add URL button.":::

1. Enter an [account key or SAS URL](kusto/api/connection-strings/generate-sas-token.md) to your source container with read and list permissions. When verification has completed, a green check will appear to the right of the container link.

    :::image type="content" source="media/external-table/add-sas-url.png" alt-text="Screenshot of adding SAS URL.":::

#### File filters

Use **File filters** to filter the files that the table should include. Files can be filtered according to folder path, file begins with, or file extension.

:::image type="content" source="media/external-table/file-filters.png" alt-text="Screenshot of selecting schema-defining file.":::

#### Schema-defining file

The first source container will display files below **File filters**.

:::image type="content" source="media/external-table/schema-defining-file.png" alt-text="Screen shot of create external table source tab in Azure Data Explorer.":::

1. Choose the schema-defining file by selecting the circle to the left of the file. This file will be used to generate the table schema.
1. Select **Next: schema**. The **Schema** tab opens.

### Schema tab

In the right-hand side of the tab, you can preview your data. On the left-hand side, you can add [partitions](kusto/management/partitioning-policy.md) to your table definitions to access the source data more quickly and achieve better performance.

> [!NOTE]
> Mappings are not part of the definition of an external table, and are not supported in this wizard. Mappings can be [configured later](kusto/management/external-table-mapping-create.md) if necessary. Some functionalities, such as deleting the last column in CSV files or changing column names in JSON files, require mappings in order to work correctly.

1. Select **Add partition**.

    :::image type="content" source="media/external-table/view-file.png" alt-text="Screen shot of view file for external table in Azure Data Explorer.":::

1. The partition window opens. A partition is defined over a subpath of the file, which can be altered using the **Path prefix** field. For each partition you wish to apply, fill out the fields as follows:

    Field | Description | Required/Optional
    ---|---|---
    Partition name | Used for identification of the partition. The name can be arbitrary. | Required
    Type | The data type of the data partitioning column. | Required
    Data column | The column used for partitioning. Virtual columns partition according to URL path. | Required
    Function | The function applied to the data column used for partitioning. | Optional
    Function argument | Argument to be used in the partition function. | Required if function is used.
    Path prefix | The subpath of the file on which the partitioning is defined. This prefix changes the URL of the external table, as seen in the **Uri preview** box, and should match the schema-defining file URI. | Optional
    Datetime pattern | Format of date that will be used to construct the table URI path. | Optional

    :::image type="content" source="media/external-table/add-partitions.png" alt-text="Screen shot add partitions to external table in Azure Data Explorer." lightbox="media/external-table/add-partitions.png":::

    For example, the partition name *CustomerName* suggests that the value to partition by is in the customer name part of the URL. The above example declared two partitions: one partition over the customer name and one partition over the date embedded in the URL.

    > [!NOTE]
    > Virtual columns appear as part of the schema as the columns data extracted from the file path, and this data can be used later in queries.

1. Select **Add partition** to add another partition.
1. Select **Save**. The partitions you added now appear in the list of **Partitions** in the left pane. Partitioned columns can't be changed in preview.

    :::image type="content" source="media/external-table/schema.png" alt-text="Screenshot of schema external table Azure Data Explorer.":::

1. Select **Next: Create table**. When the table is created, an **External table successfully created** window opens.
1. To view the command used to create the table, select **View command**.

    :::image type="content" source="media/external-table/successfully-created.png" alt-text="Screenshot of successful creation of external table in Azure Data Explorer.":::
1. To undo the creation of the external table, select **Tools** > **Undo**.

## Query the external table

The resulting table includes data from all the files that fit the criteria defined above. You can query this table using the `external_table()` function. For more information on how to query external tables, see [Querying an external table](data-lake-query-data.md#querying-an-external-table).

:::image type="content" source="media/external-table/view-table.png" alt-text="Screen shot of table output from querying external table in Azure Data Explorer.":::

## Related content

* [External tables overview](kusto/query/schema-entities/external-tables.md)
* [Create and alter Azure Storage external tables](kusto/management/external-tables-azurestorage-azuredatalake.md)
* [external_table() function](kusto/query/externaltablefunction.md)
