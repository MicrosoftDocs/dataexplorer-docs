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

For a complete list of data connectors, see [Data connectors overview](integrate-overview.md).

## Prerequisites

* [Fluent Bit](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

You can use any of the available [Query tools](integrate-query-overview.md) for your query environment.

[!INCLUDE [fluent-bit](includes/cross-repo/fluent-bit.md)]

## Configure Fluent Bit to send logs to your table

To configure Fluent Bit to send logs to your Azure Data Explorer table, create a [classic mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) or [YAML mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/yaml/configuration-file) configuration file with the following output properties:

| Field                       | Description                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                        | `azure_kusto`                                                                                                                                                                                                                      |
| Match                       | A pattern to match against the tags of incoming records. It's case-sensitive and supports the star (`*`) character as a wildcard.                                                                                                  |
| Tenant_Id                   | **Directory (tenant) ID** from [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                  |
| Client_Id                   | **Application (client) ID** from [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                |
| Client_Secret               | The client secret key value [Register a Microsoft Entra app with permissions to ingest data](#register-a-microsoft-entra-app-with-permissions-to-ingest-data).                                                                     |
| Ingestion_Endpoint          | Use the **Data Ingestion URI** found in the [Azure portal](https://ms.portal.azure.com/) under your cluster overview.                                                                                                              |
| Database_Name               | The name of the database that contains your logs table.                                                                                                                                                                            |
| Table_Name                  | The name of the table from [Create a table to store your logs](#create-a-table-to-store-your-logs).                                                                                                         |
| Ingestion_Mapping_Reference | The name of the ingestion mapping from [Create a table](#create-a-table-to-store-your-logs). If you didn't create an ingestion mapping, remove the property from the configuration file. |

To see an example configuration file, select the relevant tab:

[!INCLUDE [fluent-bit-2](includes/cross-repo/fluent-bit-2.md)]

## Related content

* [Write queries](/kusto/query/tutorials/learn-common-operators)
