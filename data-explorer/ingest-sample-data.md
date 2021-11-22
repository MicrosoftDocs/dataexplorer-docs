---
title: Ingest sample data into Azure Data Explorer
description: Learn about how to ingest (load) weather-related sample data into Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: quickstart
ms.date: 11/11/2021
ms.custom: mode-portal
ms.localizationpriority: high
---

# Quickstart: Ingest sample data into Azure Data Explorer

This article shows you how to ingest (load) sample data into an Azure Data Explorer database. There are [several ways to ingest data](ingest-data-overview.md); this article focuses on a basic approach that is suitable for testing purposes.

> [!NOTE]
> You already have this data if you completed [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md).

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## Ingest data

The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncdc.noaa.gov/stormevents/).

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com).

# [Ingest with query](#tab/ingest-query)

1. Select **Query** in the left pane. In the upper-left of the application, select **Add cluster**.

1. In the **Add cluster** dialog box, enter your cluster URL in the form `https://<ClusterName>.<Region>.kusto.windows.net/`, then select **Add**.

1. Paste in the following command, and select **Run** to create a StormEvents table.

    ```Kusto
    .create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)
    ```

1. Paste in the following command, and select **Run** to ingest data into StormEvents table.

    ```Kusto
    .ingest into table StormEvents 'https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?sv=2019-12-12&ss=b&srt=o&sp=r&se=2022-09-05T02:23:52Z&st=2020-09-04T18:23:52Z&spr=https&sig=VrOfQMT1gUrHltJ8uhjYcCequEcfhjyyMX%2FSc3xsCy4%3D' with (ignoreFirstRecord=true)
    ```

1. After ingestion completes, paste in the following query, select the query in the window, and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    The query returns the following results from the ingested sample data.

    ![Query results.](media/ingest-sample-data/query-results.png)

# [Ingest with wizard](#tab/one-click-ingest)

1. Select **Data** in the left pane. In the **Data Management** page, select **Ingest data from blob**, and then **Ingest**. 
      
      :::image type="content" source="media/ingest-sample-data/select-ingestion-wizard.png" alt-text="Ingest data from the data management window of the WebUI interface - Azure Data Explorer." lightbox="media/ingest-sample-data/select-ingestion-wizard.png":::

1. Fill out the basic cluster details with the following information.

    :::image type="content" source="media/ingest-sample-data/select-ingestion-cluster.png" alt-text="Select ingestion cluster and  database and select an existing or new table name. Specify table name.":::

    | Setting | Description|
    |---|---|
    |Cluster | Select your cluster. |
    |Database | Choose a database. |
    |Table | Create a new table. For this example, name it *StormEvents*. |

    
1. Specify out the source details with the following information.

    :::image type="content" source="media/ingest-sample-data/specify-ingestion-source.png" alt-text="Select source for ingestion and provide list of source URIs or containers.":::

    | Setting | Field description|
    |---|---|
    | Source type | Select the data source to ingest. In this example, *From blob* is already selected. |
    | Link to source | Add a blob URI with a SAS token or Account key. For this example, enter https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?sv=2019-12-12&ss=b&srt=o&sp=r&se=2022-09-05T02:23:52Z&st=2020-09-04T18:23:52Z&spr=https&sig=VrOfQMT1gUrHltJ8uhjYcCequEcfhjyyMX%2FSc3xsCy4%3D. |
   

1. Confirm the schema details.

    :::image type="content" source="media/ingest-sample-data/define-ingestion-schema.png" alt-text="Define schema for ingestion, whether data is uncompressed, and structure of table.":::

    | Setting | Field description|
    |---|---|
    | Compression type | Compression type has been taken from the file extension. |
    | Data format | The data format, **CSV**, is already specified. | 
    | Ignore the first record | If the source table includes column names, the first record is ignored during ingestion.  | 
    | Mapping | Schema mapping name. | 

1. After ingestion completes, select **Query** in the left pane. Paste in the following query, select the query in the window, and select **Run**.

    ```Kusto
    StormEvents
    | sort by StartTime desc
    | take 10
    ```

    The query returns the following results from the ingested sample data.

    ![Query results.](media/ingest-sample-data/query-results.png)
---

## Next steps

* [Azure Data Explorer data ingestion](ingest-data-overview.md) to learn more about ingestion methods.
* [Quickstart: Query data in Azure Data Explorer](web-query-data.md) Web UI.
* [Write queries](write-queries.md) with Kusto Query Language.
