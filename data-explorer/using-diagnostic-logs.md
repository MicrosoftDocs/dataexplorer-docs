---
title: Monitor Azure Data Explorer ingestion, commands, and queries using diagnostic logs
description: Learn how to set up diagnostic logs for Azure Data Explorer to monitor ingestion commands, and query operations.
ms.reviewer: guregini
ms.topic: how-to
ms.date: 08/09/2023
---

# Monitor Azure Data Explorer ingestion, commands, queries, and tables using diagnostic logs

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. [Azure Monitor diagnostic logs](/azure/azure-monitor/platform/diagnostic-logs-overview) provide data about the operation of Azure resources. Azure Data Explorer uses diagnostic logs for insights on ingestion, commands, query, and tables. You can export operation logs to Azure Storage, event hub, or Log Analytics to monitor ingestion, commands, and query status. Logs from Azure Storage and Azure Event Hubs can be routed to a table in your Azure Data Explorer cluster for further analysis.

> [!IMPORTANT]
> Diagnostic log data may contain sensitive data. Restrict permissions of the logs destination according to your monitoring needs.

[!INCLUDE [azure-monitor-vs-log-analytics](includes/azure-monitor-vs-log-analytics.md)]

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).
* Create [a cluster and database](create-cluster-and-database.md).

## Set up diagnostic logs for an Azure Data Explorer cluster

Diagnostic logs can be used to configure the collection of the following log data:

### [Ingestion](#tab/ingestion)

> [!NOTE]
> Ingestion logs are supported for queued ingestion to the ingestion endpoint using SDKs, data connections, and connectors.
>
> Ingestion logs aren't supported for streaming ingestion, direct ingestion to the engine, ingestion from query, or set-or-append commands.

> [!NOTE]
> Failed ingestion logs are only reported for the final state of an ingest operation, unlike the [Ingestion result](using-metrics.md#ingestion-metrics) metric, which is emitted for transient failures that are retried internally.

* **Successful ingestion operations**: These logs have information about successfully completed ingestion operations.
* **Failed ingestion operations**: These logs have detailed information about failed ingestion operations including error details.
* **Ingestion batching operations**: These logs have detailed statistics of batches ready for ingestion (duration, batch size, blobs count, and [batching types](kusto/management/batchingpolicy.md#sealing-a-batch)).

### [Commands and Queries](#tab/commands-and-queries)

* **Commands**: These logs have information about admin commands that have reached a final state.
* **Queries**: These logs have detailed information about queries that have reached a final state.

    > [!NOTE]
    > The command and query log data contains the query text.

### [Tables](#tab/tables)

* **TableUsageStatistics**: These logs have detailed information about the tables whose extents were scanned during query execution.

    > [!NOTE]
    > The `TableUsageStatistics` log data doesn't contain the command or query text.

* **TableDetails**: These logs have detailed information about the cluster's tables.

### [Journal](#tab/journal)

* **Journal**: These logs have detailed information about metadata operations.

---

You can choose to send the log data to a Log Analytics workspace, a storage account, or stream it to an event hub.

### Enable diagnostic logs

Diagnostic logs are disabled by default. Use the following steps to enable diagnostic logs for your cluster:

1. In the [Azure portal](https://portal.azure.com), select the cluster resource that you want to monitor.
1. Under **Monitoring**, select **Diagnostic settings**.

    ![Add diagnostics logs.](media/using-diagnostic-logs/add-diagnostic-logs.png)

1. Select **Add diagnostic setting**.
1. In the **Diagnostic settings** window:

    :::image type="content" source="media/using-diagnostic-logs/configure-diagnostics-settings.png" alt-text="Screenshot of the Diagnostic settings screen, on which you configure which monitoring data to collect for your Azure Data Explorer cluster.":::

    1. Enter a **Diagnostic setting name**.
    1. Select one or more destination targets: a Log Analytics workspace, a storage account, or an event hub.
    1. Select logs to be collected: **Succeeded ingestion**, **Failed ingestion**, **Ingestion batching**, **Command**, **Query**, **Table usage statistics**, **Table details**, or **Journal**.
    1. Select [metrics](using-metrics.md#supported-azure-data-explorer-metrics) to be collected (optional).
    1. Select **Save** to save the new diagnostic logs settings and metrics.

Once the settings are ready, logs will start to appear in the configured destination targets (a storage account, an event hub, or Log Analytics workspace).

> [!NOTE]
> If you send logs to a Log Analytics workspace, the `SucceededIngestion`, `FailedIngestion`, `IngestionBatching`, `Command`, `Query`, `TableUsageStatistics`, `TableDetails`, and `Journal` logs will be stored in Log Analytics tables named: `SucceededIngestion`, `FailedIngestion`, `ADXIngestionBatching`, `ADXCommand`, `ADXQuery`, `ADXTableUsageStatistics`, `ADXTableDetails`, and `ADXJournal` respectively.

## Diagnostic logs schema

All [Azure Monitor diagnostic logs share a common top-level schema](/azure/azure-monitor/platform/diagnostic-logs-schema). Azure Data Explorer events have their own unique properties that are described in the following schema references:

* [SucceededIngestion](/azure/azure-monitor/reference/tables/succeededingestion)
* [FailedIngestion](/azure/azure-monitor/reference/tables/failedingestion)
    * For information about error codes, see [Ingestion error codes](error-codes.md)
* [ADXIngestionBatching](/azure/azure-monitor/reference/tables/adxingestionbatching)
    * For information about batching types, see [Batching policy](kusto/management/batchingpolicy.md#sealing-a-batch)
* [ADXCommand](/azure/azure-monitor/reference/tables/adxcommand)
* [ADXQuery](/azure/azure-monitor/reference/tables/adxquery)
* [ADXTableUsageStatistics](/azure/azure-monitor/reference/tables/adxtableusagestatistics)
* [ADXTableDetails](/azure/azure-monitor/reference/tables/adxtabledetails)
* [ADXJournal](/azure/azure-monitor/reference/tables/adxjournal)

## Next steps

* [Use metrics to monitor cluster health](using-metrics.md)
* [Tutorial: Ingest and query monitoring data in Azure Data Explorer](ingest-data-no-code.md) for ingestion diagnostic logs
