---
title: Ingest data with Fluent Bit into Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Fluent Bit.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 06/27/2024
---

# Ingest data with Fluent Bit into Azure Data Explorer

[Fluent Bit](https://github.com/fluent/fluent-bit/tree/master) is an open-source agent that collects logs, metrics, and traces from various sources. It allows you to filter, modify, and aggregate event data before sending it to storage. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. This article guides you through the process of using Fluent Bit to send data to Azure Data Explorer.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * [Create a table to store your logs](#create-a-table-to-store-your-logs)
> * [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data)
> * [Configure Fluent Bit to send logs to your table](#configure-fluent-bit-to-send-logs-to-your-table)
> * [Verify that data has landed in your table](#verify-that-data-has-landed-in-your-table)

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* [Fluent Bit](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

You can use any of the available [Query tools](integrate-query-overview.md&tabs=integrations) for your query environment.

[!INCLUDE [fluent-bit](includes/cross-repo/fluent-bit.md)]

## Related content

* [Write queries](kusto/query/tutorials/learn-common-operators.md)
