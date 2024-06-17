---
title: Ingest data with the Serilog sink into Azure Data Explorer
description: Learn how to use the Azure Data Explorer Serilog sink to ingest data into your cluster.
ms.date: 06/16/2024
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Serilog sink into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

[!INCLUDE [ingest-data-serilog](includes/cross-repo/ingest-data-serilog.md)]

## Prerequisites

[!INCLUDE [ingest-data-serilog-adx-prerequisites](includes/cross-repo/ingest-data-serilog-adx-prerequisites.md)]

[!INCLUDE [ingest-data-serilog-2](includes/cross-repo/ingest-data-serilog-2.md)]

You'll need your Kusto cluster URI for the *TargetURI* value. The URI is in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. For more information, see [Add a cluster connection](../../add-cluster-connection.md#add-a-cluster-connection).

[!INCLUDE [ingest-data-serilog-3](includes/cross-repo/ingest-data-serilog-3.md)]

1. In the [web UI](https://dataexplorer.azure.com/), select the target database, and run the following query to explore the ingested data, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    <TableName>
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/serilog-connector/take-10-results.png" source="media/serilog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## Related content

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
