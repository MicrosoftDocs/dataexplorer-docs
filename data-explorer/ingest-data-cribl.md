---
title: 'Ingest data from Cribl stream into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Cribl stream.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 07/03/2024

#Customer intent: As an integration developer, I want to build integration pipelines from Cribl stream into Azure Data Explorer, so I can make data available for near real time analytics.
---
# Ingest data from Cribl stream into Azure Data Explorer

[!INCLUDE [ingest-data-cribl](includes/cross-repo/ingest-data-cribl.md)]

For a complete list of data connectors, see [Data integrations overview](integrate-data-overview.md).

## Prerequisites

* A [Cribl stream account](https://cribl.io)
* An Azure Data Explorer [cluster and database](/azure/data-explorer/create-cluster-and-database) with the default cache and retention policies.
* [Azure Data Explorer query environment](https://dataexplorer.azure.com/)

[!INCLUDE [ingest-data-cribl-2](includes/cross-repo/ingest-data-cribl-2.md)]

<!--[!INCLUDE [ingest-data-cribl-3](includes/cross-repo/ingest-data-cribl-3.md)]-->

3. In the query environment, select the target database, and run the following query to explore the ingested data, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    <TableName>
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/serilog-connector/take-10-results.png" source="media/serilog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## Ingestion URI

You'll need your Kusto cluster URI for the *TargetURI* value. The URI is in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](add-cluster-connection.md#add-a-cluster-connection).

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
