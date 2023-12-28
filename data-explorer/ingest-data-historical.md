---
title: Ingest historical data into Azure Data Explorer
description: Learn how to use LightIngest to ingest historical or ad hoc data ingestion into Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 08/22/2023
# CustomerIntent: As a data analyst, I want to learn how to ingest historical data into Azure Data Explorer, so that I can analyze it and gain insights.
---
# How to ingest historical data into Azure Data Explorer

A common scenario when onboarding to Azure Data Explorer is to ingest historical data, sometimes called backfill. The process involves ingesting data from an existing storage system into a table, which is a collection of [extents](kusto/management/extents-overview.md).

We recommend ingesting historical data using the [creationTime ingestion property](ingestion-properties.md#ingestion-properties) to set the creation time of extents to the time the data was *created*. By using the creation time as the ingestion partitioning criterion, your data can age normally in accordance with your [cache](kusto/management/cachepolicy.md) and [retention](kusto/management/retentionpolicy.md) policies, and make time filters more efficient.

By default, the creation time for extents is set to the time when the data is ingested, which may not produce the behavior you're expecting. For example, suppose you have a table that has a cache period of 30 days and a retention period of two years. In the normal flow, data ingested as it's produced is cached for 30 days and then moved to cold storage. After two years, based on it's creation time, older data is removed one day at a time. However, if you ingest two years of historical data where, by default, the data is marked with creation time as the time the data is ingested. This may not produce the desired outcome because:

- All the data lands in cache and stays there for 30 days, using more cache than you anticipated
- Older data isn't removed one day at a time; hence data is retained in the cluster for longer than necessary and, after two years, is all removed at once
- Data, previously grouped by date in the source system, may now be [batched together](kusto/management/batchingpolicy.md) in the same extent leading to inefficient queries

:::image type="content" source="media/ingest-data-historical/historical-data-expected-vs-actual.png" alt-text="Diagram showing the expected versus actual result of ingesting historical data using the default creation time.":::

In this article, you learn how to partition historical data:

- Using the `creationTime` ingestion property during ingestion (recommended)

    Where possible, ingest historical data using the [`creationTime` ingestion property](ingestion-properties.md#ingestion-properties), which allows you to set the creation time of the extents by extracting it from the file or blob path. If your folder structure doesn't use a creation date pattern, we recommend that you restructure your file or blob path to reflect the creation time. By using this method, the data is ingested into the table with the correct creation time, and the cache and retention periods are applied correctly.

    > [!NOTE]
    > By default, extents are partitioned by time of creation (ingestion), and in most cases there's no need to set a data partitioning policy.

- Using a partitioning policy post ingestion

    If you can't use the `creationTime` ingestion property, for example if you're [ingesting data using the Azure Cosmos DB connector](ingest-data-cosmos-db-connection.md) where you can't control the creation time or if you can't restructure your folder structure, you can repartition the table post ingestion to achieve the same effect using the [partitioning policy](kusto/management/partitioningpolicy.md). However, this method may require some trial and error to optimize policy properties and is less efficient than using the `creationTime` ingestion property. We only recommended this method when using the `creationTime` ingestion property isn't possible.

## Prerequisites

- A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
- An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
- [A storage account](/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
- For the recommended method of using the `creationTime` ingestion property during ingestion, [install LightIngest](lightingest.md).

## Ingest historical data

We highly recommend partitioning historical data using the `creationTime` ingestion property during ingestion. However, if you can't use this method, you can repartition the table post ingestion using a partitioning policy.

### [During ingestion (recommended)](#tab/during-ingestion)

LightIngest can be useful to load historical data from an existing storage system to Azure Data Explorer. While you can build your own command using the list of [Command-line arguments](lightingest.md#command-line-arguments), this article shows you how to autogenerate this command through an ingestion wizard. In addition to creating the command, you can use this process to create a new table, and create schema mapping. This tool infers schema mapping from your dataset.

>[!NOTE]
> This process must be performed in the ingestion wizard, and is not available in the new **Get data** experience.

1. In the Azure Data Explorer web UI, from the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data, and then select **Get data**.

    :::image type="content" source="media/ingest-data-wizard/ingest-data-from-query-page.png" alt-text="Screenshot of selection of the ingestion wizard in the Azure Data Explorer web UI.":::

    In the **Ingest data** window, the **Destination** tab is selected. The **Cluster** and **Database** fields are automatically populated.

1. On the **Destination** tab, under **Table**, select either **Existing table** or **New table**. When creating a new table, enter a name for the new table. You can use alphanumeric, hyphens, and underscores. Special characters aren't supported.

    > [!NOTE]
    > Table names must be between 1 and 1024 characters.

    :::image type="content" source="media/ingest-data-historical/ingest-new-data.png" alt-text="Screenshot of Azure Data Explorer web UI with Data tab selected on the left menu, and Ingest data dialog open to the right.":::

1. Select **Next: Source**

1. On the **Source** tab, under **Source type**, select **Blob container** to ingest data from a blob or ADLS Gen2 container.

    :::image type="content" source="media/ingest-data-historical/source-tab-lightingest.png" alt-text="Screenshot of Source tab in Ingest new table window. ":::

1. Select **Ingestion type** > **Historical data**.
1. Under **Select source**, select either **Add URL** or **Select container**.
    - When adding a URL, under **Link to source**, specify the account key or SAS URL to a container. You create the SAS URL [manually](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) or [automatically](kusto/api/connection-strings/generate-sas-token.md).
    - When selecting a container from your storage account, select your **Storage subscription**, **Storage account**, and **Container** from the dropdown menus.

        :::image type="content" source="media/ingest-data-historical/source-tab-container-from-subscription.png" alt-text="Screenshot of dialog box for selecting container from storage subscription and account.":::

1. Select **Advanced settings** to define additional settings for the ingestion process using LightIngest.

    :::image type="content" source="media/ingest-data-historical/source-tab-advanced-settings.png" alt-text="Screenshot of selecting advanced settings for the ingestion processing involving the tool LightIngest.":::

1. In the **Advanced configuration** panel, define the following settings, and then select **Done** to return to the **Source** tab.

    :::image type="content" source="media/ingest-data-historical/advanced-configuration-dialog.png" alt-text="Screenshot of setting advanced options for the ingestion processing involving the tool LightIngest.":::

    | Property | Description|
    |---|---|
    | Creation time pattern | Specify a pattern used to override the ingestion time property of the created extent. For example, you can apply a date based on the folder structure of the container. See also [Creation time pattern](lightingest.md#how-to-ingest-data-using-creationtime). |
    | Blob name pattern | Specify the pattern used to identify the files to be ingested. Ingest all the files that match the blob name pattern in the given container. Supports wildcards. We recommend enclosing this value in double quotes. |
    | Tag | A [tag](kusto/management/extent-tags.md) assigned to the ingested data. The tag can be any string. |
    | Limit number of files | Specify the number of files that can be ingested. Ingests the first `n` files that match the blob name pattern, up to the number specified.  |
    | Don't wait for ingestion to complete | If set, queues the blobs for ingestion without monitoring the ingestion process. If not set, LightIngest continues to poll the ingestion status until ingestion is complete.|
    | Display only selected items| List the files in the container, but doesn't ingest them.  |

1. Optionally, select **File Filters** to filter the data to ingest only files in a specific folder path or with a particular file extension.

    :::image type="content" source="media/ingest-data-historical/filter-data-lightingest.png" alt-text="Screenshot of filtering data in the source tab of the Ingest new data screen.":::

    By default, one of the files in the container is randomly selected and used to generate the schema for the table. Optionally, under **Schema defining file**, you can specify the file to use.

1. Select **Next: Schema** to view and edit your table column configuration.

1. On the **Schema** tab, do the following:

    1. In **Compression type**, confirm that the derived from the schema defining source file is correct.
    1. Under **Data format**, verify that:
        - The file format is correct. If not, select the correct format from the dropdown menu.
        - The **ignore the first record** check box is selected if the file has a header row.
    1. In **Mapping name**, optionally specify a mapping name. You can use alphanumeric characters and underscores. Spaces, special characters, and hyphens aren't supported.

    When using an existing table, you can **Keep current table schema** if the table schema matches the selected format.

    :::image type="content" source="media/ingest-data-historical/schema-tab-lightingest.png" alt-text="Screenshot of the schema tab in the Ingest new data dialog in Azure Data Explorer web UI.":::

1. Under **Partial data preview**, review the data preview. If the data preview is incorrect, use the column dropdown menus to alter various aspects of the table.

[!INCLUDE [data-explorer-ingestion-wizard-column-table](includes/data-explorer-ingestion-wizard-column-table.md)]

> [!NOTE]
> For tabular formats, you can't map a column twice. To map to an existing column, first delete the new column.

1. Select **Next: Start Ingestion** to generate the LightIngest command.

1. On the **Data ingestion completed** page, once the table, mapping, and LightIngest command are marked with green check marks, select the **copy** icon on the top-right of the **Generated command** box to copy the generated LightIngest command.

    :::image type="content" source="media/ingest-data-historical/summary-tab-copy-command.png" alt-text="Screenshot of Summary tab with command generated. You can copy the command using the copy icon above the generated command box." lightbox="media/ingest-data-historical/summary-tab-copy-command.png":::

    > [!NOTE]
    > If required, you can download the LightIngest tool by selecting **Download LightIngest**.

1. To complete the ingestion process, you must [run LightIngest](lightingest.md#run-lightingest) using this copied command.

### [Post ingestion](#tab/post-ingestion)

#### Step 1: Prepare for repartitioning

1. Adjust the retention policy to allow for old data. In the following example, you set retention policy for table **MyTable** to 10 years.

    ```kusto
    .alter-merge table MyTable policy retention softdelete = 3650d recoverability = enabled
    ```

1. Adjust the caching policy so that all the data is in hot cache for the repartitioning, as only hot data can be repartitioned post ingestion. In the following example, you set the caching for table **MyTable** to 10 years.

    ```kusto
    .alter table MyTable policy caching hot = 3650d
    ```

    > [!IMPORTANT]
    > Increasing the caching policy may use considerably more hot cache than in normal operations and may result in increased cost.

#### Step 2: Initiate repartitioning

1. Create a partitioning policy that partitions the data by the column named `Timestamp`. In the following example, you set the partitioning policy for table **MyTable** to partition by the column named `Timestamp`.

    ~~~kusto
    .alter table MyTable policy partitioning
    ```
    {
      "EffectiveDateTime" : "1970-01-01T00:00:00",
      "PartitionKeys": [
        {
          "ColumnName": "Timestamp",
          "Kind": "UniformRange",
          "Properties": {
            "Reference": "1970-01-01T00:00:00",
            "RangeSize": "1.00:00:00",
            "OverrideCreationTime": true
          }
        }
      ]
    }
    ```
    ~~~

    For information about the partitioning policy properties, see [partition properties](kusto/management/partitioningpolicy.md#partition-properties-1). For historical ingestion, how you set the following properties is important:

    - The **EffectiveDateTime** property must be set to a date earlier than the start of the ingestion to trigger the repartitioning.
    - The **RangeSize** is set to one day so that the data is repartitioned into buckets of one day. However, you should set this value to align with your data. For example, if you have less than several GBs of data per day, consider setting a larger value.
    - The **OverrideCreationTime** must be set to *true* so that after repartitioning the data into day buckets, the extents are marked with that day as the creation time.

1. Set a merge policy to allow merging of all extents, including extents older than 14 days. Setting this policy is important because the repartitioning process creates extents older than 14 days, which by default are excluded by the merge process.

    ~~~kusto
    .alter table MyTable policy merge
    ```
    {
      "Lookback": {
        "Kind": "HotCache"
      }
    }
    ```
    ~~~

1. Monitor the repartitioning progress using the [.show database extents partitioning statistics](kusto/management/show-database-extents-partitioning-statistics.md) command. In the returned results, look for the table you're repartitioning and monitor the **PartitionedRowPercentage** column. When the **PartitionedRowPercentage** column's value is `100`, the repartitioning is complete.

#### Step 3: Clean up post repartitioning

Once the repartitioning is complete, you can clean up the policies you set in the previous steps.

1. Remove the partitioning policy.

    ```kusto
    .delete table MyTable policy partitioning
    ```

1. Remove the merge policy.

    ```kusto
    .delete table MyTable policy merge
    ```

1. Remove or set the caching policy.

    ```kusto
    // Remove the caching policy
    .delete table MyTable policy caching
    // OR set the caching policy to your desired value
    .alter table MyTable policy caching hot = 90d
    ```

1. Remove or set the retention policy.

    ```kusto
    // Remove the retention policy
    .delete table MyTable policy retention
    // OR set the retention policy to your desired value
    .alter-merge table MyTable policy retention softdelete = 30d recoverability = enabled
    ```

## Related content

* [Query data in Azure Data Explorer](web-query-data.md)
