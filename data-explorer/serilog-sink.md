---
title: Ingest data with the Serilog sink into Azure Data Explorer
description: Learn how to use the Azure Data Explorer Serilog sink to ingest data into your cluster.
ms.date: 07/02/2024
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Serilog sink into Azure Data Explorer

[!INCLUDE [ingest-data-serilog](includes/cross-repo/ingest-data-serilog.md)]

For a complete list of data connectors, see [Data integrations overview](integrate-data-overview.md).

## Prerequisites

* .NET SDK 6.0 or later
* An Azure Data Explorer [cluster and database](/azure/data-explorer/create-cluster-and-database) with the default cache and retention policies.
* [Azure Data Explorer query environment](https://dataexplorer.azure.com/) <a id=ingestion-uri></a>
* Your Kusto cluster URI for the *TargetURI* value in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](add-cluster-connection.md#add-a-cluster-connection).

[!INCLUDE [ingest-data-serilog-2](includes/cross-repo/ingest-data-serilog-2.md)]

[!INCLUDE [ingest-data-serilog-3](includes/cross-repo/ingest-data-serilog-3.md)]

3. In the query environment, select the target database, and run the following query to explore the ingested data, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    <TableName>
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/serilog-connector/take-10-results.png" source="media/serilog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## Related content

* [Data integrations overview](integrate-data-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
