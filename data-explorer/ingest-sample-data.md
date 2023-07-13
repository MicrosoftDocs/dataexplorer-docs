---
title: Ingest sample data into Azure Data Explorer
description: Learn about how to ingest (load) weather-related sample data into Azure Data Explorer.
ms.reviewer: mblythe
ms.topic: quickstart
ms.date: 06/05/2023
ms.custom: mode-portal
---

# Quickstart: Ingest sample data into Azure Data Explorer

This article shows you how to ingest (load) sample data into an Azure Data Explorer database. There are [several ways to ingest data](ingest-data-overview.md). This article focuses on a basic approach that's suitable for testing purposes.

> [!NOTE]
> You already have this data if you completed [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Ingest data

The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncei.noaa.gov/).

First, sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com). Then follow the steps to ingest the sample data.

### [Ingest with wizard](#tab/ingestion-wizard)

1. From the left menu, select **Query**.

1. Right-click on the database where you want to ingest the data. Select **Ingest data**.

    :::image type="content" source="media/ingest-data-wizard/ingest-data-from-query-page.png" alt-text="Screenshot of selection of the ingestion wizard in the Azure Data Explorer web UI." lightbox="media/ingest-data-wizard/ingest-data-from-query-page.png":::

1. In the **Destination** tab, fill out the following information:

    :::image type="content" source="media/ingest-sample-data/select-ingestion-cluster.png" alt-text="Screenshot of the Azure Data Explorer web UI where you select ingestion cluster and database and select an existing or new table name. Specify table name.":::

    | Setting | Description|
    |---|---|
    |Cluster | Select your cluster. |
    |Database | Choose a database. |
    |Table | Create a new table. For this example, name it *StormEvents*. |

1. Select **Next: Source**.

1. Fill out the **Source** tab with the following information:

    :::image type="content" source="media/ingest-sample-data/specify-ingestion-source.png" alt-text="Screenshot of the Azure Data Explorer web UI where you select source for ingestion and provide list of source URIs or containers.":::

    | Setting | Description|
    |---|---|
    | Source type | Select the data source to ingest. For this example, select **Blob**. |
    | Link to source | Use the following [storage URI](./kusto/api/connection-strings/storage-connection-strings.md) link: https://kustosamples.blob.core.windows.net/samplefiles/StormEvents.csv. |

1. Select **Next: Schema**.

1. Confirm the schema details.

    :::image type="content" source="media/ingest-sample-data/define-ingestion-schema.png" alt-text="Screenshot of the Azure Data Explorer web UI where you define the schema for ingestion, whether data is uncompressed, and structure of table.":::

    | Setting | Description|
    |---|---|
    | Compression type | The compression type is inferred from the file extension. |
    | Data format | The data format, **CSV**, is already specified. |
    | Ignore the first record | If the source table includes column names, the first record is ignored during ingestion.  |
    | Mapping | Schema mapping name. |

1. Select **Next: Summary**.

1. After ingestion completes, select **Query** in the left pane.

    :::image type="content" source="media/ingest-sample-data/select-query.png" alt-text="Screenshot of the Azure Data Explorer web UI where you select the Query pane from the menu.":::

1. Paste in the following query and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    The query returns the following results from the ingested sample data.

    :::image type="content" source="media/ingest-sample-data/query-results.png" alt-text="Screenshot of the Azure Data Explorer web UI where you select the query results for the ingested sample data.":::

### [Ingest with command](#tab/ingest-command)

1. In the left menu, select **Query**. In the upper-left of the application, select **Add cluster**.

    :::image type="content" source="media/ingest-sample-data/add-cluster.png" alt-text="Screenshot of Azure Data Explorer web UI where you select the query pane and add a new cluster in the Query pane.":::

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run** to create a StormEvents table.

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
    ```

1. Paste in the following command, and select **Run** to ingest data into StormEvents table.

    ```Kusto
    .ingest into table StormEvents 'https://kustosamples.blob.core.windows.net/samplefiles/StormEvents.csv' with (ignoreFirstRecord=true)
    ```

1. After ingestion completes, paste in the following query and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    The query returns the following results from the ingested sample data.

    :::image type="content" source="media/ingest-sample-data/query-results.png" alt-text="Screenshot of the Azure Data Explorer web UI where you see the query results for the ingested sample data.":::

---

## Next steps

* [Azure Data Explorer data ingestion](ingest-data-overview.md) to learn more about ingestion methods.
* [Quickstart: Query data in Azure Data Explorer web UI](web-query-data.md).
* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) with Kusto Query Language.