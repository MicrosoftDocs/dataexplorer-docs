---
title: Ingest data with the NLog sink into Azure Data Explorer
description: Learn how to use the Azure Data Explorer NLog connector to ingest data into your cluster.
ms.date: 06/30/2024
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the NLog sink into Azure Data Explorer

[!INCLUDE [ingest-nlog-sink1](includes/cross-repo/ingest-nlog-sink1.md)

In this article you will learn how to ingest data with nLog sink.

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* .NET SDK 6.0 or later
* An Azure Data Explorer [cluster and database](create-cluster-and-database.md)

[!INCLUDE [ingest-nlog-sink2](includes/cross-repo/ingest-nlog-sink2.md)]

### Create a table and ingestion mapping

Create a target table for the incoming data.

* In your query editor, run the following [table creation command](kusto/management/create-table-command.md), replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (Timestamp:datetime, Level:string, Message:string, FormattedMessage:dynamic, Exception:string, Properties:dynamic)
    ```

[!INCLUDE [ingest-nlog-sink3](includes/cross-repo/ingest-nlog-sink3.md)]

## Related content

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
