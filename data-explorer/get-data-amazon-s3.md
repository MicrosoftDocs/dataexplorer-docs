---
title: Get data from Amazon S3 into Azure Data Explorer
description: Learn how to get data from Amazon S3 into Azure Data Explorer.
ms.reviewer: sharmaanshul
ms.topic: how-to
ms.date: 11/16/2023
---
# Get data from Amazon S3

Data ingestion is the process used to load data from one or more sources into a table in Azure Data Explorer. Once ingested, the data becomes available for query. In this article, you learn how to get data from Amazon S3 into either a new or existing table.

For more information on Amazon S3, see [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html).

For general information on data ingestion, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Get data

1. From the left menu, select **Query**.
1. Right-click on the database where you want to ingest the data, and then select **Get data**.

    :::image type="content" source="media/get-data-amazon-s3/get-data.png" alt-text="Screenshot of query tab, with right-click on a database and the get options dialog open." lightbox="media/get-data-amazon-s3/get-data.png":::

## Source

In the **Get data window**, the **Source** tab is selected.

Select the data source from the available list. In this example, you are ingesting data from **Amazon S3**.

:::image type="content" source="media/get-data-amazon-s3/select-data-source.png" alt-text="Screenshot of get data window with source tab selected." lightbox="media/get-data-amazon-s3/select-data-source.png":::

## Configure

1. Select a target database and table. If you want to ingest data into a new table, select **+New table** and enter a table name.

    > [!NOTE]
    > Table names can be up to 1024 characters including spaces, alphanumeric, hyphens, and underscores. Special characters aren't supported.

1. In the **URI** field, paste the connection string of a single bucket, or an individual object in the following format.

    > Bucket: `https://`*BucketName*`.s3.`*RegionName*`.amazonaws.com`
    >
    > Object: *ObjectName*`;AwsCredentials=`*AwsAccessID*`,`*AwsSecretKey*

    Optionally, you can apply bucket filters to filter data according to a specific file extension.

    :::image type="content" source="media/get-data-amazon-s3/configure-tab.png" alt-text="Screenshot of configure tab with new table entered and an Amazon S3 connection string pasted." lightbox="media/get-data-amazon-s3/configure-tab.png":::

1. Select **Next**.

## Inspect

The **inspect** tab opens with a preview of the data.

To complete the ingestion process, select **Finish**.

:::image type="content" source="media/get-data-amazon-s3/inspect-data.png" alt-text="Screenshot of the inspect tab." lightbox="media/get-data-amazon-s3/inspect-data.png":::

Optionally:

* Select **Command viewer** to view and copy the automatic commands generated from your inputs.
* Use the **Schema definition file** dropdown to change the file that the schema is inferred from.
* Change the automatically inferred data format by selecting the desired format from the dropdown. See [Data formats supported by Azure Data Explorer for ingestion](ingestion-supported-formats.md).
* [Edit columns](#edit-columns).
* Explore [Advanced options based on data type](#advanced-options-based-on-data-type).

[!INCLUDE [get-data-edit-columns](includes/get-data-edit-columns.md)]

:::image type="content" source="media/get-data-amazon-s3/edit-columns.png" alt-text="Screenshot of columns open for editing." lightbox="media/get-data-amazon-s3/edit-columns.png":::

[!INCLUDE [mapping-transformations](includes/mapping-transformations.md)]

[!INCLUDE [get-data-advanced-options](includes/get-data-advanced-options.md)]

## Summary

In the **Data preparation** window, all three steps are marked with green check marks when data ingestion finishes successfully. You can view the commands that were used for each step, or select a card to query, visualize, or drop the ingested data.

:::image type="content" source="media/get-data-amazon-s3/summary.png" alt-text="Screenshot of summary page with successful ingestion completed." lightbox="media/get-data-amazon-s3/summary.png":::

## Related content

* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
